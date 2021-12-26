const archer = { grain: 25, lumber: 50, gold: 10 };
const spearman = { grain: 25, lumber: 50 };
const swordsman = { grain: 50, iron: 50, gold: 25 };

function barracksTrainCost() {
    let grainCost = 0, lumberCost = 0, ironCost = 0, goldCost = 0;

    archers = document.getElementById("archers").value;
    spearmen = document.getElementById("spearmen").value;
    swordsmen = document.getElementById("swordsmen").value;


    grainCost += archers * archer.grain;
    grainCost += spearmen * spearman.grain;
    grainCost += swordsmen * swordsman.grain;

    lumberCost += archers * archer.lumber;
    lumberCost += spearmen * spearman.lumber;

    ironCost += swordsmen * swordsman.iron;

    goldCost += archers * archer.gold;
    goldCost += swordsmen * swordsman.gold;

    document.getElementById("grain").innerHTML = grainCost;
    document.getElementById("lumber").innerHTML = lumberCost;
    document.getElementById("iron").innerHTML = ironCost;
    document.getElementById("gold").innerHTML = goldCost;
    document.getElementById("recruits").innerHTML = parseInt(archers) + parseInt(spearmen) + parseInt(swordsmen);
}

document.getElementById("archers").addEventListener("input", barracksTrainCost);
document.getElementById("spearmen").addEventListener("input", barracksTrainCost);
document.getElementById("swordsmen").addEventListener("input", barracksTrainCost);