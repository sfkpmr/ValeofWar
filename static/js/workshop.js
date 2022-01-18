const batteringRam = { lumber: 1500, iron: 500, gold: 150, attackDamage: 75, levelRequirement: 5 };
const siegeTower = { lumber: 3000, iron: 500, gold: 300, attackDamage: 150, levelRequirement: 10 };
const ballista = { lumber: 400, iron: 100, gold: 100, attackDamage: 150, defenseDamage: 300, levelRequirement: 15 };
const trebuchet = { lumber: 750, iron: 100, gold: 0, attackDamage: 250, levelRequirement: 20 };

function workshopBuildCost() {
    var lumberCost = 0, ironCost = 0, goldCost = 0;

    let batteringRams = parseInt(document.getElementById('batteringRam').value);
    let siegeTowers = parseInt(document.getElementById('siegeTower').value);
    let ballistas = parseInt(document.getElementById('ballista').value);
    let trebuchets = parseInt(document.getElementById('trebuchet').value);

    if (batteringRams < 0 || isNaN(batteringRams)) {
        batteringRams = 0;
        document.getElementById("batteringRam").value = 0;
    } else if (batteringRams > 9999) {
        batteringRams = 9999;
        document.getElementById("batteringRam").value = 9999;
    }
    if (siegeTowers < 0 || isNaN(siegeTowers)) {
        siegeTowers = 0;
        document.getElementById("siegeTower").value = 0;
    } else if (siegeTowers > 9999) {
        siegeTowers = 9999;
        document.getElementById("siegeTower").value = 9999;
    }
    if (ballistas < 0 || isNaN(ballistas)) {
        ballistas = 0;
        document.getElementById("ballista").value = 0;
    } else if (ballistas > 9999) {
        ballistas = 9999;
        document.getElementById("ballista").value = 9999;
    }
    if (trebuchets < 0 || isNaN(trebuchets)) {
        trebuchets = 0;
        document.getElementById("trebuchet").value = 0;
    } else if (trebuchets > 9999) {
        trebuchets = 9999;
        document.getElementById("trebuchet").value = 9999;
    }

    lumberCost += batteringRams * batteringRam.lumber;
    lumberCost += siegeTowers * siegeTower.lumber;
    lumberCost += ballistas * ballista.lumber;
    lumberCost += trebuchets * trebuchet.lumber;

    ironCost += batteringRams * batteringRam.iron;
    ironCost += siegeTowers * siegeTower.iron;
    ironCost += ballistas * ballista.iron;
    ironCost += trebuchets * trebuchet.iron;

    goldCost += batteringRams * batteringRam.gold;
    goldCost += siegeTowers * siegeTower.gold;
    goldCost += ballistas * ballista.gold;
    goldCost += trebuchets * trebuchet.gold;

    document.getElementById("lumber").innerText = lumberCost;
    document.getElementById("iron").innerText = ironCost;
    document.getElementById("gold").innerText = goldCost;
    document.getElementById("recruits").innerText = (ballistas + trebuchets) * 5;
}

document.getElementById("batteringRam").addEventListener("input", workshopBuildCost);
document.getElementById("siegeTower").addEventListener("input", workshopBuildCost);
document.getElementById("ballista").addEventListener("input", workshopBuildCost);
document.getElementById("trebuchet").addEventListener("input", workshopBuildCost);
document.getElementById("batteringRamAttackDamage").innerText = batteringRam.attackDamage;
document.getElementById("batteringRamLevelRequirement").innerText = batteringRam.levelRequirement;
document.getElementById("siegeTowerAttackDamage").innerText = siegeTower.attackDamage;
document.getElementById("siegeTowerLevelRequirement").innerText = siegeTower.levelRequirement;
document.getElementById("ballistaAttackDamage").innerText = ballista.attackDamage;
document.getElementById("ballistaDefenseDamage").innerText = ballista.defenseDamage;
document.getElementById("ballistaLevelRequirement").innerText = ballista.levelRequirement;
document.getElementById("trebuchetAttackDamage").innerText = trebuchet.attackDamage;
document.getElementById("trebuchetLevelRequirement").innerText = trebuchet.levelRequirement;