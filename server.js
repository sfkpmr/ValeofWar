const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require('mongodb');
require("dotenv").config();
const { auth, requiresAuth } = require('express-openid-connect');
const ejs = require('ejs');
const e = require("express");
const { send, render } = require("express/lib/response"); //???
app.set('view engine', 'ejs');

const uri = "mongodb+srv://server:zjzJoTWpk322w2eJ@cluster0.rn9ur.mongodb.net/gamedb?retryWrites=true&w=majority"
//const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}`
const client = new MongoClient(uri);

const maxFarms = 6, maxGoldMines = 3, maxIronMines = 4, maxQuarries = 2, maxLumberCamps = 4;
//const farmBaseCost = {lumber: 100, gold: 100};

main().catch(console.error);

async function main() {

    try {
        await client.connect();
    } catch (e) {
        console.error(e);
    }
}

app.use(
    auth({
        authRequired: false,
        auth0Logout: true,
        issuerBaseURL: process.env.ISSUER_BASE_URL,
        baseURL: process.env.BASE_URL,
        clientID: process.env.CLIENT_ID,
        secret: process.env.SECRET
    })
);

app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    //res.send(req.oidc.isAuthenticated());

    res.render('pages/index')
});

app.get("/profile", requiresAuth(), async (req, res) => {

    //res.send(JSON.stringify(req.oidc.user));

    //Test user: johanna@test.com, saodhgi-9486y-(WYTH

    const user = await getUserByEmail(req.oidc.user.email)

    res.redirect(`/profile/${user.username}`)
});

app.get("/profile/:username", requiresAuth(), async (req, res) => {

    const currentUser = req.oidc.user.email;
    const profileUser = await getUser(req.params.username);

    gold = profileUser.gold;
    iron = profileUser.iron;
    lumber = profileUser.lumber;
    grain = profileUser.grain;
    stone = profileUser.stone;

    archers = profileUser.archers;
    spearmen = profileUser.spearmen;
    horsemen = profileUser.horsemen;
    knights = profileUser.knights;

    username = req.params.username;

    if (currentUser === profileUser.email) {
        //todo add settings/delete
        res.render('pages/myprofile');
    } else {
        res.render('pages/publicprofile');
    }

});

app.get("/base", requiresAuth(), (req, res) => {
    res.render('pages/index')
});

app.get("/mailbox", requiresAuth(), async (req, res) => {
    //console.log(JSON.stringify(req.oidc.user));
    //const apa = await req.oidc.fetchUserInfo();
    //console.log(apa);
    res.render('pages/mailbox')
});

app.get("/mailbox/log", requiresAuth(), async (req, res) => {
    res.render('pages/log')
});

app.get("/mailbox/log/:id", requiresAuth(), async (req, res) => {

    //TODO check only show your logs

    temp = await getAttackLog("61bad482a3c6aa506c3ae343")

    console.log(temp)

    res.render('pages/attack')
});

app.post("/search", requiresAuth(), (req, res) => {
    res.redirect(`/profile/${req.body.name}`)
});

app.get("/search/random", requiresAuth(), async (req, res) => {


    //const result = await client.db("gamedb").collection("players").findOne({ "username": username });
    // const result = await client.db("gamedb").collection("players").findOne({ "username": username });

    const result = await client.db("gamedb").collection("players").aggregate([{ $sample: { size: 1 } }]).toArray();




    // res.redirect(`/profile/${user.username}`)

    //console.log(result[0].username);

    res.redirect(`/profile/${result[0].username}`)

});

app.get("/town", requiresAuth(), async (req, res) => {
    //const user = await getUserByEmail(req.oidc.user.email);

    res.render('pages/town');
});

// app.get("/town/blacksmith/upgrade", requiresAuth(), async (req, res) => {
//     const user = await getUserByEmail(req.oidc.user.email);

//     blacksmith = user.blacksmithLevel;

//     for (let i = 1; i < blacksmith + 1; i++) {

