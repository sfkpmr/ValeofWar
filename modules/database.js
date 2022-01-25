const { ObjectId, MongoClient } = require('mongodb');
require("dotenv").config();

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}`;
const client = new MongoClient(uri);
const db = client.db("gamedb");
const players = db.collection("players");
const trades = db.collection("trades");
const armies = db.collection("armies");
const armories = db.collection("armories");
const messages = db.collection("messages");

const baseGrainIncome = 7, baseLumberIncome = 6, baseStoneIncome = 3, baseIronIncome = 2, baseGoldIncome = 1;
let userMap, io;

async function connectDb(socketServer) {
    await client.connect();
    userMap = new Map();
    io = socketServer;
}

async function getUserByEmail(email) {
    return await players.findOne({ "email": email });
}

async function incDatabaseValue(username, data) {
    await players.updateOne({ "username": username }, { $inc: data });
}
async function setDatabaseValue(username, data) {
    await players.updateOne({ "username": username }, { $set: data });
}
async function getUserByUsername(username) {
    const result = await players.findOne({ "username": username });
    if (result === null) {
        return false;
    } else {
        return result;
    }
}
async function getUserById(id) {
    return await players.findOne({ "_id": id });
}
async function deleteUser(id) {
    return await players.deleteOne({ "_id": id });
}
async function getAllTrades() {
    const cursor = await trades.find();
    const result = await cursor.toArray();
    return result;
}
async function addTrade(data) {
    try {
        return await trades.insertOne(data);
    } catch (e) {
        console.log(e);
    }
}
async function getTrade(id) {
    console.log(id)
    return await trades.findOne({ "_id": new ObjectId(id) });
}
async function deleteTrade(id) {
    return await trades.deleteOne({ "_id": id });
}
async function hasTrades(username) {
    const cursor = trades.find({ "seller": username })
    const result = await cursor.toArray();
    if (result[0] === undefined) {
        return false;
    }
    return true;
}
async function getUserTrades(username) {
    const cursor = trades.find({ "seller": username })
    const result = await cursor.toArray();
    if (result[0] === undefined) {
        return false;
    }
    return result;
}
async function getUserMessages(username) {
    const cursor = messages.find({ $or: [{ "sentBy": username }, { "sentTo": username }] })
    const result = await cursor.toArray();
    if (result[0] === undefined) {
        return false;
    }
    return result;
}
async function getMessageById(id) {
    const result = messages.findOne({ "_id": id });
    if (result === undefined) {
        return false;
    }
    return result;
}
async function addMessage(data) {
    //alltid?
    try {
        result = await messages.insertOne(data);
    } catch (e) {
        console.log(e);
    }
    return result.insertedId;
}
async function getInvolvedAttackLogs(username) {
    const cursor = db.collection("attacks").find({ $or: [{ "attacker": username }, { "defender": username }] })
    const result = await cursor.toArray();
    if (result[0] === undefined) {
        return false;
    }
    return result;
}
async function getInvolvedSpyLogs(username) {
    const cursor = db.collection("intrusions").find({ $or: [{ "attacker": username }, { "defender": username }] })
    const result = await cursor.toArray();
    if (result[0] === undefined) {
        return false;
    }
    return result;
}
async function prepareMessagesOrLogs(user, nr, type) {
    let result;
    if (type === "log") {
        result = await getInvolvedAttackLogs(user.username)
    } else if (type === "message") {
        result = await getUserMessages(user.username)
    } else if (type === "spyLog") {
        result = await getInvolvedSpyLogs(user.username)
    } else {
        console.debug(type, "Invalid object")
    }
    const maxPages = Math.ceil(Object.keys(result).length / 20);

    if (nr < 1 || nr > maxPages || isNaN(nr)) {
        return false;
    } else {
        if (result.length === 0) {
            return 0;
        }

        const currentPage = nr;

        let startPoint = 0;
        if (currentPage === 1) {
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

        return { "result": result, "currentPage": currentPage, "maxPages": maxPages, "filteredResult": filteredResult };
    }
}
async function checkHowManyTradesPlayerHas(user) {
    const number = await client.db("gamedb").collection("trades").countDocuments({ seller: user.username });
    return number;
}
async function userAllowedToTrade(user) {
    if (await checkHowManyTradesPlayerHas(user) < 4) {
        return true;
    }
    return false;
}
async function checkIfAlreadyTradingResource(user, type) {
    const result = await getUserTrades(user.username);
    for (let i = 0; i < result.length; i++) {
        if (result[i].sellResource === type) {
            return true;
        }
    }
    return false;
}
async function getArmyByEmail(email) {
    return await armies.findOne({ "email": email });
}
async function getArmoryByEmail(email) {
    return await armories.findOne({ "email": email });
}
//remove plural s
async function incTroopValues(username, data) {
    await armies.updateOne({ "username": username }, { $inc: data });
}
async function setTroopsValue(username, data) {
    await armies.updateOne({ "username": username }, { $set: data });
}
async function incArmorValues(username, data) {
    await armories.updateOne({ "username": username }, { $inc: data });
}
async function deleteArmy(email) {
    await armies.deleteOne({ "email": email });
}
async function deleteArmory(email) {
    await armories.deleteOne({ "email": email });
}
async function getSpyLog(ObjectId) {
    const result = await db.collection("intrusions").findOne({ "_id": ObjectId });
    if (result === null) {
        return false;
    } else {
        return result;
    }
}

async function updateAllResources() {
    await players.find().forEach(function (user) {
        addResources(user.username);
    });
};

async function addResources(username) {
    const user = await getUserByUsername(username);
    const recruitsIncome = user.trainingfieldLevel * 5;
    const horseIncome = user.stablesLevel * 3;
    let farmLevels = 0, lumberLevels = 0, stoneLevels = 0, ironLevels = 0, goldLevels = 0;

    user.farms.forEach(grainCalc);
    user.lumberCamps.forEach(lumberCalc);
    user.quarries.forEach(stoneCalc);
    user.ironMines.forEach(ironCalc);
    user.goldMines.forEach(goldCalc);

    function grainCalc(i) {
        farmLevels += i;
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

    const grainIncome = incomeCalc("grain", farmLevels);
    const lumberIncome = incomeCalc("lumber", lumberLevels);
    const stoneIncome = incomeCalc("stone", stoneLevels);
    const ironIncome = incomeCalc("iron", ironLevels);
    const goldIncome = incomeCalc("gold", goldLevels);
    const updatedUser = { "grain": grainIncome, "lumber": lumberIncome, "stone": stoneIncome, "gold": goldIncome, "iron": ironIncome, "recruits": recruitsIncome, "horses": horseIncome };

    await incDatabaseValue(username, updatedUser);
}

function incomeCalc(type, levels) {
    let baseIncome = 0;

    switch (type) {
        case "grain":
            baseIncome = baseGrainIncome;
            break;
        case "lumber":
            baseIncome = baseLumberIncome;
            break;
        case "stone":
            baseIncome = baseStoneIncome;
            break;
        case "iron":
            baseIncome = baseIronIncome;
            break;
        case "gold":
            baseIncome = baseGoldIncome;
            break;
    }
    return income = levels * baseIncome;
}

async function checkDb(timeInMs = 60000, pipeline = []) {
    const collection = players;
    const changeStream = collection.watch(pipeline);

    changeStream.on('change', (next) => {

        validateUserTrades(next.documentKey._id);
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

function addUserToMap(userId, socketId) {
    userMap[userId] = socketId;

    for (var i in userMap) {
        console.log(i)
    }
}

function getUserMap() {
    return userMap;
}

function removeFromMap(socketId) {
    for (var i in userMap) {
        if (userMap[i] === socketId) {
            delete userMap[i]
        }
    }
}


async function validateUserTrades(id) {
    const user = await getUserById(id);
    const currentGrain = user.grain;
    const currentLumber = user.lumber;
    const currentStone = user.stone;
    const currentIron = user.iron;
    const currentGold = user.gold;

    if (await hasTrades(user.username)) {
        const trades = await getUserTrades(user.username);
        for (let i = 0; i < trades.length; i++) {
            let cancelTrade = false;
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
                const data = { sentTo: user.username, sentBy: "SYSTEM", message: `Your trade offer of ${trades[i].sellResource} was canceled due to insufficient stockpiles.`, time: new Date() };
                await deleteTrade(trades[i]._id);
                addMessage(data);
            }
        }
    };
}

async function getRandomPlayer() {
    const result = await players.aggregate([{ $sample: { size: 1 } }]).toArray();
    return result[0];
}

async function messagePlayer(id, type, message) {

    io.to(userMap[id]).emit(type, message);

}

async function getAttackLog(ObjectId) {
    const result = await db.collection("attacks").findOne({ "_id": ObjectId });
    if (result === null) {
        return false;
    } else {
        return result;
    }
}
async function createAttackLog(data) {
    result = await db.collection("attacks").insertOne(data);
    return result.insertedId;
}
async function createSpyLog(data) {
    result = await db.collection("intrusions").insertOne(data);
    return result.insertedId;
}



//behöver alla exporteras?
module.exports.getUserByEmail = getUserByEmail;
module.exports.incDatabaseValue = incDatabaseValue;
module.exports.setDatabaseValue = setDatabaseValue;
module.exports.getUserByUsername = getUserByUsername;
module.exports.deleteUser = deleteUser;
module.exports.getAllTrades = getAllTrades;
module.exports.addTrade = addTrade;
module.exports.getTrade = getTrade;
module.exports.deleteTrade = deleteTrade;
module.exports.hasTrades = hasTrades;
module.exports.getUserTrades = getUserTrades;
module.exports.getUserMessages = getUserMessages;
module.exports.getMessageById = getMessageById;
module.exports.addMessage = addMessage;
module.exports.getInvolvedAttackLogs = getInvolvedAttackLogs;
module.exports.getInvolvedSpyLogs = getInvolvedSpyLogs;
module.exports.prepareMessagesOrLogs = prepareMessagesOrLogs;
module.exports.checkHowManyTradesPlayerHas = checkHowManyTradesPlayerHas;
module.exports.userAllowedToTrade = userAllowedToTrade;
module.exports.checkIfAlreadyTradingResource = checkIfAlreadyTradingResource;
module.exports.getArmyByEmail = getArmyByEmail;
module.exports.getArmoryByEmail = getArmoryByEmail;
module.exports.incTroopValues = incTroopValues;
module.exports.setTroopsValue = setTroopsValue;
module.exports.incArmorValues = incArmorValues;
module.exports.deleteArmy = deleteArmy;
module.exports.deleteArmory = deleteArmory;
module.exports.getSpyLog = getSpyLog;
module.exports.getUserById = getUserById;
module.exports.connectDb = connectDb;
module.exports.updateAllResources = updateAllResources;
module.exports.incomeCalc = incomeCalc;
module.exports.checkDb = checkDb;
module.exports.addUserToMap = addUserToMap;
module.exports.getUserMap = getUserMap;
module.exports.removeFromMap = removeFromMap;
module.exports.getRandomPlayer = getRandomPlayer;
module.exports.messagePlayer = messagePlayer;
module.exports.getAttackLog = getAttackLog;
module.exports.createAttackLog = createAttackLog;
module.exports.createSpyLog = createSpyLog;