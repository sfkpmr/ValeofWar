const archer = { grain: 10, lumber: 5, gold: 5, attackDamage: 10, defenseDamage: 15, levelRequirement: 0 };
const spearman = { grain: 5, lumber: 5, attackDamage: 10, defenseDamage: 20, levelRequirement: 0 };
const swordsman = { grain: 20, lumber: 20, iron: 20, gold: 20, attackDamage: 20, defenseDamage: 20, levelRequirement: 5 };
const crossbowman = { grain: 50, lumber: 50, iron: 25, gold: 25, attackDamage: 10, defenseDamage: 50, levelRequirement: 10 };
const twoHandedSwordsman = { grain: 200, lumber: 0, iron: 100, gold: 100, attackDamage: 50, defenseDamage: 20, levelRequirement: 20 };
const halberdier = { grain: 50, lumber: 50, iron: 50, gold: 50, attackDamage: 25, defenseDamage: 25, levelRequirement: 15 };
const longbowman = { grain: 15, lumber: 50, iron: 10, gold: 100, attackDamage: 25, defenseDamage: 25, levelRequirement: 10 };

function barracksTrainCost() {
    let grainCost = 0, lumberCost = 0, ironCost = 0, goldCost = 0;

    let archers = parseInt(document.getElementById("archers").value);
    let spearmen = parseInt(document.getElementById("spearmen").value);
    let swordsmen = parseInt(document.getElementById("swordsmen").value);
    let crossbowmen = parseInt(document.getElementById("crossbowmen").value);
    let twoHandedSwordsmen = parseInt(document.getElementById("twoHandedSwordsmen").value);
    let halberdiers = parseInt(document.getElementById("halberdiers").value);
    let longbowmen = parseInt(document.getElementById("longbowmen").value);

    if (archers < 0 || isNaN(archers)) {
        archers = 0;
        document.getElementById('archers').value = 0;
    } else if (archers > 9999) {
        archers = 9999;
        document.getElementById('archers').value = 9999;
    }
    if (spearmen < 0 || isNaN(spearmen)) {
        spearmen = 0;
        document.getElementById('spearmen').value = 0;
    } else if (spearmen > 9999) {
        spearmen = 9999;
        document.getElementById('spearmen').value = 9999;
    }
    if (swordsmen < 0 || isNaN(swordsmen)) {
        swordsmen = 0;
        document.getElementById('swordsmen').value = 0;
    } else if (swordsmen > 9999) {
        swordsmen = 9999;
        document.getElementById('swordsmen').value = 9999;
    }
    if (crossbowmen < 0 || isNaN(crossbowmen)) {
        crossbowmen = 0;
        document.getElementById('crossbowmen').value = 0;
    } else if (crossbowmen > 9999) {
        crossbowmen = 9999;
        document.getElementById('crossbowmen').value = 9999;
    }
    if (twoHandedSwordsmen < 0 || isNaN(twoHandedSwordsmen)) {
        twoHandedSwordsmen = 0;
        document.getElementById('twoHandedSwordsmen').value = 0;
    } else if (twoHandedSwordsmen > 9999) {
        twoHandedSwordsmen = 9999;
        document.getElementById('twoHandedSwordsmen').value = 9999;
    }
    if (halberdiers < 0 || isNaN(halberdiers)) {
        halberdiers = 0;
        document.getElementById('halberdiers').value = 0;
    } else if (halberdiers > 9999) {
        halberdiers = 9999;
        document.getElementById('halberdiers').value = 9999;
    }
    if (longbowmen < 0 || isNaN(longbowmen)) {
        longbowmen = 0;
        document.getElementById('longbowmen').value = 0;
    } else if (longbowmen > 9999) {
        longbowmen = 9999;
        document.getElementById('longbowmen').value = 9999;
    }

    grainCost += archers * archer.grain;
    grainCost += spearmen * spearman.grain;
    grainCost += swordsmen * swordsman.grain;
    grainCost += crossbowmen * crossbowman.grain;
    grainCost += twoHandedSwordsmen * twoHandedSwordsman.grain;
    grainCost += halberdiers * halberdier.grain;
    grainCost += longbowmen * longbowman.grain;

    lumberCost += archers * archer.lumber;
    lumberCost += spearmen * spearman.lumber;
    lumberCost += swordsmen * swordsman.lumber;
    lumberCost += crossbowmen * crossbowman.lumber;
    lumberCost += twoHandedSwordsmen * twoHandedSwordsman.lumber;
    lumberCost += halberdiers * halberdier.lumber;
    lumberCost += longbowmen * longbowman.lumber;

    ironCost += swordsmen * swordsman.iron;
    ironCost += crossbowmen * crossbowman.iron;
    ironCost += twoHandedSwordsmen * twoHandedSwordsman.iron;
    ironCost += halberdiers * halberdier.iron;
    ironCost += longbowmen * longbowman.iron;

    goldCost += archers * archer.gold;
    goldCost += swordsmen * swordsman.gold;
    goldCost += crossbowmen * crossbowman.gold;
    goldCost += twoHandedSwordsmen * twoHandedSwordsman.gold;
    goldCost += halberdiers * halberdier.gold;
    goldCost += longbowmen * longbowman.gold;

    document.getElementById("grain").innerText = grainCost;
    document.getElementById("lumber").innerText = lumberCost;
    document.getElementById("iron").innerText = ironCost;
    document.getElementById("gold").innerText = goldCost;
    document.getElementById("recruits").innerText = archers + spearmen + swordsmen + crossbowmen + twoHandedSwordsmen + halberdiers + longbowmen;
}

