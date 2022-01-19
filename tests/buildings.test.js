const { validateRequiredProductionLevel, convertNegativeToZero, calcTotalCraftCost, calcIronCraftCost, calcGoldCraftCost, calcLumberCraftCost, calcGoldTrainCost, calcLumberTrainCost,
    calcIronTrainCost, calcGrainTrainCost, calcGrainCraftCost } = require("../modules/buildings.js");

const armor = { ropes: 1, nets: 1, spyglasses: 1, poisons: 1, boots: 1, bracers: 1, helmets: 1, lances: 1, longbows: 1, shields: 1, spears: 1, swords: 1 };
const nullArmor = { boots: null, bracers: null, helmets: null, lances: null, longbows: null, shields: null, spears: null, swords: null };
const user = { barracksLevel: 3, stablesLevel: 4 };
const data = { archer: 2, spearmen: 0, swordsmen: 4 };
const data2 = { archer: 2, spearmen: 0, swordsmen: 0 };
army = {
    "archers": 1, "spearmen": 1, "swordsmen": 1, "horsemen": 1, "knights": 1, "batteringRams": 1, "siegeTowers": 1,
    "crossbowmen": 1, "ballistas": 1, "twoHandedSwordsmen": 1, "longbowmen": 1, "horseArchers": 1, "trebuchets": 1, "halberdiers": 1,
    "spies": 1, "sentries": 1
}

test("calcGoldTrainCost", () => {
    expect(calcGoldTrainCost(army)).toBe(1095)
})
test("calcIronTrainCost", () => {
    expect(calcIronTrainCost(army)).toBe(1730)
})
test("calcGrainTrainCost", () => {
    expect(calcGrainTrainCost(army)).toBe(850)
})
test("calcLumberTrainCost", () => {
    expect(calcLumberTrainCost(army)).toBe(5880)
})
test("calcIronCraftCost", () => {
    expect(calcIronCraftCost(armor)).toBe(365)
})
test("calcGoldCraftCost", () => {
    expect(calcGoldCraftCost(armor)).toBe(150)
})
test("calcLumberCraftCost", () => {
    expect(calcLumberCraftCost(armor)).toBe(465)
})
test("calcLumberCraftCost", () => {
    expect(calcGrainCraftCost(armor)).toBe(100)
})
test("calcTotalCraftCost", () => {
    expect(calcTotalCraftCost(armor)).toEqual({ lumberCost: 465, ironCost: 365, goldCost: 150, grainCost: 100 })
})
test("emptyArmor", () => {
    expect(calcTotalCraftCost(nullArmor)).toEqual({ lumberCost: 0, ironCost: 0, goldCost: 0, grainCost: 0 })
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