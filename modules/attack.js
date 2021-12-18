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
        } if (batteringrams !== undefined && batteringrams !== null) {
            archerDamage = archerDamage * batteringrams;
            spearmenDamage = spearmenDamage * batteringrams;
        } if (siegetowers !== undefined && siegetowers !== null) {
            //fix does double calc with battering ram dmg
            archerDamage = archerDamage * siegetowers * 5;
            spearmenDamage = spearmenDamage * siegetowers * 5;
        }

        return archerDamage + spearmenDamage + horsemenDamage + knightsDamage;
    },

    calculateDefense: async function (defender) {

        archers = defender.archers;
        spearmen = defender.spearmen;
        horsemen = defender.horsemen;
        knights = defender.knights;
        walls = defender.wallLevel;

        var archerDamage = 0, spearmenDamage = 0, horsemenDamage = 0, knightsDamage = 0;

        if (archers !== undefined && archers !== null) {
            archerDamage = archers * 10;
        } if (spearmen !== undefined && spearmen !== null) {
            spearmenDamage = spearmen * 10;
        } if (horsemen !== undefined && horsemen !== null) {
            horsemenDamage = horsemen * 5;
        } if (knights !== undefined && knights !== null) {
            knightsDamage = knights * 20;
        }

        return (archerDamage + spearmenDamage + horsemenDamage + knightsDamage) * (1 + (walls / 10));

    }
}