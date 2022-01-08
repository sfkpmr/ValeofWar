const { incDatabaseValue, setDatabaseValue } = require("../modules/database.js");
const { checkIfCanAfford, removeResources } = require("../modules/resources.js");

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

const farmBaseCost = { lumber: 500, stone: 50, iron: 10, gold: 25 };
const lumberCampBaseCost = { lumber: 500, stone: 100, iron: 5, gold: 5 };
const quarryBaseCost = { lumber: 500, stone: 100, iron: 100, gold: 100 };
const ironMineBaseCost = { lumber: 750, stone: 500, iron: 100, gold: 100 };
const goldMineBaseCost = { lumber: 1000, stone: 250, iron: 250, gold: 100 };

const maxFarms = 4, maxGoldMines = 2, maxIronMines = 3, maxQuarries = 4, maxLumberCamps = 4;

buildingObject = {
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
    calcTotalCraftCost: function (armorOrder) {
        let boots, bracers, helmets, lances, longbows, shields, spears, swords;

        if (armorOrder.boots !== null && armorOrder.boots !== undefined) {
            boots = armorOrder.boots;
        } else {
            boots = 0;
        }
        if (armorOrder.bracers !== null && armorOrder.bracers !== undefined) {
            bracers = armorOrder.bracers;
        } else {
            bracers = 0;
        }
        if (armorOrder.helmets !== null && armorOrder.helmets !== undefined) {
            helmets = armorOrder.helmets;
        } else {
            helmets = 0;
        }
        if (armorOrder.lances !== null && armorOrder.lances !== undefined) {
            lances = armorOrder.lances;
        } else {
            lances = 0;
        }
        if (armorOrder.longbows !== null && armorOrder.longbows !== undefined) {
            longbows = armorOrder.longbows;
        } else {
            longbows = 0;
        }
        if (armorOrder.shields !== null && armorOrder.shields !== undefined) {
            shields = armorOrder.shields;
        } else {
            shields = 0;
        }
        if (armorOrder.spears !== null && armorOrder.spears !== undefined) {
            spears = armorOrder.spears;
        } else {
            spears = 0;
        }
        if (armorOrder.swords !== null && armorOrder.swords !== undefined) {
            swords = armorOrder.swords;
        } else {
            swords = 0;
        }

        const lumberCost = buildingObject.calcLumberCraftCost(boots, bracers, helmets, lances, longbows, shields, spears, swords);
        const ironCost = buildingObject.calcIronCraftCost(boots, bracers, helmets, lances, longbows, shields, spears, swords);
        const goldCost = buildingObject.calcGoldCraftCost(boots, bracers, helmets, lances, longbows, shields, spears, swords);

        return { lumberCost: lumberCost, ironCost: ironCost, goldCost: goldCost };

    },
    upgradeBuilding: async function (client, username, building) {
        const updatedUser = { [building]: 1 };
        await incDatabaseValue(client, username, updatedUser);
    },
    upgradeResource: async function (client, username, data) {
        await setDatabaseValue(client, username, data);
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
            case "farm":
                cost = farmBaseCost.lumber;
                break;
            case "lumbercamp":
                cost = lumberCampBaseCost.lumber;
                break;
            case "quarry":
                cost = quarryBaseCost.lumber;
                break;
            case "ironMine":
                cost = ironMineBaseCost.lumber;
                break;
            case "goldMine":
                cost = goldMineBaseCost.lumber;
                break;
            default:
                console.log("ERROR " + type)

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
            case "farm":
                cost = farmBaseCost.stone;
                break;
            case "lumbercamp":
                cost = lumberCampBaseCost.stone;
                break;
            case "quarry":
                cost = quarryBaseCost.stone;
                break;
            case "ironMine":
                cost = ironMineBaseCost.stone;
                break;
            case "goldMine":
                cost = goldMineBaseCost.stone;
                break;
            default:
                console.log("ERROR " + type)
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
            case "farm":
                cost = farmBaseCost.iron;
                break;
            case "lumbercamp":
                cost = lumberCampBaseCost.iron;
                break;
            case "quarry":
                cost = quarryBaseCost.iron;
                break;
            case "ironMine":
                cost = ironMineBaseCost.iron;
                break;
            case "goldMine":
                cost = goldMineBaseCost.iron;
                break;
            default:
                console.log("ERROR " + type)
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
            case "farm":
                cost = farmBaseCost.gold;
                break;
            case "lumbercamp":
                cost = lumberCampBaseCost.gold;
                break;
            case "quarry":
                cost = quarryBaseCost.gold;
                break;
            case "ironMine":
                cost = ironMineBaseCost.gold;
                break;
            case "goldMine":
                cost = goldMineBaseCost.gold;
                break;
            default:
                console.log("ERROR " + type)
        }

        for (i = 0; i < buildingLevel; i++) {
            if (i > 0) {
                cost = cost * 1.2;
            }


        }
        return Math.round(cost);

    },
    restoreWallHealth: async function (client, user) {

        newHealth = user.wallLevel * 100;
        data = { currentWallHealth: newHealth };

        await setDatabaseValue(client, user.username, data);
    },
    lowerWallHealth: async function (client, defender, amount) {

        newHealth = defender.currentWallHealth - amount;
        if (newHealth < 0) {
            newHealth = 0;
        }
        data = { currentWallHealth: newHealth };

        await setDatabaseValue(client, defender.username, data);
    },
    convertNegativeToZero: function (amount) {
        if (amount < 0) {
            return 0;
        } else {
            return amount;
        }
    },
    calculateTotalBuildingUpgradeCost: async function (type, buildingLevel) {

        const lumberCost = await buildingObject.calcBuildingLumberCost(type, buildingLevel + 1);
        const stoneCost = await buildingObject.calcBuildingStoneCost(type, buildingLevel + 1);
        const ironCost = await buildingObject.calcBuildingIronCost(type, buildingLevel + 1);
        const goldCost = await buildingObject.calcBuildingGoldCost(type, buildingLevel + 1);

        return { lumberCost: lumberCost, stoneCost: stoneCost, ironCost: ironCost, goldCost: goldCost };

    },
    craftArmor: async function (client, user, craftingOrder) {
        const totalCost = buildingObject.calcTotalCraftCost(craftingOrder);

        console.log(totalCost)

        if (await checkIfCanAfford(client, user.username, totalCost.goldCost, totalCost.lumberCost, 0, totalCost.ironCost, 0, 0, 0)) {
            await troopsObject.addToDb(client, user.username, craftingOrder);
            await resourceObject.removeResources(client, user.username, totalCost.goldCost, totalCost.lumberCost, 0, totalCost.ironCost, 0, 0, 0);
        } else {
            console.log("bbbb");
        }

    },
    upgradeResourceField: async function (client, user, type, resourceId) {
        let updatedUser, resourceLevel, resource;

        if (type === "farm") {
            if (resourceId >= 0 && resourceId <= maxFarms) {
                resource = "farms"
                updatedUser = user.farms;
                resourceLevel = updatedUser[resourceId]
                updatedUser[resourceId]++;
                updatedUser = { farms: updatedUser }
            } else {
                res.redirect("/land");
            }
        } else if (type === "goldMine") {
            if (resourceId >= 0 && resourceId <= maxGoldMines) {
                resource = "goldMines";
                updatedUser = user.goldMines;
                resourceLevel = updatedUser[resourceId]
                updatedUser[resourceId]++;

                updatedUser = { goldMines: updatedUser }
            } else {
                res.redirect("/land");
            }
        } else if (type === "ironMine") {
            if (resourceId >= 0 && resourceId <= maxIronMines) {
                resource = "ironMines";
                updatedUser = user.ironMines;
                resourceLevel = updatedUser[resourceId]
                updatedUser[resourceId]++;

                updatedUser = { ironMines: updatedUser }
            } else {
                res.redirect("/land");
            }
        }
        else if (type === "lumbercamp") {
            if (resourceId >= 0 && resourceId <= maxLumberCamps) {
                resource = "lumberCamp"
                updatedUser = user.lumberCamps;
                resourceLevel = updatedUser[resourceId]
                updatedUser[resourceId]++;

                updatedUser = { lumberCamps: updatedUser }
            } else {
                res.redirect("/land");
            }
        } else if (type === "quarry") {
            if (resourceId >= 0 && resourceId <= maxQuarries) {
                resource = "quarry"
                updatedUser = user.quarries;
                resourceLevel = updatedUser[resourceId]
                updatedUser[resourceId]++;

                updatedUser = { quarries: updatedUser }
            } else {
                res.redirect("/land");
            }
        } else {
            console.debug(type, 'Error')
        }

        if (resourceLevel >= 20) {
            return false;
        } else {
            const totalCost = await buildingObject.calculateTotalBuildingUpgradeCost(type, resourceLevel)

            if (await checkIfCanAfford(client, user.username, totalCost.goldCost, totalCost.lumberCost, totalCost.stoneCost, totalCost.ironCost, 0, 0, 0)) {
                await buildingObject.upgradeResource(client, user.username, updatedUser, resource);
                await removeResources(client, user.username, totalCost.goldCost, totalCost.lumberCost, totalCost.stoneCost, totalCost.ironCost, 0, 0, 0);
            } else {
                console.debug("bbb-1");
                return false;
            }
        }
    },
    fullUpgradeBuildingFunc: async function (client, user, type) {
        let buildingName, level;

        switch (type) {
            case "barracks":
                level = user.barracksLevel;
                buildingName = "barracksLevel";
                break;
            case "blacksmith":
                level = user.blacksmithLevel;
                buildingName = "blacksmithLevel";
                break;
            case "stables":
                console.log('aaaaaaaaaaaa')
                level = user.stablesLevel;
                buildingName = "stablesLevel";
                break;
            case "trainingfield":
                level = user.trainingfieldLevel;
                buildingName = "trainingfieldLevel";
                break;
            case "wall":
                level = user.wallLevel;
                buildingName = "wallLevel";
                break;
            case "workshop":
                level = user.workshopLevel;
                buildingName = "workshopLevel";
                break;
            default:
                console.debug(type, "Error")
        }

        if (level >= 20) {
            return false;
        } else {
            const totalCost = await buildingObject.calculateTotalBuildingUpgradeCost(type, level)
            if (await checkIfCanAfford(client, user.username, totalCost.goldCost, totalCost.lumberCost, totalCost.stoneCost, totalCost.ironCost, 0, 0, 0)) {
                await buildingObject.upgradeBuilding(client, user.username, buildingName);
                await removeResources(client, user.username, totalCost.goldCost, totalCost.lumberCost, totalCost.stoneCost, totalCost.ironCost, 0, 0, 0);
                if (type === "wall") {
                    await buildingObject.restoreWallHealth(client, user);
                }
            } else {
                console.log("bbb-2");
                return false;
            }
        }

    },
    getResourceFieldData: async function (user, type, resourceId) {
        let invalidId, resourceLevel, title;

        if (type === "farm") {
            if (resourceId >= 0 && resourceId <= maxFarms - 1) {
                title = "Farm";
                resourceLevel = user.farms[resourceId];
            } else {
                invalidId = true;
            }
        } else if (type === "goldMine") {
            if (resourceId >= 0 && resourceId <= maxGoldMines - 1) {
                title = "Gold mine";
                resourceLevel = user.goldMines[resourceId];
            } else {
                invalidId = true;
            }
        } else if (type === "ironMine") {
            if (resourceId >= 0 && resourceId <= maxIronMines - 1) {
                title = "Iron mine";
                resourceLevel = user.ironMines[resourceId];
            } else {
                invalidId = true;
            }
        }
        else if (type === "lumbercamp") {
            if (resourceId >= 0 && resourceId <= maxLumberCamps - 1) {
                title = "Lumber camp";
                resourceLevel = user.lumberCamps[resourceId];
            } else {
                invalidId = true;
            }
        }
        else if (type === "quarry") {
            if (resourceId >= 0 && resourceId <= maxQuarries - 1) {
                title = "Quarry";
                resourceLevel = user.quarries[resourceId];
            } else {
                invalidId = true;
            }
        }
        const totalCost = await buildingObject.calculateTotalBuildingUpgradeCost(type, resourceLevel);

        return { totalCost: totalCost, resourceLevel: resourceLevel, invalidId: invalidId, title: title };

    }
};

module.exports = buildingObject;