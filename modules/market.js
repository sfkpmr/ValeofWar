const { addTrade, hasTrades, getUserTrades, deleteTrade } = require("../modules/database.js");

resourceObject = {
    addTrade: async function (client, user, sellAmount, sellResource, buyAmount, buyResource) {

        const currentGrain = user.grain;
        const currentLumber = user.lumber;
        const currentStone = user.stone;
        const currentIron = user.iron;
        const currentGold = user.gold;

        let makeTrade = false;

        if (sellResource === "Grain" && sellAmount <= currentGrain) {
            makeTrade = true;
        } else if (sellResource === "Lumber" && sellAmount <= currentLumber) {
            makeTrade = true;
        } else if (sellResource === "Stone" && sellAmount <= currentStone) {
            makeTrade = true;
        } else if (sellResource === "Iron" && sellAmount <= currentIron) {
            makeTrade = true;
        } else if (sellResource === "Gold" && sellAmount <= currentGold) {
            makeTrade = true;
        }

        if (sellResource !== buyResource && makeTrade) {
            data = { seller: user.username, sellAmount: sellAmount, sellResource: sellResource, buyAmount: buyAmount, buyResource: buyResource }
            addTrade(client, data);
        }

    },
    buyTrade: async function () {

    }
};

module.exports = resourceObject;