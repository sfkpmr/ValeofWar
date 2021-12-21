function barracksTrainCost(val) {

    grainCost = 0, lumberCost = 0, ironCost = 0, goldCost = 0;

    grainCost += parseInt(document.getElementById('archers').value) * 10;
    lumberCost += parseInt(document.getElementById('archers').value) * 20;
    goldCost += parseInt(document.getElementById('archers').value) * 10;

    grainCost += parseInt(document.getElementById('spearmen').value) * 10;
    lumberCost += parseInt(document.getElementById('spearmen').value) * 5;

    grainCost += parseInt(document.getElementById('swordsmen').value) * 10;
    ironCost += parseInt(document.getElementById('swordsmen').value) * 20;
    goldCost += parseInt(document.getElementById('swordsmen').value) * 10;

    document.getElementById("grain").innerHTML = grainCost; 
    document.getElementById("lumber").innerHTML = lumberCost; 
    document.getElementById("iron").innerHTML = ironCost; 
    document.getElementById("gold").innerHTML = goldCost; 
    document.getElementById("recruits").innerHTML = parseInt(document.getElementById('archers').value) + parseInt(document.getElementById('spearmen').value) 
    + parseInt(document.getElementById('swordsmen').value); 

}

function stablesTrainCost(val) {

    grainCost = 0, lumberCost = 0, ironCost = 0, goldCost = 0;

    grainCost += parseInt(document.getElementById('horsemen').value) * 10;
    lumberCost += parseInt(document.getElementById('horsemen').value) * 10;
   
    goldCost += parseInt(document.getElementById('knights').value) * 25;
    grainCost += parseInt(document.getElementById('knights').value) * 30;
    ironCost += parseInt(document.getElementById('knights').value) * 20;

    document.getElementById("grain").innerHTML = grainCost; 
    document.getElementById("lumber").innerHTML = lumberCost; 
    document.getElementById("iron").innerHTML = ironCost; 
    document.getElementById("gold").innerHTML = goldCost; 
    document.getElementById("recruits").innerHTML = parseInt(document.getElementById('horsemen').value) + parseInt(document.getElementById('knights').value); 
    document.getElementById("horses").innerHTML = parseInt(document.getElementById('horsemen').value) + parseInt(document.getElementById('knights').value); 
}

function craftingCost(val) {

    lumberCost = 0, ironCost = 0, goldCost = 0;

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
