const { MongoClient, ObjectId } = require('mongodb');

module.exports = {

    incDatabaseValue: async function (client, username, data) {
        await client.db("gamedb").collection("players").updateOne({ "username": username }, { $inc: data });
    },
    setDatabaseValue: async function (client, username, data) {
        await client.db("gamedb").collection("players").updateOne({ "username": username }, { $set: data });
    },
    getUser: async function (client, username) {
        result = await client.db("gamedb").collection("players").findOne({ "username": username });
        if (result === null) {
            return false;
        } else {
            return result;
        }
    },
    getUserByEmail: async function (client, email) {
        return await client.db("gamedb").collection("players").findOne({ "email": email });
    },
    getUserById: async function (client, id) {
        return await client.db("gamedb").collection("players").findOne({ "_id": id });
    },
    deleteUser: async function (client, id) {
        return await client.db("gamedb").collection("players").deleteOne({ "_id": id });
    },
    getAllTrades: async function (client) {
        //const result = await client.db("gamedb").collection("trades").findOne({ "_id": ObjectId });
        const cursor = await client.db("gamedb").collection("trades").find();
        const result = await cursor.toArray();
        return result;
    },
    addTrade: async function (client, data) {
        try {
            return await client.db("gamedb").collection("trades").insertOne(data);
        } catch (e) {
            console.log(e);
        }
    },
    getTrade: async function (client, id) {
        searchObject = new ObjectId(id);
        return await client.db("gamedb").collection("trades").findOne({ "_id": searchObject });
    },
    deleteTrade: async function (client, id) {
        return await client.db("gamedb").collection("trades").deleteOne({ "_id": id });
    },
    hasTrades: async function (client, username) {
        const cursor = client.db("gamedb").collection("trades").find({ "seller": username })
        const result = await cursor.toArray();
        if (result[0] === undefined) {
            return false;
        }
        return true;
    },
    getUserTrades: async function (client, username) {
        const cursor = client.db("gamedb").collection("trades").find({ "seller": username })
        const result = await cursor.toArray();
        if (result[0] === undefined) {
            return false;
        }
        return result;
    },
    getUserMessages: async function (client, username) {
        const cursor = client.db("gamedb").collection("messages").find({ $or: [{ "sentBy": username }, { "sentTo": username }] })
        const result = await cursor.toArray();
        if (result[0] === undefined) {
            return false;
        }
        return result;
    },
    getMessageById: async function (client, id) {
        const result = client.db("gamedb").collection("messages").findOne({ "_id": id });
        if (result === undefined) {
            return false;
        }
        return result;
    },
    addMessage: async function (client, data) {
        try {
            result = await client.db("gamedb").collection("messages").insertOne(data);
        } catch (e) {
            console.log(e);
        }
        return result.insertedId;
    },
}