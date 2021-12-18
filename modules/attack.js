const e = require('express');
const { MongoClient, ObjectId } = require('mongodb');

module.exports = {

    getAttackLog: async function (client, ObjectId) {
        const result = await client.db("gamedb").collection("attacks").findOne({ "_id": ObjectId });
        return result;
    },

    createAttackLog: async function (client, data) {

        result = await client.db("gamedb").collection("attacks").insertOne(data);

        return result.insertedId;

    },

    getInvolvedAttackLogs: async function (client, username) {
        //const result = await client.db("gamedb").collection("attacks").find({ $or: [ { "attacker": username }, { "defender": username } ] }).toArray();
        //const result = await client.db("gamedb").collection("attacks").find().toArray;

        const cursor = client.db("gamedb").collection("attacks").find({ $or: [{ "attacker": username }, { "defender": username }] })

        const result = await cursor.toArray();

        return result;
    },

    calculateAttack: async function (attacker) {

        archers = attacker.archers;
        spearmen = attacker.spearmen;
        horsemen = attacker.horsemen;
        knights = attacker.knights;
        swordsmen = attacker.swordsmen;
        batteringrams = attacker.batteringrams;
        siegetowers = attacker.siegetowers;

        var archerDamage = 0, spearmenDamage = 0, horsemenDamage = 0, knightsDamage = 0;

        if (archers !== undefined && archers !== null) {
            archerDamage = archers * 10;
        } if (spearmen !== undefined && spearmen !== null) {
            spearmenDamage = spearmen * 5;
        } if (horsemen !== undefined && horsemen !== null) {
            horsemenDamage = horsemen * 15;
        } if (knights !== undefined && knights !== null) {
            knightsDamage = knights * 20;
        } if (swordsmen !== undefined && swordsmen !== null) {
            swordsmenDamage = swordsmen * 20;
        } if (batteringrams !== undefined && batteringrams !== null) {
            archerDamage = archerDamage * batteringrams;
            spearmenDamage = spearmenDamage * batteringrams;
        } if (siegetowers !== undefined && siegetowers !== null) {
            //fix does double calc with battering ram dmg
            archerDamage = archerDamage * siegetowers * 5;
            spearmenDamage = spearmenDamage * siegetowers * 5;
        }

        return archerDamage + spearmenDamage + horsemenDamage + knightsDamage + swordsmenDamage;
    },

    calculateDefense: async function (defender) {

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

        if (boots == undefined || boots == null) {
            boots = 0;
        }
        if (bracers == undefined || bracers == null) {
            bracers = 0;
        }
        if (helmets == undefined || helmets == null) {
            helmets = 0;
        }
        if (longbows == undefined || longbows == null) {
            longbows = 0;
        }

        var archerDamage = 0, spearmenDamage = 0, horsemenDamage = 0, knightsDamage = 0;

        if (archers !== undefined && archers !== null) {
            archerDamage = archers * 10;
            if (boots >= archers) {
                archerDamage += archers * 2;
                boots = boots - archers;
            } else {
                archerDamage += boots * 2;
            }
            archerDamage += bracers * 2;
            archerDamage += helmets * 2;
            archerDamage += longbows * 2;
        } if (spearmen !== undefined && spearmen !== null) {
            spearmenDamage = spearmen * 10;
        } if (horsemen !== undefined && horsemen !== null) {
            horsemenDamage = horsemen * 5;
        } if (knights !== undefined && knights !== null) {
            knightsDamage = knights * 20;
        } if (swordsmen !== undefined && swordsmen !== null) {
            swordsmenDamage = swordsmen * 20;
        }


        console.log(("aaaaaaaaaaaaaaaa " + archers + " " + archerDamage + " " + spearmenDamage + " " + horsemenDamage + " " + knightsDamage + " " + walls))
        console.log(boots + " " + bracers + " " + helmets + " " + longbows)

        return (archerDamage + spearmenDamage + horsemenDamage + knightsDamage + swordsmenDamage) * (1 + (walls / 10));

    }
}