//         if (i === 1) {
//             goldCost = 10;
//             lumberCost = 10;
//             stoneCost = 10;
//             ironCost = 10;
//             console.log(goldCost + " " + lumberCost + " " + stoneCost + " " + ironCost);
//         } else {
//             goldCost += Math.round(goldCost * 1.2);
//             lumberCost += Math.round(lumberCost * 1.2);
//             stoneCost += Math.round(stoneCost * 1.2);
//             ironCost += Math.round(ironCost * 1.2);
//             console.log(goldCost + " " + lumberCost + " " + stoneCost + " " + ironCost);
//         }
//     }

//     if (await checkIfCanAfford(req.oidc.user.nickname, goldCost, lumberCost, stoneCost, ironCost, 0)) {
//         await upgradeBuilding(user.username, "blacksmithLevel");
//         await removeResources(req.oidc.user.nickname, goldCost, lumberCost, stoneCost, ironCost, 0, 0);
//     } else {
//         console.log("bbbb");
//     }

//     res.redirect('/town/blacksmith');

// });

// app.get("/town/barracks/upgrade", requiresAuth(), async (req, res) => {
//     const user = await getUserByEmail(req.oidc.user.email);
// });

app.get("/town/barracks", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(req.oidc.user.email);

    barracks = user.barracksLevel;

    gold = user.gold;
    iron = user.iron;
    lumber = user.lumber;
    grain = user.grain;
    stone = user.stone;
    recruits = user.recruits;
    horses = user.horses;

    archers = user.archers;
    spearmen = user.spearmen;

    res.render('pages/barracks');
});

app.get("/town/wall", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(req.oidc.user.email);

    wall = user.wallLevel;

    gold = user.gold;
    iron = user.iron;
    lumber = user.lumber;
    grain = user.grain;
    stone = user.stone;
    recruits = user.recruits;
    horses = user.horses;

    res.render('pages/wall')

});

app.post("/town/:building/upgrade", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(req.oidc.user.email);

    console.log("aaaaaaaaaaaaa")

    var buildingName = "";

    switch (req.params.building) {
        case "wall":
            buildingName = "wallLevel"
            break;
        case "blacksmith":
            buildingName = "blacksmithLevel"
            break;
        case "barracks":
            buildingName = "barracksLevel"
            break;
        case "trainingfield":
            buildingName = "trainingfieldLevel"
            break;
        case "stables":
            buildingName = "stablesLevel"
            break;
        case "workshop":
            buildingName = "workshopLevel"
            break;
        default:
            //catch
            console.log("error");
    }


    if (await checkIfCanAfford(user.username, 0, 0, 0, 0, 0, 0, 0)) {
        await upgradeBuilding(user.username, buildingName);
        await removeResources(user.username, 0, 0, 0, 0, 0, 0, 0);
    } else {
        console.log("bbbb");
    }




    res.redirect(`/town/${req.params.building}`);
});

app.get("/town/trainingfield", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(req.oidc.user.email);

    trainingField = user.trainingfieldLevel;

    gold = user.gold;
    iron = user.iron;
    lumber = user.lumber;
    grain = user.grain;
    stone = user.stone;
    recruits = user.recruits;
    horses = user.horses;

    res.render('pages/trainingField')
});

app.get("/town/workshop", requiresAuth(), async (req, res) => {

    //todo method to get user and set variables
    const user = await getUserByEmail(req.oidc.user.email);

    workshop = user.workshopLevel;

    gold = user.gold;
    iron = user.iron;
    lumber = user.lumber;
    grain = user.grain;
    stone = user.stone;
    recruits = user.recruits;
    horses = user.horses;

    res.render('pages/workshop')
});

app.get("/town/stables", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(req.oidc.user.email);

    stables = user.stablesLevel;

    gold = user.gold;
    iron = user.iron;
    lumber = user.lumber;
    grain = user.grain;
    stone = user.stone;
    recruits = user.recruits;
    horses = user.horses;

    horsemen = user.horsemen;
    knights = user.knights;

    res.render('pages/stables');
});

