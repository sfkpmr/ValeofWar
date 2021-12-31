const e = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const { setDatabaseValue } = require("../modules/database.js");
const { stealResources, loseResources } = require("../modules/resources.js");
const { lowerWallHealth } = require("../modules/buildings.js");

archer = { attackDamage: 10, defenseDamage: 10 };
spearman = { attackDamage: 10, defenseDamage: 10 };
swordsman = { attackDamage: 20, defenseDamage: 20 };
horseman = { attackDamage: 5, defenseDamage: 5 };
knight = { attackDamage: 20, defenseDamage: 20 };
batteringram = { attackDamage: 25 };
siegetower = { attackDamage: 50 };

boot = { attackDamage: 10, defenseDamage: 10 };
bracer = { attackDamage: 5, defenseDamage: 10 };
helmet = { attackDamage: 15, defenseDamage: 15 };
longbow = { attackDamage: 20, defenseDamage: 30 };
lance = { attackDamage: 25, defenseDamage: 10 };
shield = { attackDamage: 10, defenseDamage: 20 };
spear = { attackDamage: 10, defenseDamage: 25 };
sword = { attackDamage: 10, defenseDamage: 10 };

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
    getInvolvedAttackLogs: async function (client, username) {
        const cursor = client.db("gamedb").collection("attacks").find({ $or: [{ "attacker": username }, { "defender": username }] })
        const result = await cursor.toArray();
        if (result[0] === undefined) {
            return false;
        }
        return result;
    },
    calculateAttack: function (attacker) {

        //todo rename variable to user?
        const archers = attacker.archers;
        const spearmen = attacker.spearmen;
        const horsemen = attacker.horsemen;
        const knights = attacker.knights;
        const swordsmen = attacker.swordsmen;
        var boots = attacker.boots;
        var bracers = attacker.bracers;
        var helmets = attacker.helmets;
        var lances = attacker.lances;
        var longbows = attacker.longbows;
        var shields = attacker.shields;
        var spears = attacker.spears;
        var swords = attacker.swords;
        var batteringrams = attacker.batteringrams * 10;
        var siegetowers = attacker.siegetowers * 25;

        if (boots == undefined || boots == null) {
            boots = 0;
        }
        if (bracers == undefined || bracers == null) {
            bracers = 0;
        }
        if (helmets == undefined || helmets == null) {
            helmets = 0;
        }
        if (lances == undefined || lances == null) {
            lances = 0;
        }
        if (longbows == undefined || longbows == null) {
            longbows = 0;
        }
        if (shields == undefined || shields == null) {
            shields = 0;
        }
        if (spears == undefined || spears == null) {
            spears = 0;
        }
        if (swords == undefined || swords == null) {
            swords = 0;
        }
        if (batteringrams == undefined || batteringrams == null) {
            batteringrams = 0;
        }
        if (siegetowers == undefined || siegetowers == null) {
            siegetowers = 0;
        }

        var archerDamage = 0, spearmenDamage = 0, swordsmenDamage = 0, horsemenDamage = 0, knightsDamage = 0;
        const bootsDamage = boot.attackDamage, bracersDamage = bracer.attackDamage, helmetDamage = helmet.attackDamage, longbowDamage = longbow.attackDamage, lanceDamage = lance.attackDamage, shieldDamage = shield.attackDamage, spearDamage = spear.attackDamage, swordDamage = sword.attackDamage;
        if (archers !== undefined && archers !== null) {
            archerDamage = archers * archer.attackDamage;
            if (boots >= archers) {
                archerDamage += archers * bootsDamage;
                boots = boots - archers;
            } else {
                archerDamage += boots * bootsDamage;
                boots = 0;
            }
            if (bracers >= archers) {
                archerDamage += archers * bracersDamage;
                bracers = bracers - archers;
            } else {
                archerDamage += bracers * bracersDamage;
                bracers = 0;
            }
            if (helmets >= archers) {
                archerDamage += archers * helmetDamage;
                helmets = helmets - archers;
            } else {
                archerDamage += helmets * helmetDamage;
                helmets = 0;
            }

            if (longbows >= archers) {
                archerDamage += archers * longbowDamage;
                longbows = longbows - archers;
            } else {
                archerDamage += longbows * longbowDamage;
                longbows = 0;
            }
        } if (spearmen !== undefined && spearmen !== null) {
            spearmenDamage = spearmen * spearman.attackDamage;
            if (boots >= spearmen) {
                spearmenDamage += spearmen * bootsDamage;
                boots = boots - spearmen;
            } else {
                spearmenDamage += boots * bootsDamage;
                boots = 0;
            }
            if (helmets >= spearmen) {
                spearmenDamage += spearmen * helmetDamage;
                helmets = helmets - spearmen;
            } else {
                spearmenDamage += helmets * helmetDamage;
                helmets = 0;
            }
            if (spears >= spearmen) {
                spearmenDamage += spearmen * spearDamage;
                spears = spears - spearmen;
            } else {
                spearmenDamage += spears * spearDamage;
                spears = 0;
            }
        } if (swordsmen !== undefined && swordsmen !== null) {
            swordsmenDamage = swordsmen * swordsman.attackDamage;
            if (boots >= swordsmen) {
                swordsmenDamage += swordsmen * bootsDamage;
                boots = boots - swordsmen;
            } else {
                swordsmenDamage += boots * bootsDamage;
                boots = 0;
            }
            if (helmets >= swordsmen) {
                swordsmenDamage += swordsmen * helmetDamage;
                helmets = helmets - swordsmen;
            } else {
                swordsmenDamage += helmets * helmetDamage;
                helmets = 0;
            }
            if (swords >= swordsmen) {
                swordsmenDamage += swordsmen * swordDamage;
                swords = swords - swordsmen;
            } else {
                swordsmenDamage += swords * swordDamage;
                swords = 0;
            }
            if (shields >= swordsmen) {
                swordsmenDamage += swordsmen * shieldDamage;
                shields = shields - swordsmen;
            } else {
                swordsmenDamage += shields * shieldDamage;
                shields = 0;
            }
        } if (horsemen !== undefined && horsemen !== null) {
            horsemenDamage = horsemen * horseman.attackDamage;
            if (boots >= horsemen) {
                horsemenDamage += horsemen * bootsDamage;
                boots = boots - horsemen;
            } else {
                horsemenDamage += boots * bootsDamage;
                boots = 0;
            }
            if (helmets >= horsemen) {
                horsemenDamage += horsemen * helmetDamage;
                helmets = helmets - horsemen;
            } else {
                horsemenDamage += helmets * helmetDamage;
                helmets = 0;
            }
            if (swords >= horsemen) {
                horsemenDamage += horsemen * swordDamage;
                swords = swords - horsemen;
            } else {
                horsemenDamage += swords * swordDamage;
                swords = 0;
            }

        } if (knights !== undefined && knights !== null) {
            knightsDamage = knights * knight.attackDamage;
            if (boots >= knights) {
                knightsDamage += knights * bootsDamage;
                boots = boots - knights;
            } else {
                knightsDamage += boots * bootsDamage;
                boots = 0;
            }
            if (helmets >= knights) {
                knightsDamage += knights * helmetDamage;
                helmets = helmets - knights;
            } else {
                knightsDamage += helmets * helmetDamage;
                helmets = 0;
            }
            if (lances >= knights) {
                knightsDamage += knights * lanceDamage;
                lances = lances - knights;
            } else {
                knightsDamage += lances * lanceDamage;
                lances = 0;
            }
            if (shields >= knights) {
                knightsDamage += knights * shieldDamage;
                shields = shields - knights;
            } else {
                knightsDamage += shields * shieldDamage;
                shields = 0;
            }
        } if (batteringrams !== undefined && batteringrams !== null) {
            if ((spearmen + swordsmen) >= batteringrams) {
                batteringramDamage = batteringrams * batteringram.attackDamage;
            } else {
                batteringramDamage = (spearmen + swordsmen) * batteringram.attackDamage;
            }
        } if (siegetowers !== undefined && siegetowers !== null) {
            if ((archers + swordsmen) >= siegetowers) {
                siegetowerDamage = siegetowers * siegetower.attackDamage;
            } else {
                siegetowerDamage = (archers + swordsmen) * siegetower.attackDamage;
            }
        }

        return archerDamage + spearmenDamage + horsemenDamage + knightsDamage + swordsmenDamage + batteringramDamage + siegetowerDamage;
    },

    calculateDefense: function (defender) {

        //todo losing armor
        const archers = defender.archers;
        const spearmen = defender.spearmen;
        const horsemen = defender.horsemen;
        const knights = defender.knights;
        const swordsmen = defender.swordsmen;
        const walls = defender.wallLevel;
        var boots = defender.boots;
        var bracers = defender.bracers;
        var helmets = defender.helmets;
        var lances = defender.lances;
        var longbows = defender.longbows;
        var shields = defender.shields;
        var spears = defender.spears;
        var swords = defender.swords;

        //todo account for nr of weapons, check nulls

        //TODO nr of ===
        //TODO send object, return with correct 0s? Same with dmg calc?
        if (boots == undefined || boots == null) {
            boots = 0;
        }
        if (bracers == undefined || bracers == null) {
            bracers = 0;
        }
        if (helmets == undefined || helmets == null) {
            helmets = 0;
        }
        if (lances == undefined || lances == null) {
            lances = 0;
        }
        if (longbows == undefined || longbows == null) {
            longbows = 0;
        }
        if (shields == undefined || shields == null) {
            shields = 0;
        }
        if (spears == undefined || spears == null) {
            spears = 0;
        }
        if (swords == undefined || swords == null) {
            swords = 0;
        }

        var archerDamage = 0, spearmenDamage = 0, swordsmenDamage = 0, horsemenDamage = 0, knightsDamage = 0;
        const bootsDamage = boot.defenseDamage, bracersDamage = bracer.defenseDamage, helmetDamage = helmet.defenseDamage, longbowDamage = longbow.defenseDamage, lanceDamage = lance.defenseDamage, shieldDamage = shield.defenseDamage, spearDamage = spear.defenseDamage, swordDamage = sword.defenseDamage;
        if (archers !== undefined && archers !== null) {
            archerDamage = archers * archer.defenseDamage;
            if (boots >= archers) {
                archerDamage += archers * bootsDamage;
                boots = boots - archers;
            } else {
                archerDamage += boots * bootsDamage;
                boots = 0;
            }

            if (bracers >= archers) {
                archerDamage += archers * bracersDamage;
                bracers = bracers - archers;
            } else {
                archerDamage += bracers * bracersDamage;
                bracers = 0;
            }

            if (helmets >= archers) {
                archerDamage += archers * helmetDamage;
                helmets = helmets - archers;
            } else {
                archerDamage += helmets * helmetDamage;
                helmets = 0;
            }

            if (longbows >= archers) {
                archerDamage += archers * longbowDamage;
                longbows = longbows - archers;
            } else {
                archerDamage += longbows * longbowDamage;
                longbows = 0;
            }

        } if (spearmen !== undefined && spearmen !== null) {
            spearmenDamage = spearmen * spearman.defenseDamage;
            if (boots >= spearmen) {
                spearmenDamage += spearmen * bootsDamage;
                boots = boots - spearmen;
            } else {
                spearmenDamage += boots * bootsDamage;
                boots = 0;
            }
            if (helmets >= spearmen) {
                spearmenDamage += spearmen * helmetDamage;
                helmets = helmets - spearmen;
            } else {
                spearmenDamage += helmets * helmetDamage;
                helmets = 0;
            }

            if (spears >= spearmen) {
                spearmenDamage += spearmen * spearDamage;
                spears = spears - spearmen;
            } else {
                spearmenDamage += spears * spearDamage;
                spears = 0;
            }

        } if (swordsmen !== undefined && swordsmen !== null) {
            swordsmenDamage = swordsmen * swordsman.defenseDamage;
            if (boots >= swordsmen) {
                swordsmenDamage += swordsmen * bootsDamage;
                boots = boots - swordsmen;
            } else {
                swordsmenDamage += boots * bootsDamage;
                boots = 0;
            }
            if (helmets >= swordsmen) {
                swordsmenDamage += swordsmen * helmetDamage;
                helmets = helmets - swordsmen;
            } else {
                swordsmenDamage += helmets * helmetDamage;
                helmets = 0;
            }
            if (swords >= swordsmen) {
                swordsmenDamage += swordsmen * swordDamage;
                swords = swords - swordsmen;
            } else {
                swordsmenDamage += swords * swordDamage;
                swords = 0;
            }
            if (shields >= swordsmen) {
                swordsmenDamage += swordsmen * shieldDamage;
                shields = shields - swordsmen;
            } else {
                swordsmenDamage += shields * shieldDamage;
                shields = 0;
            }
        } if (horsemen !== undefined && horsemen !== null) {
            horsemenDamage = horsemen * horseman.defenseDamage;
            if (boots >= horsemen) {
                horsemenDamage += horsemen * bootsDamage;
                boots = boots - horsemen;
            } else {
                horsemenDamage += boots * bootsDamage;
                boots = 0;
            }
            if (helmets >= horsemen) {
                horsemenDamage += horsemen * helmetDamage;
                helmets = helmets - horsemen;
            } else {
                horsemenDamage += helmets * helmetDamage;
                helmets = 0;
            }
            if (swords >= horsemen) {
                horsemenDamage += horsemen * swordDamage;
                swords = swords - horsemen;
            } else {
                horsemenDamage += swords * swordDamage;
                swords = 0;
            }

        } if (knights !== undefined && knights !== null) {
            knightsDamage = knights * knight.defenseDamage;
            if (boots >= knights) {
                knightsDamage += knights * bootsDamage;
                boots = boots - knights;
            } else {
                knightsDamage += boots * bootsDamage;
                boots = 0;
            }
            if (helmets >= knights) {
                knightsDamage += knights * helmetDamage;
                helmets = helmets - knights;
            } else {
                knightsDamage += helmets * helmetDamage;
                helmets = 0;
            }
            if (lances >= knights) {
                knightsDamage += knights * lanceDamage;
                lances = lances - knights;
            } else {
                knightsDamage += lances * lanceDamage;
                lances = 0;
            }
            if (shields >= knights) {
                knightsDamage += knights * shieldDamage;
                shields = shields - knights;
            } else {
                knightsDamage += shields * shieldDamage;
                shields = 0;
            }

        }

        // console.log(("aaaaaaaaaaaaaaaa " + archerDamage + " " + spearmenDamage + " " + swordsmenDamage + " " + horsemenDamage + " " + knightsDamage + " " + walls))
        // console.log(boots + " " + bracers + " " + helmets + " " + longbows)

        wallBonus = (1 + (walls / 10));
        if (defender.currentWallHealth === 0) {
            wallBonus = 1;
        }

        return Math.round((archerDamage + spearmenDamage + horsemenDamage + knightsDamage + swordsmenDamage) * wallBonus);

    },

    armyLosses: async function (client, username, divider) {

        archers = username.archers;
        spearmen = username.spearmen;
        swordsmen = username.swordsmen;
        horsemen = username.horsemen;
        knights = username.knights;
        batteringrams = username.batteringrams;
        siegetowers = username.siegetowers;

        console.log(username.username, "has", archers, spearmen, swordsmen, horsemen, knights, batteringrams, siegetowers)

        totalTroops = archers + spearmen + swordsmen + horsemen + knights + batteringrams + siegetowers;
        battleLosses = Math.round(totalTroops / divider);

        lossesCounter = battleLosses;

        if (lossesCounter > batteringrams) {
            potentialBatteringramLosses = batteringrams;
        } else {
            potentialBatteringramLosses = lossesCounter;
        }
        batteringramLosses = Math.floor(Math.random() * potentialBatteringramLosses);
        lossesCounter = lossesCounter - batteringramLosses;
        if (lossesCounter > siegetowers) {
            potentialSiegtowerLosses = siegetowers;
        } else {
            potentialSiegtowerLosses = lossesCounter;
        }
        siegetowerLosses = Math.floor(Math.random() * potentialSiegtowerLosses);
        lossesCounter = lossesCounter - siegetowerLosses;
        if (lossesCounter > spearmen) {
            potentialSpearmenLosses = spearmen;
        } else {
            potentialSpearmenLosses = lossesCounter;
        }
        spearmenLosses = Math.floor(Math.random() * potentialSpearmenLosses);
        lossesCounter = lossesCounter - spearmenLosses;
        if (lossesCounter > swordsmen) {
            potentialSwordsmenLosses = swordsmen;
        } else {
            potentialSwordsmenLosses = lossesCounter;
        }
        swordsmenLosses = Math.floor(Math.random() * potentialSwordsmenLosses);
        lossesCounter = lossesCounter - swordsmenLosses;
        if (lossesCounter > horsemen) {
            potentialHorsemenLosses = horsemen;
        } else {
            potentialHorsemenLosses = lossesCounter;
        }
        horsemenLosses = Math.floor(Math.random() * potentialHorsemenLosses);
        lossesCounter = lossesCounter - horsemenLosses;
        if (lossesCounter > knights) {
            potentialKnightsLosses = knights;
        } else {
            potentialKnightsLosses = lossesCounter;
        }
        knightsLosses = Math.floor(Math.random() * potentialKnightsLosses);
        lossesCounter = lossesCounter - knightsLosses;
        if (lossesCounter > archers) {
            potentialArcherLosses = archers;
        } else {
            potentialArcherLosses = lossesCounter;
        }
        archerLosses = Math.floor(Math.random() * potentialArcherLosses);
        lossesCounter = lossesCounter - archerLosses;
        console.log(username.username + " lost " + archerLosses, spearmenLosses, swordsmenLosses, horsemenLosses, knightsLosses, batteringramLosses, siegetowerLosses);

        newArchers = archers - archerLosses;
        newSpearmen = spearmen - spearmenLosses;
        newSwordsmen = swordsmen - swordsmenLosses;
        newHorsemen = horsemen - horsemenLosses;
        newKnights = knights - knightsLosses;
        newBatteringrams = batteringrams - batteringramLosses;
        newSiegetowers = siegetowers - siegetowerLosses;

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
        if (newBatteringrams < 0) {
            newBatteringrams = 0;
        }
        if (newSiegetowers < 0) {
            newSiegetowers = 0;
        }

        data = { archers: newArchers, spearmen: newSpearmen, swordsmen: newSwordsmen, horsemen: newHorsemen, knights: newKnights, batteringrams: newBatteringrams, siegetowers: newSiegetowers };

        await setDatabaseValue(client, username.username, data);

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
        const attackDamage = attackObject.calculateAttack(attacker);
        const defenseDamage = attackObject.calculateDefense(defender);

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

        const attackerLosses = await attackObject.armyLosses(client, attacker, attackTroopDivider);
        const defenderLosses = await attackObject.armyLosses(client, defender, defenseTroopDivider);

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
    }
};

module.exports = attackObject;

