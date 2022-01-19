const { incDatabaseValue, setDatabaseValue, incArmorValues } = require("../modules/database.js");
const { checkIfCanAfford, removeResources } = require("../modules/resources.js");

const archer = { grain: 10, lumber: 5, gold: 5, levelRequirement: 0 };
const spearman = { grain: 5, lumber: 5, levelRequirement: 0 };
const swordsman = { grain: 20, lumber: 20, iron: 20, gold: 20, levelRequirement: 5 };
const horseman = { grain: 100, iron: 50, gold: 30, levelRequirement: 0 };
const knight = { grain: 100, iron: 100, gold: 50, levelRequirement: 5 };
const batteringRam = { lumber: 1500, iron: 500, gold: 150, levelRequirement: 5 };
const siegeTower = { lumber: 3000, iron: 500, gold: 300, levelRequirement: 10 };
const crossbowman = { grain: 50, lumber: 50, iron: 25, gold: 25, levelRequirement: 10 };
const ballista = { grain: 0, lumber: 400, iron: 100, gold: 100, levelRequirement: 15 };
const twoHandedSwordsman = { grain: 200, lumber: 0, iron: 100, gold: 100, levelRequirement: 20 };
const halberdier = { grain: 50, lumber: 50, iron: 50, gold: 50, levelRequirement: 15 };
const longbowman = { grain: 15, lumber: 50, iron: 10, gold: 100, levelRequirement: 10 };
const horseArcher = { grain: 100, lumber: 50, iron: 100, gold: 100, levelRequirement: 15 };
const trebuchet = { grain: 0, lumber: 750, iron: 100, gold: 0, levelRequirement: 20 };

const boot = { iron: 25, levelRequirement: 0 };
const bracer = { iron: 25, levelRequirement: 0 };
const helmet = { iron: 50, levelRequirement: 5 };
const lance = { lumber: 100, iron: 50, gold: 10, levelRequirement: 10 };
const longbow = { lumber: 50, iron: 10, levelRequirement: 10 };
const shield = { lumber: 50, iron: 25, levelRequirement: 5 };
const spear = { lumber: 100, iron: 5, levelRequirement: 0 };
const sword = { iron: 50, gold: 15, levelRequirement: 5 };

const barracksBaseCost = { lumber: 200, stone: 50, iron: 10, gold: 5 };
const blacksmithBaseCost = { lumber: 250, stone: 50, iron: 100, gold: 25 };
const trainingFieldBaseCost = { lumber: 100, stone: 100, iron: 5, gold: 5 };
const stablesBaseCost = { lumber: 500, stone: 100, iron: 50, gold: 50 };
const wallBaseCost = { lumber: 250, stone: 500, iron: 100, gold: 10 };
const workshopBaseCost = { lumber: 500, stone: 250, iron: 250, gold: 100 };
const spyGuildBaseCost = { lumber: 500, stone: 250, iron: 250, gold: 100 };

const farmBaseCost = { lumber: 500, stone: 50, iron: 10, gold: 25 };
const lumberCampBaseCost = { lumber: 500, stone: 100, iron: 5, gold: 5 };
const quarryBaseCost = { lumber: 500, stone: 100, iron: 100, gold: 100 };
const ironMineBaseCost = { lumber: 750, stone: 500, iron: 100, gold: 100 };
const goldMineBaseCost = { lumber: 1000, stone: 250, iron: 250, gold: 100 };

const spy = { grain: 100, lumber: 0, iron: 50, gold: 50, attack: 10, levelRequirement: 0 };
const sentry = { grain: 100, lumber: 0, iron: 25, gold: 15, defense: 10, levelRequirement: 5 };
const rope = { lumber: 50, iron: 25, attack: 30, levelRequirement: 0 };
const net = { lumber: 100, iron: 50, defense: 25, levelRequirement: 5 };
const spyglass = { lumber: 15, iron: 50, gold: 25, attack: 25, defense: 10, levelRequirement: 5 };
const poison = { grain: 100, gold: 100, attack: 50, levelRequirement: 10 };

