const express = require("express");
const https = require('https');
const fs = require('fs');
var key = fs.readFileSync(__dirname + '/certs/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/certs/selfsigned.crt');
var options = {
    key: key,
    cert: cert
};
const path = require('path');
const app = express();
var server = https.createServer(options, app);
const { MongoClient, ObjectId } = require('mongodb');
require("dotenv").config();
const { auth, requiresAuth } = require('express-openid-connect');
const ejs = require('ejs');
const e = require("express");
app.set('view engine', 'ejs');
var compression = require('compression');
// Use Gzip compression
app.use(compression());
// Remove x-powered-by Express
app.disable('x-powered-by');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator')
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const { Server } = require("socket.io");
const io = new Server(server);

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}`;
const client = new MongoClient(uri);

const { addTrade, buyTrade } = require("./modules/market.js");
const { getAttackLog, calculateAttack, calculateDefense, attackFunc, calcSpyAttack, calcSpyDefense, spyFunc } = require("./modules/attack.js");
const { trainTroops } = require("./modules/troops.js");
const { getUserByUsername, getUserByEmail, getUserById, deleteUser, getAllTrades, getTrade, deleteTrade, getUserMessages, getMessageById, addMessage, prepareMessagesOrLogs,
    getInvolvedAttackLogs, userAllowedToTrade, checkIfAlreadyTradingResource, getArmyByEmail, getArmoryByEmail, deleteArmy, deleteArmory, getInvolvedSpyLogs,
    getSpyLog } = require("./modules/database.js");
const { fullUpgradeBuildingFunc, craftArmor, restoreWallHealth, convertNegativeToZero, calculateTotalBuildingUpgradeCost, upgradeResourceField, getResourceFieldData,
    validateRequiredProductionLevel } = require("./modules/buildings.js");
const { addResources, removeResources, checkIfCanAfford, incomeCalc, validateUserTrades, getAllIncomes, getResourceBoost } = require("./modules/resources.js");

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

var ManagementClient = require('auth0').ManagementClient;

var management = new ManagementClient({
    domain: process.env.MANAGEMENT_DOMAIN,
    clientId: process.env.MANAGEMENT_CLIENT_ID,
    clientSecret: process.env.MANAGEMENT_CLIENT_SECRET,
    scope: process.env.MANAGEMENT_SCOPE,
});

const userMap = new Map();

io.on('connection', (socket) => {
    let date = new Date();
    console.log(date.toLocaleDateString(), date.toLocaleTimeString() + " " + socket.id + " connected.")

    io.to(socket.id).emit("sync"); //sends user info to server

    socket.on('disconnect', () => {
        date = new Date();
        console.log(date.toLocaleDateString(), date.toLocaleTimeString() + " " + socket.id + " disconnected.")

        for (var i in userMap) {
            if (userMap[i] === socket.id) {
                delete userMap[i]
            }
        }
    });
});

main().catch(console.error);

async function main() {

    try {
        await client.connect();
        await checkDb(client, 15000);
    } catch (e) {
        console.error(e);
    }

    async function checkDb(client, timeInMs = 60000, pipeline = []) {

        const collection = client.db("gamedb").collection("players");
        const changeStream = collection.watch(pipeline);

        changeStream.on('change', (next) => {
            validateUserTrades(client, next.documentKey._id);
            for (var i in userMap) {
                if (i === next.documentKey._id && next.operationType != "delete") {
                    //https://stackoverflow.com/questions/17476294/how-to-send-a-message-to-a-particular-client-with-socket-io
                    io.to(userMap[i]).emit("sync");
                    io.to(userMap[i]).emit("getIncomes");
                    io.to(userMap[i]).emit("updatePower");
                }
            }
        })
    }
}

app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    if (req.oidc.isAuthenticated()) {
        res.redirect("/vale")
    } else {
        res.sendFile(path.join(__dirname, '/static/index.html'));
    }
});

app.get("/vale", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const army = await getArmyByEmail(client, req.oidc.user.email);
    const armory = await getArmoryByEmail(client, req.oidc.user.email);

    let grainLevels = 0, lumberLevels = 0, stoneLevels = 0, ironLevels = 0, goldLevels = 0, grainIncome = 0, lumberIncome = 0, stoneIncome = 0, ironIncome = 0, goldIncome = 0;
    function grainCalc(i) {
        grainLevels += i;
    };
    function lumberCalc(i) {
        lumberLevels += i;
    };
    function stoneCalc(i) {
        stoneLevels += i;
    };
    function ironCalc(i) {
        ironLevels += i;
    };
    function goldCalc(i) {
        goldLevels += i;
    };

    user.farms.forEach(grainCalc);
    grainIncome = incomeCalc("grain", grainLevels);

    user.lumberCamps.forEach(lumberCalc);
    lumberIncome = incomeCalc("lumber", lumberLevels);

    user.quarries.forEach(stoneCalc);
    stoneIncome = incomeCalc("stone", stoneLevels);

    user.ironMines.forEach(ironCalc);
    ironIncome = incomeCalc("iron", ironLevels);

    user.goldMines.forEach(goldCalc);
    goldIncome = incomeCalc("gold", goldLevels);

    const recruitsIncome = user.trainingfieldLevel * 5;
    const horseIncome = user.stablesLevel * 3;

    const attackValue = await calculateAttack(army, armory);
    const defenseValue = await calculateDefense(user, army, armory);
    const spyAttack = await calcSpyAttack(user, army, armory);
    const spyDefense = await calcSpyDefense(user, army, armory);

    res.render("pages/vale", { user, army, grainIncome, lumberIncome, stoneIncome, ironIncome, goldIncome, recruitsIncome, horseIncome, attackValue, defenseValue, spyAttack, spyDefense })
});

app.get("/settings", requiresAuth(), async (req, res) => {
    //Test user: johanna@test.com, saodhgi-9486y-(WYTH
    const profileUser = await getUserByEmail(client, req.oidc.user.email)
    res.render("pages/settings", { profileUser })
});

//TODO radera mellanden och loggar?
app.delete("/settings/delete", requiresAuth(), async (req, res) => {
    //Accept prompt remains after first click, needs to click twice? Causes 'TypeError: Cannot read property '_id' of null'
    const user = await getUserByEmail(client, req.oidc.user.email);
    const id = `auth0|${user._id}`

    await deleteUser(client, user._id);
    await deleteArmy(client, req.oidc.user.email)
    await deleteArmory(client, req.oidc.user.email)

    management.deleteUser({ id: id }, function (err) {
        if (err) {
            console.log(err);
        }
        console.log(id + " was deleted from auth0.");
    });
    res.status(200).end();
});

app.get("/profile/:username", requiresAuth(), urlencodedParser, [
    check('username').isLength({ min: 5, max: 15 })//auth0 currently allowing special characters in usernames
], async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const currentUser = await getUserByEmail(client, req.oidc.user.email);
        const profileUser = await getUserByUsername(client, req.params.username);

        if (profileUser === false) {
            io.to(userMap[currentUser._id]).emit("error", "No user by that name!");
        } else {
            if (req.oidc.user.email === profileUser.email) {
                res.render('pages/settings', { profileUser });
            } else {
                res.render('pages/publicprofile', { profileUser });
            }
        }
    } else {
        res.status(400).render('pages/400');
    }
});

//verifiera att alla säljare har tillräckligt mycket resurser för att sälja, annars avbryt trade -- skicka meddelande om försäljning avbryts
app.get("/market", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const trades = await getAllTrades(client);
    const allowedToTrade = await userAllowedToTrade(client, user);
    res.render('pages/market', { user, trades, allowedToTrade });
});

app.post("/market/sell", requiresAuth(), urlencodedParser, [
    check('sellAmount', 'Must be between 100 and 9999').exists().isNumeric({ no_symbols: true }).isLength({ min: 3, max: 4 }),
    check('sellResource').exists(),
    check('buyAmount', 'Must be between 100 and 9999').exists().isNumeric({ no_symbols: true }).isLength({ min: 3, max: 4 }),
    check('buyResource').exists()
], async (req, res) => {
    const errors = validationResult(req)
    const sellAmount = parseInt(req.body.sellAmount);
    const sellResource = req.body.sellResource;
    const buyAmount = parseInt(req.body.buyAmount);
    const buyResource = req.body.buyResource;
    const resources = ['Grain', 'Lumber', 'Stone', 'Iron', 'Gold'];
    const user = await getUserByEmail(client, req.oidc.user.email);
    const allowedToTrade = await userAllowedToTrade(client, user);
    const alreadyTradingResource = await checkIfAlreadyTradingResource(client, user, sellResource);
    if (errors.isEmpty() && resources.includes(sellResource) && resources.includes(buyResource) && allowedToTrade && !alreadyTradingResource) {
        await addTrade(client, user, sellAmount, sellResource, buyAmount, buyResource);
    }
    res.redirect("/market");
});

app.post("/market/cancel/:id", requiresAuth(), urlencodedParser, [//change to delete request
    check('id').exists().isMongoId()
], async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const user = await getUserByEmail(client, req.oidc.user.email);
        const trade = await getTrade(client, req.params.id);

        if (user.username === trade.seller) {
            await deleteTrade(client, new ObjectId(trade._id));
        }

        res.redirect('/market')
    } else {
        res.status(400).render('pages/400');
    }
});

app.get("/messages/inbox", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const messages = await getUserMessages(client, user.username);
    if (messages) {
        res.redirect('/messages/inbox/page/1')
    } else {
        io.to(userMap[user._id]).emit("error", "No messages yet!");
    }
});

app.get("/messages/new", requiresAuth(), async (req, res) => {
    const recipient = "";
    res.render("pages/writeMessage", { recipient })
});

app.get("/messages/new/:username", requiresAuth(), urlencodedParser, [
    check('username').exists().isAlphanumeric().isLength({ min: 5, max: 15 })
], async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const recipient = req.params.username;
        res.render("pages/writeMessage", { recipient })
    } else {
        res.status(400).render('pages/400');
    }
});

app.get("/messages/inbox/:id", requiresAuth(), urlencodedParser, [
    check('id').exists().isMongoId()
], async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const user = await getUserByEmail(client, req.oidc.user.email);
        const message = await getMessageById(client, new ObjectId(req.params.id));

        if (message && (user.username === message.sentBy || user.username === message.sentTo)) {
            res.render('pages/message', { user, message })
        } else {
            res.send("No such message!")
        }
    } else {
        res.status(400).render('pages/400');
    }
});

app.post("/messages/inbox/:id/report", requiresAuth(), urlencodedParser, [
    check('id').exists().isMongoId()
], async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const messageExists = await getMessageById(client, new ObjectId(req.params.id));
        if (messageExists) {
            const message = "Reported message ID: " + messageExists._id;
            const data = { sentTo: "johanna", sentBy: "SYSTEM", message: message, time: new Date() };
            addMessage(client, data);
            res.redirect(`/messages/inbox`);
        } else {
            res.send("No such message!")
        }
    } else {
        res.status(400).render('pages/400');
    }
});

app.post("/messages/send", requiresAuth(), urlencodedParser, [
    check('recipient').exists().isAlphanumeric().isLength({ min: 5, max: 15 }),
    check('message').exists().isLength({ max: 1000 })//TODO handle ?!#%  ????
], async (req, res) => {
    const errors = validationResult(req)
    const sender = await getUserByEmail(client, req.oidc.user.email);
    const receiver = await getUserByUsername(client, req.body.recipient);
    if (!receiver) {
        io.to(userMap[sender._id]).emit("error", "No user by that name!");
    } else if (errors.isEmpty() && receiver) {

        const message = req.body.message;
        const data = { sentTo: receiver.username, sentBy: sender.username, message: message, time: new Date() };
        const result = await addMessage(client, data);
        res.redirect(`/messages/inbox/${result}`);
    } else {
        res.status(400).render('pages/400');
    }
});

app.get("/messages/inbox/page/:nr", requiresAuth(), urlencodedParser, [
    check('nr').exists().isNumeric({ no_symbols: true }).isLength({ max: 4 })
], async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const user = await getUserByEmail(client, req.oidc.user.email);
        const messages = await prepareMessagesOrLogs(client, user, parseInt(req.params.nr), "message");
        res.render('pages/inbox', { user, messages })
    } else {
        res.status(400).render('pages/400');
    }
});

app.post("/market/buy/:id", requiresAuth(), urlencodedParser, [
    check('id').exists().isMongoId()
], async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const buyer = await getUserByEmail(client, req.oidc.user.email);
        const result = await buyTrade(client, buyer, req.params.id);
        if (!result) {
            io.to(userMap[buyer._id]).emit("error", "You can't afford that!");
        }
        res.redirect('/market')
    } else {
        res.status(400).render('pages/400');
    }
});

app.get("/mailbox", requiresAuth(), async (req, res) => {
    res.render('pages/mailbox')
});

app.get("/mailbox/log", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const result = await getInvolvedAttackLogs(client, user.username)
    if (result) {
        res.redirect('/mailbox/log/page/1')
    } else {
        io.to(userMap[user._id]).emit("error", "You haven't attacked anyone yet!");
    }
});

//TODO no log for defender if spies were undetected
app.get("/mailbox/spyLog", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const result = await getInvolvedSpyLogs(client, user.username)
    if (result) {
        res.redirect('/mailbox/spyLog/page/1')
    } else {
        io.to(userMap[user._id]).emit("error", "You haven't spied on anyone yet!");
    }
});

app.get("/mailbox/spyLog/:id", requiresAuth(), urlencodedParser, [
    check('id').exists().isMongoId(),
], async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const user = await getUserByEmail(client, req.oidc.user.email);
        const username = user.username;
        const log = await getSpyLog(client, new ObjectId(req.params.id));
        let spyUrl;

        if (user.username === log.attacker) {
            spyUrl = `/profile/${log.defender}/spy`
        } else {
            spyUrl = `/profile/${log.attacker}/spy`
        }

        if (log && (username === log.attacker || username === log.defender)) {
            res.render('pages/spyLogEntry', { username, log, spyUrl })
        } else {
            res.send("No such log!")
        }
    } else {
        res.status(400).render('pages/400');
    }
});

app.get("/mailbox/spyLog/page/:nr", requiresAuth(), urlencodedParser, [
    check('nr').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
], async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const user = await getUserByEmail(client, req.oidc.user.email);
        const messages = await prepareMessagesOrLogs(client, user, parseInt(req.params.nr), "spyLog");
        res.render('pages/spyLog', { user, messages })
    } else {
        res.status(400).render('pages/400');
    }
});

app.get("/mailbox/log/:id", requiresAuth(), urlencodedParser, [
    check('id').exists().isMongoId(),
], async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const user = await getUserByEmail(client, req.oidc.user.email);
        const username = user.username;
        const log = await getAttackLog(client, new ObjectId(req.params.id));
        let attackUrl;

        if (user.username === log.attacker) {
            attackUrl = `/profile/${log.defender}/attack`
        } else {
            attackUrl = `/profile/${log.attacker}/attack`
        }

        if (log && (username === log.attacker || username === log.defender)) {
            res.render('pages/attack', { username, log, attackUrl })
        } else {
            res.send("No such log!")
        }
    } else {
        res.status(400).render('pages/400');
    }
});

//TODO error check alla URL inputs
app.get("/mailbox/log/page/:nr", requiresAuth(), urlencodedParser, [
    check('nr').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
], async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const user = await getUserByEmail(client, req.oidc.user.email);
        const messages = await prepareMessagesOrLogs(client, user, parseInt(req.params.nr), "log");
        res.render('pages/log', { user, messages })
    } else {
        res.status(400).render('pages/400');
    }
});

app.post("/search", requiresAuth(), urlencodedParser, [
    check('searchName').exists().isAlphanumeric().isLength({ min: 5, max: 15 })
], (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        res.redirect(`/profile/${req.body.searchName}`)
    } else {
        res.status(400).render('pages/400');
    }
});

app.get("/search/random", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const result = await client.db("gamedb").collection("players").aggregate([{ $sample: { size: 1 } }]).toArray();

    if (user.username === result[0].username) {
        res.redirect("/search/random")
    } else {
        res.redirect(`/profile/${result[0].username}`)
    }
});

app.get("/town", requiresAuth(), async (req, res) => {
    res.render('pages/town');
});

app.get("/town/barracks", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const army = await getArmyByEmail(client, req.oidc.user.email);
    const totalCost = await calculateTotalBuildingUpgradeCost("barracks", user.barracksLevel)
    res.render('pages/barracks', { user, totalCost, army });
});

app.get("/online", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const temp = [];

    for (let i in userMap) {
        let result = await getUserById(client, i);
        temp.push(result.username);
    }
    res.render('pages/online', { user, temp });
});

app.get("/town/spyGuild", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const army = await getArmyByEmail(client, req.oidc.user.email);
    const armory = await getArmoryByEmail(client, req.oidc.user.email);
    const totalCost = await calculateTotalBuildingUpgradeCost("spyGuild", user.spyGuildLevel);

    res.render('pages/spyGuild', { user, army, armory, totalCost });
});

app.post("/town/spyGuild/train", requiresAuth(), urlencodedParser, [
    check('spies').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
    check('sentries').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
], async (req, res) => {
    //dogs?
    const errors = validationResult(req);
    const user = await getUserByEmail(client, req.oidc.user.email);
    const spies = convertNegativeToZero(parseInt(req.body.spies));
    const sentries = convertNegativeToZero(parseInt(req.body.sentries));

    const trainees = {
        "spies": spies, "sentries": sentries,
        "archers": 0, "spearmen": 0, "swordsmen": 0, "horsemen": 0, "knights": 0, "batteringRams": 0, "siegeTowers": 0,
        "crossbowmen": 0, "ballistas": 0, "twoHandedSwordsmen": 0, "longbowmen": 0, "horseArchers": 0, "trebuchets": 0, "halberdiers": 0
    };
    const requiredValidationResult = validateRequiredProductionLevel(user, trainees);
    if (errors.isEmpty() && requiredValidationResult) {
        const result = await trainTroops(client, user.username, trainees);
        if (!result) {
            io.to(userMap[user._id]).emit("error", "You can't afford that!");
        }
    } else {
        console.log(JSON.stringify(errors))
    }

    res.redirect('/town/spyGuild');
});

app.post("/town/spyGuild/craft", requiresAuth(), urlencodedParser, [
    check('ropes').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
    check('nets').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
    check('spyglasses').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
    check('poisons').isNumeric({ no_symbols: true }).isLength({ max: 4 })
], async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);

    const errors = validationResult(req);
    const ropes = convertNegativeToZero(parseInt(req.body.ropes));
    const nets = convertNegativeToZero(parseInt(req.body.nets));
    const spyglasses = convertNegativeToZero(parseInt(req.body.spyglasses));
    const poisons = convertNegativeToZero(parseInt(req.body.poisons));

    const craftingOrder = { ropes: ropes, nets: nets, spyglasses: spyglasses, poisons: poisons, boots: 0, bracers: 0, helmets: 0, lances: 0, longbows: 0, shields: 0, spears: 0, swords: 0 };
    const requiredValidationResult = validateRequiredProductionLevel(user, craftingOrder);
    if (errors.isEmpty() && requiredValidationResult) {
        const result = await craftArmor(client, user, craftingOrder);
        if (!result) {
            io.to(userMap[user._id]).emit("error", "You can't afford that!");
        }
    }
    res.redirect('/town/spyGuild');


});

app.get("/town/wall", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const maxWallHealth = user.wallLevel * 100;
    const defenseBonus = user.wallLevel * 10;

    let atMaxHealth;
    if (maxWallHealth === user.currentWallHealth) {
        atMaxHealth = true;
    } else {
        atMaxHealth = false;
    }
    const upgradeCost = await calculateTotalBuildingUpgradeCost("wall", user.wallLevel);
    const repairCost = {};
    repairCost.lumberCost = upgradeCost.lumberCost * 0.5;
    repairCost.stoneCost = upgradeCost.stoneCost * 0.5;
    repairCost.ironCost = upgradeCost.ironCost * 0.5;
    repairCost.goldCost = upgradeCost.goldCost * 0.5;

    res.render('pages/wall', { user, maxWallHealth, atMaxHealth, repairCost, upgradeCost, defenseBonus })
});

app.post("/town/:building/upgrade", requiresAuth(), urlencodedParser, [
    check('building').exists().isAlpha().isLength({ min: 4, max: 13 })
], async (req, res) => {
    const errors = validationResult(req)
    const buildings = ['barracks', 'blacksmith', 'stables', 'trainingfield', 'wall', 'workshop', 'spyGuild'];
    const type = req.params.building;
    if (errors.isEmpty() && buildings.includes(type)) {
        const user = await getUserByEmail(client, req.oidc.user.email);
        const result = await fullUpgradeBuildingFunc(client, user, type);
        if (!result) {
            io.to(userMap[user._id]).emit("error", "You can't afford that!");
        }
        res.redirect(`/town/${req.params.building}`);
    } else {
        res.status(400).render('pages/400');
    }
});

app.get("/town/trainingfield", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const totalCost = await calculateTotalBuildingUpgradeCost("trainingfield", user.trainingfieldLevel)
    res.render('pages/trainingField', { user, totalCost })
});

app.post("/town/wall/repair", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const maxWallHealth = user.wallLevel * 100;
    if (user.currentWallHealth < maxWallHealth) {
        const totalCost = await calculateTotalBuildingUpgradeCost("wall", user.wallLevel)
        if (await checkIfCanAfford(client, user.username, totalCost.goldCost * 0.5, totalCost.lumberCost * 0.5, totalCost.stoneCost * 0.5, totalCost.ironCost * 0.5, 0, 0, 0)) {
            await removeResources(client, user.username, totalCost.goldCost * 0.5, totalCost.lumberCost * 0.5, totalCost.stoneCost * 0.5, totalCost.ironCost * 0.5, 0, 0, 0);
            restoreWallHealth(client, user); //await?
        } else {
            console.log("bbb-3");
        }
    } else {
        console.log("Already at max HP");
    }
    res.redirect(`/town/wall`);
});

app.get("/credits", async (req, res) => {
    res.sendFile(path.join(__dirname, '/static/credits.html'));
});

app.get("/town/workshop", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const army = await getArmyByEmail(client, req.oidc.user.email);
    const totalCost = await calculateTotalBuildingUpgradeCost("workshop", user.workshopLevel)
    res.render('pages/workshop', { user, totalCost, army })
});

app.post("/town/workshop/train", requiresAuth(), urlencodedParser, [
    check('batteringRam').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
    check('siegeTower').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
    check('ballista').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
    check('trebuchet').isNumeric({ no_symbols: true }).isLength({ max: 4 })
], async (req, res) => {
    const errors = validationResult(req);
    const user = await getUserByEmail(client, req.oidc.user.email);
    const batteringRams = convertNegativeToZero(parseInt(req.body.batteringRam));
    const siegeTowers = convertNegativeToZero(parseInt(req.body.siegeTower));
    const ballistas = convertNegativeToZero(parseInt(req.body.ballista));
    const trebuchets = convertNegativeToZero(parseInt(req.body.trebuchet));
    const trainees = {
        "archers": 0, "spearmen": 0, "swordsmen": 0, "horsemen": 0, "knights": 0, "batteringRams": batteringRams, "siegeTowers": siegeTowers,
        "crossbowmen": 0, "ballistas": ballistas, "twoHandedSwordsmen": 0, "longbowmen": 0, "horseArchers": 0, "trebuchets": trebuchets, "halberdiers": 0,
        "spies": 0, "sentries": 0
    };

    const requiredValidationResult = validateRequiredProductionLevel(user, trainees);
    if (errors.isEmpty() && requiredValidationResult) {
        const result = await trainTroops(client, user.username, trainees);
        if (!result) {
            io.to(userMap[user._id]).emit("error", "You can't afford that!");
        }
    }
    res.redirect('/town/workshop');
});

app.get("/town/stables", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const army = await getArmyByEmail(client, req.oidc.user.email);
    const totalCost = await calculateTotalBuildingUpgradeCost("stables", user.stablesLevel)
    res.render('pages/stables', { user, totalCost, army });
});

app.get("/town/blacksmith", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const armory = await getArmoryByEmail(client, req.oidc.user.email);
    const totalCost = await calculateTotalBuildingUpgradeCost("blacksmith", user.blacksmithLevel)
    res.render('pages/blacksmith', { user, totalCost, armory });
});

app.post("/town/blacksmith/craft", requiresAuth(), urlencodedParser, [
    check('boots').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
    check('bracers').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
    check('helmet').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
    check('lance').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
    check('longbow').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
    check('shield').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
    check('spear').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
    check('sword').isNumeric({ no_symbols: true }).isLength({ max: 4 })
], async (req, res) => {
    const errors = validationResult(req);
    const user = await getUserByEmail(client, req.oidc.user.email);
    const boots = convertNegativeToZero(parseInt(req.body.boots));
    const bracers = convertNegativeToZero(parseInt(req.body.bracers));
    const helmets = convertNegativeToZero(parseInt(req.body.helmet));
    const lances = convertNegativeToZero(parseInt(req.body.lance));
    const longbows = convertNegativeToZero(parseInt(req.body.longbow));
    const shields = convertNegativeToZero(parseInt(req.body.shield));
    const spears = convertNegativeToZero(parseInt(req.body.spear));
    const swords = convertNegativeToZero(parseInt(req.body.sword));
    const craftingOrder = { boots: boots, bracers: bracers, helmets: helmets, lances: lances, longbows: longbows, shields: shields, spears: spears, swords: swords, ropes: 0, nets: 0, spyglasses: 0, poisons: 0 };
    const requiredValidationResult = validateRequiredProductionLevel(user, craftingOrder);
    if (errors.isEmpty() && requiredValidationResult) {
        const result = await craftArmor(client, user, craftingOrder);
        if (!result) {
            io.to(userMap[user._id]).emit("error", "You can't afford that!");
        }
    }
    res.redirect('/town/blacksmith');
});

app.get("/land", requiresAuth(), async (req, res) => {
    res.render('pages/land');
});

app.post("/town/stables/train", requiresAuth(), urlencodedParser, [
    check('horsemen').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
    check('knights').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
    check('horseArchers').isNumeric({ no_symbols: true }).isLength({ max: 4 })
], async (req, res) => {
    const errors = validationResult(req)
    const user = await getUserByEmail(client, req.oidc.user.email);
    const horsemen = convertNegativeToZero(parseInt(req.body.horsemen));
    const knights = convertNegativeToZero(parseInt(req.body.knights));
    const horseArchers = convertNegativeToZero(parseInt(req.body.horseArchers));

    const trainees = {
        "archers": 0, "spearmen": 0, "swordsmen": 0, "horsemen": horsemen, "knights": knights, "batteringRams": 0, "siegeTowers": 0,
        "crossbowmen": 0, "ballistas": 0, "twoHandedSwordsmen": 0, "longbowmen": 0, "horseArchers": horseArchers, "trebuchets": 0, "halberdiers": 0,
        "spies": 0, "sentries": 0
    };

    const requiredValidationResult = validateRequiredProductionLevel(user, trainees);
    if (errors.isEmpty() && requiredValidationResult) {
        const result = await trainTroops(client, user.username, trainees);
        if (!result) {
            io.to(userMap[user._id]).emit("error", "You can't afford that!");
        }
    } else {
        console.log("apa")
    }
    res.redirect('/town/stables');
});

app.post("/town/barracks/train", requiresAuth(), urlencodedParser, [
    check('archers').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
    check('spearmen').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
    check('swordsmen').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
    check('crossbowmen').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
    check('twoHandedSwordsmen').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
    check('longbowmen').isNumeric({ no_symbols: true }).isLength({ max: 4 }),
    check('halberdiers').isNumeric({ no_symbols: true }).isLength({ max: 4 })
], async (req, res) => {
    const errors = validationResult(req);
    const user = await getUserByEmail(client, req.oidc.user.email);
    const archers = convertNegativeToZero(parseInt(req.body.archers));
    const spearmen = convertNegativeToZero(parseInt(req.body.spearmen));
    const swordsmen = convertNegativeToZero(parseInt(req.body.swordsmen));
    const crossbowmen = convertNegativeToZero(parseInt(req.body.crossbowmen));
    const twoHandedSwordsmen = convertNegativeToZero(parseInt(req.body.twoHandedSwordsmen));
    const longbowmen = convertNegativeToZero(parseInt(req.body.longbowmen));
    const halberdiers = convertNegativeToZero(parseInt(req.body.halberdiers));
    const trainees = {
        "archers": archers, "spearmen": spearmen, "swordsmen": swordsmen, "horsemen": 0, "knights": 0, "batteringRams": 0, "siegeTowers": 0,
        "crossbowmen": crossbowmen, "ballistas": 0, "twoHandedSwordsmen": twoHandedSwordsmen, "longbowmen": longbowmen, "horseArchers": 0, "trebuchets": 0, "halberdiers": halberdiers,
        "spies": 0, "sentries": 0
    };

    const requiredValidationResult = validateRequiredProductionLevel(user, trainees);
    if (errors.isEmpty() && requiredValidationResult) {
        const result = await trainTroops(client, user.username, trainees);
        if (!result) {
            io.to(userMap[user._id]).emit("error", "You can't afford that!");
        }
    } else {
        console.log("apa")
    }
    res.redirect('/town/barracks');
});

//TODO require at least 1 soldier
app.post("/profile/:username/attack", requiresAuth(), urlencodedParser, [
    check('username').isLength({ min: 5, max: 15 }),
], async (req, res) => {
    //TODO attack limiter? //reset all at midnight? //lose armor //TODO validate db input
    const errors = validationResult(req);
    const attacker = await getUserByEmail(client, req.oidc.user.email);
    const defender = await getUserByUsername(client, req.params.username);
    if (defender === false) {
        res.send("No such user");
    } else if (errors.isEmpty() && attacker !== defender) {
        console.log(attacker.username + " tries to attack " + defender.username);
        const result = await attackFunc(client, attacker, defender);
        res.redirect(`/mailbox/log/${result}`);
    }
});

//TODO require at least 1 spy
app.post("/profile/:username/spy", requiresAuth(), urlencodedParser, [
    check('username').isLength({ min: 5, max: 15 }),
], async (req, res) => {
    const errors = validationResult(req);
    const attacker = await getUserByEmail(client, req.oidc.user.email);
    const defender = await getUserByUsername(client, req.params.username);
    if (defender === false) {
        res.send("No such user");
    } else if (errors.isEmpty() && attacker !== defender) {
        console.log(attacker.username + " tries to spy on " + defender.username);
        const result = await spyFunc(client, attacker, defender);
        res.redirect(`/mailbox/spyLog/${result}`);
    }
});

app.get("/land/:type/:number", requiresAuth(), urlencodedParser, [
    check('type').exists().isAlpha().isLength({ min: 4, max: 10 }),
    check('number').exists().isNumeric({ no_symbols: true }).isLength({ min: 1, max: 1 })
], async (req, res) => {
    const errors = validationResult(req)
    const type = req.params.type;
    const resourceId = parseInt(req.params.number);
    const resources = ['farm', 'lumbercamp', 'quarry', 'ironMine', 'goldMine'];
    const incomeBoost = getResourceBoost(type);
    if (errors.isEmpty() && resources.includes(type)) {
        const user = await getUserByEmail(client, req.oidc.user.email);
        const resourceData = await getResourceFieldData(user, type, resourceId);
        if (resourceData.invalidId) {
            res.redirect("/land");
        } else if (resourceData.resourceLevel !== undefined && resourceData.resourceLevel > 0) {
            //use one field for all levels, none to 20
            res.render('pages/resourcefield', { resourceData, resourceId, type, incomeBoost });
        } else {
            res.render('pages/emptyfield', { resourceData, resourceId, type });
        }
    } else {
        res.status(400).render('pages/400');
    }
});

app.post("/land/:type/:number/upgrade", requiresAuth(), urlencodedParser, [
    check('type').exists().isAlpha().isLength({ min: 4, max: 10 }),
    check('number').exists().isNumeric({ no_symbols: true }).isLength({ min: 1, max: 1 })
], async (req, res) => {
    const errors = validationResult(req)
    const type = req.params.type;
    const resources = ['farm', 'lumbercamp', 'quarry', 'ironMine', 'goldMine'];
    if (errors.isEmpty() && resources.includes(type)) {
        const resourceId = parseInt(req.params.number);
        const user = await getUserByEmail(client, req.oidc.user.email);
        const result = await upgradeResourceField(client, user, type, resourceId);
        if (!result) {
            io.to(userMap[user._id]).emit("error", "You can't afford that!");
        }
        res.redirect(`/land/${type}/${resourceId}`);
    } else {
        res.status(400).render('pages/400');
    }
});

async function checkAll() {
    await client.db("gamedb").collection("players").find().forEach(function (user) {
        addResources(client, user.username);
    });
}

app.get("/api/getPowers", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const army = await getArmyByEmail(client, req.oidc.user.email);
    const armory = await getArmoryByEmail(client, req.oidc.user.email);
    const attackValue = await calculateAttack(army, armory);
    const defenseValue = await calculateDefense(user, army, armory);
    const spyAttackValue = await calcSpyAttack(user, army, armory);
    const spyDefenseValue = await calcSpyDefense(user, army, armory);
    res.send(JSON.stringify({ attack: attackValue, defense: defenseValue, spyAttack: spyAttackValue, spyDefense: spyDefenseValue }))
});

app.get("/api/getIncomes", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const incomes = await getAllIncomes(user);
    res.send(JSON.stringify(incomes));
});

app.get("/api/getUser/:id", requiresAuth(), urlencodedParser, [
    check('id').exists().isLength({ min: 20, max: 20 }) //format check
], async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const user = await getUserByEmail(client, req.oidc.user.email);
        const army = await getArmyByEmail(client, req.oidc.user.email);
        const data = {
            grain: user.grain, lumber: user.lumber, stone: user.stone, iron: user.iron, gold: user.gold, recruits: user.recruits, horses: user.horses, archers: army.archers,
            spearmen: army.spearmen, swordsmen: army.swordsmen, horsemen: army.horsemen, knights: army.knights, batteringrams: army.batteringRams, siegetowers: army.siegeTowers,
            trebuchets: army.trebuchets, ballistas: army.ballistas, crossbowmen: army.crossbowmen, halberdiers: army.halberdiers, longbowmen: army.longbowmen,
            twoHandedSwordsmen: army.twoHandedSwordsmen, horseArchers: army.horseArchers
        };
        userMap[user._id] = req.params.id
        res.send(JSON.stringify(data));
    } else {
        res.status(400).render('pages/400');
    }
});

app.get("/api/getTimeToNextUpdate", requiresAuth(), async (req, res) => {
    const time = Math.abs(new Date() - the_interval - startTime);
    res.send(JSON.stringify(time));
});

//måste köra för alla så folk kan anfalla folk som är afk //ev kör när någon interagerar med afk folk
const minutes = 15, the_interval = minutes * 60 * 1000;
let startTime = new Date();
setInterval(function () {
    startTime = new Date();
    const date = new Date();
    console.log(date.toLocaleDateString(), date.toLocaleTimeString() + " Adding resources for everyone!");
    checkAll();
    for (var i in userMap) {
        io.to(userMap[i]).emit("updateCountDown");
    }
}, the_interval);

const port = process.env.PORT || 3000;
server.listen(port, () => {
    const date = new Date();
    console.log(date.toLocaleDateString(), date.toLocaleTimeString() + ` Listening on https://localhost:${port}`);
});

app.use(express.static(path.join(__dirname, 'pages')));
// Handle HTTP 404
app.use(function (req, res) {
    const date = new Date();
    console.log(date.toLocaleDateString(), date.toLocaleTimeString() + " Bad URL: " + req.path);
    res.status(404).render('pages/404');
});

// Handle HTTP 500
app.use(function (error, req, res, next) {
    const date = new Date();
    console.log(date.toLocaleDateString(), date.toLocaleTimeString() + " " + error + " " + req.path);
    res.status(500).render('pages/500');
});