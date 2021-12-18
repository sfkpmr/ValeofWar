const { getUser, incDatabaseValue } = require("../modules/database.js");

module.exports = {
    addResources: async function (client, username) {
        const user = await getUser(client, username);

        const lumberCamps = user.lumberCamps;
        const goldMines = user.goldMines;
        const farms = user.farms;
        const ironMines = user.ironMines;
        const quarries = user.quarries;
        const trainingfield = user.trainingfieldLevel;
        const stables = user.stablesLevel;

        var lumberIncome = 0, goldIncome = 0, grainIncome = 0, ironIncome = 0, stoneIncome = 0, recruitsIncome = trainingfield * 10, horseIncome = stables * 10;

        lumberCamps.forEach(lumberCalc);
        goldMines.forEach(goldCalc);
        farms.forEach(grainCalc);
        ironMines.forEach(ironCalc);
        quarries.forEach(stoneCalc);

        function lumberCalc(i) {
            lumberIncome += i * 10;
        };

        function goldCalc(i) {
            goldIncome += i * 2;
        };

        function grainCalc(i) {
            grainIncome += i * 10;
        };

        function ironCalc(i) {
            ironIncome += i * 5;
        };

        function stoneCalc(i) {
            stoneIncome += i * 5;
        };

        console.log(`Giving ${grainIncome} grain, ${lumberIncome} lumber, ${goldIncome} gold, ${stoneIncome} stone, ${ironIncome} iron, ${recruitsIncome} recruits and ${horseIncome} horses to ${username}.`);

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
        console.log("User wants to use " + goldCost + " " + lumberCost + " " + stoneCost + " " + ironCost + " " + grainCost + " " + recruitCost + " " + horseCost);

        if (user.gold >= goldCost && user.lumber >= lumberCost && user.stone >= stoneCost && user.iron >= ironCost && user.grain >= grainCost && user.recruits >= recruitCost && user.horses >= horseCost) {
            return true;
        }
        return false;
    },

    stealResources: async function (client, username, gold, lumber, stone, iron, grain) {

        console.log(username + " is stealing resources");
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

        console.log(username + " is losing resources");
        const user = await getUser(client, username);

        const newGold = user.gold - gold;
        const newLumber = user.lumber - lumber;
        const newStone = user.stone - stone;
        const newIron = user.iron - iron;
        const newGrain = user.grain - grain;

        const updatedUser = { grain: newGrain, lumber: newLumber, stone: newStone, gold: newGold, iron: newIron };
        await client.db("gamedb").collection("players").updateOne({ username: username }, { $set: updatedUser });
    }
}