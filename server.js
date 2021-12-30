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

const { getAttackLog, createAttackLog, getInvolvedAttackLogs, calculateAttack, calculateDefense, armyLosses } = require("./modules/attack.js");
const { trainTroops, craftArmor } = require("./modules/troops.js");
const { getUser, getUserByEmail, getUserById, deleteUser, getAllTrades, addTrade, getTrade, setDatabaseValue, deleteTrade, hasTrades, getUserTrades } = require("./modules/database.js");
const { calcGoldTrainCost, calcGrainTrainCost, calcIronTrainCost, calcLumberTrainCost, upgradeBuilding, calcLumberCraftCost, calcIronCraftCost, calcGoldCraftCost, calcBuildingLumberCost, calcBuildingStoneCost, calcBuildingIronCost, calcBuildingGoldCost, upgradeResource, restoreWallHealth, lowerWallHealth } = require("./modules/buildings.js");
const { addResources, removeResources, checkIfCanAfford, stealResources, loseResources, incomeCalc } = require("./modules/resources.js");

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}`;
const client = new MongoClient(uri);

const maxFarms = 4, maxGoldMines = 2, maxIronMines = 3, maxQuarries = 4, maxLumberCamps = 4;

const { Server } = require("socket.io");
const attack = require("./modules/attack.js");
const req = require("express/lib/request");
const { filter } = require("compression");
const { get } = require("express/lib/response");
const io = new Server(server);

var ManagementClient = require('auth0').ManagementClient;

var management = new ManagementClient({
    domain: 'dev-66gl6b4zf.eu.auth0.com',
    clientId: 'avQSfz75P1z22yWOJ60mZ3EUHFfJBT78',
    clientSecret: '_n0T3XSg2KC6GihkHAYYgR9T3WiFZhN1LfXuhFSgj5OfeJrVgfC0RMC6qrYPktK_',
    scope: 'update:users delete:users',
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
                    user = next.updateDescription.updatedFields;

                    grain = JSON.stringify(user.grain);
                    lumber = JSON.stringify(user.lumber);
                    stone = JSON.stringify(user.stone);
                    iron = JSON.stringify(user.iron);
                    gold = JSON.stringify(user.gold);
                    recruits = JSON.stringify(user.recruits);
                    horses = JSON.stringify(user.horses);

                    archers = JSON.stringify(user.archers);
                    spearmen = JSON.stringify(user.spearmen);
                    swordsmen = JSON.stringify(user.swordsmen);
                    horsemen = JSON.stringify(user.horsemen);
                    knights = JSON.stringify(user.knights);
                    batteringrams = JSON.stringify(user.batteringrams);
                    siegetowers = JSON.stringify(user.siegetowers);

                    farms = JSON.stringify(user.farms);
                    lumbercamps = JSON.stringify(user.lumberCamps);
                    quarries = JSON.stringify(user.quarries);
                    ironmines = JSON.stringify(user.ironMines);
                    goldmines = JSON.stringify(user.goldMines);
                    trainingfield = JSON.stringify(user.trainingfieldLevel);
                    stables = JSON.stringify(user.stablesLevel);
                    wall = JSON.stringify(user.wallLevel);

                    boots = JSON.stringify(user.boots);
                    bracers = JSON.stringify(user.bracers);
                    helmets = JSON.stringify(user.helmets);
                    lances = JSON.stringify(user.lances);
                    longbows = JSON.stringify(user.longbows);
                    shields = JSON.stringify(user.shields);
                    spears = JSON.stringify(user.spears);
                    swords = JSON.stringify(user.swords);

                    currentWallHealth = JSON.stringify(user.currentWallHealth);

                    updateDamage = false;
                    checkTrades = false;

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
                        validateUserTrades(i);
                    }

                } else {
                    //console.log('fel')
                }
            }
        })
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
    authenticated = req.oidc.isAuthenticated();

    if (authenticated) {
        res.redirect("/vale")
    } else {
        res.sendFile(path.join(__dirname, '/static/index.html'));
    }

});

app.delete("/settings/delete", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);

    id = `auth0|${user._id}`

    await deleteUser(client, user._id);

    management.deleteUser({ id: id }, function (err) {
        if (err) {
            console.log(err);
        }
        console.log(id + " was deleted from auth0.");
    });

    res.status(200).end();
    //res.redirect('/logout')
});

app.get("/api/getAttackPower", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    result = await calculateAttack(user);

    res.send(JSON.stringify(result))
});

app.get("/api/getDefensePower", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    result = await calculateDefense(user);

    res.send(JSON.stringify(result))
});

app.get("/api/:getIncome", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);

    requestedIncome = req.params.getIncome;

    var levels = 0, income = 0;
    function calc(i) {
        levels += i;
    };

    if (requestedIncome === "getGrainIncome") {
        const count = user.farms;
        count.forEach(calc);
        income = incomeCalc("grain", levels);
    } else if (requestedIncome === "getLumberIncome") {
        const count = user.lumberCamps;
        count.forEach(calc);
        income = incomeCalc("lumber", levels);
    }
    else if (requestedIncome === "getStoneIncome") {
        const count = user.quarries;
        count.forEach(calc);
        income = incomeCalc("stone", levels);
    }
    else if (requestedIncome === "getIronIncome") {
        const count = user.ironMines;
        count.forEach(calc);
        income = incomeCalc("iron", levels);
    }
    else if (requestedIncome === "getGoldIncome") {
        const count = user.goldMines;
        count.forEach(calc);
        income = incomeCalc("gold", levels);
    } else if (requestedIncome === "getRecruitsIncome") {
        income = user.trainingfieldLevel * 5;
    } else if (requestedIncome === "getHorseIncome") {
        income = user.stablesLevel * 3;
    } else {
        levels = null;
    }

    res.send(JSON.stringify(income))
});

app.get("/settings", requiresAuth(), async (req, res) => {

    //res.send(JSON.stringify(req.oidc.user));
    //Test user: johanna@test.com, saodhgi-9486y-(WYTH

    user = await getUserByEmail(client, req.oidc.user.email)

    res.render("pages/settings")
});

//make post?
app.get("/api/getUser/:id", requiresAuth(), async (req, res) => {

    //catch om någon gör request på annat sätt än "rätt sätt", och inte har email
    user = await getUserByEmail(client, req.oidc.user.email);
    userMap[user._id] = req.params.id

    res.status(200).end();
});

app.get("/vale", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);

    grain = user.grain;
    lumber = user.lumber;
    stone = user.stone;
    iron = user.iron;
    gold = user.gold;
    recruits = user.recruits;
    horses = user.horses;

    archers = user.archers;
    spearmen = user.spearmen;
    swordsmen = user.swordsmen;
    horsemen = user.horsemen;
    knights = user.knights;
    batteringrams = user.batteringrams;
    siegetowers = user.siegetowers;

    grainLevels = 0, lumberLevels = 0, stoneLevels = 0, ironLevels = 0, goldLevels = 0, grainIncome = 0, lumberIncome = 0, stoneIncome = 0, ironIncome = 0, goldIncome = 0;
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

    recruitsIncome = user.trainingfieldLevel * 5;
    horseIncome = user.stablesLevel * 3;

    attackValue = await calculateAttack(user);
    defenseValue = await calculateDefense(user);

    res.render("pages/vale")
});

app.get("/profile/:username", requiresAuth(), async (req, res) => {

    const currentUser = req.oidc.user.email;
    const profileUser = await getUser(client, req.params.username);

    if (profileUser === false) {
        res.send("No such user");
    } else {

        gold = profileUser.gold;
        iron = profileUser.iron;
        lumber = profileUser.lumber;
        grain = profileUser.grain;
        stone = profileUser.stone;

        archers = profileUser.archers;
        spearmen = profileUser.spearmen;
        swordsmen = profileUser.swordsmen;
        horsemen = profileUser.horsemen;
        knights = profileUser.knights;

        username = req.params.username;

        if (currentUser === profileUser.email) {
            res.render('pages/settings');
        } else {
            res.render('pages/publicprofile');
        }
    }
});

app.get("/market", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);
    const trades = await getAllTrades(client);

    res.render('pages/market', { trades, user });
});

app.post("/market/sell", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);
    const currentGrain = user.grain;
    const currentLumber = user.lumber;
    const currentStone = user.stone;
    const currentIron = user.iron;
    const currentGold = user.gold;

    const sellAmount = parseInt(req.body.sellAmount);
    const sellResource = req.body.sellResource;
    const buyAmount = parseInt(req.body.buyAmount);
    const buyResource = req.body.buyResource;
    var makeTrade = false;

    if (sellResource === "Grain" && sellAmount <= currentGrain) {
        makeTrade = true;
    } else if (sellResource === "Lumber" && sellAmount <= currentLumber) {
        makeTrade = true;
    } else if (sellResource === "Stone" && sellAmount <= currentStone) {
        makeTrade = true;
    } else if (sellResource === "Iron" && sellAmount <= currentIron) {
        makeTrade = true;
    } else if (sellResource === "Gold" && sellAmount <= currentGold) {
        makeTrade = true;
    }

    if (sellResource !== buyResource && makeTrade) {
        data = { seller: user.username, sellAmount: sellAmount, sellResource: sellResource, buyAmount: buyAmount, buyResource: buyResource }
        addTrade(client, data);
    }
    res.redirect("/market");
});

app.post("/market/cancel/:id", requiresAuth(), async (req, res) => {

    console.log("apa1")
    const user = await getUserByEmail(client, req.oidc.user.email);
    const trade = await getTrade(client, req.params.id);

    if (user.username === trade.seller) {
        console.log("apa2")
        await deleteTrade(client, new ObjectId(trade._id));
    }

    res.redirect('/market')
});

app.post("/market/buy/:id", requiresAuth(), async (req, res) => {


    console.log("vaaaaaaa")
    //TODO not buy your own stuff

    const buyer = await getUserByEmail(client, req.oidc.user.email);
    const currentBuyerGrain = buyer.grain;
    const currentBuyerLumber = buyer.lumber;
    const currentBuyerStone = buyer.stone;
    const currentBuyerIron = buyer.iron;
    const currentBuyerGold = buyer.gold;
    const trade = await getTrade(client, req.params.id);
    const seller = await getUser(client, trade.seller);
    const buyResource = trade.buyResource.toString().toLowerCase();;
    const buyAmount = trade.buyAmount;
    const sellResource = trade.sellResource.toString().toLowerCase();
    const sellAmount = trade.sellAmount;
    const currentSellerGrain = seller.grain;
    const currentSellerLumber = seller.lumber;
    const currentSellerStone = seller.stone;
    const currentSellerIron = seller.iron;
    const currentSellerGold = seller.gold;
    var dataToSeller;
    var dataToBuyer;
    var sellerNewSellResourceAmount, sellerNewBuyResourceAmount, buyerNewSellResourceAmount, buyerNewBuyResourceAmount;
    var saleIsOk = false;

    if (buyResource === "grain" && currentBuyerGrain >= buyAmount) {
        sellerNewBuyResourceAmount = currentSellerGrain + buyAmount;
        buyerNewBuyResourceAmount = currentBuyerGrain - buyAmount;
        saleIsOk = true;
    } else if (buyResource === "lumber" && currentBuyerLumber >= buyAmount) {
        sellerNewBuyResourceAmount = currentSellerLumber + buyAmount;
        buyerNewBuyResourceAmount = currentBuyerLumber - buyAmount;
        saleIsOk = true;
    } else if (buyResource === "stone" && currentBuyerStone >= buyAmount) {
        sellerNewBuyResourceAmount = currentSellerStone + buyAmount;
        buyerNewBuyResourceAmount = currentBuyerStone - buyAmount;
        saleIsOk = true;
    } else if (buyResource === "iron" && currentBuyerIron >= buyAmount) {
        sellerNewBuyResourceAmount = currentSellerIron + buyAmount;
        buyerNewBuyResourceAmount = currentBuyerIron - buyAmount;
        saleIsOk = true;
    } else if (buyResource === "gold" && currentBuyerGold >= buyAmount) {
        sellerNewBuyResourceAmount = currentSellerGold + buyAmount;
        buyerNewBuyResourceAmount = currentBuyerGold - buyAmount;
        saleIsOk = true;
    }

    if (sellResource === "grain") {
        sellerNewSellResourceAmount = currentSellerGrain - sellAmount;
        buyerNewSellResourceAmount = currentBuyerGrain + sellAmount;
    } else if (sellResource === "lumber") {
        sellerNewSellResourceAmount = currentSellerLumber - sellAmount;
        buyerNewSellResourceAmount = currentBuyerLumber + sellAmount;
    } else if (sellResource === "stone") {
        sellerNewSellResourceAmount = currentSellerStone - sellAmount;
        buyerNewSellResourceAmount = currentBuyerStone + sellAmount;
    } else if (sellResource === "iron") {
        sellerNewSellResourceAmount = currentSellerIron - sellAmount;
        buyerNewSellResourceAmount = currentBuyerIron + sellAmount;
    } else if (sellResource === "gold") {
        sellerNewSellResourceAmount = currentSellerGold - sellAmount;
        buyerNewSellResourceAmount = currentBuyerGold + sellAmount;
    }

    dataToSeller = { [sellResource]: sellerNewSellResourceAmount, [buyResource]: sellerNewBuyResourceAmount };
    dataToBuyer = { [sellResource]: buyerNewSellResourceAmount, [buyResource]: buyerNewBuyResourceAmount };

    if (saleIsOk) {
        await setDatabaseValue(client, seller.username, dataToSeller);
        await setDatabaseValue(client, buyer.username, dataToBuyer);
        await deleteTrade(client, new ObjectId(trade._id));
        console.log("seller", dataToSeller);
        console.log("buyer", dataToBuyer);
    }

    res.redirect('/market')
});

app.get("/mailbox", requiresAuth(), async (req, res) => {
    res.render('pages/mailbox')
});

app.get("/mailbox/log", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);
    result = await getInvolvedAttackLogs(client, user.username)
    if (result === false) {
        res.send("You haven't attacked anyone yet!")
    } else {
        res.redirect('/mailbox/log/page/1')
    }

});

app.get("/mailbox/log/:id", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);
    username = user.username;
    //TODO check only show your logs
    //error check if invalid format

    var searchObject;
    try {
        searchObject = new ObjectId(req.params.id);
    }
    catch (err) {
        log = false;
    }
    log = await getAttackLog(client, searchObject);



    if (user.username === log.attacker) {
        attackUrl = `/profile/${log.defender}/attack`
    } else {
        attackUrl = `/profile/${log.attacker}/attack`
    }


    if (log === false) {
        res.send("No such log!")
    } else {
        res.render('pages/attack')
    }
});

app.get("/mailbox/log/page/:nr", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);
    username = user.username;
    result = await getInvolvedAttackLogs(client, user.username)

    maxPages = Math.ceil(Object.keys(result).length / 20);
    //if check size/nr/osv, nr can't be negative etc
    //TODO error check alla URL inputs

    nr = parseInt(req.params.nr);

    if (nr < 1 || nr > maxPages || isNaN(nr)) {
        //todo detect % and #
        res.redirect('/mailbox/log/page/1')
    } else {

        if (result.length === 0) {
            res.render('pages/log')
        }

        currentPage = parseInt(req.params.nr);

        var startPoint = 0;
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

        tempArray = objectToArray2(result);
        reverseArray = [];

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
        filteredResult = objectToArray(reverseArray);

        res.render('pages/log')
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
    const type = "barracks"

    barracks = user.barracksLevel;

    lumberCost = await calcBuildingLumberCost(type, barracks + 1);
    stoneCost = await calcBuildingStoneCost(type, barracks + 1);
    ironCost = await calcBuildingIronCost(type, barracks + 1);
    goldCost = await calcBuildingGoldCost(type, barracks + 1);

    archers = user.archers;
    spearmen = user.spearmen;
    swordsmen = user.swordsmen;

    res.render('pages/barracks');
});

app.get("/online", requiresAuth(), async (req, res) => {

    temp = [];

    for (var i in userMap) {
        result = await getUserById(client, i);
        temp.push(result.username);
    }

    res.render('pages/online');
});

app.get("/town/wall", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    wall = user.wallLevel;
    currentWallHealth = user.currentWallHealth;
    maxWallHealth = wall * 100;
    type = "wall"
    defenseBonus = wall * 10;

    notAtMaxHealth = 0;
    if (maxWallHealth === user.currentWallHealth) {
        notAtMaxHealth = true;
    } else {
        notAtMaxHealth = false;
    }

    lumberCost = await calcBuildingLumberCost(type, wall + 1);
    stoneCost = await calcBuildingStoneCost(type, wall + 1);
    ironCost = await calcBuildingIronCost(type, wall + 1);
    goldCost = await calcBuildingGoldCost(type, wall + 1);
    res.render('pages/wall')
});

app.post("/town/:building/upgrade", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);

    type = req.params.building;
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
        const lumberCost = await calcBuildingLumberCost(type, level + 1);
        const stoneCost = await calcBuildingStoneCost(type, level + 1);
        const ironCost = await calcBuildingIronCost(type, level + 1);
        const goldCost = await calcBuildingGoldCost(type, level + 1);

        if (await checkIfCanAfford(client, user.username, goldCost, lumberCost, stoneCost, ironCost, 0, 0, 0)) {
            await upgradeBuilding(client, user.username, buildingName);
            await removeResources(client, user.username, goldCost, lumberCost, stoneCost, ironCost, 0, 0, 0);
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

    trainingField = user.trainingfieldLevel;
    type = "trainingfield"

    lumberCost = await calcBuildingLumberCost(type, trainingField + 1);
    stoneCost = await calcBuildingStoneCost(type, trainingField + 1);
    ironCost = await calcBuildingIronCost(type, trainingField + 1);
    goldCost = await calcBuildingGoldCost(type, trainingField + 1);

    res.render('pages/trainingField')

});

app.post("/town/wall/repair", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);

    maxWallHealth = user.wallLevel * 100;

    if (user.currentWallHealth < maxWallHealth) {


        type = "wall"

        lumberCost = await calcBuildingLumberCost(type, user.wallLevel);
        stoneCost = await calcBuildingStoneCost(type, user.wallLevel);
        ironCost = await calcBuildingIronCost(type, user.wallLevel);
        goldCost = await calcBuildingGoldCost(type, user.wallLevel);

        if (await checkIfCanAfford(client, user.username, goldCost, lumberCost, stoneCost, ironCost, 0, 0, 0)) {
            await removeResources(client, user.username, goldCost, lumberCost, stoneCost, ironCost, 0, 0, 0);
            restoreWallHealth(client, user);
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
    const type = "workshop"

    workshop = user.workshopLevel;

    batteringrams = user.batteringrams;
    siegetowers = user.siegetowers;

    lumberCost = await calcBuildingLumberCost(type, workshop + 1);
    stoneCost = await calcBuildingStoneCost(type, workshop + 1);
    ironCost = await calcBuildingIronCost(type, workshop + 1);
    goldCost = await calcBuildingGoldCost(type, workshop + 1);

    res.render('pages/workshop')
});

app.post("/town/workshop/train", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);
    const batteringrams = parseInt(req.body.batteringram);
    const siegetowers = parseInt(req.body.siegetower);

    const goldCost = calcGoldTrainCost(0, 0, 0, 0, 0, batteringrams, siegetowers);
    const grainCost = calcGrainTrainCost(0, 0, 0, 0, 0, batteringrams, siegetowers);
    const lumberCost = calcLumberTrainCost(0, 0, 0, 0, 0, batteringrams, siegetowers);
    const ironCost = calcIronTrainCost(0, 0, 0, 0, 0, batteringrams, siegetowers);

    const recruitCost = (batteringrams + siegetowers) * 2;

    const data = { "batteringrams": batteringrams, "siegetowers": siegetowers };

    if (await checkIfCanAfford(client, user.username, goldCost, lumberCost, 0, ironCost, grainCost, recruitCost, 0)) {
        await trainTroops(client, user.username, data);
        await removeResources(client, user.username, goldCost, lumberCost, 0, ironCost, grainCost, recruitCost, 0);
    } else {
        console.log("bbbb");
    }

    res.redirect('/town/workshop');
});

app.get("/town/stables", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);
    const type = "stables"

    stables = user.stablesLevel;

    lumberCost = await calcBuildingLumberCost(type, stables + 1);
    stoneCost = await calcBuildingStoneCost(type, stables + 1);
    ironCost = await calcBuildingIronCost(type, stables + 1);
    goldCost = await calcBuildingGoldCost(type, stables + 1);

    horsemen = user.horsemen;
    knights = user.knights;

    res.render('pages/stables');
});

app.get("/town/blacksmith", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);

    type = "blacksmith"
    blacksmith = user.blacksmithLevel;

    boots = user.boots;
    bracers = user.bracers;
    helmets = user.helmets;
    lances = user.lances;
    longbows = user.longbows;
    shields = user.shields;
    spears = user.spears;
    swords = user.swords;

    lumberCost = await calcBuildingLumberCost(type, blacksmith + 1);
    stoneCost = await calcBuildingStoneCost(type, blacksmith + 1);
    ironCost = await calcBuildingIronCost(type, blacksmith + 1);
    goldCost = await calcBuildingGoldCost(type, blacksmith + 1);

    res.render('pages/blacksmith');
});

app.post("/town/blacksmith/craft", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);

    var goldCost = 0, lumberCost = 0, ironCost = 0;

    boots = parseInt(req.body.boots);
    bracers = parseInt(req.body.bracers);
    helmets = parseInt(req.body.helmet);
    lances = parseInt(req.body.lance);
    longbows = parseInt(req.body.longbow);
    shields = parseInt(req.body.shield);
    spears = parseInt(req.body.spear);
    swords = parseInt(req.body.sword);

    lumberCost = calcLumberCraftCost(boots, bracers, helmets, lances, longbows, shields, spears, swords);
    ironCost = calcIronCraftCost(boots, bracers, helmets, lances, longbows, shields, spears, swords);
    goldCost = calcGoldCraftCost(boots, bracers, helmets, lances, longbows, shields, spears, swords);

    updateUser = {
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
    const user = await getUserByEmail(client, req.oidc.user.email);

    farms = maxFarms;
    goldMines = maxGoldMines;
    quarries = maxQuarries;
    lumberCamps = maxLumberCamps;
    ironMines = maxIronMines;

    f = user.farms;
    g = user.goldMines;
    q = user.quarries;
    l = user.lumberCamps;
    i = user.ironMines;

    res.render('pages/land');
});

app.post("/town/stables/train", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);

    const horsemen = parseInt(req.body.horsemen);
    const knights = parseInt(req.body.knights);

    const goldCost = calcGoldTrainCost(0, 0, 0, horsemen, knights, 0, 0);
    const grainCost = calcGrainTrainCost(0, 0, 0, horsemen, knights, 0, 0);
    const lumberCost = calcLumberTrainCost(0, 0, 0, horsemen, knights, 0, 0);
    const ironCost = calcIronTrainCost(0, 0, 0, horsemen, knights, 0, 0);

    const horseAndRecruitCost = horsemen + knights;
    const data = { "horsemen": horsemen, "knights": knights };

    if (await checkIfCanAfford(client, user.username, goldCost, lumberCost, 0, ironCost, grainCost, horseAndRecruitCost, horseAndRecruitCost)) {
        await trainTroops(client, user.username, data);
        await removeResources(client, user.username, goldCost, lumberCost, 0, ironCost, grainCost, horseAndRecruitCost, horseAndRecruitCost);
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

    const user = await getUserByEmail(client, req.oidc.user.email);
    const archers = parseInt(req.body.archers);
    const spearmen = parseInt(req.body.spearmen);
    const swordsmen = parseInt(req.body.swordsmen);

    const goldCost = calcGoldTrainCost(archers, spearmen, swordsmen, 0, 0, 0, 0);
    const grainCost = calcGrainTrainCost(archers, spearmen, swordsmen, 0, 0, 0, 0);
    const lumberCost = calcLumberTrainCost(archers, spearmen, swordsmen, 0, 0, 0, 0);
    const ironCost = calcIronTrainCost(archers, spearmen, swordsmen, 0, 0, 0, 0);

    const recruitCost = archers + spearmen + swordsmen;
    const data = { "archers": archers, "spearmen": spearmen, "swordsmen": swordsmen };

    if (await checkIfCanAfford(client, user.username, goldCost, lumberCost, 0, ironCost, grainCost, recruitCost, 0)) {
        await trainTroops(client, user.username, data);
        await removeResources(client, user.username, goldCost, lumberCost, 0, ironCost, grainCost, recruitCost, 0);
    } else {
        console.log("bbbb");
    }

    //error check?

    res.redirect('/town/barracks');

});

app.get("/profile/:username/attack", requiresAuth(), async (req, res) => {

    //TODO Make POST
    //TODO attack limiter //reset all at midnight? //losses
    //TODO validate db input

    const attacker = await getUserByEmail(client, req.oidc.user.email);
    const defender = await getUser(client, req.params.username);
    if (defender === false) {
        res.send("No such user");
    } else {

        console.log(attacker.username + " tries to attack " + defender.username);

        var attackDamage = await calculateAttack(attacker);
        var defenseDamage = await calculateDefense(defender);

        console.log("Total defense: " + defenseDamage + " Total attack: " + attackDamage);

        const closeness = attackDamage / (attackDamage + defenseDamage);
        var resourceDivider, attackTroopDivider, defenseTroopDivider;

        if (closeness <= 0.1) {
            resourceDivider = 100;
            attackTroopDivider = 5;
            defenseTroopDivider = 100;
        } else if (closeness <= 0.2) {
            resourceDivider = 80;
            attackTroopDivider = 7;
            defenseTroopDivider = 80;
        } else if (closeness <= 0.4) {
            resourceDivider = 20;
            attackTroopDivider = 10;
            defenseTroopDivider = 60;
        } else if (closeness <= 0.6) {
            resourceDivider = 5;
            attackTroopDivider = 5;
            defenseTroopDivider = 5;
        } else if (closeness <= 0.8) {
            resourceDivider = 20;
            attackTroopDivider = 20;
            defenseTroopDivider = 10;
        } else if (closeness <= 0.9) {
            resourceDivider = 10;
            attackTroopDivider = 30;
            defenseTroopDivider = 10;
        } else {
            resourceDivider = 100;
            attackTroopDivider = 50;
            defenseTroopDivider = 20;
        }

        wallBonus = 1 - ((defender.wallLevel * 2.5) * 0.01);

        goldLoot = Math.round((defender.gold / resourceDivider) * wallBonus);
        lumberLoot = Math.round((defender.lumber / resourceDivider) * wallBonus);
        stoneLoot = Math.round((defender.stone / resourceDivider) * wallBonus);
        grainLoot = Math.round((defender.grain / resourceDivider) * wallBonus);
        ironLoot = Math.round((defender.iron / resourceDivider) * wallBonus);

        stealResources(client, attacker.username, goldLoot, lumberLoot, stoneLoot, ironLoot, grainLoot);
        loseResources(client, defender.username, goldLoot, lumberLoot, stoneLoot, ironLoot, grainLoot);

        attackerLosses = await armyLosses(client, attacker, attackTroopDivider);
        defenderLosses = await armyLosses(client, defender, defenseTroopDivider);

        const wallDamage = Math.floor(Math.random() * 5);

        await lowerWallHealth(client, defender, wallDamage);

        const data = {
            "_id": new ObjectId(), "time": new Date(), "attacker": attacker.username, "defender": defender.username, "attackDamage": attackDamage, "defenseDamage": defenseDamage, "attackerLosses": attackerLosses, "defenderLosses": defenderLosses, "goldLoot": goldLoot,
            "grainLoot": grainLoot, "lumberLoot": lumberLoot, "stoneLoot": stoneLoot, "ironLoot": ironLoot, "wallDamage": wallDamage
        };

        result = await createAttackLog(client, data);

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
    // else {
    //  title = "none"
    //  resourceLevel = 0;
    //}
    lumberCost = await calcBuildingLumberCost(type, resourceLevel + 1);
    stoneCost = await calcBuildingStoneCost(type, resourceLevel + 1);
    ironCost = await calcBuildingIronCost(type, resourceLevel + 1);
    goldCost = await calcBuildingGoldCost(type, resourceLevel + 1);

    if (invalidId) {
        res.redirect("/land");
    } else if (resourceLevel !== undefined) {
        res.render('pages/resourcefield');
    } else {
        res.render('pages/emptyfield');
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
        const lumberCost = await calcBuildingLumberCost(type, resourceLevel + 1);
        const stoneCost = await calcBuildingStoneCost(type, resourceLevel + 1);
        const ironCost = await calcBuildingIronCost(type, resourceLevel + 1);
        const goldCost = await calcBuildingGoldCost(type, resourceLevel + 1);

        if (await checkIfCanAfford(client, user.username, goldCost, lumberCost, stoneCost, ironCost, 0, 0, 0)) {
            await upgradeResource(client, user.username, updatedUser, resource);
            await removeResources(client, user.username, goldCost, lumberCost, stoneCost, ironCost, 0, 0, 0);
        } else {
            console.log("bbbb");
        }


        res.redirect(`/land/${type}/${resourceId}`);
    }

});

app.get("/land/:type/:number/establish", requiresAuth(), async (req, res) => {

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

    const lumberCost = await calcBuildingLumberCost(type, 1);
    const stoneCost = await calcBuildingStoneCost(type, 1);
    const ironCost = await calcBuildingIronCost(type, 1);
    const goldCost = await calcBuildingGoldCost(type, 1);

    if (await checkIfCanAfford(client, user.username, goldCost, lumberCost, stoneCost, ironCost, 0, 0, 0)) {
        await upgradeResource(client, user.username, updatedUser, type);
        await removeResources(client, user.username, goldCost, lumberCost, stoneCost, ironCost, 0, 0, 0);
    }

    res.redirect("/land");

});

async function checkAll() {
    const result = await client.db("gamedb").collection("players").find().forEach(function (user) {
        addResources(client, user.username);
    });
}

async function validateUserTrades(id) {
    user = await getUserById(client, id);
    currentGrain = user.grain;
    currentLumber = user.lumber;
    currentStone = user.stone;
    currentIron = user.iron;
    currentGold = user.gold;
    var cancelTrade = false;
    if (await hasTrades(client, user.username)) {
        trades = await getUserTrades(client, user.username);

        for (let i = 0; i < trades.length; i++) {
            if (trades[i].sellResource === "Grain" && trades[i].sellAmount > currentGrain) {
                cancelTrade = true;
            } else if (trades[i].sellResource === "Lumber" && trades[i].sellAmount > currentLumber) {
                cancelTrade = true;
            } else if (trades[i].sellResource === "Stone" && trades[i].sellAmount > currentStone) {
                cancelTrade = true;
            } else if (trades[i].sellResource === "Iron" && trades[i].sellAmount > currentIron) {
                cancelTrade = true;
            } else if (trades[i].sellResource === "Gold" && trades[i].sellAmount > currentGold) {
                cancelTrade = true;
            }

            if (cancelTrade) {
                await deleteTrade(client, trades[i]._id);
            }
        }
    };
}



//måste köra för alla så folk kan anfalla folk som är afk
//ev kör när någon interagerar med afk folk
var minutes = 15, the_interval = minutes * 60 * 1000;
setInterval(function () {
    date = new Date();
    console.log(date.toLocaleDateString(), date.toLocaleTimeString() + " Adding resources for everyone!");
    checkAll();
}, the_interval);

const port = process.env.PORT || 3000;
server.listen(port, () => {
    date = new Date();
    console.log(date.toLocaleDateString(), date.toLocaleTimeString() + ` Listening on https://localhost:${port}`);
});

app.use(express.static(path.join(__dirname, 'pages')));
// Handle 404
app.use(function (req, res) {
    date = new Date();
    console.log(date.toLocaleDateString(), date.toLocaleTimeString() + " Bad URL: " + req.path);
    res.status(404).render('pages/404');
});

// Handle 500
app.use(function (error, req, res, next) {
    date = new Date();
    console.log(date.toLocaleDateString(), date.toLocaleTimeString() + " " + error + " " + req.path);
    res.status(500).render('pages/500');
});