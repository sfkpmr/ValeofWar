const express = require("express");
const app = express();
require("dotenv").config();
const { auth, requiresAuth } = require('express-openid-connect');
const ejs = require('ejs');
app.set('view engine', 'ejs');

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

app.get("/profile/:username", requiresAuth(), (req, res) => {
    res.send(req.params.username);
});

app.get("/base", requiresAuth(), (req, res) => {
    ejsvalue = value;
    res.render('pages/index')
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});