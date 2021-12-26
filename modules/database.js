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
    }
}