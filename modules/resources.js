const { getUser, incDatabaseValue, getUserById, hasTrades, getUserTrades, deleteTrade } = require("../modules/database.js");

const baseGrainIncome = 7, baseLumberIncome = 6, baseStoneIncome = 3, baseIronIncome = 2, baseGoldIncome = 1;

resourceObject = {
    addResources: async function (client, username) {
        const user = await getUser(client, username);

        const farms = user.farms;
        const lumberCamps = user.lumberCamps;
        const quarries = user.quarries;
        const ironMines = user.ironMines;
        const goldMines = user.goldMines;
        const trainingfield = user.trainingfieldLevel;
        const stables = user.stablesLevel;

        var recruitsIncome = trainingfield * 5, horseIncome = stables * 3;

        var farmLevels = 0, lumberLevels = 0, stoneLevels = 0, ironLevels = 0, goldLevels = 0;

        farms.forEach(grainCalc);
        lumberCamps.forEach(lumberCalc);
        quarries.forEach(stoneCalc);
        ironMines.forEach(ironCalc);
        goldMines.forEach(goldCalc);

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

        // console.log(`Giving ${grainIncome} grain, ${lumberIncome} lumber, ${goldIncome} gold, ${stoneIncome} stone, ${ironIncome} iron, ${recruitsIncome} recruits and ${horseIncome} horses to ${username}.`);

        const updatedUser = { "grain": grainIncome, "lumber": lumberIncome, "stone": stoneIncome, "gold": goldIncome, "iron": ironIncome, "recruits": recruitsIncome, "horses": horseIncome };

        await incDatabaseValue(client, username, updatedUser);

    },

    removeResources: async function (client, username, gold, lumber, stone, iron, grain, recruits, horses) {
        const user = await getUser(client, username);

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
        const user = await getUser(client, username);

        console.log("User has " + user.gold + " " + user.lumber + " " + user.stone + " " + user.iron + " " + user.grain + " " + user.recruits + " " + user.horses);
        console.log("User wants to use " + goldCost + " gold, " + lumberCost + " lumber, " + stoneCost + " stone, " + ironCost + " iron, " + grainCost + " grain, " + recruitCost + " " + horseCost);

        if (user.gold >= goldCost && user.lumber >= lumberCost && user.stone >= stoneCost && user.iron >= ironCost && user.grain >= grainCost && user.recruits >= recruitCost && user.horses >= horseCost) {
            return true;
        }
        return false;
    },

    stealResources: async function (client, username, gold, lumber, stone, iron, grain) {

        //  console.log(username + " is stealing resources");
        const user = await getUser(client, username);

        const newGold = Math.round(user.gold + gold);
        const newLumber = Math.round(user.lumber + lumber);
        const newStone = Math.round(user.stone + stone);
        const newIron = Math.round(user.iron + iron);
        const newGrain = Math.round(user.grain + grain);

        const updatedUser = { grain: newGrain, lumber: newLumber, stone: newStone, gold: newGold, iron: newIron };

        await client.db("gamedb").collection("players").updateOne({ "username": username }, { $set: updatedUser });
    },

    loseResources: async function (client, username, gold, lumber, stone, iron, grain) {

        //  console.log(username + " is losing resources");
        const user = await getUser(client, username);

        const newGold = user.gold - gold;
        const newLumber = user.lumber - lumber;
        const newStone = user.stone - stone;
        const newIron = user.iron - iron;
        const newGrain = user.grain - grain;

        const updatedUser = { grain: newGrain, lumber: newLumber, stone: newStone, gold: newGold, iron: newIron };
        console.log('User spent', updatedUser)
        await client.db("gamedb").collection("players").updateOne({ username: username }, { $set: updatedUser });
    },
    incomeCalc: function (type, levels) {

        var baseIncome = 0;

        if (type === "grain") {
            baseIncome = baseGrainIncome;
        } else if (type === "lumber") {
            baseIncome = baseLumberIncome;
        } else if (type === "stone") {
            baseIncome = baseStoneIncome;
        } else if (type === "iron") {
            baseIncome = baseIronIncome;
        } else if (type === "gold") {
            baseIncome = baseGoldIncome;
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
            trades = await getUserTrades(client, user.username);
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
                    await deleteTrade(client, trades[i]._id);
                }
            }
        };
    },
    getIncome: async function (client, id) {

    }
};

module.exports = resourceObject;