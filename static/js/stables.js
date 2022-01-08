const horseman = { grain: 100, iron: 25, attackDamage: 5, defenseDamage: 5 };
const knight = { grain: 100, iron: 100, gold: 50, attackDamage: 20, defenseDamage: 20 };

function stablesTrainCost() {
    let grainCost = 0, ironCost = 0, goldCost = 0;

    let horsemen = parseInt(document.getElementById('horsemen').value);
    let knights = parseInt(document.getElementById('knights').value);

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

    grainCost += horsemen * horseman.grain;
    grainCost += knights * knight.grain;

    ironCost += horsemen * horseman.iron;
    ironCost += knights * knight.iron;

    goldCost += knights * knight.gold;

    document.getElementById("grain").innerText = grainCost;
    document.getElementById("iron").innerText = ironCost;
    document.getElementById("gold").innerText = goldCost;
    document.getElementById("recruits").innerText = horsemen + knights;
    document.getElementById("horses").innerText = horsemen + knights;
}

document.getElementById("horsemen").addEventListener("input", stablesTrainCost);
document.getElementById("knights").addEventListener("input", stablesTrainCost);
document.getElementById("horsemanAttackDamage").innerText = horseman.attackDamage;
document.getElementById("horsemanDefenseDamage").innerText = horseman.defenseDamage;
document.getElementById("knightAttackDamage").innerText = knight.attackDamage;
document.getElementById("knightDefenseDamage").innerText = knight.defenseDamage;