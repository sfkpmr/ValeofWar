const express = require("express");
const app = express();
const { MongoClient } = require('mongodb');
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

app.get("/profile", requiresAuth(), (req, res) => {

    //res.send(JSON.stringify(req.oidc.user));

    //Test user: johanna@test.com, saodhgi-9486y-(WYTH

    res.redirect(`/profile/${req.oidc.user.nickname}`)
});

app.get("/profile/:username", requiresAuth(), async (req, res) => {

    const currentUser = req.oidc.user.nickname;
    //const currentUser = await req.oidc.fetchUserInfo();
    const profileUser = await getUser(client, req.params.username);

    //console.log(currentUser.email + " " + profileUser.username + " " + req.params.username + " " + JSON.stringify(req.oidc.user));
    console.log(req.oidc.user.email + " " + profileUser.email);

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

    if (currentUser === req.params.username) {
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

app.post("/search", requiresAuth(), (req, res) => {
    res.redirect(`/profile/${req.body.name}`)
});

app.get("/search/random", requiresAuth(), (req, res) => {
    //todo
    res.send("asf")
    //res.redirect(`/profile/${req.body.name}`)
});

app.get("/town", requiresAuth(), async (req, res) => {
    const user = await getUser(client, req.oidc.user.nickname);

    barracks = user.barracksLevel;

    res.render('pages/town');
});

app.get("/town/blacksmith/upgrade", requiresAuth(), async (req, res) => {
    const user = await getUser(client, req.oidc.user.nickname);

    blacksmith = user.blacksmithLevel;

    for (let i = 1; i < blacksmith + 1; i++) {

        if (i === 1) {
            goldCost = 10;
            lumberCost = 10;
            stoneCost = 10;
            ironCost = 10;
            console.log(goldCost + " " + lumberCost + " " + stoneCost + " " + ironCost);
        } else {
            goldCost += Math.round(goldCost * 1.2);
            lumberCost += Math.round(lumberCost * 1.2);
            stoneCost += Math.round(stoneCost * 1.2);
            ironCost += Math.round(ironCost * 1.2);
            console.log(goldCost + " " + lumberCost + " " + stoneCost + " " + ironCost);
        }
    }



    if (await checkIfCanAfford(req.oidc.user.nickname, goldCost, lumberCost, stoneCost, ironCost, 0)) {
        //console.log("error2")
        await upgradeBuilding(user.username, "blacksmithLevel");
        await removeResources(req.oidc.user.nickname, goldCost, lumberCost, stoneCost, ironCost, 0, 0);
    } else {
        console.log("bbbb");
    }


    res.redirect('/town/blacksmith');

});

app.get("/town/barracks/upgrade", requiresAuth(), async (req, res) => {
    const user = await getUser(client, req.oidc.user.nickname);
});

app.get("/town/barracks", requiresAuth(), async (req, res) => {

    const user = await getUser(client, req.oidc.user.nickname);

    //res.send(req.oidc.user.nickname);

    barracks = user.barracksLevel;

    gold = user.gold;
    iron = user.iron;
    lumber = user.lumber;
    grain = user.grain;
    stone = user.stone;

    archers = user.archers;
    spearmen = user.spearmen;

    res.render('pages/barracks');
});

app.get("/town/stables", requiresAuth(), async (req, res) => {

    const user = await getUser(client, req.oidc.user.nickname);

    stables = user.stablesLevel;

    gold = user.gold;
    iron = user.iron;
    lumber = user.lumber;
    grain = user.grain;
    stone = user.stone;

    horsemen = user.horsemen;
    knights = user.knights;

    res.render('pages/stables');
});

app.get("/town/blacksmith", requiresAuth(), async (req, res) => {

    const user = await getUser(client, req.oidc.user.nickname);

    //res.send(req.oidc.user.nickname);

    blacksmith = user.blacksmithLevel;

    gold = user.gold;
    iron = user.iron;
    lumber = user.lumber;
    grain = user.grain;
    stone = user.stone;

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

    console.log(helmets);

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

    if (await checkIfCanAfford(req.oidc.user.nickname, goldCost, lumberCost, 0, ironCost, 0)) {
        await craftArmor(client, req.oidc.user.nickname, updateUser);
        await removeResources(req.oidc.user.nickname, goldCost, lumberCost, 0, ironCost, 0);
    } else {
        console.log("bbbb");
    }

    //error check?

    res.redirect('/town/blacksmith');

});

app.get("/land", requiresAuth(), async (req, res) => {
    const user = await getUser(client, req.oidc.user.nickname);

    farms = maxFarms;
    goldMines = maxGoldMines;
    quarries = maxQuarries;
    lumberCamps = maxLumberCamps;
    ironMines = maxIronMines;

    res.render('pages/land');
});

app.post("/town/stables/train", requiresAuth(), async (req, res) => {

    await updateLastAction(req.oidc.user.nickname);

    horsemen = parseInt(req.body.horsemen);
    knights = parseInt(req.body.knights);

    var goldCost = 0, grainCost = 0, lumberCost = 0, ironCost = 0;

    goldCost += horsemen * 10;
    grainCost += horsemen * 10;
    lumberCost += horsemen * 10;

    grainCost += knights * 10;
    lumberCost += knights * 10;

    if (await checkIfCanAfford(req.oidc.user.nickname, goldCost, lumberCost, 0, ironCost, grainCost)) {
        await trainTroops(req.oidc.user.nickname, { "horsemen": horsemen, "knights": knights });
        //TODO remove horses
        await removeResources(req.oidc.user.nickname, goldCost, lumberCost, 0, ironCost, grainCost, (horsemen + knights));
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

    if (await checkIfCanAfford(req.oidc.user.nickname, goldCost, lumberCost, 0, ironCost, grainCost, (archers + spearmen))) {
        await trainTroops(req.oidc.user.nickname, updateInfo);
        await removeResources(req.oidc.user.nickname, goldCost, lumberCost, 0, ironCost, grainCost, (archers + spearmen));
    } else {
        console.log("bbbb");
    }

    //error check?

    res.redirect('/town/barracks');

});

app.get("/profile/:username/attack", requiresAuth(), async (req, res) => {

    //TODO attack limiter //reset all at midnight? //losses
    //TODO create attack database to pull data from for attack log

    const attacker = await getUser(client, req.oidc.user.nickname);
    const defender = await getUser(client, req.params.username);

    console.log(attacker.username + " tries to attack " + defender.username);

    var defense = await calculateDefense(defender);
    var attack = await calculateAttack(attacker);

    console.log("Total defense: " + defense + " Total attack " + attack);

    //res.send(req.oidc.user.nickname);

    if (attack > defense) {
        stealResources(attacker.username, defender.gold / 5, defender.lumber / 5, defender.stone / 5, defender.iron / 5, defender.grain / 5);
        loseResources(defender.username, defender.gold / 5, defender.lumber / 5, defender.stone / 5, defender.iron / 5, defender.grain / 5);
    }

    res.redirect(`/profile/${defender.username}`);

});

app.get("/:type/:number", requiresAuth(), async (req, res) => {

    type = req.params.type;
    resourceId = req.params.number;
    const user = await getUser(client, req.oidc.user.nickname);
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

app.get("/:type/:number/upgrade", requiresAuth(), async (req, res) => {

    type = req.params.type;
    resourceId = req.params.number;
    const user = await getUser(client, req.oidc.user.nickname);
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

    if (await checkIfCanAfford(user.username, 1, 1, 2, 3, 4)) {
        const result = await client.db("gamedb").collection("players").updateOne({ username: user.username }, { $set: updatedUser });
    }

    res.redirect("/land");

});

app.get("/:type/:number/establish", requiresAuth(), async (req, res) => {

    //TODO error check
    type = req.params.type;
    resourceId = req.params.number;
    const user = await getUser(client, req.oidc.user.nickname);
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

    if (await checkIfCanAfford(user.username, 1, 1, 2, 3, 4)) {
        const result = await client.db("gamedb").collection("players").updateOne({ username: user.username }, { $set: updatedUser });
    }

    res.redirect("/land");

});

async function getUser(client, username) {
    //TODO https://docs.mongodb.com/manual/reference/method/db.collection.findOne/#specify-the-fields-to-return
    const result = await client.db("gamedb").collection("players").findOne({ username: username });
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

    //TODO Add horses

    const user = await getUser(client, username);

    const lumberCamps = user.lumberCamps;
    const goldMines = user.goldMines;
    const farms = user.farms;
    const ironMines = user.ironMines;
    const quarries = user.quarries;
    const trainingField = user.trainingField;

    var lumberIncome = 0, goldIncome = 0, grainIncome = 0, ironIncome = 0, stoneIncome = 0, recruitsIncome = trainingField * 10;

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

    console.log(`Giving ${grainIncome} grain, ${lumberIncome} lumber, ${goldIncome} gold, ${stoneIncome} stone, ${ironIncome} iron and ${recruitsIncome} recruits to ${username}.`);

    const updatedUser = { "grain": grainIncome, "lumber": lumberIncome, "stone": stoneIncome, "gold": goldIncome, "iron": ironIncome, "recruits": recruitsIncome };

    await incDatabaseValue(username, updatedUser);

}

async function removeResources(username, gold, lumber, stone, iron, grain, recruits) {

    const user = await getUser(client, username);

    const newGold = user.gold - gold;
    const newLumber = user.lumber - lumber;
    const newStone = user.stone - stone;
    const newIron = user.iron - iron;
    const newGrain = user.grain - grain;
    const newRecruits = user.recruits - recruits;

    const updatedUser = { "grain": newGrain, "lumber": newLumber, "stone": newStone, "gold": newGold, "iron": newIron, "recruits": newRecruits };

    const result = await client.db("gamedb").collection("players").updateOne({ username: username }, { $set: updatedUser });

}

async function checkIfCanAfford(username, goldCost, lumberCost, stoneCost, ironCost, grainCost) {

    const user = await getUser(client, username);

    console.log("User has " + user.gold + " " + user.lumber + " " + user.stone + " " + user.iron + " " + user.grain);
    console.log("User wants use " + goldCost + " " + lumberCost + " " + stoneCost + " " + ironCost + " " + grainCost);

    if (user.gold >= goldCost && user.lumber >= lumberCost && user.stone >= stoneCost && user.iron >= ironCost && user.grain >= grainCost) {
        return true;
    }
    return false;

}

async function calculateDefense(defender) {

    archerDamage = defender.archers * 10;
    spearmenDamage = defender.spearmen * 10;

    return archerDamage + spearmenDamage;

}

async function calculateAttack(attacker) {

    archerDamage = attacker.archers * 10;
    spearmenDamage = attacker.spearmen * 5;

    return archerDamage + spearmenDamage;

}

async function stealResources(username, gold, lumber, stone, iron, grain) {

    console.log(username + " is stealing resources");
    const user = await getUser(client, username);

    const newGold = Math.round(user.gold + gold);
    const newLumber = Math.round(user.lumber + lumber);
    const newStone = Math.round(user.stone + stone);
    const newIron = Math.round(user.iron + iron);
    const newGrain = Math.round(user.grain + grain);

    const updatedUser = { grain: newGrain, lumber: newLumber, stone: newStone, gold: newGold, iron: newIron };

    const result = await client.db("gamedb").collection("players").updateOne({ username: username }, { $set: updatedUser });
}

async function loseResources(username, gold, lumber, stone, iron, grain) {

    console.log(username + " is losing resources");
    const user = await getUser(client, username);

    const newGold = user.gold - gold;
    const newLumber = user.lumber - lumber;
    const newStone = user.stone - stone;
    const newIron = user.iron - iron;
    const newGrain = user.grain - grain;

    const updatedUser = { grain: newGrain, lumber: newLumber, stone: newStone, gold: newGold, iron: newIron };
    const result = await client.db("gamedb").collection("players").updateOne({ username: username }, { $set: updatedUser });
}

async function upgradeBuilding(username, building) {
    const updatedUser = { [building]: 1 };
    await incDatabaseValue(username, updatedUser);
}

//TODO set metod
async function incDatabaseValue(username, updatedData) {
    await client.db("gamedb").collection("players").updateOne({ username: username }, { $inc: updatedData });
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