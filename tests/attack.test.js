const { calcResourceDivider, calcWallBonus, calcattackTroopDivider, calcdefenseTroopDivider, calcCloseness } = require("../modules/attack.js");

const defender = { wallLevel: 5 }

test("calcResourceDivider", () => {
    expect(calcResourceDivider(0.5)).toBe(5)
})
test("calcattackTroopDivider", () => {
    expect(calcattackTroopDivider(0.5)).toBe(5)
})
test("calcdefenseTroopDivider", () => {
    expect(calcdefenseTroopDivider(0.3)).toBe(60)
})
test("calcCloseness", () => {
    expect(calcCloseness(5, 5)).toBe(0.5)
})
test("calcWallBonus", () => {
    expect(calcWallBonus(defender)).toBe(0.875)
})