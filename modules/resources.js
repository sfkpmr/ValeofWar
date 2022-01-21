const { setDatabaseValue, getUserByUsername, incDatabaseValue, getUserById, hasTrades, getUserTrades, deleteTrade, addMessage, incomeCalc } = require("../modules/database.js");

const baseGrainIncome = 7, baseLumberIncome = 6, baseStoneIncome = 3, baseIronIncome = 2, baseGoldIncome = 1;



async function removeResources(username, gold, lumber, stone, iron, grain, recruits, horses) {
    const user = await getUserByUsername(username);

    const newGold = user.gold - gold;
    const newLumber = user.lumber - lumber;
    const newStone = user.stone - stone;
    const newIron = user.iron - iron;
    const newGrain = user.grain - grain;
    const newRecruits = user.recruits - recruits;
    const newHorses = user.horses - horses;
    const updatedUser = { "grain": newGrain, "lumber": newLumber, "stone": newStone, "gold": newGold, "iron": newIron, "recruits": newRecruits, "horses": newHorses };


    await setDatabaseValue(username, updatedUser);
    //await client.db("gamedb").collection("players").updateOne({ username: username }, { $set: updatedUser });
}

async function checkIfCanAfford(username, goldCost, lumberCost, stoneCost, ironCost, grainCost, recruitCost, horseCost) {
    const user = await getUserByUsername(username);
    console.log(user.username, "tries to use", grainCost, lumberCost, stoneCost, ironCost, goldCost, recruitCost, horseCost, ". Currently has",
        user.grain, user.lumber, user.stone, user.iron, user.gold, user.recruits, user.horses)
    if (user.gold >= goldCost && user.lumber >= lumberCost && user.stone >= stoneCost && user.iron >= ironCost && user.grain >= grainCost && user.recruits >= recruitCost && user.horses >= horseCost) {
        console.log(user.username + "'s resource use request accepted!");
        return true;
    }
    console.log(user.username + "'s resource use request rejected!");
    return false;
}

async function stealResources(client, username, gold, lumber, stone, iron, grain) {
    const user = await getUserByUsername(client, username);

    const newGold = Math.round(user.gold + gold);
    const newLumber = Math.round(user.lumber + lumber);
    const newStone = Math.round(user.stone + stone);
    const newIron = Math.round(user.iron + iron);
    const newGrain = Math.round(user.grain + grain);

    const updatedUser = { grain: newGrain, lumber: newLumber, stone: newStone, gold: newGold, iron: newIron };

    await client.db("gamedb").collection("players").updateOne({ "username": username }, { $set: updatedUser });//flytta till db module
    //return something to check against with unit test? return true/false? return new value?
}

async function loseResources(client, username, gold, lumber, stone, iron, grain) {
    const user = await getUserByUsername(client, username);

    const newGold = user.gold - gold;
    const newLumber = user.lumber - lumber;
    const newStone = user.stone - stone;
    const newIron = user.iron - iron;
    const newGrain = user.grain - grain;

    const updatedUser = { grain: newGrain, lumber: newLumber, stone: newStone, gold: newGold, iron: newIron };
    await client.db("gamedb").collection("players").updateOne({ username: username }, { $set: updatedUser });
}

function getIncome(user, requestedIncome) {
    let levels = 0;
    function calc(i) {
        levels += i;
    };

    switch (requestedIncome) {
        case "getGrainIncome":
            user.farms.forEach(calc);
            return incomeCalc("grain", levels);
        case "getLumberIncome":
            user.lumberCamps.forEach(calc);
            return incomeCalc("lumber", levels);
        case "getStoneIncome":
            user.quarries.forEach(calc);
            return incomeCalc("stone", levels);
        case "getIronIncome":
            user.ironMines.forEach(calc);
            return incomeCalc("iron", levels);
        case "getGoldIncome":
            user.goldMines.forEach(calc);
            return incomeCalc("gold", levels);
        case "getRecruitsIncome":
            return user.trainingfieldLevel * 5;
        case "getHorseIncome":
            return user.stablesLevel * 3;
        default:
            return false;
    }

}
function getAllIncomes(user) {
    const grainIncome = getIncome(user, "getGrainIncome");
    const lumberIncome = getIncome(user, "getLumberIncome");
    const stoneIncome = getIncome(user, "getStoneIncome");
    const ironIncome = getIncome(user, "getIronIncome");
    const goldIncome = getIncome(user, "getGoldIncome");
    const recruitsIncome = getIncome(user, "getRecruitsIncome");
    const horseIncome = getIncome(user, "getHorseIncome");

    return { grainIncome: grainIncome, lumberIncome: lumberIncome, stoneIncome: stoneIncome, ironIncome: ironIncome, goldIncome: goldIncome, recruitsIncome: recruitsIncome, horseIncome: horseIncome }
}
function getResourceBoost(type) {
    switch (type) {
        case "farm":
            return baseGrainIncome;
        case "lumbercamp":
            return baseLumberIncome;
        case "quarry":
            return baseStoneIncome;
        case "ironMine":
            return baseIronIncome;
        case "goldMine":
            return baseGoldIncome;
    }
}

module.exports.removeResources = removeResources;
module.exports.checkIfCanAfford = checkIfCanAfford;
module.exports.stealResources = stealResources;
module.exports.loseResources = loseResources;
module.exports.getIncome = getIncome;
module.exports.getAllIncomes = getAllIncomes;
module.exports.getResourceBoost = getResourceBoost;