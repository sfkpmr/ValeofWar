const horseman = { grain: 100, iron: 25, attackDamage: 5, defenseDamage: 5 };
const knight = { grain: 100, iron: 100, gold: 50, attackDamage: 20, defenseDamage: 20 };

function stablesTrainCost(val) {
    let grainCost = 0, lumberCost = 0, ironCost = 0, goldCost = 0;

    horsemen = document.getElementById('horsemen').value;
    knights = document.getElementById('knights').value;

    grainCost += horsemen * horseman.grain;
    grainCost += knights * knight.grain;

    ironCost += horsemen * horseman.iron;
    ironCost += knights * knight.iron;

    goldCost += knights * knight.gold;

    document.getElementById("grain").innerText = grainCost;
    document.getElementById("iron").innerText = ironCost;
    document.getElementById("gold").innerText = goldCost;
    document.getElementById("recruits").innerText = parseInt(horsemen) + parseInt(knights);
    document.getElementById("horses").innerText = parseInt(horsemen) + parseInt(knights);
}

document.getElementById("horsemen").addEventListener("input", stablesTrainCost);
document.getElementById("knights").addEventListener("input", stablesTrainCost);
document.getElementById("horsemanAttackDamage").innerText = horseman.attackDamage;
document.getElementById("horsemanDefenseDamage").innerText = horseman.defenseDamage;
document.getElementById("knightAttackDamage").innerText = knight.attackDamage;
document.getElementById("knightDefenseDamage").innerText = knight.defenseDamage;