const { getUserByUsername, incDatabaseValue, getUserById, hasTrades, getUserTrades, deleteTrade, addMessage } = require("../modules/database.js");

const baseGrainIncome = 7, baseLumberIncome = 6, baseStoneIncome = 3, baseIronIncome = 2, baseGoldIncome = 1;

resourceObject = {
    addResources: async function (client, username) {
        const user = await getUserByUsername(client, username);
        const recruitsIncome = user.trainingfieldLevel * 5;
        const horseIncome = user.stablesLevel * 3;
        let farmLevels = 0, lumberLevels = 0, stoneLevels = 0, ironLevels = 0, goldLevels = 0;

        user.farms.forEach(grainCalc);
        user.lumberCamps.forEach(lumberCalc);
        user.quarries.forEach(stoneCalc);
        user.ironMines.forEach(ironCalc);
        user.goldMines.forEach(goldCalc);

        function grainCalc(i) {
            farmLevels += i;
        };
        function lumberCalc(i) {
            lumberLevels += i;
        };
        function stoneCalc(i) {
            stoneLevels += i;
        };
        function ironCalc(i) {
            ironLevels += i;
        };
        function goldCalc(i) {
            goldLevels += i;
        };

        const grainIncome = resourceObject.incomeCalc("grain", farmLevels);
        const lumberIncome = resourceObject.incomeCalc("lumber", lumberLevels);
        const stoneIncome = resourceObject.incomeCalc("stone", stoneLevels);
        const ironIncome = resourceObject.incomeCalc("iron", ironLevels);
        const goldIncome = resourceObject.incomeCalc("gold", goldLevels);
        const updatedUser = { "grain": grainIncome, "lumber": lumberIncome, "stone": stoneIncome, "gold": goldIncome, "iron": ironIncome, "recruits": recruitsIncome, "horses": horseIncome };

        await incDatabaseValue(client, username, updatedUser);
    },

    removeResources: async function (client, username, gold, lumber, stone, iron, grain, recruits, horses) {
        const user = await getUserByUsername(client, username);

        const newGold = user.gold - gold;
        const newLumber = user.lumber - lumber;
        const newStone = user.stone - stone;
        const newIron = user.iron - iron;
        const newGrain = user.grain - grain;
        const newRecruits = user.recruits - recruits;
        const newHorses = user.horses - horses;
        const updatedUser = { "grain": newGrain, "lumber": newLumber, "stone": newStone, "gold": newGold, "iron": newIron, "recruits": newRecruits, "horses": newHorses };

        await client.db("gamedb").collection("players").updateOne({ username: username }, { $set: updatedUser });
    },

    checkIfCanAfford: async function (client, username, goldCost, lumberCost, stoneCost, ironCost, grainCost, recruitCost, horseCost) {
        const user = await getUserByUsername(client, username);
        console.log(grainCost, lumberCost, stoneCost, ironCost, goldCost, recruitCost, horseCost)
        if (user.gold >= goldCost && user.lumber >= lumberCost && user.stone >= stoneCost && user.iron >= ironCost && user.grain >= grainCost && user.recruits >= recruitCost && user.horses >= horseCost) {
            return true;
        }
        return false;
    },

    stealResources: async function (client, username, gold, lumber, stone, iron, grain) {
        const user = await getUserByUsername(client, username);

        const newGold = Math.round(user.gold + gold);
        const newLumber = Math.round(user.lumber + lumber);
        const newStone = Math.round(user.stone + stone);
        const newIron = Math.round(user.iron + iron);
        const newGrain = Math.round(user.grain + grain);

        const updatedUser = { grain: newGrain, lumber: newLumber, stone: newStone, gold: newGold, iron: newIron };

        await client.db("gamedb").collection("players").updateOne({ "username": username }, { $set: updatedUser });//flytta till db module
        //return something to check against with unit test? return true/false?
    },

    loseResources: async function (client, username, gold, lumber, stone, iron, grain) {
        const user = await getUserByUsername(client, username);

        const newGold = user.gold - gold;
        const newLumber = user.lumber - lumber;
        const newStone = user.stone - stone;
        const newIron = user.iron - iron;
        const newGrain = user.grain - grain;

        const updatedUser = { grain: newGrain, lumber: newLumber, stone: newStone, gold: newGold, iron: newIron };
        await client.db("gamedb").collection("players").updateOne({ username: username }, { $set: updatedUser });
    },
    incomeCalc: function (type, levels) {
        let baseIncome = 0;

        switch (type) {
            case "grain":
                baseIncome = baseGrainIncome;
                break;
            case "lumber":
                baseIncome = baseLumberIncome;
                break;
            case "stone":
                baseIncome = baseStoneIncome;
                break;
            case "iron":
                baseIncome = baseIronIncome;
                break;
            case "gold":
                baseIncome = baseGoldIncome;
                break;
        }
        return income = levels * baseIncome;
    },
    validateUserTrades: async function (client, id) {
        const user = await getUserById(client, id);
        const currentGrain = user.grain;
        const currentLumber = user.lumber;
        const currentStone = user.stone;
        const currentIron = user.iron;
        const currentGold = user.gold;

        if (await hasTrades(client, user.username)) {
            const trades = await getUserTrades(client, user.username);
            for (let i = 0; i < trades.length; i++) {
                let cancelTrade = false;
                if (trades[i].sellResource === "Grain" && trades[i].sellAmount > currentGrain) {
                    cancelTrade = true;
                } else if (trades[i].sellResource === "Lumber" && trades[i].sellAmount > currentLumber) {
                    cancelTrade = true;
                } else if (trades[i].sellResource === "Stone" && trades[i].sellAmount > currentStone) {
                    cancelTrade = true;
                } else if (trades[i].sellResource === "Iron" && trades[i].sellAmount > currentIron) {
                    cancelTrade = true;
                } else if (trades[i].sellResource === "Gold" && trades[i].sellAmount > currentGold) {
                    cancelTrade = true;
                }

                if (cancelTrade) {
                    const data = { sentTo: user.username, sentBy: "SYSTEM", message: `Your trade offer of ${trades[i].sellResource} was canceled due to insufficient stockpiles.`, time: new Date() };
                    await deleteTrade(client, trades[i]._id);
                    addMessage(client, data);
                }
            }
        };
    },
    getIncome: function (user, requestedIncome) {
        let levels = 0;
        function calc(i) {
            levels += i;
        };

        switch (requestedIncome) {
            case "getGrainIncome":
                user.farms.forEach(calc);
                return resourceObject.incomeCalc("grain", levels);
            case "getLumberIncome":
                user.lumberCamps.forEach(calc);
                return resourceObject.incomeCalc("lumber", levels);
            case "getStoneIncome":
                user.quarries.forEach(calc);
                return resourceObject.incomeCalc("stone", levels);
            case "getIronIncome":
                user.ironMines.forEach(calc);
                return resourceObject.incomeCalc("iron", levels);
            case "getGoldIncome":
                user.goldMines.forEach(calc);
                return resourceObject.incomeCalc("gold", levels);
            case "getRecruitsIncome":
                return user.trainingfieldLevel * 5;
            case "getHorseIncome":
                return user.stablesLevel * 3;
            default:
                return false;
        }

    },
    getAllIncomes: function (user) {
        const grainIncome = resourceObject.getIncome(user, "getGrainIncome");
        const lumberIncome = resourceObject.getIncome(user, "getLumberIncome");
        const stoneIncome = resourceObject.getIncome(user, "getStoneIncome");
        const ironIncome = resourceObject.getIncome(user, "getIronIncome");
        const goldIncome = resourceObject.getIncome(user, "getGoldIncome");
        const recruitsIncome = resourceObject.getIncome(user, "getRecruitsIncome");
        const horseIncome = resourceObject.getIncome(user, "getHorseIncome");

        return { grainIncome: grainIncome, lumberIncome: lumberIncome, stoneIncome: stoneIncome, ironIncome: ironIncome, goldIncome: goldIncome, recruitsIncome: recruitsIncome, horseIncome: horseIncome }
    }
};

module.exports = resourceObject;