app.get("/town/blacksmith", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(req.oidc.user.email);

    blacksmith = user.blacksmithLevel;

    gold = user.gold;
    iron = user.iron;
    lumber = user.lumber;
    grain = user.grain;
    stone = user.stone;
    recruits = user.recruits;
    horses = user.horses;

    boots = user.boots;
    bracers = user.bracers;
    helmets = user.helmets;
    lances = user.lances;
    longbows = user.longbows;
    shields = user.shields;
    spears = user.spears;
    swords = user.swords;

    res.render('pages/blacksmith');
});

app.post("/town/blacksmith/craft", requiresAuth(), async (req, res) => {
    await updateLastAction(req.oidc.user.nickname);

    var goldCost = 0, lumberCost = 0, ironCost = 0;

    shields = parseInt(req.body.shield);
    swords = parseInt(req.body.sword);
    bracers = parseInt(req.body.bracers);
    longbows = parseInt(req.body.longbow);
    spears = parseInt(req.body.spear);
    lances = parseInt(req.body.lance);
    boots = parseInt(req.body.boots);
    helmets = parseInt(req.body.helmet);

    goldCost += shields * 10;
    lumberCost += shields * 10;
    ironCost += shields * 10;

    goldCost += swords * 10;
    lumberCost += swords * 10;
    ironCost += swords * 10;

    goldCost += bracers * 10;
    lumberCost += bracers * 10;
    ironCost += bracers * 10;

    goldCost += longbows * 10;
    lumberCost += longbows * 10;
    ironCost += longbows * 10;

    goldCost += spears * 10;
    lumberCost += spears * 10;
    ironCost += spears * 10;

    goldCost += lances * 10;
    lumberCost += lances * 10;
    ironCost += lances * 10;

    goldCost += boots * 10;
    lumberCost += boots * 10;
    ironCost += boots * 10;

    goldCost += helmets * 10;
    lumberCost += helmets * 10;
    ironCost += helmets * 10;

    updateUser = {
        "shields": shields, "swords": swords, "bracers": bracers, "longbows": longbows, "spears": spears, "lances": lances, "boots": boots, "helmets": helmets
    }

    //todo fixa usernames
    if (await checkIfCanAfford(req.oidc.user.nickname, goldCost, lumberCost, 0, ironCost, 0, 0, 0)) {
        await craftArmor(req.oidc.user.nickname, updateUser);
        await removeResources(req.oidc.user.nickname, goldCost, lumberCost, 0, ironCost, 0);
    } else {
        console.log("bbbb");
    }

    //error check?

    res.redirect('/town/blacksmith');

});

app.get("/land", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(req.oidc.user.email);

    farms = maxFarms;
    goldMines = maxGoldMines;
    quarries = maxQuarries;
    lumberCamps = maxLumberCamps;
    ironMines = maxIronMines;

    res.render('pages/land');
});

app.post("/town/stables/train", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(req.oidc.user.email);
    await updateLastAction(user.username);

    horsemen = parseInt(req.body.horsemen);
    knights = parseInt(req.body.knights);

    var goldCost = 0, grainCost = 0, lumberCost = 0, ironCost = 0;

    goldCost += horsemen * 10;
    grainCost += horsemen * 10;
    lumberCost += horsemen * 10;

    grainCost += knights * 10;
    lumberCost += knights * 10;

    horseAndRecruitCost = horsemen + knights;

    if (await checkIfCanAfford(user.username, goldCost, lumberCost, 0, ironCost, grainCost, horseAndRecruitCost, horseAndRecruitCost)) {
        await trainTroops(user.username, { "horsemen": horsemen, "knights": knights });
        //TODO remove horses
        await removeResources(user.username, goldCost, lumberCost, 0, ironCost, grainCost, horseAndRecruitCost, horseAndRecruitCost);
    } else {
        console.log("bbbb");
    }

    //error check?

    res.redirect('/town/stables');
});

