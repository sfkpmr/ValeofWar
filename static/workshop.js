const batteringRam = { lumber: 500, iron: 100, gold: 50 };
const siegeTower = { lumber: 1000, iron: 100, gold: 100 };

function workshopBuildCost() {

    var lumberCost = 0, ironCost = 0, goldCost = 0;

    batteringRams = parseInt(document.getElementById('batteringram').value);
    siegeTowers = parseInt(document.getElementById('batteringram').value);

    lumberCost += batteringRams * batteringRam.lumber;
    lumberCost += siegeTowers * siegeTower.lumber;

    ironCost += batteringRams * batteringRam.iron;
    ironCost += siegeTowers * siegeTower.iron;

    goldCost += batteringRams * batteringRam.gold;
    goldCost += siegeTowers * siegeTower.gold;

    document.getElementById("lumber").innerHTML = lumberCost;
    document.getElementById("iron").innerHTML = ironCost;
    document.getElementById("gold").innerHTML = goldCost;

}

document.getElementById("batteringram").addEventListener("input", workshopBuildCost);
document.getElementById("siegetower").addEventListener("input", workshopBuildCost);