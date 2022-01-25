const { incomeCalc, getIncome, getAllIncomes } = require("../modules/resources.js");

const user = { farms: [1, 2, 3, 0], lumberCamps: [1, 2, 3, 0], quarries: [1, 2, 3, 0], ironMines: [1, 2, 3], goldMines: [1, 2], trainingfieldLevel: 5, stablesLevel: 2 };

test("getIncome", () => {
    expect(getIncome(user, "getGrainIncome")).toBe(42)
})
test("getAllIncomes", () => {
    expect(getAllIncomes(user)).toEqual({ grainIncome: 42, lumberIncome: 36, stoneIncome: 18, ironIncome: 12, goldIncome: 3, recruitsIncome: 25, horseIncome: 6 })
})