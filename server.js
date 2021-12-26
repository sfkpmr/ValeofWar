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

const { getAttackLog, createAttackLog, getInvolvedAttackLogs, calculateAttack, calculateDefense } = require("./modules/attack.js");
const { trainTroops, craftArmor } = require("./modules/troops.js");
const { getUser, getUserByEmail } = require("./modules/database.js");
const { calcGoldTrainCost, calcGrainTrainCost, calcIronTrainCost, calcLumberTrainCost, upgradeBuilding, calcLumberCraftCost, calcIronCraftCost, calcGoldCraftCost, calcBuildingLumberCost, calcBuildingStoneCost, calcBuildingIronCost, calcBuildingGoldCost, upgradeResource } = require("./modules/buildings.js");
const { addResources, removeResources, checkIfCanAfford, stealResources, loseResources } = require("./modules/resources.js");

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}`;
const client = new MongoClient(uri);

const maxFarms = 4, maxGoldMines = 2, maxIronMines = 3, maxQuarries = 4, maxLumberCamps = 4;

const { Server } = require("socket.io");
const attack = require("./modules/attack.js");
const req = require("express/lib/request");
const { filter } = require("compression");
const io = new Server(server);

let userMap = {};

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
                if (i === next.documentKey._id) {
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

                    //TODO update damage when making armor

                    updateDamage = false;

                    if (grain !== null && grain !== undefined) {
                        io.to(userMap[i]).emit("updateGrain", grain);
                    };
                    if (lumber !== null && lumber !== undefined) {
                        io.to(userMap[i]).emit("updateLumber", lumber);
                    };
                    if (stone !== null && stone !== undefined) {
                        io.to(userMap[i]).emit("updateStone", stone);
                    };
                    if (iron !== null && iron !== undefined) {
                        io.to(userMap[i]).emit("updateIron", iron);
                    };
                    if (gold !== null && gold !== undefined) {
                        io.to(userMap[i]).emit("updateGold", gold);
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

                    if (updateDamage) {
                        io.to(userMap[i]).emit("updatePower");
                    };

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
        res.render('pages/index')
    }

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
            //todo add settings/delete
            res.render('pages/myprofile');
        } else {
            res.render('pages/publicprofile');
        }
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
    if (result === false) {
        res.send("No attack logs")
    } else {
        res.redirect('/mailbox/log/page/1')
    }

});

app.get("/mailbox/log/:id", requiresAuth(), async (req, res) => {

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

    if (log === false) {
        res.send("No such log")
    } else {
        res.render('pages/attack')
    }
});

app.get("/mailbox/log/page/:nr", requiresAuth(), async (req, res) => {

    const user = await getUserByEmail(client, req.oidc.user.email);
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

        log = filteredResult

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

app.get("/town/wall", requiresAuth(), async (req, res) => {
    const user = await getUserByEmail(client, req.oidc.user.email);
    wall = user.wallLevel;
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

    const lumberCost = await calcBuildingLumberCost(type, level + 1);
    const stoneCost = await calcBuildingStoneCost(type, level + 1);
    const ironCost = await calcBuildingIronCost(type, level + 1);
    const goldCost = await calcBuildingGoldCost(type, level + 1);

    if (await checkIfCanAfford(client, user.username, goldCost, lumberCost, stoneCost, ironCost, 0, 0, 0)) {
        await upgradeBuilding(client, user.username, buildingName);
        await removeResources(client, user.username, goldCost, lumberCost, stoneCost, ironCost, 0, 0, 0);
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
        var divider;

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

        wallBonus = 1 - ((defender.wallLevel * 2.5) * 0.01);

        goldLoot = Math.round((defender.gold / divider) * wallBonus);
        lumberLoot = Math.round((defender.lumber / divider) * wallBonus);
        stoneLoot = Math.round((defender.stone / divider) * wallBonus);
        grainLoot = Math.round((defender.grain / divider) * wallBonus);
        ironLoot = Math.round((defender.iron / divider) * wallBonus);

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
    }

});

app.get("/land/:type/:number", requiresAuth(), async (req, res) => {

    type = req.params.type;
    resourceId = parseInt(req.params.number);
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
    resourceId = parseInt(req.params.number);
    const user = await getUserByEmail(client, req.oidc.user.email);
    var updatedUser, resourceLevel, resource;

    if (type === "farm") {

        if (resourceId >= 0 && resourceId <= maxFarms) {
            resource = "farms"
            updatedUser = user.farms;
            console.log(updatedUser)
            resourceLevel = updatedUser[resourceId]
            updatedUser[resourceId]++;
            console.log(updatedUser)
            updatedUser = { farms: updatedUser }
        } else {
            res.redirect("/land");
        }
    } else if (type === "goldmine") {
        if (resourceId >= 0 && resourceId <= maxGoldMines) {
            resource = "goldMines"
            updatedUser = user.goldMines;
            resourceLevel = updatedUser[resourceId]
            updatedUser[resourceId]++;

            updatedUser = { goldMines: updatedUser }
        } else {
            res.redirect("/land");
        }
    } else if (type === "ironmine") {
        if (resourceId >= 0 && resourceId <= maxIronMines) {
            resource = "ironMines"
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

    res.redirect("/land");

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

//måste köra för alla så folk kan anfalla folk som är afk
//ev kör när någon interagerar med afk folk
var minutes = 15, the_interval = minutes * 60 * 1000;
setInterval(function () {
    console.log("Adding resources for everyone!");
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