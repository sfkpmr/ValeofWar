const { setDatabaseValue, getArmyByEmail, getArmoryByEmail, setTroopsValue } = require("../modules/database.js");
const { stealResources, loseResources } = require("../modules/resources.js");
const { lowerWallHealth } = require("../modules/buildings.js");
const { ObjectId } = require('mongodb');

const archer = { attackDamage: 10, defenseDamage: 15 };
const ballista = { attackDamage: 150, defenseDamage: 300 };
const crossbowman = { attackDamage: 10, defenseDamage: 50 };
const halberdier = { attackDamage: 25, defenseDamage: 25 };
const horseArcher = { attackDamage: 50, defenseDamage: 10 };
const longbowman = { attackDamage: 25, defenseDamage: 25 };
const spearman = { attackDamage: 10, defenseDamage: 20 };
const swordsman = { attackDamage: 20, defenseDamage: 20 };
const trebuchet = { attackDamage: 250 };
const twoHandedSwordsman = { attackDamage: 50, defenseDamage: 20 };
const horseman = { attackDamage: 15, defenseDamage: 5 };
const knight = { attackDamage: 25, defenseDamage: 15 };
const batteringRam = { attackDamage: 75 };
const siegeTower = { attackDamage: 150 };

const boot = { attackDamage: 10, defenseDamage: 10 };
const bracer = { attackDamage: 5, defenseDamage: 10 };
const helmet = { attackDamage: 15, defenseDamage: 15 };
const longbow = { attackDamage: 20, defenseDamage: 30 };
const lance = { attackDamage: 25, defenseDamage: 10 };
const shield = { attackDamage: 10, defenseDamage: 20 };
const spear = { attackDamage: 10, defenseDamage: 25 };
const sword = { attackDamage: 10, defenseDamage: 10 };

const spy = { grain: 100, lumber: 0, iron: 50, gold: 50, attack: 10, levelRequirement: 0 };
const sentry = { grain: 100, lumber: 0, iron: 25, gold: 15, defense: 10, levelRequirement: 5 };
const rope = { iron: 50, attack: 30, levelRequirement: 0 };
const net = { iron: 50, defense: 25, levelRequirement: 5 };
const spyglass = { lumber: 0, iron: 75, gold: 10, attack: 25, defense: 10, levelRequirement: 5 };
const poison = { lumber: 0, iron: 0, gold: 100, attack: 50, levelRequirement: 10 };

