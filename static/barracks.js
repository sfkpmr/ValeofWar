const archer = { grain: 25, lumber: 50, gold: 10, attackDamage: 10, defenseDamage: 10 };
const spearman = { grain: 25, lumber: 50, attackDamage: 10, defenseDamage: 10 };
const swordsman = { grain: 50, iron: 50, gold: 25, attackDamage: 20, defenseDamage: 20 };

function barracksTrainCost() {
    let grainCost = 0, lumberCost = 0, ironCost = 0, goldCost = 0;

    let archers = parseInt(document.getElementById("archers").value);
    let spearmen = parseInt(document.getElementById("spearmen").value);
    let swordsmen = parseInt(document.getElementById("swordsmen").value);

    if (archers < 0 || isNaN(archers)) {
        archers = 0;
        document.getElementById('archers').value = 0;
    }
    if (spearmen < 0 || isNaN(spearmen)) {
        spearmen = 0;
        document.getElementById('spearmen').value = 0;
    }
    if (swordsmen < 0 || isNaN(swordsmen)) {
        swordsmen = 0;
        document.getElementById('swordsmen').value = 0;
    }

    grainCost += archers * archer.grain;
    grainCost += spearmen * spearman.grain;
    grainCost += swordsmen * swordsman.grain;

    lumberCost += archers * archer.lumber;
    lumberCost += spearmen * spearman.lumber;

    ironCost += swordsmen * swordsman.iron;

    goldCost += archers * archer.gold;
    goldCost += swordsmen * swordsman.gold;

    document.getElementById("grain").innerText = grainCost;
    document.getElementById("lumber").innerText = lumberCost;
    document.getElementById("iron").innerText = ironCost;
    document.getElementById("gold").innerText = goldCost;
    document.getElementById("recruits").innerText = archers + spearmen + swordsmen;
}

document.getElementById("archers").addEventListener("input", barracksTrainCost);
document.getElementById("spearmen").addEventListener("input", barracksTrainCost);
document.getElementById("swordsmen").addEventListener("input", barracksTrainCost);
document.getElementById("archerAttackDamage").innerText = archer.attackDamage;
document.getElementById("archerDefenseDamage").innerText = archer.defenseDamage;
document.getElementById("spearmanAttackDamage").innerText = spearman.attackDamage;
document.getElementById("spearmanDefenseDamage").innerText = spearman.defenseDamage;
document.getElementById("swordsmanAttackDamage").innerText = swordsman.attackDamage;
document.getElementById("swordsmanDefenseDamage").innerText = swordsman.defenseDamage;