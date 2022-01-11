const { incDatabaseValue, setDatabaseValue } = require("../modules/database.js");
const { checkIfCanAfford, removeResources } = require("../modules/resources.js");

const archer = { grain: 25, lumber: 50, gold: 10, requiredLevel: 0 };
const spearman = { grain: 25, lumber: 50, requiredLevel: 0 };
const swordsman = { grain: 50, iron: 50, gold: 25, requiredLevel: 5 };
const horseman = { grain: 100, iron: 25, requiredLevel: 0 };
const knight = { grain: 100, iron: 100, gold: 50, requiredLevel: 5 };
const batteringram = { lumber: 500, iron: 100, gold: 50, requiredLevel: 5 };
const siegetower = { lumber: 1000, iron: 100, gold: 100, requiredLevel: 10 };

const boot = { iron: 25, requiredLevel: 0 };
const bracer = { iron: 25, requiredLevel: 0 };
const helmet = { iron: 50, requiredLevel: 5 };
const lance = { lumber: 100, iron: 50, gold: 10, requiredLevel: 10 };
const longbow = { lumber: 50, iron: 10, requiredLevel: 10 };
const shield = { lumber: 50, iron: 25, requiredLevel: 5 };
const spear = { lumber: 100, iron: 5, requiredLevel: 0 };
const sword = { iron: 50, gold: 15, requiredLevel: 5 };

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
        let cost = 0;

        cost += archers * archer.gold;
        cost += swordsmen * swordsman.gold;
        cost += knights * knight.gold;
        cost += batteringrams * batteringram.gold;
        cost += siegetowers * siegetower.gold;

        return Math.round(cost);
    },

    calcIronTrainCost: function (archers, spearmen, swordsmen, horsemen, knights, batteringrams, siegetowers) {
        let cost = 0;

        cost += swordsmen * swordsman.iron;
        cost += horsemen * horseman.iron;
        cost += knights * knight.iron;
        cost += batteringrams * batteringram.iron;
        cost += siegetowers * siegetower.iron;

        return Math.round(cost);
    },

    calcGrainTrainCost: function (archers, spearmen, swordsmen, horsemen, knights, batteringrams, siegetowers) {
        let cost = 0;

        cost += archers * archer.grain;
        cost += spearmen * spearman.grain;
        cost += swordsmen * swordsman.grain;
        cost += horsemen * horseman.grain;
        cost += knights * knight.grain;

        return Math.round(cost);
    },
    calcLumberTrainCost: function (archers, spearmen, swordsmen, horsemen, knights, batteringrams, siegetowers) {
        let cost = 0;

        cost += archers * archer.lumber;
        cost += spearmen * spearman.lumber;
        cost += batteringrams * batteringram.lumber;
        cost += siegetowers * siegetower.lumber;

        return Math.round(cost);
    },
    calcLumberCraftCost: function (boots, bracers, helmets, lances, longbows, shields, spears, swords) {
        let cost = 0;

        cost += lances * lance.lumber;
        cost += longbows * longbow.lumber;
        cost += shields * shield.lumber;
        cost += spears * spear.lumber;

        return Math.round(cost);
    },
    calcIronCraftCost: function (boots, bracers, helmets, lances, longbows, shields, spears, swords) {
        let cost = 0;

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
    //pass object instead
    calcGoldCraftCost: function (boots, bracers, helmets, lances, longbows, shields, spears, swords) {
        let cost = 0;

        cost += lances * lance.gold;
        cost += swords * sword.gold;

        return Math.round(cost);
    },
    calcTotalCraftCost: function (armorOrder) {
        const lumberCost = buildingObject.calcLumberCraftCost(armorOrder.boots, armorOrder.bracers, armorOrder.helmets, armorOrder.lances, armorOrder.longbows, armorOrder.shields, armorOrder.spears, armorOrder.swords);
        const ironCost = buildingObject.calcIronCraftCost(armorOrder.boots, armorOrder.bracers, armorOrder.helmets, armorOrder.lances, armorOrder.longbows, armorOrder.shields, armorOrder.spears, armorOrder.swords);
        const goldCost = buildingObject.calcGoldCraftCost(armorOrder.boots, armorOrder.bracers, armorOrder.helmets, armorOrder.lances, armorOrder.longbows, armorOrder.shields, armorOrder.spears, armorOrder.swords);

        return { lumberCost: lumberCost, ironCost: ironCost, goldCost: goldCost };
    },
    upgradeBuilding: async function (client, username, building) {
        const updatedUser = { [building]: 1 };
        await incDatabaseValue(client, username, updatedUser);
    },
    upgradeResource: async function (client, username, data) {
        await setDatabaseValue(client, username, data);
    },
    calcBuildingLumberCost: function (type, buildingLevel) {
        let cost;

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
        return Math.round(cost / 100) * 100;

    },
    calcBuildingStoneCost: function (type, buildingLevel) {
        let cost;

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
        return Math.round(cost / 100) * 100;

    },
    calcBuildingIronCost: function (type, buildingLevel) {
        let cost;

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
        return Math.round(cost / 100) * 100;
    },
    calcBuildingGoldCost: function (type, buildingLevel) {
        let cost;

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
        return Math.round(cost / 100) * 100;
    },
    restoreWallHealth: async function (client, user) {
        const newHealth = user.wallLevel * 100;
        const data = { currentWallHealth: newHealth };
        await setDatabaseValue(client, user.username, data);
    },
    lowerWallHealth: async function (client, defender, amount) {
        let newHealth = defender.currentWallHealth - amount;
        if (newHealth < 0) {
            newHealth = 0;
        }
        const data = { currentWallHealth: newHealth };
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
        if (await checkIfCanAfford(client, user.username, totalCost.goldCost, totalCost.lumberCost, 0, totalCost.ironCost, 0, 0, 0)) {
            await troopsObject.addToDb(client, user.username, craftingOrder);
            await resourceObject.removeResources(client, user.username, totalCost.goldCost, totalCost.lumberCost, 0, totalCost.ironCost, 0, 0, 0);
        } else {
            console.log("bbbb");
        }
    },
    upgradeResourceField: async function (client, user, type, resourceId) {
        let upgradedFieldData, resourceLevel, resource;

        if (resourceLevel >= 20 || resourceId < 0) {
            return false;
        }
        switch (type) {
            case "farm":
                //check correct number
                if (resourceId <= maxFarms) {
                    resource = "farms"
                    upgradedFieldData = user.farms;
                    resourceLevel = upgradedFieldData[resourceId]
                    upgradedFieldData[resourceId]++;
                    upgradedFieldData = { farms: upgradedFieldData }

                }
                break;
            case "lumbercamp":
                if (resourceId <= maxLumberCamps) {
                    resource = "lumberCamp"
                    upgradedFieldData = user.lumberCamps;
                    resourceLevel = upgradedFieldData[resourceId]
                    upgradedFieldData[resourceId]++;
                    upgradedFieldData = { lumberCamps: upgradedFieldData }
                }
                break;
            case "quarry":
                if (resourceId <= maxQuarries) {
                    resource = "quarry"
                    upgradedFieldData = user.quarries;
                    resourceLevel = upgradedFieldData[resourceId]
                    upgradedFieldData[resourceId]++;
                    upgradedFieldData = { quarries: upgradedFieldData }
                }
                break;
            case "ironMine":
                if (resourceId <= maxIronMines) {
                    resource = "ironMines";
                    upgradedFieldData = user.ironMines;
                    resourceLevel = upgradedFieldData[resourceId]
                    upgradedFieldData[resourceId]++;
                    upgradedFieldData = { ironMines: upgradedFieldData }
                }
                break;
            case "goldMine":
                if (resourceId <= maxGoldMines) {
                    resource = "goldMines";
                    upgradedFieldData = user.goldMines;
                    resourceLevel = upgradedFieldData[resourceId]
                    upgradedFieldData[resourceId]++;
                    upgradedFieldData = { goldMines: upgradedFieldData }
                }
                break;
            default:
                console.debug(type, 'Error');
        }

        const totalCost = await buildingObject.calculateTotalBuildingUpgradeCost(type, resourceLevel)

        if (await checkIfCanAfford(client, user.username, totalCost.goldCost, totalCost.lumberCost, totalCost.stoneCost, totalCost.ironCost, 0, 0, 0)) {
            await buildingObject.upgradeResource(client, user.username, upgradedFieldData, resource);
            await removeResources(client, user.username, totalCost.goldCost, totalCost.lumberCost, totalCost.stoneCost, totalCost.ironCost, 0, 0, 0);
        } else {
            console.debug("bbb-1");
            return false;
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
        let invalidId = false, resourceLevel, title;

        if (resourceId >= 0) {
            switch (type) {
                case "farm":
                    if (resourceId <= maxFarms - 1) {
                        title = "Farm";
                        resourceLevel = user.farms[resourceId];
                    } else {
                        invalidId = true;
                    }
                    break;
                case "lumbercamp":
                    if (resourceId <= maxLumberCamps - 1) {
                        title = "Lumber camp";
                        resourceLevel = user.lumberCamps[resourceId];
                    } else {
                        invalidId = true;
                    }
                    break;
                case "quarry":
                    if (resourceId <= maxQuarries - 1) {
                        title = "Quarry";
                        resourceLevel = user.quarries[resourceId];
                    } else {
                        invalidId = true;
                    }
                    break;
                case "ironMine":
                    if (resourceId <= maxIronMines - 1) {
                        title = "Iron mine";
                        resourceLevel = user.ironMines[resourceId];
                    } else {
                        invalidId = true;
                    }
                    break;
                case "goldMine":
                    if (resourceId <= maxGoldMines - 1) {
                        title = "Gold mine";
                        resourceLevel = user.goldMines[resourceId];
                    } else {
                        invalidId = true;
                    }
            }
        }

        const totalCost = await buildingObject.calculateTotalBuildingUpgradeCost(type, resourceLevel);
        return { totalCost: totalCost, resourceLevel: resourceLevel, invalidId: invalidId, title: title };
    },
    validateRequiredProductionLevel: function (user, data) {
        if (data.swordsmen > 0 && user.barracksLevel < swordsman.requiredLevel) {
            return false;
        }
        if (data.knights > 0 && user.stablesLevel < knight.requiredLevel) {
            return false;
        }
        if (data.batteringrams > 0 && user.workshopLevel < batteringram.requiredLevel) {
            return false;
        }
        if (data.siegetowers > 0 && user.workshopLevel < siegetower.requiredLevel) {
            return false;
        }
        if (data.helmets > 0 && user.blacksmithLevel < helmet.requiredLevel) {
            return false;
        }
        if (data.lances > 0 && user.blacksmithLevel < lance.requiredLevel) {
            return false;
        }
        if (data.longbows > 0 && user.blacksmithLevel < longbow.requiredLevel) {
            return false;
        }
        if (data.shields > 0 && user.blacksmithLevel < shield.requiredLevel) {
            return false;
        }
        if (data.swords > 0 && user.blacksmithLevel < sword.requiredLevel) {
            return false;
        }
        return true;
    }
};

module.exports = buildingObject;