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

main();

async function main() {

    try {
        await client.connect();
    } catch (e) {
        console.error(e);
    } //finally {
    //await client.close();
    //}

    //main().catch(console.error);
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

var value = 0;

app.get("/", (req, res) => {
    //res.send(req.oidc.isAuthenticated());
    ejsvalue = value;
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
    ejsvalue = value;
    res.render('pages/index')
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.get("/barracks", requiresAuth(), async (req, res) => {

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

app.get("/town", requiresAuth(), async (req, res) => {
    const user = await getUser(client, req.oidc.user.nickname);

    barracks = user.barracksLevel;

    res.render('pages/town');
});

app.get("/land", requiresAuth(), async (req, res) => {
    const user = await getUser(client, req.oidc.user.nickname);

    farms = user.farms.length;

    console.log(farm1 = user.farms[0]);
    console.log(farm2 = user.farms[2]);

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

    grainCost += req.query.spearmen * 10;
    grainCost += req.query.spearmen * 10;

    lumberCost += req.query.spearmen * 10;
    lumberCost += req.query.spearmen * 10;

    if (await checkIfCanAfford(req.oidc.user.nickname, goldCost, lumberCost, 0, ironCost, grainCost)) {
        await trainTroops(client, req.oidc.user.nickname, { archers: parseInt(req.query.archers), spearmen: parseInt(req.query.spearmen) });
        await removeResources(req.oidc.user.nickname, goldCost, lumberCost, 0, ironCost, grainCost);
    } else {
        console.log("bbbb");
    }

    //error check?

    res.redirect('/barracks');

});

app.get("/profile/:username/attack", requiresAuth(), async (req, res) => {

    //TODO attack limiter //reset all at midnight? //losses

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

    resourceId = req.params.number;
    const user = await getUser(client, req.oidc.user.nickname);


    if (req.params.type === "farm") {
        title = "Farm";
        resourceLevel = user.farms[resourceId];

    } else {
        title = "none"
        resourceLevel = 0;
    }
    res.render('pages/resourcefield');

});

app.get("/:type/:number/upgrade", requiresAuth(), async (req, res) => {

    const user = await getUser(client, req.oidc.user.nickname);

    if (req.params.type === "farm") {
        farmId = req.params.number;

        var updatedUser = user.farms;
        console.log(updatedUser);

        updatedUser[farmId]++;
        console.log(updatedUser);

        updatedUser = { farms: updatedUser }

        if (await checkIfCanAfford(user.username, 1, 1, 2, 3, 4)) {
            const result = await client.db("gamedb").collection("players").updateOne({ username: user.username }, { $set: updatedUser });
        }

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

    console.log(result);

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
        //console.log("apapapapapap")
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
    const user = await getUser(client, username);

    const newGold = user.gold - gold;
    const newLumber = user.lumber - lumber;
    const newStone = user.stone - stone;
    const newIron = user.iron - iron;
    const newGrain = user.grain - grain;

    const updatedUser = { grain: newGrain, lumber: newLumber, stone: newStone, gold: newGold, iron: newIron };

    const result = await client.db("gamedb").collection("players").updateOne({ username: username }, { $set: updatedUser });

}

var minutes = 10, the_interval = minutes * 60 * 1000;
setInterval(function () {
    console.log("I am doing my time check");
    // do your stuff here
    checkAll();
}, the_interval);