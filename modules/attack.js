const e = require('express');
const { MongoClient, ObjectId } = require('mongodb');

module.exports = {

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

        //console.log(cursor)

        const result = await cursor.toArray();

        if (result[0] === undefined) {
            return false;
        }

        return result;
    },

    calculateAttack: async function (attacker) {

        //todo rename variable to user?
        const archers = attacker.archers;
        const spearmen = attacker.spearmen;
        const horsemen = attacker.horsemen;
        const knights = attacker.knights;
        const swordsmen = attacker.swordsmen;
        //batteringrams = attacker.batteringrams;
        //siegetowers = attacker.siegetowers;
        var boots = attacker.boots;
        var bracers = attacker.bracers;
        var helmets = attacker.helmets;
        var lances = attacker.lances;
        var longbows = attacker.longbows;
        var shields = attacker.shields;
        var spears = attacker.spears;
        var swords = attacker.spears;
        var batteringrams = attacker.batteringrams * 10;
        var siegetowers = attacker.siegetowers * 10;

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
        const bootsDamage = 2, bracersDamage = 2, helmetDamage = 2, longbowDamage = 2, lanceDamage = 2, shieldDamage = 2, spearDamage = 2, swordDamage = 2, batteringramDamage = 10, siegetowerDamage = 50;
        if (archers !== undefined && archers !== null) {
            archerDamage = archers * 10;
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

            if (siegetowers >= archers) {
                archerDamage += archers * siegetowerDamage;
                siegetowers = siegetowers - archers;
            } else {
                archerDamage += siegetowers * siegetowerDamage;
                siegetowers = 0;
            }

        } if (spearmen !== undefined && spearmen !== null) {
            spearmenDamage = spearmen * 10;
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

            if (batteringrams >= spearmen) {
                spearmenDamage += spearmen * batteringramDamage;
                batteringrams = batteringrams - spearmen;
            } else {
                spearmenDamage += batteringrams * batteringramDamage;
                batteringrams = 0;
            }

        } if (swordsmen !== undefined && swordsmen !== null) {
            swordsmenDamage = swordsmen * 20;
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
            if (batteringrams >= swordsmen) {
                swordsmenDamage += swordsmen * batteringramDamage;
                batteringrams = batteringrams - swordsmen;
            } else {
                swordsmenDamage += batteringrams * batteringramDamage;
                batteringrams = 0;
            }
            if (siegetowers >= swordsmen) {
                swordsmenDamage += swordsmen * siegetowerDamage;
                siegetowers = siegetowers - swordsmen;
            } else {
                swordsmenDamage += siegetowers * siegetowerDamage;
                siegetowers = 0;
            }

        } if (horsemen !== undefined && horsemen !== null) {
            horsemenDamage = horsemen * 5;
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
            knightsDamage = knights * 20;
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

        return archerDamage + spearmenDamage + horsemenDamage + knightsDamage + swordsmenDamage;
    },

    calculateDefense: async function (defender) {

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
        var swords = defender.spears;

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

        var archerDamage = 0, spearmenDamage = 0, horsemenDamage = 0, knightsDamage = 0;
        const bootsDamage = 2, bracersDamage = 2, helmetDamage = 2, longbowDamage = 2, lanceDamage = 2, shieldDamage = 2, spearDamage = 2, swordDamage = 2;
        if (archers !== undefined && archers !== null) {
            archerDamage = archers * 10;
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
            spearmenDamage = spearmen * 10;
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
            swordsmenDamage = swordsmen * 20;
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
            horsemenDamage = horsemen * 5;
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
            knightsDamage = knights * 20;
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

        return Math.round((archerDamage + spearmenDamage + horsemenDamage + knightsDamage + swordsmenDamage) * (1 + (walls / 10)));

    }
}