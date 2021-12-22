function craftingCost(val) {
    let lumberCost = 0, ironCost = 0, goldCost = 0;

    ironCost += parseInt(document.getElementById('boots').value) * 10;

    ironCost += parseInt(document.getElementById('bracers').value) * 10;

    ironCost += parseInt(document.getElementById('helmet').value) * 20;

    ironCost += parseInt(document.getElementById('lance').value) * 50;
    goldCost += parseInt(document.getElementById('lance').value) * 10;

    lumberCost += parseInt(document.getElementById('longbow').value) * 20;
    goldCost += parseInt(document.getElementById('longbow').value) * 10;

    lumberCost += parseInt(document.getElementById('shield').value) * 50;
    ironCost += parseInt(document.getElementById('shield').value) * 10;

    lumberCost += parseInt(document.getElementById('spear').value) * 50;
    ironCost += parseInt(document.getElementById('spear').value) * 5;

    ironCost += parseInt(document.getElementById('sword').value) * 50;
    goldCost += parseInt(document.getElementById('sword').value) * 10;

    document.getElementById("lumber").innerHTML = lumberCost;
    document.getElementById("iron").innerHTML = ironCost;
    document.getElementById("gold").innerHTML = goldCost;

}

document.getElementById("boots").addEventListener("input", craftingCost);
document.getElementById("bracers").addEventListener("input", craftingCost);
document.getElementById("helmet").addEventListener("input", craftingCost);
document.getElementById("lance").addEventListener("input", craftingCost);
document.getElementById("longbow").addEventListener("input", craftingCost);
document.getElementById("shield").addEventListener("input", craftingCost);
document.getElementById("spear").addEventListener("input", craftingCost);
document.getElementById("sword").addEventListener("input", craftingCost);