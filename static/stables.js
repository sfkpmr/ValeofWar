function stablesTrainCost(val) {
    let grainCost = 0, lumberCost = 0, ironCost = 0, goldCost = 0;

    horsemen = document.getElementById('horsemen').value
    knights = document.getElementById('knights').value

    grainCost += parseInt(horsemen) * 10;
    lumberCost += parseInt(horsemen) * 10;

    goldCost += parseInt(knights) * 25;
    grainCost += parseInt(knights) * 30;
    ironCost += parseInt(knights) * 20;

    document.getElementById("grain").innerHTML = grainCost;
    document.getElementById("lumber").innerHTML = lumberCost;
    document.getElementById("iron").innerHTML = ironCost;
    document.getElementById("gold").innerHTML = goldCost;
    document.getElementById("recruits").innerHTML = parseInt(horsemen) + parseInt(knights);
    document.getElementById("horses").innerHTML = parseInt(horsemen) + parseInt(knights);
}

document.getElementById("horsemen").addEventListener("input", stablesTrainCost);
document.getElementById("knights").addEventListener("input", stablesTrainCost);