attackObject = {
    getAttackLog: async function (client, ObjectId) {
        const result = await client.db("gamedb").collection("attacks").findOne({ "_id": ObjectId });
        if (result === null) {
            return false;
        } else {
            return result;
        }
    },
    createAttackLog: async function (client, data) {
        result = await client.db("gamedb").collection("attacks").insertOne(data);
        return result.insertedId;
    },
    calculateAttack: function (army, armory) {

        const archers = army.archers;
        const spearmen = army.spearmen;
        const horsemen = army.horsemen;
        const knights = army.knights;
        const swordsmen = army.swordsmen;
        const crossbowmen = army.crossbowmen;
        const twoHandedSwordsmen = army.twoHandedSwordsmen;
        const halberdiers = army.halberdiers;
        const longbowmen = army.longbowmen;
        const horseArchers = army.horseArchers;
        const totalTroops = archers + spearmen + horsemen + knights + swordsmen + crossbowmen + twoHandedSwordsmen + halberdiers + longbowmen + horseArchers;
        const bowTroops = archers + crossbowmen + longbowmen + horseArchers;
        const shieldTroops = swordsmen + knights;
        const swordsTroops = swordsmen + twoHandedSwordsmen + knights;

        const boots = armory.boots;
        const bracers = armory.bracers;
        const helmets = armory.helmets;
        const lances = armory.lances;
        const longbows = armory.longbows;
        const shields = armory.shields;
        const spears = armory.spears;
        const swords = armory.swords;

        let totalDamage = archers * archer.attackDamage;
        totalDamage += spearmen * spearman.attackDamage;
        totalDamage += swordsmen * swordsman.attackDamage;
        totalDamage += horsemen * horseman.attackDamage;
        totalDamage += knights * knight.attackDamage;
        totalDamage += army.batteringRams * batteringRam.attackDamage;
        totalDamage += army.siegeTowers * siegeTower.attackDamage;
        totalDamage += crossbowmen * crossbowman.attackDamage;
        totalDamage += twoHandedSwordsmen * twoHandedSwordsman.attackDamage;
        totalDamage += army.ballistas * ballista.attackDamage;
        totalDamage += halberdiers * halberdier.attackDamage;
        totalDamage += longbowmen * longbowman.attackDamage;
        totalDamage += horseArchers * horseArcher.attackDamage;
        totalDamage += army.trebuchets * trebuchet.attackDamage;

        if (totalTroops > boots) {
            totalDamage += boots * boot.attackDamage;
        } else {
            totalDamage += totalTroops * boot.attackDamage;
        }
        if (bowTroops > bracers) {
            totalDamage += bracers * bracer.attackDamage;
        } else {
            totalDamage += bowTroops * bracer.attackDamage;
        }
        if (totalTroops > helmets) {
            totalDamage += helmets * helmet.attackDamage;
        } else {
            totalDamage += totalTroops * helmet.attackDamage;
        }
        if (knights > lances) {
            totalDamage += lances * lance.attackDamage;
        } else {
            totalDamage += knights * lance.attackDamage;
        }
        if (bowTroops > longbows) {
            totalDamage += longbows * longbow.attackDamage;
        } else {
            totalDamage += bowTroops * longbow.attackDamage;
        }
        if (shieldTroops > shields) {
            totalDamage += boots * shield.attackDamage;
        } else {
            totalDamage += shieldTroops * shield.attackDamage;
        }
        if (spearmen > spears) {
            totalDamage += spears * spear.attackDamage;
        } else {
            totalDamage += spearmen * spear.attackDamage;
        }
        if (swordsTroops > swords) {
            totalDamage += swords * sword.attackDamage;
        } else {
            totalDamage += swordsTroops * sword.attackDamage;
        }

        return totalDamage;
    },

    calculateDefense: function (defender, army, armory) {

        //todo losing armor
        const archers = army.archers;
        const spearmen = army.spearmen;
        const horsemen = army.horsemen;
        const knights = army.knights;
        const swordsmen = army.swordsmen;
        const crossbowmen = army.crossbowmen;
        const twoHandedSwordsmen = army.twoHandedSwordsmen;
        const ballistas = army.ballistas;
        const halberdiers = army.halberdiers;
        const longbowmen = army.longbowmen;
        const horseArchers = army.horseArchers;
        const totalTroops = archers + spearmen + horsemen + knights + swordsmen + crossbowmen + twoHandedSwordsmen + halberdiers + longbowmen + horseArchers;
        const bowTroops = archers + crossbowmen + longbowmen + horseArchers;
        const shieldTroops = swordsmen + knights;
        const swordsTroops = swordsmen + twoHandedSwordsmen + knights;

        const boots = armory.boots;
        const bracers = armory.bracers;
        const helmets = armory.helmets;
        const lances = armory.lances;
        const longbows = armory.longbows;
        const shields = armory.shields;
        const spears = armory.spears;
        const swords = armory.swords;

        let totalDamage = archers * archer.defenseDamage;
        totalDamage += spearmen * spearman.defenseDamage;
        totalDamage += swordsmen * swordsman.defenseDamage;
        totalDamage += horsemen * horseman.defenseDamage;
        totalDamage += knights * knight.defenseDamage;
        totalDamage += crossbowmen * crossbowman.defenseDamage;
        totalDamage += twoHandedSwordsmen * twoHandedSwordsman.defenseDamage;
        totalDamage += ballistas * ballista.defenseDamage;
        totalDamage += halberdiers * halberdier.defenseDamage;
        totalDamage += longbowmen * longbowman.defenseDamage;
        totalDamage += horseArchers * horseArcher.defenseDamage;

        if (totalTroops > boots) {
            totalDamage += boots * boot.defenseDamage;
        } else {
            totalDamage += totalTroops * boot.defenseDamage;
        }
        if (bowTroops > bracers) {
            totalDamage += bracers * bracer.defenseDamage;
        } else {
            totalDamage += bowTroops * bracer.defenseDamage;
        }
        if (totalTroops > helmets) {
            totalDamage += helmets * helmet.defenseDamage;
        } else {
            totalDamage += totalTroops * helmet.defenseDamage;
        }
        if (knights > lances) {
            totalDamage += lances * lance.defenseDamage;
        } else {
            totalDamage += knights * lance.defenseDamage;
        }
        if (bowTroops > longbows) {
            totalDamage += longbows * longbow.defenseDamage;
        } else {
            totalDamage += bowTroops * longbow.defenseDamage;
        }
        if (shieldTroops > shields) {
            totalDamage += boots * shield.defenseDamage;
        } else {
            totalDamage += shieldTroops * shield.defenseDamage;
        }
        if (spearmen > spears) {
            totalDamage += spears * spear.defenseDamage;
        } else {
            totalDamage += spearmen * spear.defenseDamage;
        }
        if (swordsTroops > swords) {
            totalDamage += swords * sword.defenseDamage;
        } else {
            totalDamage += swordsTroops * sword.defenseDamage;
        }

        let wallBonus = (1 + (defender.wallLevel / 10));
        if (defender.currentWallHealth === 0) {
            wallBonus = 1;
        }

        return Math.round(totalDamage * wallBonus);
    },

    armyLosses: async function (client, army, divider) {

        const archers = army.archers;
        const spearmen = army.spearmen;
        const swordsmen = army.swordsmen;
        const horsemen = army.horsemen;
        const knights = army.knights;
        const batteringRams = army.batteringRams;
        const siegeTowers = army.siegeTowers;

        const crossbowmen = army.crossbowmen;
        const halberdiers = army.halberdiers;
        const longbowmen = army.longbowmen;
        const twoHandedSwordsmen = army.twoHandedSwordsmen;
        const ballistas = army.ballistas;
        const trebuchets = army.trebuchets;
        const horseArchers = army.horseArchers;

        const totalTroops = archers + spearmen + swordsmen + horsemen + knights + batteringRams + siegeTowers + crossbowmen + halberdiers + longbowmen + twoHandedSwordsmen + ballistas + trebuchets + horseArchers;

        const battleLosses = Math.round(totalTroops / divider);

        let lossesCounter = battleLosses;
        console.log("-----------", battleLosses, lossesCounter, totalTroops)

        if (lossesCounter > batteringRams) {
            potentialBatteringramLosses = batteringRams;
        } else {
            potentialBatteringramLosses = lossesCounter;
        }
        const batteringramLosses = Math.floor(Math.random() * potentialBatteringramLosses);
        lossesCounter = lossesCounter - batteringramLosses;
        if (lossesCounter > siegeTowers) {
            potentialSiegtowerLosses = siegeTowers;
        } else {
            potentialSiegtowerLosses = lossesCounter;
        }
        const siegetowerLosses = Math.floor(Math.random() * potentialSiegtowerLosses);
        lossesCounter = lossesCounter - siegetowerLosses;
        if (lossesCounter > spearmen) {
            potentialSpearmenLosses = spearmen;
        } else {
            potentialSpearmenLosses = lossesCounter;
        }
        const spearmenLosses = Math.floor(Math.random() * potentialSpearmenLosses);
        lossesCounter = lossesCounter - spearmenLosses;
        if (lossesCounter > twoHandedSwordsmen) {
            potentialTwoHandedSwordsmenLosses = twoHandedSwordsmen;
        } else {
            potentialTwoHandedSwordsmenLosses = lossesCounter;
        }
        const twoHandedSwordsmenLosses = Math.floor(Math.random() * potentialTwoHandedSwordsmenLosses);
        lossesCounter = lossesCounter - twoHandedSwordsmenLosses;
        if (lossesCounter > halberdiers) {
            potentialHalberdiersLosses = halberdiers;
        } else {
            potentialHalberdiersLosses = lossesCounter;
        }
        const halberdiersLosses = Math.floor(Math.random() * potentialHalberdiersLosses);
        lossesCounter = lossesCounter - halberdiersLosses;
        if (lossesCounter > swordsmen) {
            potentialSwordsmenLosses = swordsmen;
        } else {
            potentialSwordsmenLosses = lossesCounter;
        }
        const swordsmenLosses = Math.floor(Math.random() * potentialSwordsmenLosses);
        lossesCounter = lossesCounter - swordsmenLosses;
        if (lossesCounter > horsemen) {
            potentialHorsemenLosses = horsemen;
        } else {
            potentialHorsemenLosses = lossesCounter;
        }
        const horsemenLosses = Math.floor(Math.random() * potentialHorsemenLosses);
        lossesCounter = lossesCounter - horsemenLosses;
        if (lossesCounter > knights) {
            potentialKnightsLosses = knights;
        } else {
            potentialKnightsLosses = lossesCounter;
        }
        const knightsLosses = Math.floor(Math.random() * potentialKnightsLosses);
        lossesCounter = lossesCounter - knightsLosses;
        if (lossesCounter > crossbowmen) {
            potentialCrossbowmenLosses = crossbowmen;
        } else {
            potentialCrossbowmenLosses = lossesCounter;
        }
        const crossbowmenLosses = Math.floor(Math.random() * potentialCrossbowmenLosses);
        lossesCounter = lossesCounter - crossbowmenLosses;
        if (lossesCounter > horseArchers) {
            potentialHorseArchersLosses = horseArchers;
        } else {
            potentialHorseArchersLosses = lossesCounter;
        }
        const horseArchersLosses = Math.floor(Math.random() * potentialHorseArchersLosses);
        lossesCounter = lossesCounter - horseArchersLosses;
        if (lossesCounter > archers) {
            potentialArcherLosses = archers;
        } else {
            potentialArcherLosses = lossesCounter;
        }
        const archerLosses = Math.floor(Math.random() * potentialArcherLosses);
        lossesCounter = lossesCounter - archerLosses;
        if (lossesCounter > longbowmen) {
            potentialLongbowmenLosses = longbowmen;
        } else {
            potentialLongbowmenLosses = lossesCounter;
        }
        const longbowmenLosses = Math.floor(Math.random() * potentialLongbowmenLosses);
        lossesCounter = lossesCounter - longbowmenLosses;
        if (lossesCounter > trebuchets) {
            potentialTrebuchetLosses = trebuchets;
        } else {
            potentialTrebuchetLosses = lossesCounter;
        }
        const trebuchetLosses = Math.floor(Math.random() * potentialTrebuchetLosses);
        lossesCounter = lossesCounter - trebuchetLosses;
        if (lossesCounter > ballistas) {
            potentialBallistasLosses = ballistas;
        } else {
            potentialBallistasLosses = lossesCounter;
        }
        const ballistasLosses = Math.floor(Math.random() * potentialBallistasLosses);
        lossesCounter = lossesCounter - ballistasLosses;

        // console.log(army.username + " lost " + archerLosses, spearmenLosses, swordsmenLosses, horsemenLosses, knightsLosses, batteringramLosses, siegetowerLosses, crossbowmenLosses,
        //     halberdiersLosses, longbowmenLosses, twoHandedSwordsmenLosses, ballistasLosses, trebuchetLosses, horseArchersLosses);

        let newArchers = archers - archerLosses;
        let newSpearmen = spearmen - spearmenLosses;
        let newSwordsmen = swordsmen - swordsmenLosses;
        let newHorsemen = horsemen - horsemenLosses;
        let newKnights = knights - knightsLosses;
        let newBatteringRams = batteringRams - batteringramLosses;
        let newSiegeTowers = siegeTowers - siegetowerLosses;
        let newCrossbowmen = crossbowmen - crossbowmenLosses;
        let newHalberdiers = halberdiers - halberdiersLosses;
        let newLongbowmen = longbowmen - longbowmenLosses;
        let newTwoHandedSwordsmen = twoHandedSwordsmen - twoHandedSwordsmenLosses;
        let newBallistas = ballistas - ballistasLosses;
        let newTrebuchets = trebuchets - trebuchetLosses;
        let newHorseArchers = horseArchers - horseArchersLosses;

        if (newArchers < 0) {
            newArchers = 0;
        }
        if (newSpearmen < 0) {
            newSpearmen = 0;
        }
        if (newSwordsmen < 0) {
            newSwordsmen = 0;
        }
        if (newHorsemen < 0) {
            newHorsemen = 0;
        }
        if (newKnights < 0) {
            newKnights = 0;
        }
        if (newBatteringRams < 0) {
            newBatteringRams = 0;
        }
        if (newSiegeTowers < 0) {
            newSiegeTowers = 0;
        }
        if (newCrossbowmen < 0) {
            newCrossbowmen = 0;
        }
        if (newHalberdiers < 0) {
            newHalberdiers = 0;
        }
        if (newLongbowmen < 0) {
            newLongbowmen = 0;
        }
        if (newTwoHandedSwordsmen < 0) {
            newTwoHandedSwordsmen = 0;
        }
        if (newBallistas < 0) {
            newBallistas = 0;
        }
        if (newTrebuchets < 0) {
            newTrebuchets = 0;
        }
        if (newHorseArchers < 0) {
            newHorseArchers = 0;
        }

        console.log(army.username, newArchers, newSpearmen, newSwordsmen, newHorsemen, newKnights, newBatteringRams, newSiegeTowers, newBallistas, newCrossbowmen, newTwoHandedSwordsmen, newLongbowmen, newHorseArchers, newHalberdiers, newTrebuchets)

        const data = {
            "archers": newArchers, "spearmen": newSpearmen, "swordsmen": newSwordsmen, "horsemen": newHorsemen, "knights": newKnights, "batteringRams": newBatteringRams, "siegeTowers": newSiegeTowers,
            "crossbowmen": newCrossbowmen, "ballistas": newBallistas, "twoHandedSwordsmen": newTwoHandedSwordsmen, "longbowmen": newLongbowmen, "horseArchers": newHorseArchers, "trebuchets": newTrebuchets, "halberdiers": newHalberdiers
        };

        await setTroopsValue(client, army.username, data);

        return battleLosses;
    },
    calcResourceDivider: function (closeness) {
        let value;
        if (closeness <= 0.1) {
            value = 100;
        } else if (closeness <= 0.2) {
            value = 80;
        } else if (closeness <= 0.4) {
            value = 20;
        } else if (closeness <= 0.6) {
            value = 5;
        } else if (closeness <= 0.8) {
            value = 20;
        } else if (closeness <= 0.9) {
            value = 10;
        } else {
            value = 100;
        }
        return value;
    },
    calcattackTroopDivider: function (closeness) {
        let value;
        if (closeness <= 0.1) {
            value = 5;
        } else if (closeness <= 0.2) {
            value = 7;
        } else if (closeness <= 0.4) {
            value = 10;
        } else if (closeness <= 0.6) {
            value = 5;
        } else if (closeness <= 0.8) {
            value = 20;
        } else if (closeness <= 0.9) {
            value = 30;
        } else {
            value = 50;
        }
        return value;
    },
    calcdefenseTroopDivider: function (closeness) {
        let value;
        if (closeness <= 0.1) {
            value = 100;
        } else if (closeness <= 0.2) {
            value = 80;
        } else if (closeness <= 0.4) {
            value = 60;
        } else if (closeness <= 0.6) {
            value = 5;
        } else if (closeness <= 0.8) {
            value = 10;
        } else if (closeness <= 0.9) {
            value = 10;
        } else {
            value = 20;
        }
        return value;
    },
    attackFunc: async function (client, attacker, defender) {
        const attackingArmy = await getArmyByEmail(client, attacker.email)
        const defendingArmy = await getArmyByEmail(client, defender.email)
        const attackingArmory = await getArmoryByEmail(client, attacker.email)
        const defendingArmory = await getArmoryByEmail(client, defender.email)
        const attackDamage = attackObject.calculateAttack(attackingArmy, attackingArmory);
        const defenseDamage = attackObject.calculateDefense(defender, defendingArmy, defendingArmory);

        console.log("Total defense: " + defenseDamage + " Total attack: " + attackDamage);

        const closeness = attackObject.calcCloseness(attackDamage, defenseDamage);
        const resourceDivider = attackObject.calcResourceDivider(closeness);
        const attackTroopDivider = attackObject.calcattackTroopDivider(closeness);
        const defenseTroopDivider = attackObject.calcdefenseTroopDivider(closeness);

        const wallBonus = attackObject.calcWallBonus(defender);

        const goldLoot = Math.round((defender.gold / resourceDivider) * wallBonus);
        const lumberLoot = Math.round((defender.lumber / resourceDivider) * wallBonus);
        const stoneLoot = Math.round((defender.stone / resourceDivider) * wallBonus);
        const grainLoot = Math.round((defender.grain / resourceDivider) * wallBonus);
        const ironLoot = Math.round((defender.iron / resourceDivider) * wallBonus);

        stealResources(client, attacker.username, goldLoot, lumberLoot, stoneLoot, ironLoot, grainLoot);
        loseResources(client, defender.username, goldLoot, lumberLoot, stoneLoot, ironLoot, grainLoot);

        const attackerLosses = await attackObject.armyLosses(client, attackingArmy, attackTroopDivider);
        const defenderLosses = await attackObject.armyLosses(client, defendingArmy, defenseTroopDivider);

        const wallDamage = Math.floor(Math.random() * 5);
        await lowerWallHealth(client, defender, wallDamage);
        const data = {
            "_id": new ObjectId(), "time": new Date(), "attacker": attacker.username, "defender": defender.username, "attackDamage": attackDamage, "defenseDamage": defenseDamage, "attackerLosses": attackerLosses, "defenderLosses": defenderLosses, "goldLoot": goldLoot,
            "grainLoot": grainLoot, "lumberLoot": lumberLoot, "stoneLoot": stoneLoot, "ironLoot": ironLoot, "wallDamage": wallDamage
        };

        const result = await attackObject.createAttackLog(client, data);

        return result;

    },
    calcCloseness: function (attackDamage, defenseDamage) {
        return attackDamage / (attackDamage + defenseDamage);
    },
    calcWallBonus: function (defender) {
        return 1 - ((defender.wallLevel * 2.5) * 0.01);
    },
    calcSpyAttack: function (defender, army, armory) {

        let damage = 0;
        const spies = army.spies;

        damage += spies * spy.attack;

        if (spies > armory.ropes) {
            damage += spies * rope.attack;
        } else {
            damage += armory.ropes * rope.attack;
        }
        if (spies > armory.spyglasses) {
            damage += spies * spyglass.attack;
        } else {
            damage += armory.spyglasses * spyglass.attack;
        }
        if (spies > armory.poisons) {
            damage += spies * poison.attack;
        } else {
            damage += armory.poisons * poison.attack;
        }
        const spyGuildBonus = 1 + (defender.spyGuildLevel / 10);
        return damage = damage * spyGuildBonus;

    },
    calcSpyDefense: function (defender, army, armory) {

        let damage = 0;
        const sentries = army.sentries;

        damage += sentries * sentry.defense;

        if (sentries > armory.nets) {
            damage += sentries * net.defense;
        } else {
            damage += armory.nets * net.defense;
        }
        if (sentries > armory.spyglasses) {
            damage += sentries * spyglass.defense;
        } else {
            damage += armory.spyglasses * spyglass.defense;
        }

        const spyGuildBonus = 1 + (defender.spyGuildLevel / 10);
        return damage = damage * spyGuildBonus;

    }
};

module.exports = attackObject;