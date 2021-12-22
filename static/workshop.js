function workshopBuildCost(val) {

    console.log(parseInt(document.getElementById('batteringram').value))

    lumberCost = parseInt(document.getElementById('batteringram').value) * 100;
    ironCost = parseInt(document.getElementById('batteringram').value) * 25;
    goldCost = parseInt(document.getElementById('batteringram').value) * 25;

    lumberCost += parseInt(document.getElementById('siegetower').value) * 500;
    ironCost += parseInt(document.getElementById('siegetower').value) * 100;
    goldCost += parseInt(document.getElementById('siegetower').value) * 100;

    document.getElementById("lumber").innerHTML = lumberCost;
    document.getElementById("iron").innerHTML = ironCost;
    document.getElementById("gold").innerHTML = goldCost;

}

document.getElementById("batteringram").addEventListener("input", workshopBuildCost);
document.getElementById("siegetower").addEventListener("input", workshopBuildCost);