app.post("/town/barracks/train", requiresAuth(), async (req, res) => {

    // if (typeof req.query.archers === 'string' || req.query.archers instanceof String) {
    //     console.log(req.query.archers)
    // } else {
    //     console.log("good")
    // }

    //const apa = await getUser(client, req.params.username);
    await updateLastAction(req.oidc.user.nickname);

    archers = parseInt(req.body.archers);
    spearmen = parseInt(req.body.spearmen);

    console.log(archers + " " + spearmen)

    var goldCost = 0;
    var grainCost = 0;
    var lumberCost = 0;
    var ironCost = 0;

    goldCost += archers * 10;
    grainCost += archers * 10;
    lumberCost += archers * 10;

    grainCost += spearmen * 10;
    lumberCost += spearmen * 10;

    updateInfo = { "archers": archers, "spearmen": spearmen };
    recruitCost = archers + spearmen;

    if (await checkIfCanAfford(req.oidc.user.nickname, goldCost, lumberCost, 0, ironCost, grainCost, recruitCost, 0)) {
        await trainTroops(req.oidc.user.nickname, updateInfo);
        await removeResources(req.oidc.user.nickname, goldCost, lumberCost, 0, ironCost, grainCost, recruitCost, 0);
    } else {
        console.log("bbbb");
    }

    //error check?

    res.redirect('/town/barracks');

});

app.get("/profile/:username/attack", requiresAuth(), async (req, res) => {

    //TODO attack limiter //reset all at midnight? //losses
    //TODO create attack database to pull data from for attack log

    const attacker = await getUserByEmail(req.oidc.user.email);
    const defender = await getUser(req.params.username);

    console.log(attacker.username + " tries to attack " + defender.username);

    var defense = await calculateDefense(defender);
    var attack = await calculateAttack(attacker);

    console.log("Total defense: " + defense + " Total attack: " + attack);

    const closeness = attack / (attack + defense);
    var divider;
    console.log("close: " + closeness);

    if (closeness <= 0.1) {
        divider = 100;
    } else if (closeness <= 0.2) {
        divider = 80;
    } else if (closeness <= 0.4) {
        divider = 60;
    } else if (closeness <= 0.6) {
        divider = 40;
    } else if (closeness <= 0.8) {
        divider = 20;
    } else if (closeness <= 0.9) {
        divider = 10;
    } else {
        divider = 5;
    }

    goldLoot = Math.round(defender.gold / divider);
    lumberLoot = Math.round(defender.gold / divider);
    stoneLoot = Math.round(defender.stone / divider);
    grainLoot = Math.round(defender.grain / divider);
    ironLoot = Math.round(defender.iron / divider);

    stealResources(attacker.username, goldLoot, lumberLoot, stoneLoot, ironLoot, grainLoot);
    loseResources(defender.username, goldLoot, lumberLoot, stoneLoot, ironLoot, grainLoot);

    createAttackLog(attacker.username, defender.username, attack, defense, 0, 0, goldLoot, grainLoot, lumberLoot, stoneLoot, ironLoot);

    res.redirect(`/ profile / ${defender.username}`);

});

app.get("/land/:type/:number", requiresAuth(), async (req, res) => {

    type = req.params.type;
    resourceId = req.params.number;
    const user = await getUserByEmail(req.oidc.user.email);
    var invalidId;

    if (type === "farm") {
        if (resourceId >= 0 && resourceId <= maxFarms) {
            title = "Farm";
            resourceLevel = user.farms[resourceId];
        } else {
            invalidId = true;
        }
    } else if (type === "goldMine") {
        if (resourceId >= 0 && resourceId <= maxGoldMines) {
            title = "Gold mine";
            resourceLevel = user.goldMines[resourceId];
        } else {
            invalidId = true;
        }
    } else if (type === "ironMine") {
        console.log(user.ironMines);
        if (resourceId >= 0 && resourceId <= maxIronMines) {
            title = "Iron mine";
            resourceLevel = user.ironMines[resourceId];
        } else {
            invalidId = true;
        }
    }
    else if (type === "lumbercamp") {
        if (resourceId >= 0 && resourceId <= maxLumberCamps) {
            title = "Lumber camp";
            resourceLevel = user.lumberCamps[resourceId];
        } else {
            invalidId = true;
        }
    }
    else if (type === "quarry") {
        if (resourceId >= 0 && resourceId <= maxQuarries) {
            title = "Quarry";
            resourceLevel = user.quarries[resourceId];
        } else {
            invalidId = true;
        }
    }
    // else {
    //  title = "none"
    //  resourceLevel = 0;
    //}

    if (invalidId) {
        res.redirect("/land");
    } else if (resourceLevel !== undefined) {
        res.render('pages/resourcefield');
    } else {
        res.render('pages/emptyfield');
    }

});

