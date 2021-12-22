function barracksTrainCost() {
    let grainCost = 0, lumberCost = 0, ironCost = 0, goldCost = 0;

    archers = document.getElementById("archers").value;
    spearmen = document.getElementById("spearmen").value;
    swordsmen = document.getElementById("swordsmen").value;

    grainCost += parseInt(archers) * 10;
    lumberCost += parseInt(archers) * 20;
    goldCost += parseInt(archers) * 10;

    grainCost += parseInt(spearmen) * 10;
    lumberCost += parseInt(spearmen) * 5;

    grainCost += parseInt(swordsmen) * 10;
    ironCost += parseInt(swordsmen) * 20;
    goldCost += parseInt(swordsmen) * 10;

    document.getElementById("grain").innerHTML = grainCost;
    document.getElementById("lumber").innerHTML = lumberCost;
    document.getElementById("iron").innerHTML = ironCost;
    document.getElementById("gold").innerHTML = goldCost;
    document.getElementById("recruits").innerHTML = parseInt(archers) + parseInt(spearmen) + parseInt(swordsmen);
}

document.getElementById("archers").addEventListener("input", barracksTrainCost);
document.getElementById("spearmen").addEventListener("input", barracksTrainCost);
document.getElementById("swordsmen").addEventListener("input", barracksTrainCost);