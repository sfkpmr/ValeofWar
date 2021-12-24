const { incDatabaseValue } = require("../modules/database.js");

const archer = { grain: 25, lumber: 50, gold: 10 };
const spearman = { grain: 25, lumber: 50 };
const swordsman = { grain: 50, iron: 50, gold: 25 };
const horseman = { grain: 100, iron: 25 };
const knight = { grain: 100, iron: 100, gold: 50 };
const batteringram = { lumber: 500, iron: 100, gold: 50 };
const siegetower = { lumber: 1000, iron: 100, gold: 100 };

const boot = { iron: 25 };
const bracer = { iron: 25 };
const helmet = { iron: 50 };
const lance = { lumber: 100, iron: 50, gold: 10 };
const longbow = { lumber: 50, iron: 10 };
const shield = { lumber: 50, iron: 25 };
const spear = { lumber: 100, iron: 5 };
const sword = { iron: 50, gold: 15 };

const barracksBaseCost = { lumber: 200, stone: 50, iron: 10, gold: 5 };
const blacksmithBaseCost = { lumber: 250, stone: 50, iron: 100, gold: 25 };
const trainingFieldBaseCost = { lumber: 100, stone: 100, iron: 5, gold: 5 };
const stablesBaseCost = { lumber: 500, stone: 100, iron: 50, gold: 50 };
const wallBaseCost = { lumber: 250, stone: 500, iron: 100, gold: 10 };
const workshopBaseCost = { lumber: 500, stone: 250, iron: 250, gold: 100 };

module.exports = {

    calcGoldTrainCost: function (archers, spearmen, swordsmen, horsemen, knights, batteringrams, siegetowers) {
        var cost = 0;

        cost += archers * archer.gold;
        cost += swordsmen * swordsman.gold;
        cost += knights * knight.gold;
        cost += batteringrams * batteringram.gold;
        cost += siegetowers * siegetower.gold;

        return Math.round(cost);
    },

    calcIronTrainCost: function (archers, spearmen, swordsmen, horsemen, knights, batteringrams, siegetowers) {
        var cost = 0;

        cost += swordsmen * swordsman.iron;
        cost += horsemen * horseman.iron;
        cost += knights * knight.iron;
        cost += batteringrams * batteringram.iron;
        cost += siegetowers * siegetower.iron;

        return Math.round(cost);
    },

    calcGrainTrainCost: function (archers, spearmen, swordsmen, horsemen, knights, batteringrams, siegetowers) {
        var cost = 0;

        cost += archers * archer.grain;
        cost += spearmen * spearman.grain;
        cost += swordsmen * swordsman.grain;
        cost += horsemen * horseman.grain;
        cost += knights * knight.grain;

        return Math.round(cost);
    },
    calcLumberTrainCost: function (archers, spearmen, swordsmen, horsemen, knights, batteringrams, siegetowers) {
        var cost = 0;

        cost += archers * archer.lumber;
        cost += spearmen * spearman.lumber;
        cost += batteringrams * batteringram.lumber;
        cost += siegetowers * siegetower.lumber;

        return Math.round(cost);
    },
    calcLumberCraftCost: function (boots, bracers, helmets, lances, longbows, shields, spears, swords) {
        var cost = 0;

        cost += lances * lance.lumber;
        cost += longbows * longbow.lumber;
        cost += shields * shield.lumber;
        cost += spears * spear.lumber;

        return Math.round(cost);
    },
    calcIronCraftCost: function (boots, bracers, helmets, lances, longbows, shields, spears, swords) {
        var cost = 0;

        cost += boots * boot.iron;
        cost += bracers * bracer.iron;
        cost += helmets * helmet.iron;
        cost += lances * lance.iron;
        cost += longbows * longbow.iron;
        cost += shields * shield.iron;
        cost += spears * spear.iron;
        cost += swords * sword.iron;

        return Math.round(cost);
    },
    calcGoldCraftCost: function (boots, bracers, helmets, lances, longbows, shields, spears, swords) {
        var cost = 0;

        cost += lances * lance.gold;
        cost += swords * sword.gold;

        return Math.round(cost);
    },
    upgradeBuilding: async function (client, username, building) {
        //socket update defense when upgrading wall
        // check cost
        const updatedUser = { [building]: 1 };
        await incDatabaseValue(client, username, updatedUser);
    },
    calcBuildingLumberCost: async function (type, buildingLevel) {

        var cost;

        switch (type) {
            case "barracks":
                cost = barracksBaseCost.lumber;
                break;
            case "blacksmith":
                cost = blacksmithBaseCost.lumber;
                break;
            case "stables":
                cost = stablesBaseCost.lumber;
                break;
            case "trainingfield":
                cost = trainingFieldBaseCost.lumber;
                break;
            case "wall":
                cost = wallBaseCost.lumber;
                break;
            case "workshop":
                cost = workshopBaseCost.lumber;
                break;
        }

        for (i = 0; i < buildingLevel; i++) {
           if (i > 0) {
                cost = cost * 1.2;
            }


        }
        return Math.round(cost);

    },
    calcBuildingStoneCost: async function (type, buildingLevel) {

        var cost;

        switch (type) {
            case "barracks":
                cost = barracksBaseCost.stone;
                break;
            case "blacksmith":
                cost = blacksmithBaseCost.stone;
                break;
            case "stables":
                cost = stablesBaseCost.stone;
                break;
            case "trainingfield":
                cost = trainingFieldBaseCost.stone;
                break;
            case "wall":
                cost = wallBaseCost.stone;
                break;
            case "workshop":
                cost = workshopBaseCost.stone;
                break;
        }

        for (i = 0; i < buildingLevel; i++) {
            if (i > 0) {
                cost = cost * 1.2;
            }


        }
        return Math.round(cost);

    },
    calcBuildingIronCost: async function (type, buildingLevel) {

        var cost;

        switch (type) {
            case "barracks":
                cost = barracksBaseCost.iron;
                break;
            case "blacksmith":
                cost = blacksmithBaseCost.iron;
                break;
            case "stables":
                cost = stablesBaseCost.iron;
                break;
            case "trainingfield":
                cost = trainingFieldBaseCost.iron;
                break;
            case "wall":
                cost = wallBaseCost.iron;
                break;
            case "workshop":
                cost = workshopBaseCost.iron;
                break;
        }

        for (i = 0; i < buildingLevel; i++) {
             if (i > 0) {
                cost = cost * 1.2;
            }


        }
        return Math.round(cost);

    },
    calcBuildingGoldCost: async function (type, buildingLevel) {

        var cost;

        switch (type) {
            case "barracks":
                cost = barracksBaseCost.gold;
                break;
            case "blacksmith":
                cost = blacksmithBaseCost.gold;
                break;
            case "stables":
                cost = stablesBaseCost.gold;
                break;
            case "trainingfield":
                cost = trainingFieldBaseCost.gold;
                break;
            case "wall":
                cost = wallBaseCost.gold;
                break;
            case "workshop":
                cost = workshopBaseCost.gold;
                break;
        }

        for (i = 0; i < buildingLevel; i++) {
           if (i > 0) {
                cost = cost * 1.2;
            }


        }
        return Math.round(cost);

    }
}