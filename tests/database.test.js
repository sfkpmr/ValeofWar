const { MongoClient } = require('mongodb');
const { getUserByEmail } = require('../modules/database');

describe('insert', () => {
    let connection;
    let db;
    let players;

    beforeAll(async () => {
        connection = await MongoClient.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = await connection.db();
        players = db.collection('players');
    });

    it('should insert a doc into collection', async () => {
        const mockUser = { _id: 'some-user-id', name: 'John', email: 'john@test.com' };
        await players.insertOne(mockUser);

        const insertedUser = await players.findOne({ _id: 'some-user-id' });
        expect(insertedUser).toEqual(mockUser);
    });

    it('should get player from db', async () => {
        const email = 'john@test.com'
        const result = await getUserByEmail(email);
        // result = await players.findOne({ "email": email });
        console.log(result);
        const mockUser = { _id: 'some-user-id', name: 'John', email: 'john@test.com' };
        expect(result).toEqual(mockUser);
    });

    afterAll(async () => {
        await connection.close();
    });
});

// test("incomeCalc", () => {
//     expect(incomeCalc("lumber", 8)).toBe(48)
// })