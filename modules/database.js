const { ObjectId } = require('mongodb');

databaseObject = {

    incDatabaseValue: async function (client, username, data) {
        await client.db("gamedb").collection("players").updateOne({ "username": username }, { $inc: data });
    },
    setDatabaseValue: async function (client, username, data) {
        await client.db("gamedb").collection("players").updateOne({ "username": username }, { $set: data });
    },
    getUserByUsername: async function (client, username) {
        const result = await client.db("gamedb").collection("players").findOne({ "username": username });
        if (result === null) {
            return false;
        } else {
            return result;
        }
    },
    getUserByEmail: async function (client, email) {
        return await client.db("gamedb").collection("players").findOne({ "email": email });
    },
    getUserById: async function (client, id) {
        return await client.db("gamedb").collection("players").findOne({ "_id": id });
    },
    deleteUser: async function (client, id) {
        return await client.db("gamedb").collection("players").deleteOne({ "_id": id });
    },
    getAllTrades: async function (client) {
        const cursor = await client.db("gamedb").collection("trades").find();
        const result = await cursor.toArray();
        return result;
    },
    addTrade: async function (client, data) {
        try {
            return await client.db("gamedb").collection("trades").insertOne(data);
        } catch (e) {
            console.log(e);
        }
    },
    getTrade: async function (client, id) {
        return await client.db("gamedb").collection("trades").findOne({ "_id": new ObjectId(id) });
    },
    deleteTrade: async function (client, id) {
        return await client.db("gamedb").collection("trades").deleteOne({ "_id": id });
    },
    hasTrades: async function (client, username) {
        const cursor = client.db("gamedb").collection("trades").find({ "seller": username })
        const result = await cursor.toArray();
        if (result[0] === undefined) {
            return false;
        }
        return true;
    },
    getUserTrades: async function (client, username) {
        const cursor = client.db("gamedb").collection("trades").find({ "seller": username })
        const result = await cursor.toArray();
        if (result[0] === undefined) {
            return false;
        }
        return result;
    },
    getUserMessages: async function (client, username) {
        const cursor = client.db("gamedb").collection("messages").find({ $or: [{ "sentBy": username }, { "sentTo": username }] })
        const result = await cursor.toArray();
        if (result[0] === undefined) {
            return false;
        }
        return result;
    },
    getMessageById: async function (client, id) {
        const result = client.db("gamedb").collection("messages").findOne({ "_id": id });
        if (result === undefined) {
            return false;
        }
        return result;
    },
    addMessage: async function (client, data) {
        //alltid?
        try {
            result = await client.db("gamedb").collection("messages").insertOne(data);
        } catch (e) {
            console.log(e);
        }
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
    getInvolvedSpyLogs: async function (client, username) {
        const cursor = client.db("gamedb").collection("intrusions").find({ $or: [{ "attacker": username }, { "defender": username }] })
        const result = await cursor.toArray();
        if (result[0] === undefined) {
            return false;
        }
        return result;
    },
    prepareMessagesOrLogs: async function (client, user, nr, type) {
        let result;
        if (type === "log") {
            result = await databaseObject.getInvolvedAttackLogs(client, user.username)
        } else if (type === "message") {
            result = await databaseObject.getUserMessages(client, user.username)
        } else if (type === "spyLog") {
            result = await databaseObject.getInvolvedSpyLogs(client, user.username)
        } else {
            console.debug(type, "Invalid object")
        }
        const maxPages = Math.ceil(Object.keys(result).length / 20);

        if (nr < 1 || nr > maxPages || isNaN(nr)) {
            return false;//res.redirect('/messages/inbox/page/1')
        } else {
            if (result.length === 0) {
                return 0;//res.render('pages/inbox')
            }

            const currentPage = nr;

            let startPoint = 0;
            if (currentPage === 1) {
                startPoint = 0
            } else {
                startPoint = (currentPage - 1) * 20;
            }

            const objectToArray2 = result => {
                const keys = Object.keys(result);
                const res = [];
                for (let i = 0; i < keys.length; i++) {
                    res.push(result[keys[i]]);
                };
                return res;
            };

            const tempArray = objectToArray2(result);
            const reverseArray = [];

            for (i = tempArray.length - 1; i >= 0; i--) {
                reverseArray.push(tempArray[i]);
            }

            const objectToArray = reverseArray => {
                const keys = Object.keys(reverseArray);
                const res = [];
                for (let i = startPoint; i < startPoint + 20; i++) {
                    res.push(reverseArray[keys[i]]);
                    if (reverseArray[keys[i + 1]] === null || reverseArray[keys[i + 1]] === undefined) {
                        i = Number.MAX_SAFE_INTEGER;
                    }
                };
                return res;
            };
            const filteredResult = objectToArray(reverseArray);

            return { "result": result, "currentPage": currentPage, "maxPages": maxPages, "filteredResult": filteredResult };
        }
    },
    checkHowManyTradesPlayerHas: async function (client, user) {
        const number = await client.db("gamedb").collection("trades").countDocuments({ seller: user.username });
        return number;
    },
    userAllowedToTrade: async function (client, user) {
        if (await databaseObject.checkHowManyTradesPlayerHas(client, user) < 4) {
            return true;
        }
        return false;
    },
    checkIfAlreadyTradingResource: async function (client, user, type) {
        const result = await databaseObject.getUserTrades(client, user.username);
        for (let i = 0; i < result.length; i++) {
            if (result[i].sellResource === type) {
                return true;
            }
        }
        return false;
    },
    getArmyByEmail: async function (client, email) {
        return await client.db("gamedb").collection("armies").findOne({ "email": email });
    },
    getArmoryByEmail: async function (client, email) {
        return await client.db("gamedb").collection("armories").findOne({ "email": email });
    },
    //remove plural s
    incTroopValues: async function (client, username, data) {
        await client.db("gamedb").collection("armies").updateOne({ "username": username }, { $inc: data });
    },
    setTroopsValue: async function (client, username, data) {
        await client.db("gamedb").collection("armies").updateOne({ "username": username }, { $set: data });
    },
    incArmorValues: async function (client, username, data) {
        await client.db("gamedb").collection("armories").updateOne({ "username": username }, { $inc: data });
    },
    deleteArmy: async function (client, email) {
        await client.db("gamedb").collection("armies").deleteOne({ "email": email });
    },
    deleteArmory: async function (client, email) {
        await client.db("gamedb").collection("armories").deleteOne({ "email": email });
    },
    getSpyLog: async function (client, ObjectId) {
        const result = await client.db("gamedb").collection("intrusions").findOne({ "_id": ObjectId });
        if (result === null) {
            return false;
        } else {
            return result;
        }
    },

};

module.exports = databaseObject;