document.getElementById("archers").addEventListener("input", barracksTrainCost);
document.getElementById("spearmen").addEventListener("input", barracksTrainCost);
document.getElementById("swordsmen").addEventListener("input", barracksTrainCost);
document.getElementById("crossbowmen").addEventListener("input", barracksTrainCost);
document.getElementById("twoHandedSwordsmen").addEventListener("input", barracksTrainCost);
document.getElementById("halberdiers").addEventListener("input", barracksTrainCost);
document.getElementById("longbowmen").addEventListener("input", barracksTrainCost);
document.getElementById("archerAttackDamage").innerText = archer.attackDamage;
document.getElementById("archerDefenseDamage").innerText = archer.defenseDamage;
document.getElementById("archerLevelRequirement").innerText = archer.levelRequirement;
document.getElementById("spearmanAttackDamage").innerText = spearman.attackDamage;
document.getElementById("spearmanDefenseDamage").innerText = spearman.defenseDamage;
document.getElementById("spearmanLevelRequirement").innerText = spearman.levelRequirement;
document.getElementById("swordsmanAttackDamage").innerText = swordsman.attackDamage;
document.getElementById("swordsmanDefenseDamage").innerText = swordsman.defenseDamage;
document.getElementById("swordsmanLevelRequirement").innerText = swordsman.levelRequirement;
document.getElementById("longbowmanAttackDamage").innerText = longbowman.attackDamage;
document.getElementById("longbowmanDefenseDamage").innerText = longbowman.defenseDamage;
document.getElementById("longbowmanLevelRequirement").innerText = longbowman.levelRequirement;
document.getElementById("halberdierAttackDamage").innerText = halberdier.attackDamage;
document.getElementById("halberdierDefenseDamage").innerText = halberdier.defenseDamage;
document.getElementById("halberdierLevelRequirement").innerText = halberdier.levelRequirement;
document.getElementById("twoHandedSwordsmanAttackDamage").innerText = twoHandedSwordsman.attackDamage;
document.getElementById("twoHandedSwordsmanDefenseDamage").innerText = twoHandedSwordsman.defenseDamage;
document.getElementById("twoHandedSwordsmanLevelRequirement").innerText = twoHandedSwordsman.levelRequirement;
document.getElementById("crossbowmanAttackDamage").innerText = crossbowman.attackDamage;
document.getElementById("crossbowmanDefenseDamage").innerText = crossbowman.defenseDamage;
document.getElementById("crossbowmanLevelRequirement").innerText = crossbowman.levelRequirement;