app.get("/land/:type/:number/upgrade", requiresAuth(), async (req, res) => {

    type = req.params.type;
    resourceId = req.params.number;
    const user = await getUserByEmail(req.oidc.user.email);
    var updatedUser;

    //todo use switch

    if (type === "farm") {

        if (resourceId >= 0 && resourceId <= maxFarms) {
            updatedUser = user.farms;
            console.log(updatedUser);

            updatedUser[resourceId]++;
            console.log(updatedUser);

            updatedUser = { farms: updatedUser }
        } else {
            res.redirect("/land");
        }

    } else if (type === "goldmine") {
        if (resourceId >= 0 && resourceId <= maxGoldMines) {
            updatedUser = user.goldMines;
            updatedUser[resourceId]++;

            updatedUser = { goldMines: updatedUser }
        } else {
            res.redirect("/land");
        }
    } else if (type === "ironmine") {
        if (resourceId >= 0 && resourceId <= maxIronMines) {
            updatedUser = user.ironMines;
            updatedUser[resourceId]++;

            updatedUser = { ironMines: updatedUser }
        } else {
            res.redirect("/land");
        }
    }
    else if (type === "lumbercamp") {
        if (resourceId >= 0 && resourceId <= maxLumberCamps) {
            updatedUser = user.lumberCamps;
            updatedUser[resourceId]++;

            updatedUser = { lumberCamps: updatedUser }
        } else {
            res.redirect("/land");
        }
    } else if (type === "quarry") {
        if (resourceId >= 0 && resourceId <= maxQuarries) {
            updatedUser = user.quarries;
            updatedUser[resourceId]++;

            updatedUser = { quarries: updatedUser }
        } else {
            res.redirect("/land");
        }
    }

    if (await checkIfCanAfford(user.username, 1, 1, 2, 3, 4, 0, 0)) {
        const result = await client.db("gamedb").collection("players").updateOne({ username: user.username }, { $set: updatedUser });
    }

    res.redirect("/land");

});

app.get("/land/:type/:number/establish", requiresAuth(), async (req, res) => {

    //TODO error check
    type = req.params.type;
    resourceId = req.params.number;
    const user = await getUserByEmail(req.oidc.user.email);
    var updatedUser;

    if (type === "farm") {
        updatedUser = user.farms;
        console.log(updatedUser);
        updatedUser.push(1);
        updatedUser = { farms: updatedUser }

    } else if (type === "goldmine") {
        updatedUser = user.goldMines;
        console.log(updatedUser);
        updatedUser.push(1);
        updatedUser = { goldMines: updatedUser }

    } else if (type === "ironmine") {
        updatedUser = user.ironMines;
        console.log(updatedUser);
        updatedUser.push(1);
        updatedUser = { ironMines: updatedUser }

    } else if (type === "lumbercamp") {
        updatedUser = user.lumberCamps;
        console.log(updatedUser);
        updatedUser.push(1);
        updatedUser = { lumberCamps: updatedUser }

    } else if (type === "quarry") {
        updatedUser = user.quarries;
        console.log(updatedUser);
        updatedUser.push(1);
        updatedUser = { quarries: updatedUser }
    }

    console.log(updatedUser);

    if (await checkIfCanAfford(user.username, 1, 1, 2, 3, 4, 0, 0)) {
        const result = await client.db("gamedb").collection("players").updateOne({ username: user.username }, { $set: updatedUser });
    }

    res.redirect("/land");

});

async function getUser(username) {
    //TODO https://docs.mongodb.com/manual/reference/method/db.collection.findOne/#specify-the-fields-to-return
    const result = await client.db("gamedb").collection("players").findOne({ "username": username });
    return result;
}

