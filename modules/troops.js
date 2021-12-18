const { incDatabaseValue } = require("../modules/database.js");

module.exports = {

    trainTroops: async function (client, username, data) {
        await incDatabaseValue(client, username, data);
    },

    craftArmor: async function (client, username, data) {
        await incDatabaseValue(client, username, data);
    }
}