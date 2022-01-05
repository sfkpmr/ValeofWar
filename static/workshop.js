const batteringRam = { lumber: 500, iron: 100, gold: 50, attackDamage: 250 };
const siegeTower = { lumber: 1000, iron: 100, gold: 100, attackDamage: 500 };

function workshopBuildCost() {
    var lumberCost = 0, ironCost = 0, goldCost = 0;

    let batteringRams = parseInt(document.getElementById('batteringram').value);
    let siegeTowers = parseInt(document.getElementById('siegetower').value);

    if (batteringRams < 0 || isNaN(batteringRams)) {
        batteringRams = 0;
        document.getElementById("batteringram").value = 0;
    }
    if (siegeTowers < 0 || isNaN(siegeTowers)) {
        siegeTowers = 0;
        document.getElementById("siegetower").value = 0;
    }

    lumberCost += batteringRams * batteringRam.lumber;
    lumberCost += siegeTowers * siegeTower.lumber;

    ironCost += batteringRams * batteringRam.iron;
    ironCost += siegeTowers * siegeTower.iron;

    goldCost += batteringRams * batteringRam.gold;
    goldCost += siegeTowers * siegeTower.gold;

    document.getElementById("lumber").innerText = lumberCost;
    document.getElementById("iron").innerText = ironCost;
    document.getElementById("gold").innerText = goldCost;

}

document.getElementById("batteringram").addEventListener("input", workshopBuildCost);
document.getElementById("siegetower").addEventListener("input", workshopBuildCost);
document.getElementById("batteringramAttackDamage").innerText = batteringRam.attackDamage;
document.getElementById("siegetowerAttackDamage").innerText = siegeTower.attackDamage;