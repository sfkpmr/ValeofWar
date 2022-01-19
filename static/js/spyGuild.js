const spy = { grain: 100, lumber: 0, iron: 50, gold: 50, attack: 10, levelRequirement: 0 };
const sentry = { grain: 100, lumber: 0, iron: 25, gold: 15, defense: 10, levelRequirement: 5 };
const rope = { lumber: 50, iron: 25, attack: 30, levelRequirement: 0 };
const net = { lumber: 100, iron: 50, defense: 25, levelRequirement: 5 };
const spyglass = { lumber: 15, iron: 50, gold: 25, attack: 25, defense: 10, levelRequirement: 5 };
const poison = { grain: 100, gold: 100, attack: 50, levelRequirement: 10 };

function trainingCost() {
    let grainCost = 0, lumberCost = 0, ironCost = 0, goldCost = 0;

    let spies = parseInt(document.getElementById('spies').value);
    let sentries = parseInt(document.getElementById('sentries').value);

    if (spies < 0 || isNaN(spies)) {
        spies = 0;
        document.getElementById('spies').value = 0;
    } else if (spies > 9999) {
        spies = 9999;
        document.getElementById('spies').value = 9999;
    }
    if (sentries < 0 || isNaN(sentries)) {
        sentries = 0;
        document.getElementById('sentries').value = 0;
    } else if (sentries > 9999) {
        sentries = 9999;
        document.getElementById('sentries').value = 9999;
    }

    grainCost += spies * spy.grain;
    grainCost += sentries * sentry.grain;

    lumberCost += spies * spy.lumber;
    lumberCost += sentries * sentry.lumber;

    ironCost += spies * spy.iron;
    ironCost += sentries * sentry.iron;

    goldCost += spies * spy.gold;
    goldCost += sentries * sentry.gold;

    document.getElementById("trainGrain").innerText = grainCost;
    document.getElementById("trainLumber").innerText = lumberCost;
    document.getElementById("trainIron").innerText = ironCost;
    document.getElementById("trainGold").innerText = goldCost;

}

function craftingCost() {
    let grainCost = 0, lumberCost = 0, ironCost = 0, goldCost = 0;

    let ropes = parseInt(document.getElementById('ropes').value);
    let nets = parseInt(document.getElementById('nets').value);
    let spyglasses = parseInt(document.getElementById('spyglasses').value);
    let poisons = parseInt(document.getElementById('poisons').value);

    if (ropes < 0 || isNaN(ropes)) {
        ropes = 0;
        document.getElementById('ropes').value = 0;
    } else if (ropes > 9999) {
        ropes = 9999;
        document.getElementById('ropes').value = 9999;
    }
    if (nets < 0 || isNaN(nets)) {
        nets = 0;
        document.getElementById('nets').value = 0;
    } else if (nets > 9999) {
        nets = 9999;
        document.getElementById('nets').value = 9999;
    }
    if (spyglasses < 0 || isNaN(spyglasses)) {
        spyglasses = 0;
        document.getElementById('spyglasses').value = 0;
    } else if (spyglasses > 9999) {
        spyglasses = 9999;
        document.getElementById('spyglasses').value = 9999;
    }
    if (poisons < 0 || isNaN(poisons)) {
        poisons = 0;
        document.getElementById('poisons').value = 0;
    } else if (poisons > 9999) {
        poisons = 9999;
        document.getElementById('poisons').value = 9999;
    }

    grainCost += poisons * poison.grain;

    lumberCost += ropes * rope.lumber;
    lumberCost += nets * net.lumber;
    lumberCost += spyglasses * spyglass.lumber;

    ironCost += ropes * rope.iron;
    ironCost += nets * net.iron;
    ironCost += spyglasses * spyglass.iron;

    goldCost += spyglasses * spyglass.gold;
    goldCost += poisons * poison.gold;

    document.getElementById("craftGrain").innerText = grainCost;
    document.getElementById("craftLumber").innerText = lumberCost;
    document.getElementById("craftIron").innerText = ironCost;
    document.getElementById("craftGold").innerText = goldCost;

}

document.getElementById("spies").addEventListener("input", trainingCost);
document.getElementById("sentries").addEventListener("input", trainingCost);
document.getElementById("ropes").addEventListener("input", craftingCost);
document.getElementById("nets").addEventListener("input", craftingCost);
document.getElementById("spyglasses").addEventListener("input", craftingCost);
document.getElementById("poisons").addEventListener("input", craftingCost);
document.getElementById("spyAttack").innerText = spy.attack;
document.getElementById("sentryDefense").innerText = sentry.defense;
document.getElementById("sentryLevelRequirement").innerText = sentry.levelRequirement;
document.getElementById("ropeAttack").innerText = rope.attack;
document.getElementById("netDefense").innerText = net.defense;
document.getElementById("netLevelRequirement").innerText = net.levelRequirement;
document.getElementById("spyglassAttack").innerText = spyglass.attack;
document.getElementById("spyglassDefense").innerText = spyglass.defense;
document.getElementById("spyglassLevelRequirement").innerText = spyglass.levelRequirement;
document.getElementById("poisonAttack").innerText = poison.attack;
document.getElementById("poisonLevelRequirement").innerText = poison.levelRequirement;