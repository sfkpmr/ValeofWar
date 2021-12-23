const express = require("express");
const https = require('https');
const fs = require('fs');
var key = fs.readFileSync(__dirname + '/certs/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/certs/selfsigned.crt');
var options = {
    key: key,
    cert: cert
};
const app = express();
var server = https.createServer(options, app);
const { MongoClient, ObjectId } = require('mongodb');
require("dotenv").config();
const { auth, requiresAuth } = require('express-openid-connect');
const ejs = require('ejs');
const e = require("express");
//const { send, render } = require("express/lib/response"); //???
app.set('view engine', 'ejs');
var compression = require('compression');
// Use Gzip compression
app.use(compression());
// Remove x-powered-by Express
app.disable('x-powered-by');

const { getAttackLog, createAttackLog, getInvolvedAttackLogs, calculateAttack, calculateDefense } = require("./modules/attack.js");
const { trainTroops, craftArmor } = require("./modules/troops.js");
const { incDatabaseValue, getUser, getUserByEmail } = require("./modules/database.js");
const { calcGoldTrainCost, calcGrainTrainCost, calcIronTrainCost, calcLumberTrainCost, upgradeBuilding } = require("./modules/buildings.js");
const { addResources, removeResources, checkIfCanAfford, stealResources, loseResources } = require("./modules/resources.js");
const { json } = require("express/lib/response");

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}`;
const client = new MongoClient(uri);

//const maxFarms = 6, maxGoldMines = 3, maxIronMines = 4, maxQuarries = 2, maxLumberCamps = 4;
const maxFarms = 8, maxGoldMines = 2, maxIronMines = 3, maxQuarries = 4, maxLumberCamps = 7;
//const farmBaseCost = {lumber: 100, gold: 100};

const { Server } = require("socket.io");
const attack = require("./modules/attack.js");
const io = new Server(server);

//hashset instead? track all sockets for many windows?
let map = {};

io.on('connection', (socket) => {
    console.log('a user connected ' + socket.id);

    //io.emit('chat message', "asffsX");
    io.to(socket.id).emit("sync");

    socket.on('getUser', (msg) => {
        //io.emit('chat message', msg);
        console.log(msg)
    });

    socket.on('disconnect', () => {
        console.log('user disconnected ' + socket.id);

        for (var i in map) {
            if (map[i] === socket.id) {
                delete map[i]
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
            //console.log(next.documentKey._id);
            //io.emit('chat message', "-----------");

            for (var i in map) {
                //console.log("Check: " + i + " " + next.documentKey._id)
                if (i === next.documentKey._id) {


                    //console.log('rätt ' + map[i] + " " + i)
                    //io.emit('chat message', "-----------");
                    //https://stackoverflow.com/questions/17476294/how-to-send-a-message-to-a-particular-client-with-socket-io
                    //io.to(map[i]).emit("update", "xerxes")
                    user = next.updateDescription.updatedFields;
                    //io.to(map[i]).emit("update", 'XERXES');

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

                    updateDamage = false;

                    if (grain !== null && grain !== undefined) {
                        io.to(map[i]).emit("updateGrain", grain);
                    };
                    if (lumber !== null && lumber !== undefined) {
                        io.to(map[i]).emit("updateLumber", lumber);
                    };
                    if (stone !== null && stone !== undefined) {
                        io.to(map[i]).emit("updateStone", stone);
                    };
                    if (iron !== null && iron !== undefined) {
                        io.to(map[i]).emit("updateIron", iron);
                    };
                    if (gold !== null && gold !== undefined) {
                        io.to(map[i]).emit("updateGold", gold);
                    };
                    if (recruits !== null && recruits !== undefined) {
                        io.to(map[i]).emit("updateRecruits", recruits);
                    };
                    if (horses !== null && horses !== undefined) {
                        io.to(map[i]).emit("updateHorses", horses);
                    };
                    if (archers !== null && archers !== undefined) {
                        io.to(map[i]).emit("updateArchers", archers);
                    };
                    if (spearmen !== null && spearmen !== undefined) {
                        io.to(map[i]).emit("updateSpearmen", spearmen);
                    };
                    if (swordsmen !== null && swordsmen !== undefined) {
                        io.to(map[i]).emit("updateSwordsmen", swordsmen);
                    };
                    if (horsemen !== null && horsemen !== undefined) {
                        io.to(map[i]).emit("updateHorsemen", horsemen);
                    };
                    if (knights !== null && knights !== undefined) {
                        io.to(map[i]).emit("updateKnights", knights);
                    };
                    if (batteringrams !== null && batteringrams !== undefined) {
                        io.to(map[i]).emit("updateBatteringRams", batteringrams);
                    };
                    if (siegetowers !== null && siegetowers !== undefined) {
                        io.to(map[i]).emit("updateSiegeTowers", siegetowers);
                    };

                    // if (updateDamage) {
                    //     attack = await calculateAttack(user);
                    //     defense = await calculateDefense(user);
                    //     io.to(map[i]).emit("updateAttackPower", attack);
                    //     io.to(map[i]).emit("updateDefensePower", defense);
                    // };



                    //console.log(test.updatedFields)

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
// io.on('connection', (socket) => {
//     //users = ["aaaa", "bbbb"];
//     socket.on('setUserId', function (userId) {
//         users[userId] = socket;
//     });

//     socket.on('send notification', function (userId) {
//         users[userId].emit('notification', "important notification message");
//     });
// });
app.get("/", (req, res) => {
    authenticated = req.oidc.isAuthenticated();

    if (authenticated) {
        res.redirect("/vale")
    } else {
        res.render('pages/index')
    }

});

app.get("/profile", requiresAuth(), async (req, res) => {

    //res.send(JSON.stringify(req.oidc.user));

    //Test user: johanna@test.com, saodhgi-9486y-(WYTH

    const user = await getUserByEmail(client, req.oidc.user.email)

    res.redirect(`/profile/${user.username}`)
});

app.get("/test", requiresAuth(), async (req, res) => {

    res.render('pages/test')
});

//make post?
app.get("/getUser/:id", requiresAuth(), async (req, res) => {

    //banan = { "username": req.oidc.user.email }
    user = await getUserByEmail(client, req.oidc.user.email);
    //console.log("WWWWWWWWWWWWWWWWW " + req.params.id + " " + req.oidc.user.email + " bananana: " + user._id)
    map[user._id] = req.params.id

    //res.något annat?
    //res.send({})
    res.status(200).end();
});

app.get("/test2", requiresAuth(), async (req, res) => {

    console.log("------------")
    var keys = Object.keys(map);
    keys.forEach(key => {
        console.log(key + '|' + map[key]);
    });



    res.send("test2")
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

    attackValue = await calculateAttack(user);
    defenseValue = await calculateDefense(user);

    res.render("pages/vale")
});

app.get("/profile/:username", requiresAuth(), async (req, res) => {

    const currentUser = req.oidc.user.email;
    const profileUser = await getUser(client, req.params.username);

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
    res.render('pages/mailbox')
});

app.get("/mailbox/log", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);
    result = await getInvolvedAttackLogs(client, user.username)

    res.redirect('/mailbox/log/page/1')
});

app.get("/mailbox/log/:id", requiresAuth(), async (req, res) => {

    //TODO check only show your logs
    //error check if invalid format

    //    myMod.func(client, req.params.id, ObjectId);
    //myMod.func("a");

    const searchObject = new ObjectId(req.params.id);

    //log = await getAttackLog(req.params.id)
    log = await getAttackLog(client, searchObject);

    res.render('pages/attack')
});

app.get("/mailbox/log/page/:nr", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);
    result = await getInvolvedAttackLogs(client, user.username)

    //if check size/nr/osv, nr can't be negative etc
    //TODO error check alla URL inputs

    currentPage = parseInt(req.params.nr);

    var startPoint = 0;
    if (currentPage == 1) {
        startPoint = 0
    } else {
        //startPoint = (currentPage * 20) - 1;
        startPoint = (currentPage - 1) * 20;
    }

    console.log("start point: " + startPoint)

    const objectToArray = result => {
        const keys = Object.keys(result);
        const res = [];
        for (let i = startPoint; i < startPoint + 20; i++) {
            res.push(result[keys[i]]);
            if (result[keys[i + 1]] === null || result[keys[i + 1]] === undefined) {
                i = Number.MAX_SAFE_INTEGER;
            }
        };
        return res;
    };
    filteredResult = objectToArray(result);
    maxPages = Math.ceil(Object.keys(result).length / 20);
    
    console.log("Max pages: " + maxPages)

    //console.log("filtered result: " + filteredResult)
    console.log("filtered result length: " + filteredResult.length)
    console.log("result size " + Object.keys(result).length)


    res.render('pages/log')
});

app.post("/search", requiresAuth(), (req, res) => {
    res.redirect(`/profile/${req.body.name}`)
});

app.get("/search/random", requiresAuth(), async (req, res) => {

    const result = await client.db("gamedb").collection("players").aggregate([{ $sample: { size: 1 } }]).toArray();

    res.redirect(`/profile/${result[0].username}`)

});

app.get("/town", requiresAuth(), async (req, res) => {
    //const user = await getUserByEmail(req.oidc.user.email);

    res.render('pages/town');
});

//     blacksmith = user.blacksmithLevel;

//     for (let i = 1; i < blacksmith + 1; i++) {

//         if (i === 1) {
//             goldCost = 10;
//             lumberCost = 10;
//             stoneCost = 10;
//             ironCost = 10;
//         } else {
//             goldCost += Math.round(goldCost * 1.2);
//             lumberCost += Math.round(lumberCost * 1.2);
//             stoneCost += Math.round(stoneCost * 1.2);
//             ironCost += Math.round(ironCost * 1.2);
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

app.get("/town/barracks", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);

    barracks = user.barracksLevel;

    archers = user.archers;
    spearmen = user.spearmen;
    swordsmen = user.swordsmen;

    res.render('pages/barracks');
});

app.get("/town/wall", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);

    //TODO higher level decreases resource amount that can be stolen?

    wall = user.wallLevel;

    res.render('pages/wall')

});

app.post("/town/:building/upgrade", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);

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

    if (await checkIfCanAfford(client, user.username, 0, 20, 20, 20, 0, 0, 0)) {
        await upgradeBuilding(client, user.username, buildingName);
        await removeResources(client, user.username, 0, 20, 20, 20, 0, 0, 0);
    } else {
        console.log("bbbb");
    }

    res.redirect(`/town/${req.params.building}`);
});

app.get("/town/trainingfield", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);

    trainingField = user.trainingfieldLevel;

    res.render('pages/trainingField')
});

app.get("/town/workshop", requiresAuth(), async (req, res) => {

    //todo method to get user and set variables
    const user = await getUserByEmail(client, req.oidc.user.email);

    workshop = user.workshopLevel;

    batteringrams = user.batteringrams;
    siegetowers = user.siegetowers;

    res.render('pages/workshop')
});

app.post("/town/workshop/train", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);
    batteringrams = parseInt(req.body.batteringram);
    siegetowers = parseInt(req.body.siegetower);

    goldCost = calcGoldTrainCost(0, 0, 0, 0, batteringrams, siegetowers);
    grainCost = calcGrainTrainCost(0, 0, 0, 0, batteringrams, siegetowers);
    lumberCost = calcLumberTrainCost(0, 0, 0, 0, batteringrams, siegetowers);
    ironCost = calcIronTrainCost(0, 0, 0, 0, batteringrams, siegetowers);

    recruitCost = (batteringrams + siegetowers) * 2;

    data = { "batteringrams": batteringrams, "siegetowers": siegetowers };

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

    stables = user.stablesLevel;

    horsemen = user.horsemen;
    knights = user.knights;

    res.render('pages/stables');
});

app.get("/town/blacksmith", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);

    blacksmith = user.blacksmithLevel;

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
    //await updateLastAction(req.oidc.user.nickname);

    const user = await getUserByEmail(client, req.oidc.user.email);

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
    //await updateLastAction(user.username);

    horsemen = parseInt(req.body.horsemen);
    knights = parseInt(req.body.knights);

    var goldCost = 0, grainCost = 0, lumberCost = 0, ironCost = 0;

    goldCost += horsemen * 10;
    grainCost += horsemen * 10;
    lumberCost += horsemen * 10;

    grainCost += knights * 10;
    lumberCost += knights * 10;

    horseAndRecruitCost = horsemen + knights;
    data = { "horsemen": horsemen, "knights": knights };

    if (await checkIfCanAfford(client, user.username, goldCost, lumberCost, 0, ironCost, grainCost, horseAndRecruitCost, horseAndRecruitCost)) {
        await trainTroops(client, user.username, data);
        //TODO remove horses
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

    //const apa = await getUser(client, req.params.username);
    //update username
    //await updateLastAction(req.oidc.user.nickname);

    const user = await getUserByEmail(client, req.oidc.user.email);

    archers = parseInt(req.body.archers);
    spearmen = parseInt(req.body.spearmen);
    swordsmen = parseInt(req.body.swordsmen);

    var goldCost = 0;
    var grainCost = 0;
    var lumberCost = 0;
    var ironCost = 0;

    goldCost += archers * 10;
    grainCost += archers * 10;
    lumberCost += archers * 10;

    grainCost += spearmen * 10;
    lumberCost += spearmen * 10;

    goldCost += swordsmen * 10;
    grainCost += swordsmen * 10;
    ironCost += swordsmen * 10;

    recruitCost = archers + spearmen + swordsmen;
    data = { "archers": archers, "spearmen": spearmen, "swordsmen": swordsmen };

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

    //TODO attack limiter //reset all at midnight? //losses
    //TODO create attack database to pull data from for attack log

    const attacker = await getUserByEmail(client, req.oidc.user.email);
    const defender = await getUser(client, req.params.username);

    console.log(attacker.username + " tries to attack " + defender.username);

    var attackDamage = await calculateAttack(attacker);
    var defenseDamage = await calculateDefense(defender);

    console.log("Total defense: " + defenseDamage + " Total attack: " + attackDamage);

    const closeness = attackDamage / (attackDamage + defenseDamage);
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
    lumberLoot = Math.round(defender.lumber / divider);
    stoneLoot = Math.round(defender.stone / divider);
    grainLoot = Math.round(defender.grain / divider);
    ironLoot = Math.round(defender.iron / divider);

    stealResources(client, attacker.username, goldLoot, lumberLoot, stoneLoot, ironLoot, grainLoot);
    loseResources(client, defender.username, goldLoot, lumberLoot, stoneLoot, ironLoot, grainLoot);

    attackerLosses = 0;
    defenderLosses = 0;

    const data = {
        "_id": new ObjectId(), "time": new Date(), "attacker": attacker.username, "defender": defender.username, "attackDamage": attackDamage, "defenseDamage": defenseDamage, "attackerLosses": attackerLosses, "defenderLosses": defenderLosses, "goldLoot": goldLoot,
        "grainLoot": grainLoot, "lumberLoot": lumberLoot, "stoneLoot": stoneLoot, "ironLoot": ironLoot
    };

    result = await createAttackLog(client, data);

    res.redirect(`/mailbox/log/${result}`);

});

app.get("/land/:type/:number", requiresAuth(), async (req, res) => {

    type = req.params.type;
    resourceId = req.params.number;
    const user = await getUserByEmail(client, req.oidc.user.email);
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
    const user = await getUserByEmail(client, req.oidc.user.email);
    var updatedUser;

    //todo use switch

    if (type === "farm") {

        if (resourceId >= 0 && resourceId <= maxFarms) {
            updatedUser = user.farms;
            updatedUser[resourceId]++;
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

    //TOOD real costs
    if (await checkIfCanAfford(client, user.username, 1, 1, 2, 3, 4, 0, 0)) {
        const result = await client.db("gamedb").collection("players").updateOne({ username: user.username }, { $set: updatedUser });
    }

    res.redirect("/land");

});

app.get("/land/:type/:number/establish", requiresAuth(), async (req, res) => {

    //TODO error check
    type = req.params.type;
    resourceId = req.params.number;
    const user = await getUserByEmail(client, req.oidc.user.email);
    var updatedUser;

    if (type === "farm") {
        updatedUser = user.farms;
        updatedUser.push(1);
        updatedUser = { farms: updatedUser }
    } else if (type === "goldmine") {
        updatedUser = user.goldMines;
        updatedUser.push(1);
        updatedUser = { goldMines: updatedUser }
    } else if (type === "ironmine") {
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

    //TODO real cost
    if (await checkIfCanAfford(client, user.username, 1, 1, 2, 3, 4, 0, 0)) {
        const result = await client.db("gamedb").collection("players").updateOne({ username: user.username }, { $set: updatedUser });
    }

    res.redirect("/land");

});

async function checkAll() {
    const result = await client.db("gamedb").collection("players").find().forEach(function (user) {
        addResources(client, user.username);
    });
}

//måste köra för alla så folk kan anfalla folk som är afk
//ev kör när någon interagerar med afk folk
var minutes = 10, the_interval = minutes * 60 * 1000;
setInterval(function () {
    console.log("Adding resources for everyone!");
    checkAll();
}, the_interval);

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Listening on https://localhost:${port}`);
});