const maxFarms = 4, maxGoldMines = 2, maxIronMines = 3, maxQuarries = 4, maxLumberCamps = 4;

buildingObject = {
    calcGoldTrainCost: function (trainees) {
        let cost = 0;

        cost += trainees.archers * archer.gold;
        cost += trainees.swordsmen * swordsman.gold;
        cost += trainees.horsemen * horseman.gold;
        cost += trainees.knights * knight.gold;
        cost += trainees.batteringRams * batteringRam.gold;
        cost += trainees.siegeTowers * siegeTower.gold;
        cost += trainees.crossbowmen * crossbowman.gold;
        cost += trainees.ballistas * ballista.gold;
        cost += trainees.twoHandedSwordsmen * twoHandedSwordsman.gold;
        cost += trainees.halberdiers * halberdier.gold;
        cost += trainees.longbowmen * longbowman.gold;
        cost += trainees.horseArchers * horseArcher.gold;
        cost += trainees.trebuchets * trebuchet.gold;
        cost += trainees.spies * spy.gold;
        cost += trainees.sentries * sentry.gold;
        if (isNaN(cost)) {
            return 0;
        }
        return Math.round(cost);
    },

    calcIronTrainCost: function (trainees) {
        let cost = 0;

        cost += trainees.swordsmen * swordsman.iron;
        cost += trainees.horsemen * horseman.iron;
        cost += trainees.knights * knight.iron;
        cost += trainees.batteringRams * batteringRam.iron;
        cost += trainees.siegeTowers * siegeTower.iron;
        cost += trainees.crossbowmen * crossbowman.iron;
        cost += trainees.ballistas * ballista.iron;
        cost += trainees.twoHandedSwordsmen * twoHandedSwordsman.iron;
        cost += trainees.halberdiers * halberdier.iron;
        cost += trainees.longbowmen * longbowman.iron;
        cost += trainees.horseArchers * horseArcher.iron;
        cost += trainees.trebuchets * trebuchet.iron;
        cost += trainees.spies * spy.iron;
        cost += trainees.sentries * sentry.iron;
        if (isNaN(cost)) {
            return 0;
        }
        return Math.round(cost);
    },

    calcGrainTrainCost: function (trainees) {
        let cost = 0;

        cost += trainees.archers * archer.grain;
        cost += trainees.spearmen * spearman.grain;
        cost += trainees.swordsmen * swordsman.grain;
        cost += trainees.horsemen * horseman.grain;
        cost += trainees.knights * knight.grain;
        cost += trainees.crossbowmen * crossbowman.grain;
        cost += trainees.twoHandedSwordsmen * twoHandedSwordsman.grain;
        cost += trainees.halberdiers * halberdier.grain;
        cost += trainees.longbowmen * longbowman.grain;
        cost += trainees.horseArchers * horseArcher.grain;
        cost += trainees.spies * spy.grain;
        cost += trainees.sentries * sentry.grain;
        if (isNaN(cost)) {
            return 0;
        }
        return Math.round(cost);
    },
    calcLumberTrainCost: function (trainees) {
        let cost = 0;

        cost += trainees.archers * archer.lumber;
        cost += trainees.spearmen * spearman.lumber;
        cost += trainees.swordsmen * swordsman.lumber;
        cost += trainees.batteringRams * batteringRam.lumber;
        cost += trainees.siegeTowers * siegeTower.lumber;
        cost += trainees.crossbowmen * crossbowman.lumber;
        cost += trainees.ballistas * ballista.lumber;
        cost += trainees.twoHandedSwordsmen * twoHandedSwordsman.lumber;
        cost += trainees.halberdiers * halberdier.lumber;
        cost += trainees.longbowmen * longbowman.lumber;
        cost += trainees.horseArchers * horseArcher.lumber;
        cost += trainees.trebuchets * trebuchet.lumber;
        cost += trainees.spies * spy.lumber;
        cost += trainees.sentries * sentry.lumber;
        if (isNaN(cost)) {
            return 0;
        }
        return Math.round(cost);
    },
    calcLumberCraftCost: function (armorOrder) {
        let cost = 0;

        cost += armorOrder.lances * lance.lumber;
        cost += armorOrder.longbows * longbow.lumber;
        cost += armorOrder.shields * shield.lumber;
        cost += armorOrder.spears * spear.lumber;
        cost += armorOrder.ropes * rope.lumber;
        cost += armorOrder.nets * net.lumber;
        cost += armorOrder.spyglasses * spyglass.lumber;

        if (isNaN(cost)) {
            return 0;
        }
        return Math.round(cost);
    },
    calcGrainCraftCost: function (armorOrder) {
        return Math.round(armorOrder.poisons * poison.grain);
    },
    calcIronCraftCost: function (armorOrder) {
        let cost = 0;

        cost += armorOrder.boots * boot.iron;
        cost += armorOrder.bracers * bracer.iron;
        cost += armorOrder.helmets * helmet.iron;
        cost += armorOrder.lances * lance.iron;
        cost += armorOrder.longbows * longbow.iron;
        cost += armorOrder.shields * shield.iron;
        cost += armorOrder.spears * spear.iron;
        cost += armorOrder.swords * sword.iron;
        cost += armorOrder.ropes * rope.iron;
        cost += armorOrder.nets * net.iron;
        cost += armorOrder.spyglasses * spyglass.iron;
        if (isNaN(cost)) {
            return 0;
        }
        return Math.round(cost);
    },
    //pass object instead
    calcGoldCraftCost: function (armorOrder) {
        let cost = 0;

        cost += armorOrder.lances * lance.gold;
        cost += armorOrder.swords * sword.gold;
        cost += armorOrder.spyglasses * spyglass.gold;
        cost += armorOrder.poisons * poison.gold;
        if (isNaN(cost)) {
            return 0;
        }
        return Math.round(cost);
    },
    calcTotalCraftCost: function (armorOrder) {

        //hur fungerar med test?
        let grainCost = 0;
        if (armorOrder.poisons > 0) {
            grainCost = armorOrder.poisons * poison.grain;
        }

        const lumberCost = buildingObject.calcLumberCraftCost(armorOrder);
        const ironCost = buildingObject.calcIronCraftCost(armorOrder);
        const goldCost = buildingObject.calcGoldCraftCost(armorOrder);

        return { grainCost: grainCost, lumberCost: lumberCost, ironCost: ironCost, goldCost: goldCost };
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
            case "spyGuild":
                cost = spyGuildBaseCost.lumber;
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
            case "spyGuild":
                cost = spyGuildBaseCost.stone;
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
            case "spyGuild":
                cost = spyGuildBaseCost.iron;
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
            case "spyGuild":
                cost = spyGuildBaseCost.gold;
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
        const data = { currentWallHealth: (user.wallLevel + 1) * 100 };
        await setDatabaseValue(client, user.username, data);
    },
    repairWallHealth: async function (client, user) {
        const data = { currentWallHealth: user.wallLevel * 100 };
        await setDatabaseValue(client, user.username, data);
    },
    repairWallHealthPartially: async function (client, user) {
        const data = { currentWallHealth: (user.currentWallHealth + user.wallLevel * 10) };
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
            await incArmorValues(client, user.username, craftingOrder);
            await resourceObject.removeResources(client, user.username, totalCost.goldCost, totalCost.lumberCost, 0, totalCost.ironCost, 0, 0, 0);
            return true;
        } else {
            console.log("Can't afford armor");
            return false;
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
                if (resourceId <= maxFarms - 1) {
                    resource = "farms"
                    upgradedFieldData = user.farms;
                    resourceLevel = upgradedFieldData[resourceId]
                    upgradedFieldData[resourceId]++;
                    upgradedFieldData = { farms: upgradedFieldData }

                }
                break;
            case "lumbercamp":
                if (resourceId <= maxLumberCamps - 1) {
                    resource = "lumberCamp"
                    upgradedFieldData = user.lumberCamps;
                    resourceLevel = upgradedFieldData[resourceId]
                    upgradedFieldData[resourceId]++;
                    upgradedFieldData = { lumberCamps: upgradedFieldData }
                }
                break;
            case "quarry":
                if (resourceId <= maxQuarries - 1) {
                    resource = "quarry"
                    upgradedFieldData = user.quarries;
                    resourceLevel = upgradedFieldData[resourceId]
                    upgradedFieldData[resourceId]++;
                    upgradedFieldData = { quarries: upgradedFieldData }
                }
                break;
            case "ironMine":
                if (resourceId <= maxIronMines - 1) {
                    resource = "ironMines";
                    upgradedFieldData = user.ironMines;
                    resourceLevel = upgradedFieldData[resourceId]
                    upgradedFieldData[resourceId]++;
                    upgradedFieldData = { ironMines: upgradedFieldData }
                }
                break;
            case "goldMine":
                if (resourceId <= maxGoldMines - 1) {
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
            return true;
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
            case "spyGuild":
                level = user.spyGuildLevel;
                buildingName = "spyGuildLevel";
                break;
            default:
                console.debug(type, "Error")
        }
        console.log(buildingName, type)

        if (level >= 20) {
            console.debug("Can't upgrade beyond level 20")
            return false;
        } else {
            const totalCost = await buildingObject.calculateTotalBuildingUpgradeCost(type, level)
            if (await checkIfCanAfford(client, user.username, totalCost.goldCost, totalCost.lumberCost, totalCost.stoneCost, totalCost.ironCost, 0, 0, 0)) {
                await buildingObject.upgradeBuilding(client, user.username, buildingName);
                await removeResources(client, user.username, totalCost.goldCost, totalCost.lumberCost, totalCost.stoneCost, totalCost.ironCost, 0, 0, 0);
                if (type === "wall") {
                    await buildingObject.restoreWallHealth(client, user);
                }
                return true;
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
    //todo split up for check units/armor only, or barracks/stables etc only
    validateRequiredProductionLevel: function (user, data) {
        if (data.crossbowmen > 0 && user.barracksLevel < crossbowman.levelRequirement) {
            return false;
        }
        if (data.swordsmen > 0 && user.barracksLevel < swordsman.levelRequirement) {
            return false;
        }
        if (data.twoHandedSwordsmen > 0 && user.barracksLevel < twoHandedSwordsman.levelRequirement) {
            return false;
        }
        if (data.halberdiers > 0 && user.barracksLevel < halberdier.levelRequirement) {
            return false;
        }
        if (data.longbowmen > 0 && user.barracksLevel < longbowman.levelRequirement) {
            return false;
        }
        if (data.knights > 0 && user.stablesLevel < knight.levelRequirement) {
            return false;
        }
        if (data.horseArchers > 0 && user.stablesLevel < horseArcher.levelRequirement) {
            return false;
        }
        if (data.batteringrams > 0 && user.workshopLevel < batteringRam.levelRequirement) {
            return false;
        }
        if (data.siegetowers > 0 && user.workshopLevel < siegeTower.levelRequirement) {
            return false;
        }
        if (data.ballistas > 0 && user.workshopLevel < ballista.levelRequirement) {
            return false;
        }
        if (data.trebuchets > 0 && user.workshopLevel < trebuchet.levelRequirement) {
            return false;
        }
        if (data.helmets > 0 && user.blacksmithLevel < helmet.levelRequirement) {
            return false;
        }
        if (data.lances > 0 && user.blacksmithLevel < lance.levelRequirement) {
            return false;
        }
        if (data.longbows > 0 && user.blacksmithLevel < longbow.levelRequirement) {
            return false;
        }
        if (data.shields > 0 && user.blacksmithLevel < shield.levelRequirement) {
            return false;
        }
        if (data.swords > 0 && user.blacksmithLevel < sword.levelRequirement) {
            return false;
        }
        if (data.sentries > 0 && user.spyGuildLevel < sentry.levelRequirement) {
            return false;
        }
        if (data.nets > 0 && user.spyGuildLevel < net.levelRequirement) {
            return false;
        }
        if (data.spyglasses > 0 && user.spyGuildLevel < spyglass.levelRequirement) {
            return false;
        }
        if (data.poisons > 0 && user.spyGuildLevel < poison.levelRequirement) {
            return false;
        }
        return true;
    }
};

module.exports = buildingObject;