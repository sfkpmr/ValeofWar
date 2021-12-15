const express = require("express");
const app = express();
const { MongoClient } = require('mongodb');
require("dotenv").config();
const { auth, requiresAuth } = require('express-openid-connect');
const ejs = require('ejs');
const e = require("express");
app.set('view engine', 'ejs');

const uri = "mongodb+srv://server:zjzJoTWpk322w2eJ@cluster0.rn9ur.mongodb.net/gamedb?retryWrites=true&w=majority"
const client = new MongoClient(uri);

const maxFarms = 6, maxGoldMines = 3, maxIronMines = 4, maxQuarries = 2, maxLumberCamps = 4;

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
        secret: process.env.SECRET,
    })
);

app.use('/static', express.static('static'));

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
    const profileUser = await getUser(client, req.params.username);

    gold = profileUser.gold;
    iron = profileUser.iron;
    lumber = profileUser.lumber;
    grain = profileUser.grain;
    stone = profileUser.stone;

    username = req.params.username;

    if (currentUser === req.params.username) {
        res.render('pages/myprofile');
    } else {
        res.render('pages/publicprofile');
    }

});

app.get("/base", requiresAuth(), (req, res) => {
    res.render('pages/index')
});

app.get("/start", requiresAuth(), (req, res) => {
    res.render('pages/start')
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});



app.get("/town", requiresAuth(), async (req, res) => {
    const user = await getUser(client, req.oidc.user.nickname);

    barracks = user.barracksLevel;

    res.render('pages/town');
});

app.get("/town/barracks", requiresAuth(), async (req, res) => {

    const user = await getUser(client, req.oidc.user.nickname);

    //res.send(req.oidc.user.nickname);

    gold = user.gold;
    iron = user.iron;
    lumber = user.lumber;
    grain = user.grain;
    stone = user.stone;

    archers = user.archers;
    spearmen = user.spearmen;

    //res.send(apa);
    res.render('pages/barracks');
});

app.get("/town/blacksmith", requiresAuth(), async (req, res) => {

    const user = await getUser(client, req.oidc.user.nickname);

    //res.send(req.oidc.user.nickname);

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

app.get("/town/blacksmith/craft", requiresAuth(), async (req, res) => {
    await updateLastAction(req.oidc.user.nickname);

    var goldCost = 0;
    var lumberCost = 0;
    var ironCost = 0;

    goldCost += req.query.shield * 10;
    lumberCost += req.query.shield * 10;
    ironCost += req.query.shield * 10;

    goldCost += req.query.sword * 10;
    lumberCost += req.query.sword * 10;
    ironCost += req.query.sword * 10;

    goldCost += req.query.bracers * 10;
    lumberCost += req.query.bracers * 10;
    ironCost += req.query.bracers * 10;

    goldCost += req.query.longbow * 10;
    lumberCost += req.query.longbow * 10;
    ironCost += req.query.longbow * 10;

    goldCost += req.query.spear * 10;
    lumberCost += req.query.spear * 10;
    ironCost += req.query.spear * 10;

    goldCost += req.query.lance * 10;
    lumberCost += req.query.lance * 10;
    ironCost += req.query.lance * 10;

    goldCost += req.query.boots * 10;
    lumberCost += req.query.boots * 10;
    ironCost += req.query.boots * 10;

    goldCost += req.query.helmet * 10;
    lumberCost += req.query.helmet * 10;
    ironCost += req.query.helmet * 10;

    updateUser = {
        shields: parseInt(req.query.shield), swords: parseInt(req.query.sword), bracers: parseInt(req.query.bracers),
        longbows: parseInt(req.query.longbow), spears: parseInt(req.query.spear), lances: parseInt(req.query.lance),
        boots: parseInt(req.query.boots), helmets: parseInt(req.query.helmet)
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

app.get("/train", requiresAuth(), async (req, res) => {

    // if (typeof req.query.archers === 'string' || req.query.archers instanceof String) {
    //     console.log(req.query.archers)
    // } else {
    //     console.log("good")
    // }

    //const apa = await getUser(client, req.params.username);
    await updateLastAction(req.oidc.user.nickname);

    var goldCost = 0;
    var grainCost = 0;
    var lumberCost = 0;
    var ironCost = 0;

    goldCost += req.query.archers * 10;
    grainCost += req.query.archers * 10;
    lumberCost += req.query.archers * 10;

    grainCost += req.query.spearmen * 10;
    lumberCost += req.query.spearmen * 10;

    if (await checkIfCanAfford(req.oidc.user.nickname, goldCost, lumberCost, 0, ironCost, grainCost)) {
        await trainTroops(client, req.oidc.user.nickname, { archers: parseInt(req.query.archers), spearmen: parseInt(req.query.spearmen) });
        await removeResources(req.oidc.user.nickname, goldCost, lumberCost, 0, ironCost, grainCost);
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

async function trainTroops(client, username, updatedUser) {

    const result = await client.db("gamedb").collection("players").updateOne({ username: username }, { $inc: updatedUser });

    // console.log(result);

}

async function craftArmor(client, username, updatedUser) {

    //console.log(updatedUser);

    const result = await client.db("gamedb").collection("players").updateOne({ username: username }, { $inc: updatedUser });

    //   console.log(result);

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

async function addResources(username, multiplier) {

    const user = await getUser(client, username);

    const lumberCamps = user.lumberCamps;
    const goldMines = user.goldMines;
    const farms = user.farms;
    const ironMines = user.ironMines;
    const quarries = user.quarries;

    var lumberIncome = 0;
    var goldIncome = 0;
    var grainIncome = 0;
    var ironIncome = 0;
    var stoneIncome = 0;

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

    console.log(`Giving ${grainIncome} grain, ${lumberIncome} lumber, ${goldIncome} gold, ${stoneIncome} stone and ${ironIncome} iron to ${username}.`);

    const updatedUser = { grain: grainIncome, lumber: lumberIncome, stone: stoneIncome, gold: goldIncome, iron: ironIncome };

    const result = await client.db("gamedb").collection("players").updateOne({ username: username }, { $inc: updatedUser });

}

async function removeResources(username, gold, lumber, stone, iron, grain) {

    const user = await getUser(client, username);

    const newGold = user.gold - gold;
    const newLumber = user.lumber - lumber;
    const newStone = user.stone - stone;
    const newIron = user.iron - iron;
    const newGrain = user.grain - grain;

    const updatedUser = { grain: newGrain, lumber: newLumber, stone: newStone, gold: newGold, iron: newIron };

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

//måste köra för alla så folk kan anfalla folk som är afk
var minutes = 10, the_interval = minutes * 60 * 1000;
setInterval(function () {
    console.log("Adding resources for everyone!");
    checkAll();
}, the_interval);