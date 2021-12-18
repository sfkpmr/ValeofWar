const { MongoClient, ObjectId } = require('mongodb');

module.exports = {

    //TODO set metod
    incDatabaseValue: async function (client, username, data) {
        await client.db("gamedb").collection("players").updateOne({ "username": username }, { $inc: data });
    },
    getUser: async function (client, username) {
        return await client.db("gamedb").collection("players").findOne({ "username": username });
    },

    getUserByEmail: async function (client, email) {
        return await client.db("gamedb").collection("players").findOne({ "email": email });
    }
}