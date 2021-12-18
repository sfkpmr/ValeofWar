const { MongoClient, ObjectId } = require('mongodb');

module.exports = {

    //TODO set metod
    incDatabaseValue: async function (client, username, updatedData) {
        await client.db("gamedb").collection("players").updateOne({ "username": username }, { $inc: updatedData });
    }
}