async function getUserByEmail(email) {
    //TODO https://docs.mongodb.com/manual/reference/method/db.collection.findOne/#specify-the-fields-to-return
    const result = await client.db("gamedb").collection("players").findOne({ "email": email });
    return result;
}

async function trainTroops(username, updatedUser) {

    console.log(username)
    await incDatabaseValue(username, updatedUser);
}

async function craftArmor(username, updatedUser) {
    await incDatabaseValue(username, updatedUser);
}

async function updateLastAction(username) {

    const date = new Date();
    updatedUser = { lastAction: date.getTime() }
    console.log(updatedUser);

    const result = await client.db("gamedb").collection("players").updateOne({ username: username }, { $set: updatedUser });

    return result;
}

async function checkAll() {
    const result = await client.db("gamedb").collection("players").find().forEach(function (user) {

        var updatedSal = user._id;
        console.log(updatedSal);
        addResources(user.username);
    });
}

async function addResources(username) {
    const user = await getUser(username);

    const lumberCamps = user.lumberCamps;
    const goldMines = user.goldMines;
    const farms = user.farms;
    const ironMines = user.ironMines;
    const quarries = user.quarries;
    const trainingField = user.trainingField;
    const stables = user.stablesLevel;

    var lumberIncome = 0, goldIncome = 0, grainIncome = 0, ironIncome = 0, stoneIncome = 0, recruitsIncome = trainingField * 10, horseIncome = stables * 10;

    lumberCamps.forEach(lumberCalc);
    goldMines.forEach(goldCalc);
    farms.forEach(grainCalc);
    ironMines.forEach(ironCalc);
    quarries.forEach(stoneCalc);

    function lumberCalc(i) {
        lumberIncome += i * 10;
    };

    function goldCalc(i) {
        goldIncome += i * 2;
    };

    function grainCalc(i) {
        grainIncome += i * 10;
    };

    function ironCalc(i) {
        ironIncome += i * 5;
    };

    function stoneCalc(i) {
        stoneIncome += i * 5;
    };

    console.log(`Giving ${grainIncome} grain, ${lumberIncome} lumber, ${goldIncome} gold, ${stoneIncome} stone, ${ironIncome} iron, ${recruitsIncome} recruits and ${horseIncome} horses to ${username}.`);

    const updatedUser = { "grain": grainIncome, "lumber": lumberIncome, "stone": stoneIncome, "gold": goldIncome, "iron": ironIncome, "recruits": recruitsIncome, "horses": horseIncome };

    await incDatabaseValue(username, updatedUser);

}

async function removeResources(username, gold, lumber, stone, iron, grain, recruits, horses) {

    const user = await getUser(username);

    const newGold = user.gold - gold;
    const newLumber = user.lumber - lumber;
    const newStone = user.stone - stone;
    const newIron = user.iron - iron;
    const newGrain = user.grain - grain;
    const newRecruits = user.recruits - recruits;
    const newHorses = user.horses - horses;

    const updatedUser = { "grain": newGrain, "lumber": newLumber, "stone": newStone, "gold": newGold, "iron": newIron, "recruits": newRecruits, "horses": newHorses };

    const result = await client.db("gamedb").collection("players").updateOne({ username: username }, { $set: updatedUser });

}

async function checkIfCanAfford(username, goldCost, lumberCost, stoneCost, ironCost, grainCost, recruitCost, horseCost) {

    const user = await getUser(username);

    console.log("User has " + user.gold + " " + user.lumber + " " + user.stone + " " + user.iron + " " + user.grain + " " + user.recruits + " " + user.horses);
    console.log("User wants use " + goldCost + " " + lumberCost + " " + stoneCost + " " + ironCost + " " + grainCost + " " + recruitCost + " " + horseCost);

    if (user.gold >= goldCost && user.lumber >= lumberCost && user.stone >= stoneCost && user.iron >= ironCost && user.grain >= grainCost && user.recruits >= recruitCost && user.horses >= horseCost) {
        return true;
    }
    return false;

}

