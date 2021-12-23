const { incDatabaseValue } = require("../modules/database.js");

module.exports = {

    calcGoldTrainCost: function (archers, spearmen, horsemen, knights, batteringrams, siegetowers) {
        var cost = 0;

        cost += archers * 10;
        cost += spearmen * 10;
        cost += horsemen * 10;
        cost += knights * 10;
        cost += batteringrams * 10;
        cost += siegetowers * 10;

        return cost;
    },

    calcIronTrainCost: function (archers, spearmen, horsemen, knights, batteringrams, siegetowers) {
        var cost = 0;

        cost += archers * 10;
        cost += spearmen * 10;
        cost += horsemen * 10;
        cost += knights * 10;
        cost += batteringrams * 10;
        cost += siegetowers * 10;

        return cost;
    },

    calcGrainTrainCost: function (archers, spearmen, horsemen, knights, batteringrams, siegetowers) {
        var cost = 0;

        cost += archers * 10;
        cost += spearmen * 10;
        cost += horsemen * 10;
        cost += knights * 10;
        cost += batteringrams * 10;
        cost += siegetowers * 10;

        return cost;
    },

    calcLumberTrainCost: function (archers, spearmen, horsemen, knights, batteringrams, siegetowers) {
        var cost = 0;

        cost += archers * 10;
        cost += spearmen * 10;
        cost += horsemen * 10;
        cost += knights * 10;
        cost += batteringrams * 10;
        cost += siegetowers * 10;

        return cost;
    },
    upgradeBuilding: async function (client, username, building) {
        //socket update defense when upgrading wall
        const updatedUser = { [building]: 1 };
        await incDatabaseValue(client, username, updatedUser);
    }
}