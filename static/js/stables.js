const horseman = { grain: 100, iron: 25, attackDamage: 5, defenseDamage: 5, levelRequirement: 0 };
const knight = { grain: 100, iron: 100, gold: 50, attackDamage: 20, defenseDamage: 20, levelRequirement: 5 };
const horseArcher = { grain: 100, lumber: 15, iron: 100, gold: 100, attackDamage: 20, defenseDamage: 20, levelRequirement: 15 };

function stablesTrainCost() {
    let grainCost = 0, lumberCost = 0, ironCost = 0, goldCost = 0;

    let horsemen = parseInt(document.getElementById('horsemen').value);
    let knights = parseInt(document.getElementById('knights').value);
    let horseArchers = parseInt(document.getElementById('horseArchers').value);

    if (horsemen < 0 || isNaN(horsemen)) {
        horsemen = 0;
        document.getElementById('horsemen').value = 0;
    } else if (horsemen > 9999) {
        horsemen = 9999;
        document.getElementById('horsemen').value = 9999;
    }
    if (knights < 0 || isNaN(knights)) {
        knights = 0;
        document.getElementById('knights').value = 0;
    } else if (knights > 9999) {
        knights = 9999;
        document.getElementById('knights').value = 9999;
    }
    if (horseArchers < 0 || isNaN(horseArchers)) {
        horseArchers = 0;
        document.getElementById('horseArchers').value = 0;
    } else if (horseArcher > 9999) {
        horseArchers = 9999;
        document.getElementById('horseArchers').value = 9999;
    }

    grainCost += horsemen * horseman.grain;
    grainCost += knights * knight.grain;
    grainCost += horseArchers * horseArcher.grain;

    lumberCost += horseArchers * horseArcher.grain;

    ironCost += horsemen * horseman.iron;
    ironCost += knights * knight.iron;
    ironCost += horseArchers * horseArcher.grain;

    goldCost += knights * knight.gold;
    goldCost += horseArchers * horseArcher.grain;

    document.getElementById("grain").innerText = grainCost;
    document.getElementById("iron").innerText = ironCost;
    document.getElementById("gold").innerText = goldCost;
    document.getElementById("recruits").innerText = horsemen + knights + horseArchers;
    document.getElementById("horses").innerText = horsemen + knights + horseArchers;
}

document.getElementById("horsemen").addEventListener("input", stablesTrainCost);
document.getElementById("knights").addEventListener("input", stablesTrainCost);
document.getElementById("horseArchers").addEventListener("input", stablesTrainCost);
document.getElementById("horsemanAttackDamage").innerText = horseman.attackDamage;
document.getElementById("horsemanDefenseDamage").innerText = horseman.defenseDamage;
document.getElementById("horsemanLevelRequirement").innerText = horseman.levelRequirement;
document.getElementById("knightAttackDamage").innerText = knight.attackDamage;
document.getElementById("knightDefenseDamage").innerText = knight.defenseDamage;
document.getElementById("knightLevelRequirement").innerText = knight.levelRequirement;
document.getElementById("horseArcherAttackDamage").innerText = horseArcher.attackDamage;
document.getElementById("horseArcherDefenseDamage").innerText = horseArcher.defenseDamage;
document.getElementById("horseArcherLevelRequirement").innerText = horseArcher.levelRequirement;