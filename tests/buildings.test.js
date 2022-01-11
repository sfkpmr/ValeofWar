const { validateRequiredProductionLevel, convertNegativeToZero, calcTotalCraftCost, calcIronCraftCost, calcGoldCraftCost, calcLumberCraftCost, calcGoldTrainCost, calcLumberTrainCost, calcIronTrainCost, calcGrainTrainCost } = require("../modules/buildings.js");

const armor = { boots: 2, bracers: 3, helmets: 0, lances: 2, longbows: 2, shields: 2, spears: 3, swords: 1 };
const nullArmor = { boots: null, bracers: null, helmets: null, lances: null, longbows: null, shields: null, spears: null, swords: null };
const user = { barracksLevel: 3, stablesLevel: 4 };
const data = { archer: 2, spearmen: 0, swordsmen: 4 };
const data2 = { archer: 2, spearmen: 0, swordsmen: 0 };

test("calcGoldTrainCost", () => {
    expect(calcGoldTrainCost(3, 2, 4, 2, 1, 4, 4)).toBe(780)
})
test("calcIronTrainCost", () => {
    expect(calcIronTrainCost(3, 2, 4, 2, 1, 4, 4)).toBe(1150)
})
test("calcGrainTrainCost", () => {
    expect(calcGrainTrainCost(3, 2, 4, 2, 1, 4, 4)).toBe(625)
})
test("calcLumberTrainCost", () => {
    expect(calcLumberTrainCost(3, 2, 4, 2, 1, 4, 4)).toBe(6250)
})
test("calcIronCraftCost", () => {
    expect(calcIronCraftCost(3, 2, 4, 2, 1, 4, 4, 0)).toBe(555)
})
test("calcGoldCraftCost", () => {
    expect(calcGoldCraftCost(3, 2, 4, 2, 1, 4, 4, 0)).toBe(20)
})
test("calcLumberCraftCost", () => {
    expect(calcLumberCraftCost(3, 2, 4, 2, 1, 4, 4, 0)).toBe(850)
})
test("calcTotalCraftCost", () => {
    expect(calcTotalCraftCost(armor)).toEqual({ lumberCost: 700, ironCost: 360, goldCost: 35 })
})
test("emptyArmor", () => {
    expect(calcTotalCraftCost(nullArmor)).toEqual({ lumberCost: 0, ironCost: 0, goldCost: 0 })
})
test("convertNegativeToZero", () => {
    expect(convertNegativeToZero(-5)).toBe(0);
})
test("validateRequiredProductionLevel", () => {
    expect(validateRequiredProductionLevel(user, data)).toEqual(false);
})
test("validateRequiredProductionLevel", () => {
    expect(validateRequiredProductionLevel(user, data2)).toEqual(true);
})
test("validateRequiredProductionLevel", () => {
    expect(validateRequiredProductionLevel(user, { horsemen: 2, knights: 2 })).toEqual(false);
})
test("validateRequiredProductionLevel", () => {
    expect(validateRequiredProductionLevel({ stablesLevel: 10 }, { horsemen: 2, knights: 2 })).toEqual(true);
})