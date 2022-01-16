const { incDatabaseValue, incTroopValues } = require("../modules/database.js");
const { checkIfCanAfford, removeResources } = require("../modules/resources.js");
const { calcGoldTrainCost, calcGrainTrainCost, calcIronTrainCost, calcLumberTrainCost } = require("../modules/buildings.js");

troopsObject = {
    // addToDb: async function (client, username, data) {//ta bort?
    //     await incDatabaseValue(client, username, data);
    // },
    trainTroops: async function (client, username, trainees) {

        const grainCost = calcGrainTrainCost(trainees);
        const lumberCost = calcLumberTrainCost(trainees);
        const ironCost = calcIronTrainCost(trainees);
        const goldCost = calcGoldTrainCost(trainees);
        const recruitsCost = troopsObject.calcRecruitsCost(trainees);
        const horseCost = troopsObject.calcHorseCost(trainees);

        if (await checkIfCanAfford(client, username, goldCost, lumberCost, 0, ironCost, grainCost, recruitsCost, horseCost)) {
            await incTroopValues(client, username, trainees);
            await removeResources(client, username, goldCost, lumberCost, 0, ironCost, grainCost, recruitsCost, horseCost);
        } else {
            console.log("Can't afford troops bbbb");
        }

    },
    //TODO städa up
    calcRecruitsCost: function (trainees) {
        if (trainees.archers > 0 || trainees.spearmen > 0 || trainees.swordsmen > 0 || trainees.twoHandedSwordsmen > 0 || trainees.crossbowmen > 0 ||
            trainees.halberdiers > 0 || trainees.longbowmen > 0) {
            return trainees.archers + trainees.spearmen + trainees.swordsmen + trainees.twoHandedSwordsmen + trainees.crossbowmen + trainees.halberdiers + trainees.longbowmen;
        } else if (trainees.horsemen > 0 || trainees.knights > 0 || trainees.horseArchers > 0) {
            return trainees.horsemen + trainees.knights + trainees.horseArchers;
        } else if (trainees.ballistas > 0 || trainees.trebuchets > 0) {
            return (trainees.ballistas + trainees.trebuchets) * 5;
        } else if (trainees.spies > 0 || trainees.sentries > 0) {
            return trainees.spies + trainees.sentries;
        } else {
            console.debug("Caluclation error")
            return -1;
        }
    },
    calcHorseCost: function (trainees) {
        if (trainees.horsemen > 0 || trainees.knights > 0 || trainees.horseArchers > 0) {
            return trainees.horsemen + trainees.knights + trainees.horseArchers;
        } else {
            return 0;
        }
    }
};
module.exports = troopsObject;