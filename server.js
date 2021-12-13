const express = require("express");
const app = express();
const { MongoClient } = require('mongodb');
require("dotenv").config();
const { auth, requiresAuth } = require('express-openid-connect');
const ejs = require('ejs');
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

    res.send(JSON.stringify(req.oidc.user));
    checkAll();

    //Test user: johanna@test.com, saodhgi-9486y-(WYTH
});

app.get("/profile/:username", requiresAuth(), async (req, res) => {

    const apa = await getUser(client, req.params.username);

    res.send(apa);
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

    const apa = await getUser(client, req.oidc.user.nickname);

    //res.send(req.oidc.user.nickname);

    archers = apa.archers;
    spearmen = apa.spearmen;

    //res.send(apa);
    res.render('pages/barracks');
});

app.get("/train", requiresAuth(), async (req, res) => {


    // if (typeof req.query.archers === 'string' || req.query.archers instanceof String) {
    //     console.log(req.query.archers)
    // } else {
    //     console.log("good")
    // }

    //const apa = await getUser(client, req.params.username);
    await updateLastAction(req.oidc.user.nickname);

    console.log(req.query.archers * 50);
    console.log(req.query.spearmen * 20);

    await trainTroops(client, req.oidc.user.nickname, { archers: parseInt(req.query.archers), spearmen: parseInt(req.query.spearmen) });

    res.send("apa");

});

async function getUser(client, username) {
    //TODO https://docs.mongodb.com/manual/reference/method/db.collection.findOne/#specify-the-fields-to-return
    const result = await client.db("gamedb").collection("players").findOne({ username: username });

    if (result) {
        console.log(`Found a listing ${username}`);
        //console.log(result);
    } else {
        console.log("No listing");
        return "None";
    }

    return result;
}

async function trainTroops(client, username, updatedUser) {

    const result = await client.db("gamedb").collection("players").updateOne({ username: username }, { $inc: updatedUser }); //$set

    //const result = await client.db("gamedb").collection("players").findOne({ username: username });

    console.log(result);

    return result;
}

async function updateLastAction(username) {

    const date = new Date();
    updatedUser = { lastAction: date.getTime() }
    console.log(updatedUser);

    const result = await client.db("gamedb").collection("players").updateOne({ username: username }, { $set: updatedUser });

    //console.log(result);

    return result;
}

async function checkAll() {
    const result = await client.db("gamedb").collection("players").find().forEach(function (ban) {

        var updatedSal = ban._id;
        console.log(updatedSal);
        updateResources(ban.username);

    });

    // console.log(result);
}

async function updateResources(username) {

    const user = await getUser(client, username);

    const updatedUser = { grain: user.farmLevel * 10, lumber: user.lumbercampLevel * 10, stone: user.quarryLevel * 10, gold: user.goldMineLevel * 10, iron: user.ironMineLevel * 10 };


    const result = await client.db("gamedb").collection("players").updateOne({ username: username }, { $inc: updatedUser });


}

var minutes = 1, the_interval = minutes * 60 * 1000;
setInterval(function () {
    //console.log("I am doing my 1 minutes check");
    // do your stuff here
    //checkAll();
}, the_interval);