async function calculateAttack(attacker) {

    archers = attacker.archers;
    spearmen = attacker.spearmen;
    horsemen = attacker.horsemen;
    knights = attacker.knights;

    var archerDamage = 0, spearmenDamage = 0, horsemenDamage = 0, knightsDamage = 0;

    if (archers !== undefined && archers !== null) {
        archerDamage = archers * 10;
    } if (spearmen !== undefined && spearmen !== null) {
        spearmenDamage = spearmen * 5;
    } if (horsemen !== undefined && horsemen !== null) {
        horsemenDamage = horsemen * 15;
    } if (knights !== undefined && knights !== null) {
        knightsDamage = knights * 20;
    }

    return archerDamage + spearmenDamage + horsemenDamage + knightsDamage;

}

async function calculateDefense(defender) {

    archers = defender.archers;
    spearmen = defender.spearmen;
    horsemen = defender.horsemen;
    knights = defender.knights;

    var archerDamage = 0, spearmenDamage = 0, horsemenDamage = 0, knightsDamage = 0;

    if (archers !== undefined && archers !== null) {
        archerDamage = archers * 10;
    } if (spearmen !== undefined && spearmen !== null) {
        spearmenDamage = spearmen * 10;
    } if (horsemen !== undefined && horsemen !== null) {
        horsemenDamage = horsemen * 5;
    } if (knights !== undefined && knights !== null) {
        knightsDamage = knights * 20;
    }

    return archerDamage + spearmenDamage + horsemenDamage + knightsDamage;

}

async function stealResources(username, gold, lumber, stone, iron, grain) {

    console.log(username + " is stealing resources");
    const user = await getUser(username);

    const newGold = user.gold + gold;
    const newLumber = user.lumber + lumber;
    const newStone = user.stone + stone;
    const newIron = user.iron + iron;
    const newGrain = user.grain + grain;

    const updatedUser = { grain: newGrain, lumber: newLumber, stone: newStone, gold: newGold, iron: newIron };

    const result = await client.db("gamedb").collection("players").updateOne({ username: username }, { $set: updatedUser });
}

async function loseResources(username, gold, lumber, stone, iron, grain) {

    console.log(username + " is losing resources");
    const user = await getUser(username);

    const newGold = user.gold - gold;
    const newLumber = user.lumber - lumber;
    const newStone = user.stone - stone;
    const newIron = user.iron - iron;
    const newGrain = user.grain - grain;

    const updatedUser = { grain: newGrain, lumber: newLumber, stone: newStone, gold: newGold, iron: newIron };
    const result = await client.db("gamedb").collection("players").updateOne({ username: username }, { $set: updatedUser });
}

async function upgradeBuilding(username, building) {
    console.log(username + " " + building)
    const updatedUser = { [building]: 1 };
    await incDatabaseValue(username, updatedUser);
}

//TODO set metod
async function incDatabaseValue(username, updatedData) {
    await client.db("gamedb").collection("players").updateOne({ username: username }, { $inc: updatedData });
}

async function createAttackLog(attacker, defender, attackDamage, defenseDamage, attackerLosses, defenderLosses, grainLooted, goldLooted, lumberLooted, stoneLooted, ironLooted) {

    date = new Date();

    const data = {
        "time": date, "attacker": attacker, "defender": defender, "attackDamage": attackDamage, "defenseDamage": defenseDamage, "attackerLosses": attackerLosses, "defenderLosses": defenderLosses, "goldLooted": goldLooted,
        "grainLooted": grainLooted, "lumberLooted": lumberLooted, "stoneLooted": stoneLooted, "ironLooted": ironLooted
    };

    await client.db("gamedb").collection("attacks").insertOne(data);

}

async function getAttackLog(id) {
    //const result = await client.db("gamedb").collection("attacks").findOne({ "_id": id });
    const result = await client.db("gamedb").collection("attacks").findOne({ "_id": ObjectId(id) });
    return result;
}

//måste köra för alla så folk kan anfalla folk som är afk
var minutes = 10, the_interval = minutes * 60 * 1000;
setInterval(function () {
    console.log("Adding resources for everyone!");
    checkAll();
}, the_interval);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});