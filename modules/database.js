const { MongoClient, ObjectId } = require('mongodb');

module.exports = {

    incDatabaseValue: async function (client, username, data) {
        await client.db("gamedb").collection("players").updateOne({ "username": username }, { $inc: data });
    },
    setDatabaseValue: async function (client, username, data){
        await client.db("gamedb").collection("players").updateOne({ "username": username }, { $set: data });
    },
    getUser: async function (client, username) {
        return await client.db("gamedb").collection("players").findOne({ "username": username });
    },
    getUserByEmail: async function (client, email) {
        return await client.db("gamedb").collection("players").findOne({ "email": email });
    }
}