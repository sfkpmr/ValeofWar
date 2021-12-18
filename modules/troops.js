const { incDatabaseValue } = require("../modules/database.js");

module.exports = {

    trainTroops: async function (client, username, updatedUser) {
        await incDatabaseValue(client, username, updatedUser);
    },

    craftArmor: async function (client, username, updatedUser) {
        await incDatabaseValue(client, username, updatedUser);
    }
}