const horseman = { grain: 100, iron: 25 };
const knight = { grain: 100, iron: 100, gold: 50 };

function stablesTrainCost(val) {
    let grainCost = 0, lumberCost = 0, ironCost = 0, goldCost = 0;

    horsemen = document.getElementById('horsemen').value;
    knights = document.getElementById('knights').value;

    grainCost += horsemen * horseman.grain;
    grainCost += knights * knight.grain;

    ironCost += horsemen * horseman.iron;
    ironCost += knights * knight.iron;

    goldCost += knights * knight.gold;

    document.getElementById("grain").innerHTML = grainCost;
    document.getElementById("lumber").innerHTML = lumberCost;
    document.getElementById("iron").innerHTML = ironCost;
    document.getElementById("gold").innerHTML = goldCost;
    document.getElementById("recruits").innerHTML = parseInt(horsemen) + parseInt(knights);
    document.getElementById("horses").innerHTML = parseInt(horsemen) + parseInt(knights);
}

document.getElementById("horsemen").addEventListener("input", stablesTrainCost);
document.getElementById("knights").addEventListener("input", stablesTrainCost);