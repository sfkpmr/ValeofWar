const { addTrade, getTrade, getUserByUsername, hasTrades, getUserTrades, deleteTrade, setDatabaseValue } = require("../modules/database.js");
const { ObjectId } = require('mongodb');

resourceObject = {
    addTrade: async function (user, sellAmount, sellResource, buyAmount, buyResource) {


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
            addTrade(data);
            return true;
        } else {
            return false;
        }

    },
    buyTrade: async function (buyer, id) {
        const currentBuyerGrain = buyer.grain;
        const currentBuyerLumber = buyer.lumber;
        const currentBuyerStone = buyer.stone;
        const currentBuyerIron = buyer.iron;
        const currentBuyerGold = buyer.gold;
        const trade = await getTrade(id);
        const seller = await getUserByUsername(trade.seller);
        const buyResource = trade.buyResource.toString().toLowerCase();;
        const buyAmount = trade.buyAmount;
        const sellResource = trade.sellResource.toString().toLowerCase();
        const sellAmount = trade.sellAmount;
        const currentSellerGrain = seller.grain;
        const currentSellerLumber = seller.lumber;
        const currentSellerStone = seller.stone;
        const currentSellerIron = seller.iron;
        const currentSellerGold = seller.gold;
        var sellerNewSellResourceAmount, sellerNewBuyResourceAmount, buyerNewSellResourceAmount, buyerNewBuyResourceAmount;
        var saleIsOk = false;

        if (buyResource === "grain" && currentBuyerGrain >= buyAmount) {
            sellerNewBuyResourceAmount = currentSellerGrain + buyAmount;
            buyerNewBuyResourceAmount = currentBuyerGrain - buyAmount;
            saleIsOk = true; //checking that buyer can afford, need to check if seller has trade?
        } else if (buyResource === "lumber" && currentBuyerLumber >= buyAmount) {
            sellerNewBuyResourceAmount = currentSellerLumber + buyAmount;
            buyerNewBuyResourceAmount = currentBuyerLumber - buyAmount;
            saleIsOk = true;
        } else if (buyResource === "stone" && currentBuyerStone >= buyAmount) {
            sellerNewBuyResourceAmount = currentSellerStone + buyAmount;
            buyerNewBuyResourceAmount = currentBuyerStone - buyAmount;
            saleIsOk = true;
        } else if (buyResource === "iron" && currentBuyerIron >= buyAmount) {
            sellerNewBuyResourceAmount = currentSellerIron + buyAmount;
            buyerNewBuyResourceAmount = currentBuyerIron - buyAmount;
            saleIsOk = true;
        } else if (buyResource === "gold" && currentBuyerGold >= buyAmount) {
            sellerNewBuyResourceAmount = currentSellerGold + buyAmount;
            buyerNewBuyResourceAmount = currentBuyerGold - buyAmount;
            saleIsOk = true;
        }

        if (sellResource === "grain") {
            sellerNewSellResourceAmount = currentSellerGrain - sellAmount;
            buyerNewSellResourceAmount = currentBuyerGrain + sellAmount;
        } else if (sellResource === "lumber") {
            sellerNewSellResourceAmount = currentSellerLumber - sellAmount;
            buyerNewSellResourceAmount = currentBuyerLumber + sellAmount;
        } else if (sellResource === "stone") {
            sellerNewSellResourceAmount = currentSellerStone - sellAmount;
            buyerNewSellResourceAmount = currentBuyerStone + sellAmount;
        } else if (sellResource === "iron") {
            sellerNewSellResourceAmount = currentSellerIron - sellAmount;
            buyerNewSellResourceAmount = currentBuyerIron + sellAmount;
        } else if (sellResource === "gold") {
            sellerNewSellResourceAmount = currentSellerGold - sellAmount;
            buyerNewSellResourceAmount = currentBuyerGold + sellAmount;
        }

        const dataToSeller = { [sellResource]: sellerNewSellResourceAmount, [buyResource]: sellerNewBuyResourceAmount };
        const dataToBuyer = { [sellResource]: buyerNewSellResourceAmount, [buyResource]: buyerNewBuyResourceAmount };

        if (saleIsOk && buyer.username != seller.username) {
            await setDatabaseValue(seller.username, dataToSeller);
            await setDatabaseValue(buyer.username, dataToBuyer);
            await deleteTrade(new ObjectId(id));
            return true;
        } else {
            return false;
        }
    }
};

module.exports = resourceObject;