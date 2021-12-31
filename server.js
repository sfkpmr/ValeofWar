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

const { addTrade } = require("./modules/market.js");
const { getAttackLog, getInvolvedAttackLogs, calculateAttack, calculateDefense, attackFunc } = require("./modules/attack.js");
const { trainTroops, craftArmor } = require("./modules/troops.js");
const { getUser, getUserByEmail, getUserById, deleteUser, getAllTrades, getTrade, deleteTrade, getUserMessages, getMessageById, addMessage } = require("./modules/database.js");
const { upgradeBuilding, calcLumberCraftCost, calcIronCraftCost, calcGoldCraftCost, calcBuildingLumberCost, calcBuildingStoneCost, calcBuildingIronCost, calcBuildingGoldCost, upgradeResource, restoreWallHealth, convertNegativeToZero, calculateTotalBuildingUpgradeCost } = require("./modules/buildings.js");
const { addResources, removeResources, checkIfCanAfford, incomeCalc, validateUserTrades, getIncome } = require("./modules/resources.js");

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}`;
const client = new MongoClient(uri);

const maxFarms = 4, maxGoldMines = 2, maxIronMines = 3, maxQuarries = 4, maxLumberCamps = 4;

const { Server } = require("socket.io");
const attack = require("./modules/attack.js");
const req = require("express/lib/request");
const { filter } = require("compression");
const { get } = require("express/lib/response");
const io = new Server(server);

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

let userMap = new Map();

io.on('connection', (socket) => {
    date = new Date();
    console.log(date.toLocaleDateString(), date.toLocaleTimeString() + " " + socket.id + " connected.")

    io.to(socket.id).emit("sync");

    socket.on('getUser', (msg) => {
        console.log(msg)
    });

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
            for (var i in userMap) {
                if (i === next.documentKey._id && next.operationType != "delete") {
                    //https://stackoverflow.com/questions/17476294/how-to-send-a-message-to-a-particular-client-with-socket-io
                    const user = next.updateDescription.updatedFields;

                    const grain = JSON.stringify(user.grain);
                    const lumber = JSON.stringify(user.lumber);
                    const stone = JSON.stringify(user.stone);
                    const iron = JSON.stringify(user.iron);
                    const gold = JSON.stringify(user.gold);
                    const recruits = JSON.stringify(user.recruits);
                    const horses = JSON.stringify(user.horses);

                    const archers = JSON.stringify(user.archers);
                    const spearmen = JSON.stringify(user.spearmen);
                    const swordsmen = JSON.stringify(user.swordsmen);
                    const horsemen = JSON.stringify(user.horsemen);
                    const knights = JSON.stringify(user.knights);
                    const batteringrams = JSON.stringify(user.batteringrams);
                    const siegetowers = JSON.stringify(user.siegetowers);

                    const farms = JSON.stringify(user.farms);
                    const lumbercamps = JSON.stringify(user.lumberCamps);
                    const quarries = JSON.stringify(user.quarries);
                    const ironmines = JSON.stringify(user.ironMines);
                    const goldmines = JSON.stringify(user.goldMines);
                    const trainingfield = JSON.stringify(user.trainingfieldLevel);
                    const stables = JSON.stringify(user.stablesLevel);
                    const wall = JSON.stringify(user.wallLevel);

                    const boots = JSON.stringify(user.boots);
                    const bracers = JSON.stringify(user.bracers);
                    const helmets = JSON.stringify(user.helmets);
                    const lances = JSON.stringify(user.lances);
                    const longbows = JSON.stringify(user.longbows);
                    const shields = JSON.stringify(user.shields);
                    const spears = JSON.stringify(user.spears);
                    const swords = JSON.stringify(user.swords);

                    const currentWallHealth = JSON.stringify(user.currentWallHealth);

                    var updateDamage = false;
                    var checkTrades = false;

                    if (grain !== null && grain !== undefined) {
                        io.to(userMap[i]).emit("updateGrain", grain);
                        checkTrades = true;
                    };
                    if (lumber !== null && lumber !== undefined) {
                        io.to(userMap[i]).emit("updateLumber", lumber);
                        checkTrades = true;
                    };
                    if (stone !== null && stone !== undefined) {
                        io.to(userMap[i]).emit("updateStone", stone);
                        checkTrades = true;
                    };
                    if (iron !== null && iron !== undefined) {
                        io.to(userMap[i]).emit("updateIron", iron);
                        checkTrades = true;
                    };
                    if (gold !== null && gold !== undefined) {
                        io.to(userMap[i]).emit("updateGold", gold);
                        checkTrades = true;
                    };
                    if (recruits !== null && recruits !== undefined) {
                        io.to(userMap[i]).emit("updateRecruits", recruits);
                    };
                    if (horses !== null && horses !== undefined) {
                        io.to(userMap[i]).emit("updateHorses", horses);
                    };
                    if (archers !== null && archers !== undefined) {
                        io.to(userMap[i]).emit("updateArchers", archers);
                        updateDamage = true;
                    };
                    if (spearmen !== null && spearmen !== undefined) {
                        io.to(userMap[i]).emit("updateSpearmen", spearmen);
                        updateDamage = true;
                    };
                    if (swordsmen !== null && swordsmen !== undefined) {
                        io.to(userMap[i]).emit("updateSwordsmen", swordsmen);
                        updateDamage = true;
                    };
                    if (horsemen !== null && horsemen !== undefined) {
                        io.to(userMap[i]).emit("updateHorsemen", horsemen);
                        updateDamage = true;
                    };
                    if (knights !== null && knights !== undefined) {
                        io.to(userMap[i]).emit("updateKnights", knights);
                        updateDamage = true;
                    };
                    if (batteringrams !== null && batteringrams !== undefined) {
                        io.to(userMap[i]).emit("updateBatteringRams", batteringrams);
                        updateDamage = true;
                    };
                    if (siegetowers !== null && siegetowers !== undefined) {
                        io.to(userMap[i]).emit("updateSiegeTowers", siegetowers);
                        updateDamage = true;
                    };
                    if (farms !== null && farms !== undefined) {
                        io.to(userMap[i]).emit("getGrainIncome");
                    };
                    if (lumbercamps !== null && lumbercamps !== undefined) {
                        io.to(userMap[i]).emit("getLumberIncome");
                    };
                    if (quarries !== null && quarries !== undefined) {
                        io.to(userMap[i]).emit("getStoneIncome");
                    };
                    if (ironmines !== null && ironmines !== undefined) {
                        io.to(userMap[i]).emit("getIronIncome");
                    };
                    if (goldmines !== null && goldmines !== undefined) {
                        io.to(userMap[i]).emit("getGoldIncome");
                    };
                    if (trainingfield !== null && trainingfield !== undefined) {
                        io.to(userMap[i]).emit("getRecruitsIncome");
                    };
                    if (stables !== null && stables !== undefined) {
                        io.to(userMap[i]).emit("getHorseIncome");
                    };
                    if (wall !== null && wall !== undefined) {
                        updateDamage = true;
                    };
                    if (boots !== null && boots !== undefined) {
                        updateDamage = true;
                    };
                    if (bracers !== null && bracers !== undefined) {
                        updateDamage = true;
                    };
                    if (helmets !== null && helmets !== undefined) {
                        updateDamage = true;
                    };
                    if (lances !== null && lances !== undefined) {
                        updateDamage = true;
                    };
                    if (longbows !== null && longbows !== undefined) {
                        updateDamage = true;
                    };
                    if (shields !== null && shields !== undefined) {
                        updateDamage = true;
                    };
                    if (spears !== null && spears !== undefined) {
                        updateDamage = true;
                    };
                    if (swords !== null && swords !== undefined) {
                        updateDamage = true;
                    };
                    if (currentWallHealth !== null && currentWallHealth !== undefined) {
                        updateDamage = true;
                    };

                    if (updateDamage) {
                        io.to(userMap[i]).emit("updatePower");
                    };

                    if (checkTrades) {
                        validateUserTrades(client, i);
                    }

                } else {
                    //console.log('fel')
                }
            }
        })
    }
}

app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    const authenticated = req.oidc.isAuthenticated();

    if (authenticated) {
        res.redirect("/vale")
    } else {
        res.sendFile(path.join(__dirname, '/static/index.html'));
    }
});

app.delete("/settings/delete", requiresAuth(), async (req, res) => {
    //Accept prompt remains after first click, needs to click twice? Causes 'TypeError: Cannot read property '_id' of null'
    const user = await getUserByEmail(client, req.oidc.user.email);
    const id = `auth0|${user._id}`

    await deleteUser(client, user._id);

    management.deleteUser({ id: id }, function (err) {
        if (err) {
            console.log(err);
        }
        console.log(id + " was deleted from auth0.");
    });

    res.status(200).end();
});

app.get("/api/getAttackPower", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const result = await calculateAttack(user);

    res.send(JSON.stringify(result))
});

app.get("/api/getDefensePower", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const result = await calculateDefense(user);

    res.send(JSON.stringify(result))
});

app.get("/api/:getIncome", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const income = await getIncome(user, req.params.getIncome);

    res.send(JSON.stringify(income))
});

app.get("/settings", requiresAuth(), async (req, res) => {
    //res.send(JSON.stringify(req.oidc.user));
    //Test user: johanna@test.com, saodhgi-9486y-(WYTH
    const user = await getUserByEmail(client, req.oidc.user.email)
    res.render("pages/settings", { user })
});

app.get("/api/getUser/:id", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    userMap[user._id] = req.params.id
    res.status(200).end();
});

app.get("/vale", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);

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

    const farms = user.farms;
    farms.forEach(grainCalc);
    grainIncome = incomeCalc("grain", grainLevels);

    const lumberCamps = user.lumberCamps;
    lumberCamps.forEach(lumberCalc);
    lumberIncome = incomeCalc("lumber", lumberLevels);

    const quarries = user.quarries;
    quarries.forEach(stoneCalc);
    stoneIncome = incomeCalc("stone", stoneLevels);

    const ironMines = user.ironMines;
    ironMines.forEach(ironCalc);
    ironIncome = incomeCalc("iron", ironLevels);

    const goldMines = user.goldMines;
    goldMines.forEach(goldCalc);
    goldIncome = incomeCalc("gold", goldLevels);

    const recruitsIncome = user.trainingfieldLevel * 5;
    const horseIncome = user.stablesLevel * 3;

    const attackValue = await calculateAttack(user);
    const defenseValue = await calculateDefense(user);

    res.render("pages/vale", { user, grainIncome, lumberIncome, stoneIncome, ironIncome, goldIncome, recruitsIncome, horseIncome, attackValue, defenseValue })
});

app.get("/profile/:username", requiresAuth(), async (req, res) => {
    const currentUser = req.oidc.user.email;
    const profileUser = await getUser(client, req.params.username);

    if (profileUser === false) {
        res.send("No such user");
    } else {
        const username = req.params.username;

        if (currentUser === profileUser.email) {
            res.render('pages/settings');
        } else {
            res.render('pages/publicprofile', { username });
        }
    }
});

app.get("/market", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const trades = await getAllTrades(client);

    res.render('pages/market', { user, trades });
});

app.post("/market/sell", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);

    const sellAmount = parseInt(req.body.sellAmount);
    const sellResource = req.body.sellResource;
    const buyAmount = parseInt(req.body.buyAmount);
    const buyResource = req.body.buyResource;
    await addTrade(client, user, sellAmount, sellResource, buyAmount, buyResource);

    res.redirect("/market");
});

app.post("/market/cancel/:id", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const trade = await getTrade(client, req.params.id);

    if (user.username === trade.seller) {
        await deleteTrade(client, new ObjectId(trade._id));
    }

    res.redirect('/market')
});

app.get("/messages/inbox", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const messages = await getUserMessages(client, user.username);

    if (messages) {
        res.redirect('/messages/inbox/page/1')
    } else {
        res.send("No messages")
    }
});

app.get("/messages/new", requiresAuth(), async (req, res) => {
    const recipient = "";
    res.render("pages/writeMessage", { recipient })
});

app.get("/messages/new/:username", requiresAuth(), async (req, res) => {
    const recipient = req.params.username;
    res.render("pages/writeMessage", { recipient })
});

app.get("/messages/inbox/:id", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const username = user.username;
    let searchObject;

    try {
        searchObject = new ObjectId(req.params.id);
    }
    catch (e) {
    }

    const message = await getMessageById(client, searchObject);

    if (message && (username === message.sentBy || username === message.sentTo)) {
        res.render('pages/message', { username, message })
    } else {
        res.send("No such message!")
    }
});

app.post("/messages/send", requiresAuth(), async (req, res) => {
    const sender = await getUserByEmail(client, req.oidc.user.email);
    const receiver = await getUser(client, req.body.recipient);
    const message = req.body.message;

    if (receiver) {
        const data = { sentTo: receiver.username, sentBy: sender.username, message: message, time: new Date() };
        const result = await addMessage(client, data);
        res.redirect(`/messages/inbox/${result}`);
    } else {
        res.send("No such user")
    }
});

app.post("/messages/send/:username", requiresAuth(), async (req, res) => {
    const sender = await getUserByEmail(client, req.oidc.user.email);
    const receiver = await getUser(client, req.params.username);
    const message = req.body.message;

    if (receiver) {
        const data = { sentTo: receiver.username, sentBy: sender.username, message: message, time: new Date() };
        const result = await addMessage(client, data);
        res.redirect(`/messages/inbox/${result}`);
    } else {
        res.send("No such user")
    }
});

app.get("/messages/inbox/page/:nr", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);
    const username = user.username;
    const result = await getUserMessages(client, user.username)

    const maxPages = Math.ceil(Object.keys(result).length / 20);
    //TODO error check alla URL inputs

    const nr = parseInt(req.params.nr);

    if (nr < 1 || nr > maxPages || isNaN(nr)) {
        //todo detect % and #
        res.redirect('/messages/inbox/page/1')
    } else {

        if (result.length === 0) {
            res.render('pages/inbox')
        }

        const currentPage = parseInt(req.params.nr);

        let startPoint = 0;
        if (currentPage == 1) {
            startPoint = 0
        } else {
            startPoint = (currentPage - 1) * 20;
        }

        const objectToArray2 = result => {
            const keys = Object.keys(result);
            const res = [];
            for (let i = 0; i < keys.length; i++) {
                res.push(result[keys[i]]);
            };
            return res;
        };

        const tempArray = objectToArray2(result);
        const reverseArray = [];

        for (i = tempArray.length - 1; i >= 0; i--) {
            reverseArray.push(tempArray[i]);
        }

        const objectToArray = reverseArray => {
            const keys = Object.keys(reverseArray);
            const res = [];
            for (let i = startPoint; i < startPoint + 20; i++) {
                res.push(reverseArray[keys[i]]);
                if (reverseArray[keys[i + 1]] === null || reverseArray[keys[i + 1]] === undefined) {
                    i = Number.MAX_SAFE_INTEGER;
                }
            };
            return res;
        };
        const filteredResult = objectToArray(reverseArray);

        res.render('pages/inbox', { username, result, currentPage, maxPages, filteredResult })
    }
});

app.post("/market/buy/:id", requiresAuth(), async (req, res) => {
    const buyer = await getUserByEmail(client, req.oidc.user.email);
    await buyTrade(client, buyer);

    res.redirect('/market')
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
        res.send("You haven't attacked anyone yet!")
    }
});

app.get("/mailbox/log/:id", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const username = user.username;
    let searchObject;

    try {
        searchObject = new ObjectId(req.params.id);
    } catch (e) {
    }
    const log = await getAttackLog(client, searchObject);

    if (user.username === log.attacker) {
        attackUrl = `/profile/${log.defender}/attack`
    } else {
        attackUrl = `/profile/${log.attacker}/attack`
    }

    if (log && (username === log.attacker || username === log.defender)) {
        res.render('pages/attack', { username, log })
    } else {
        res.send("No such log!")
    }
});

app.get("/mailbox/log/page/:nr", requiresAuth(), async (req, res) => {
    //TODO use one method for both log and messages?
    const user = await getUserByEmail(client, req.oidc.user.email);
    const username = user.username;
    const result = await getInvolvedAttackLogs(client, user.username)
    const maxPages = Math.ceil(Object.keys(result).length / 20);
    //if check size/nr/osv, nr can't be negative etc
    //TODO error check alla URL inputs

    const nr = parseInt(req.params.nr);

    if (nr < 1 || nr > maxPages || isNaN(nr)) {
        //todo detect % and #
        res.redirect('/mailbox/log/page/1')
    } else {

        if (result.length === 0) {
            res.render('pages/log')
        }

        const currentPage = parseInt(req.params.nr);

        let startPoint = 0;
        if (currentPage == 1) {
            startPoint = 0
        } else {
            startPoint = (currentPage - 1) * 20;
        }

        const objectToArray2 = result => {
            const keys = Object.keys(result);
            const res = [];
            for (let i = 0; i < keys.length; i++) {
                res.push(result[keys[i]]);
            };
            return res;
        };

        const tempArray = objectToArray2(result);
        let reverseArray = [];

        for (i = tempArray.length - 1; i >= 0; i--) {
            reverseArray.push(tempArray[i]);
            //   console.log(i)
        }

        const objectToArray = reverseArray => {
            const keys = Object.keys(reverseArray);
            const res = [];
            for (let i = startPoint; i < startPoint + 20; i++) {
                res.push(reverseArray[keys[i]]);
                if (reverseArray[keys[i + 1]] === null || reverseArray[keys[i + 1]] === undefined) {
                    i = Number.MAX_SAFE_INTEGER;
                }
            };
            return res;
        };
        const filteredResult = objectToArray(reverseArray);

        res.render('pages/log', { username, result, currentPage, maxPages, filteredResult })
    }
});

app.post("/search", requiresAuth(), (req, res) => {
    res.redirect(`/profile/${req.body.name}`)
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
    const totalCost = await calculateTotalBuildingUpgradeCost("barracks", user.barracksLevel)

    res.render('pages/barracks', { user, totalCost });
});

app.get("/online", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const temp = [];

    for (let i in userMap) {
        result = await getUserById(client, i);
        temp.push(result.username);
    }

    res.render('pages/online', { user, temp });
});

app.get("/town/wall", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const maxWallHealth = user.wallLevel * 100;
    const defenseBonus = user.wallLevel * 10;

    let notAtMaxHealth;
    if (maxWallHealth === user.currentWallHealth) {
        notAtMaxHealth = true;
    } else {
        notAtMaxHealth = false;
    }

    const totalCost = await calculateTotalBuildingUpgradeCost("wall", user.wallLevel)
    res.render('pages/wall', { user, maxWallHealth, notAtMaxHealth, totalCost, defenseBonus })
});

app.post("/town/:building/upgrade", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const type = req.params.building;
    var buildingName, level;

    switch (type) {
        case "barracks":
            level = user.barracksLevel;
            buildingName = "barracksLevel";
            break;
        case "blacksmith":
            level = user.blacksmithLevel;
            buildingName = "blacksmithLevel";
            break;
        case "stables":
            level = user.stablesLevel;
            buildingName = "stablesLevel";
            break;
        case "trainingfield":
            level = user.trainingfieldLevel;
            buildingName = "trainingfieldLevel";
            break;
        case "wall":
            level = user.wallLevel;
            buildingName = "wallLevel";
            break;
        case "workshop":
            level = user.workshopLevel;
            buildingName = "workshopLevel";
            break;
        default:
            console.log("error")
    }

    if (level >= 20) {
        res.redirect(`/town/${req.params.building}`);
    } else {
        const totalCost = await calculateTotalBuildingUpgradeCost(type, level)

        if (await checkIfCanAfford(client, user.username, totalCost.goldCost, totalCost.lumberCost, totalCost.stoneCost, totalCost.ironCost, 0, 0, 0)) {
            await upgradeBuilding(client, user.username, buildingName);
            await removeResources(client, user.username, totalCost.goldCost, totalCost.lumberCost, totalCost.stoneCost, totalCost.ironCost, 0, 0, 0);
            if (type === "wall") {
                await restoreWallHealth(client, user);
            }
        } else {
            console.log("bbbb");
        }
        res.redirect(`/town/${req.params.building}`);
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

        const type = "wall"
        const lumberCost = await calcBuildingLumberCost(type, user.wallLevel);
        const stoneCost = await calcBuildingStoneCost(type, user.wallLevel);
        const ironCost = await calcBuildingIronCost(type, user.wallLevel);
        const goldCost = await calcBuildingGoldCost(type, user.wallLevel);

        if (await checkIfCanAfford(client, user.username, goldCost, lumberCost, stoneCost, ironCost, 0, 0, 0)) {
            await removeResources(client, user.username, goldCost, lumberCost, stoneCost, ironCost, 0, 0, 0);
            restoreWallHealth(client, user); //await?
        } else {
            console.log("bbbb");
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
    const totalCost = await calculateTotalBuildingUpgradeCost("workshop", user.workshopLevel)

    res.render('pages/workshop', { user, totalCost })
});

app.post("/town/workshop/train", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);
    const batteringrams = convertNegativeToZero(parseInt(req.body.batteringram));
    const siegetowers = convertNegativeToZero(parseInt(req.body.siegetower));
    const trainees = { batteringrams: batteringrams, siegetowers: siegetowers };
    await trainTroops(client, user, trainees);

    res.redirect('/town/workshop');
});

app.get("/town/stables", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const totalCost = await calculateTotalBuildingUpgradeCost("stables", user.stablesLevel)

    res.render('pages/stables', { user, totalCost });
});

app.get("/town/blacksmith", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const totalCost = await calculateTotalBuildingUpgradeCost("blacksmith", user.blacksmithLevel)

    res.render('pages/blacksmith', { user, totalCost });
});

app.post("/town/blacksmith/craft", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);

    const boots = convertNegativeToZero(parseInt(req.body.boots));
    const bracers = convertNegativeToZero(parseInt(req.body.bracers));
    const helmets = convertNegativeToZero(parseInt(req.body.helmet));
    const lances = convertNegativeToZero(parseInt(req.body.lance));
    const longbows = convertNegativeToZero(parseInt(req.body.longbow));
    const shields = convertNegativeToZero(parseInt(req.body.shield));
    const spears = convertNegativeToZero(parseInt(req.body.spear));
    const swords = convertNegativeToZero(parseInt(req.body.sword));

    const lumberCost = calcLumberCraftCost(boots, bracers, helmets, lances, longbows, shields, spears, swords);
    const ironCost = calcIronCraftCost(boots, bracers, helmets, lances, longbows, shields, spears, swords);
    const goldCost = calcGoldCraftCost(boots, bracers, helmets, lances, longbows, shields, spears, swords);

    const updateUser = {
        "shields": shields, "swords": swords, "bracers": bracers, "longbows": longbows, "spears": spears, "lances": lances, "boots": boots, "helmets": helmets
    }

    if (await checkIfCanAfford(client, user.username, goldCost, lumberCost, 0, ironCost, 0, 0, 0)) {
        await craftArmor(client, user.username, updateUser);
        await removeResources(client, user.username, goldCost, lumberCost, 0, ironCost, 0, 0, 0);
    } else {
        console.log("bbbb");
    }
    //error check?
    res.redirect('/town/blacksmith');

});

app.get("/land", requiresAuth(), async (req, res) => {
    res.render('pages/land');
});

app.post("/town/stables/train", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    const horsemen = convertNegativeToZero(parseInt(req.body.horsemen));
    const knights = convertNegativeToZero(parseInt(req.body.knights));
    const trainees = { horsemen: horsemen, knights: knights };

    await trainTroops(client, user, trainees);
    //error check?
    res.redirect('/town/stables');
});

app.post("/town/barracks/train", requiresAuth(), async (req, res) => {

    // if (typeof req.query.archers === 'string' || req.query.archers instanceof String) {
    //     console.log(req.query.archers)
    // } else {
    //     console.log("good")
    // }

    const user = await getUserByEmail(client, req.oidc.user.email);
    const archers = convertNegativeToZero(parseInt(req.body.archers));
    const spearmen = convertNegativeToZero(parseInt(req.body.spearmen));
    const swordsmen = convertNegativeToZero(parseInt(req.body.swordsmen));

    const trainees = { archers: archers, spearmen: spearmen, swordsmen: swordsmen };

    await trainTroops(client, user, trainees);

    res.redirect('/town/barracks');

});

app.post("/profile/:username/attack", requiresAuth(), async (req, res) => {
    //TODO attack limiter //reset all at midnight? //lose armor
    //TODO validate db input

    const attacker = await getUserByEmail(client, req.oidc.user.email);
    const defender = await getUser(client, req.params.username);
    if (defender === false) {
        res.send("No such user");
    } else {
        console.log(attacker.username + " tries to attack " + defender.username);
        result = await attackFunc(client, attacker, defender);
        res.redirect(`/mailbox/log/${result}`);
    }
});

app.get("/land/:type/:number", requiresAuth(), async (req, res) => {
    type = req.params.type;
    resourceId = parseInt(req.params.number);
    const user = await getUserByEmail(client, req.oidc.user.email);
    var invalidId;

    if (type === "farm") {
        if (resourceId >= 0 && resourceId <= maxFarms - 1) {
            title = "Farm";
            resourceLevel = user.farms[resourceId];
        } else {
            invalidId = true;
        }
    } else if (type === "goldMine") {
        if (resourceId >= 0 && resourceId <= maxGoldMines - 1) {
            title = "Gold mine";
            resourceLevel = user.goldMines[resourceId];
        } else {
            invalidId = true;
        }
    } else if (type === "ironMine") {
        if (resourceId >= 0 && resourceId <= maxIronMines - 1) {
            title = "Iron mine";
            resourceLevel = user.ironMines[resourceId];
        } else {
            invalidId = true;
        }
    }
    else if (type === "lumbercamp") {
        if (resourceId >= 0 && resourceId <= maxLumberCamps - 1) {
            title = "Lumber camp";
            resourceLevel = user.lumberCamps[resourceId];
        } else {
            invalidId = true;
        }
    }
    else if (type === "quarry") {
        if (resourceId >= 0 && resourceId <= maxQuarries - 1) {
            title = "Quarry";
            resourceLevel = user.quarries[resourceId];
        } else {
            invalidId = true;
        }
    }
    const totalCost = await calculateTotalBuildingUpgradeCost(type, resourceLevel)

    if (invalidId) {
        res.redirect("/land");
    } else if (resourceLevel !== undefined) {
        //use one field for all levels, none to 20
        res.render('pages/resourcefield', { totalCost });
    } else {
        res.render('pages/emptyfield', { totalCost });
    }

});

app.get("/land/:type/:number/upgrade", requiresAuth(), async (req, res) => {
    var type = req.params.type;
    const resourceId = parseInt(req.params.number);
    const user = await getUserByEmail(client, req.oidc.user.email);
    var updatedUser, resourceLevel, resource;

    if (type === "farm") {
        if (resourceId >= 0 && resourceId <= maxFarms) {
            resource = "farms"
            updatedUser = user.farms;
            resourceLevel = updatedUser[resourceId]
            updatedUser[resourceId]++;
            updatedUser = { farms: updatedUser }
        } else {
            res.redirect("/land");
        }
    } else if (type === "goldmine") {
        if (resourceId >= 0 && resourceId <= maxGoldMines) {
            type = "goldMine";
            resource = "goldMines";
            updatedUser = user.goldMines;
            resourceLevel = updatedUser[resourceId]
            updatedUser[resourceId]++;

            updatedUser = { goldMines: updatedUser }
        } else {
            res.redirect("/land");
        }
    } else if (type === "ironmine") {
        if (resourceId >= 0 && resourceId <= maxIronMines) {
            type = "ironMine";
            resource = "ironMines";
            updatedUser = user.ironMines;
            resourceLevel = updatedUser[resourceId]
            updatedUser[resourceId]++;

            updatedUser = { ironMines: updatedUser }
        } else {
            res.redirect("/land");
        }
    }
    else if (type === "lumbercamp") {
        if (resourceId >= 0 && resourceId <= maxLumberCamps) {
            resource = "lumberCamp"
            updatedUser = user.lumberCamps;
            resourceLevel = updatedUser[resourceId]
            updatedUser[resourceId]++;

            updatedUser = { lumberCamps: updatedUser }
        } else {
            res.redirect("/land");
        }
    } else if (type === "quarry") {
        if (resourceId >= 0 && resourceId <= maxQuarries) {
            resource = "quarry"
            updatedUser = user.quarries;
            resourceLevel = updatedUser[resourceId]
            updatedUser[resourceId]++;

            updatedUser = { quarries: updatedUser }
        } else {
            res.redirect("/land");
        }
    }

    if (resourceLevel >= 20) {
        res.redirect("/land");
    } else {

        const totalCost = await calculateTotalBuildingUpgradeCost(type, resourceLevel)

        if (await checkIfCanAfford(client, user.username, totalCost.goldCost, totalCost.lumberCost, totalCost.stoneCost, totalCost.ironCost, 0, 0, 0)) {
            await upgradeResource(client, user.username, updatedUser, resource);
            await removeResources(client, user.username, totalCost.goldCost, totalCost.lumberCost, totalCost.stoneCost, totalCost.ironCost, 0, 0, 0);
        } else {
            console.log("bbbb");
        }
        res.redirect(`/land/${type}/${resourceId}`);
    }

});

app.get("/land/:type/:number/establish", requiresAuth(), async (req, res) => {
    //Same thing as upgrade?
    //TODO error check
    type = req.params.type;
    resourceId = parseInt(req.params.number);
    const user = await getUserByEmail(client, req.oidc.user.email);
    var updatedUser;

    if (type === "farm") {
        updatedUser = user.farms;
        updatedUser.push(1);
        updatedUser = { farms: updatedUser }
    } else if (type === "goldmine") {
        type = "goldMine";
        updatedUser = user.goldMines;
        updatedUser.push(1);
        updatedUser = { goldMines: updatedUser }
    } else if (type === "ironmine") {
        type = "ironMine";
        updatedUser = user.ironMines;
        updatedUser.push(1);
        updatedUser = { ironMines: updatedUser }
    } else if (type === "lumbercamp") {
        updatedUser = user.lumberCamps;
        updatedUser.push(1);
        updatedUser = { lumberCamps: updatedUser }
    } else if (type === "quarry") {
        updatedUser = user.quarries;
        updatedUser.push(1);
        updatedUser = { quarries: updatedUser }
    }

    const totalCost = await calculateTotalBuildingUpgradeCost(type, 0)

    if (await checkIfCanAfford(client, user.username, totalCost.goldCost, totalCost.lumberCost, totalCost.stoneCost, totalCost.ironCost, 0, 0, 0)) {
        await upgradeResource(client, user.username, updatedUser, type);
        await removeResources(client, user.username, totalCost.goldCost, totalCost.lumberCost, totalCost.stoneCost, totalCost.ironCost, 0, 0, 0);
    }

    res.redirect("/land");
});

async function checkAll() {
    await client.db("gamedb").collection("players").find().forEach(function (user) {
        addResources(client, user.username);
    });
}

//måste köra för alla så folk kan anfalla folk som är afk
//ev kör när någon interagerar med afk folk
var minutes = 15, the_interval = minutes * 60 * 1000;
setInterval(function () {
    const date = new Date();
    console.log(date.toLocaleDateString(), date.toLocaleTimeString() + " Adding resources for everyone!");
    checkAll();
}, the_interval);

const port = process.env.PORT || 3000;
server.listen(port, () => {
    const date = new Date();
    console.log(date.toLocaleDateString(), date.toLocaleTimeString() + ` Listening on https://localhost:${port}`);
});

app.use(express.static(path.join(__dirname, 'pages')));
// Handle 404
app.use(function (req, res) {
    const date = new Date();
    console.log(date.toLocaleDateString(), date.toLocaleTimeString() + " Bad URL: " + req.path);
    res.status(404).render('pages/404');
});

// Handle 500
app.use(function (error, req, res, next) {
    const date = new Date();
    console.log(date.toLocaleDateString(), date.toLocaleTimeString() + " " + error + " " + req.path);
    res.status(500).render('pages/500');
});