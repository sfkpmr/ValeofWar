const { MongoClient } = require('mongodb');
const { getUserByEmail } = require("../modules/buildings.js");

describe('insert', () => {
    let connection;
    let db;

    beforeAll(async () => {
        connection = await MongoClient.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = await connection.db();
    });


    it('should insert a doc into collection', async () => {
        const players = db.collection('players');

        const mockUser = { _id: 'some-user-id', name: 'John', email: 'john@test.com' };
        await players.insertOne(mockUser);

        const insertedUser = await players.findOne({ _id: 'some-user-id' });
        expect(insertedUser).toEqual(mockUser);
    });


    // it('should get player from db', async () => {
    //     const email = 'john@test.com'
    //     const result = getUserByEmail(email);
    //     console.log(result);
    //     //expect(calcGrainTrainCost(army)).toBe(850)
    // });





    afterAll(async () => {
        await connection.close();
    });
});

