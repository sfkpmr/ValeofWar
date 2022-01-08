const { incDatabaseValue } = require("../modules/database.js");
const { checkIfCanAfford, removeResources } = require("../modules/resources.js");
const { calcGoldTrainCost, calcGrainTrainCost, calcIronTrainCost, calcLumberTrainCost } = require("../modules/buildings.js");

troopsObject = {
    addToDb: async function (client, username, data) {
        await incDatabaseValue(client, username, data);
    },
    trainTroops: async function (client, user, trainees) {
        let archers, spearmen, swordsmen, horsemen, knights, batteringrams, siegetowers;

        if (trainees.archers !== null && trainees.archers !== undefined) {
            archers = trainees.archers;
        } else {
            archers = 0;
        }
        if (trainees.spearmen !== null && trainees.spearmen !== undefined) {
            spearmen = trainees.spearmen;
        } else {
            spearmen = 0;
        }
        if (trainees.swordsmen !== null && trainees.swordsmen !== undefined) {
            swordsmen = trainees.swordsmen;
        } else {
            swordsmen = 0;
        }
        if (trainees.horsemen !== null && trainees.horsemen !== undefined) {
            horsemen = trainees.horsemen;
        } else {
            horsemen = 0;
        }
        if (trainees.knights !== null && trainees.knights !== undefined) {
            knights = trainees.knights;
        } else {
            knights = 0;
        }
        if (trainees.batteringrams !== null && trainees.batteringrams !== undefined) {
            batteringrams = trainees.batteringrams;
        } else {
            batteringrams = 0;
        }
        if (trainees.siegetowers !== null && trainees.siegetowers !== undefined) {
            siegetowers = trainees.siegetowers;
        } else {
            siegetowers = 0;
        }
        const goldCost = calcGoldTrainCost(archers, spearmen, swordsmen, horsemen, knights, batteringrams, siegetowers);
        const grainCost = calcGrainTrainCost(archers, spearmen, swordsmen, horsemen, knights, batteringrams, siegetowers);
        const lumberCost = calcLumberTrainCost(archers, spearmen, swordsmen, horsemen, knights, batteringrams, siegetowers);
        const ironCost = calcIronTrainCost(archers, spearmen, swordsmen, horsemen, knights, batteringrams, siegetowers);

        let recruitsCost;
        let horseCost;
        if (archers > 0 || spearmen > 0 || swordsmen > 0) {
            recruitsCost = archers + spearmen + swordsmen;
        } else if (horsemen > 0 || knights > 0) {
            recruitsCost = horsemen + knights;
            horseCost = recruitsCost;
        } else {
            recruitsCost = (batteringrams + siegetowers) * 2;
        }

        const data = { archers: archers, spearmen: spearmen, swordsmen: swordsmen, horsemen: horsemen, knights: knights, "batteringrams": batteringrams, "siegetowers": siegetowers };

        if (await checkIfCanAfford(client, user.username, goldCost, lumberCost, 0, ironCost, grainCost, recruitsCost, horseCost)) {
            await troopsObject.addToDb(client, user.username, data);
            await removeResources(client, user.username, goldCost, lumberCost, 0, ironCost, grainCost, recruitsCost, horseCost);
        } else {
            console.log("bbbb");
        }

    }
};
module.exports = troopsObject;