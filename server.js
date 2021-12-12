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
        console.log("aaaaa");
        await client.connect();
        console.log("bbbbb");
        //await findUser(client, "johanna");
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

    //Test user: test@test.com, iosudht0pi346h9-
});

app.get("/profile/:username", requiresAuth(), async (req, res) => {

    const apa = await findUser(client, req.params.username);

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

async function findUser(client, username) {
    //TODO https://docs.mongodb.com/manual/reference/method/db.collection.findOne/#specify-the-fields-to-return
    const result = await client.db("gamedb").collection("players").findOne({ username: username });

    if (result) {
        console.log(`Found a listing ${username}`);
        console.log(result);
    } else {
        console.log("No listing");
        return "None";
    }

    return result;
}