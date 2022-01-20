const { ObjectId, MongoClient } = require('mongodb');
require("dotenv").config();

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}`;
const client = new MongoClient(uri);

async function connectDb() {
    await client.connect();
}

async function getUserByEmail(email) {
    return await client.db("gamedb").collection("players").findOne({ "email": email });
}

async function incDatabaseValue(username, data) {
    await client.db("gamedb").collection("players").updateOne({ "username": username }, { $inc: data });
}
async function setDatabaseValue(username, data) {
    await client.db("gamedb").collection("players").updateOne({ "username": username }, { $set: data });
}
async function getUserByUsername(username) {
    const result = await client.db("gamedb").collection("players").findOne({ "username": username });
    if (result === null) {
        return false;
    } else {
        return result;
    }
}
async function getUserById(id) {
    return await client.db("gamedb").collection("players").findOne({ "_id": id });
}
async function deleteUser(id) {
    return await client.db("gamedb").collection("players").deleteOne({ "_id": id });
}
async function getAllTrades() {
    const cursor = await client.db("gamedb").collection("trades").find();
    const result = await cursor.toArray();
    return result;
}
async function addTrade(data) {
    try {
        return await client.db("gamedb").collection("trades").insertOne(data);
    } catch (e) {
        console.log(e);
    }
}
async function getTrade(id) {
    console.log(id)
    return await client.db("gamedb").collection("trades").findOne({ "_id": new ObjectId(id) });
}
async function deleteTrade(id) {
    return await client.db("gamedb").collection("trades").deleteOne({ "_id": id });
}
async function hasTrades(username) {
    const cursor = client.db("gamedb").collection("trades").find({ "seller": username })
    const result = await cursor.toArray();
    if (result[0] === undefined) {
        return false;
    }
    return true;
}
async function getUserTrades(username) {
    const cursor = client.db("gamedb").collection("trades").find({ "seller": username })
    const result = await cursor.toArray();
    if (result[0] === undefined) {
        return false;
    }
    return result;
}
async function getUserMessages(username) {
    const cursor = client.db("gamedb").collection("messages").find({ $or: [{ "sentBy": username }, { "sentTo": username }] })
    const result = await cursor.toArray();
    if (result[0] === undefined) {
        return false;
    }
    return result;
}
async function getMessageById(id) {
    const result = client.db("gamedb").collection("messages").findOne({ "_id": id });
    if (result === undefined) {
        return false;
    }
    return result;
}
async function addMessage(data) {
    //alltid?
    try {
        result = await client.db("gamedb").collection("messages").insertOne(data);
    } catch (e) {
        console.log(e);
    }
    return result.insertedId;
}
async function getInvolvedAttackLogs(username) {
    const cursor = client.db("gamedb").collection("attacks").find({ $or: [{ "attacker": username }, { "defender": username }] })
    const result = await cursor.toArray();
    if (result[0] === undefined) {
        return false;
    }
    return result;
}
async function getInvolvedSpyLogs(username) {
    const cursor = client.db("gamedb").collection("intrusions").find({ $or: [{ "attacker": username }, { "defender": username }] })
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
        return false;//res.redirect('/messages/inbox/page/1')
    } else {
        if (result.length === 0) {
            return 0;//res.render('pages/inbox')
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
    return await client.db("gamedb").collection("armies").findOne({ "email": email });
}
async function getArmoryByEmail(email) {
    return await client.db("gamedb").collection("armories").findOne({ "email": email });
}
//remove plural s
async function incTroopValues(username, data) {
    await client.db("gamedb").collection("armies").updateOne({ "username": username }, { $inc: data });
}
async function setTroopsValue(username, data) {
    await client.db("gamedb").collection("armies").updateOne({ "username": username }, { $set: data });
}
async function incArmorValues(username, data) {
    await client.db("gamedb").collection("armories").updateOne({ "username": username }, { $inc: data });
}
async function deleteArmy(email) {
    await client.db("gamedb").collection("armies").deleteOne({ "email": email });
}
async function deleteArmory(email) {
    await client.db("gamedb").collection("armories").deleteOne({ "email": email });
}
async function getSpyLog(ObjectId) {
    const result = await client.db("gamedb").collection("intrusions").findOne({ "_id": ObjectId });
    if (result === null) {
        return false;
    } else {
        return result;
    }
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