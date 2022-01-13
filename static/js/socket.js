var socket = io();

socket.on('sync', async function () {
    console.log("Socket connected.")
    let response = await fetch(`/api/getUser/${socket.id}`);

    if (response.ok) {
        let json = await response.json();
        document.getElementById("grain").innerText = json.grain;
        document.getElementById("lumber").innerText = json.lumber;
        document.getElementById("stone").innerText = json.stone;
        document.getElementById("iron").innerText = json.iron;
        document.getElementById("gold").innerText = json.gold;
        document.getElementById("recruits").innerText = json.recruits;
        document.getElementById("horses").innerText = json.horses;

        document.getElementById("archers").innerText = json.archers;
        document.getElementById("spearmen").innerText = json.spearmen;
        document.getElementById("swordsmen").innerText = json.swordsmen;
        document.getElementById("horsemen").innerText = json.horsemen;
        document.getElementById("knights").innerText = json.knights;
        document.getElementById("batteringrams").innerText = json.batteringrams;
        document.getElementById("siegetowers").innerText = json.siegetowers;
        document.getElementById("longbowmen").innerText = json.longbowmen;
        document.getElementById("crossbowmen").innerText = json.crossbowmen;
        document.getElementById("halberdiers").innerText = json.halberdiers;
        document.getElementById("twoHandedSwordsmen").innerText = json.twoHandedSwordsmen;
        document.getElementById("ballistas").innerText = json.ballistas;
        document.getElementById("trebuchets").innerText = json.trebuchets;
        document.getElementById("horseArchers").innerText = json.horseArchers;
    } else {
        alert("HTTP-Error: " + response.status);
    }
});
socket.on('updatePower', async function () {
    let response = await fetch("/api/getPowers");

    if (response.ok) {
        let json = await response.json();
        document.getElementById("attack").innerText = json.attack;
        document.getElementById("defense").innerText = json.defense;
    } else {
        alert("HTTP-Error: " + response.status);
    }
});
socket.on('getIncomes', async function () {
    let response = await fetch("/api/getIncomes");

    if (response.ok) {
        let json = await response.json();
        document.getElementById("grainIncome").innerText = json.grainIncome;
        document.getElementById("lumberIncome").innerText = json.lumberIncome;
        document.getElementById("stoneIncome").innerText = json.stoneIncome;
        document.getElementById("ironIncome").innerText = json.ironIncome;
        document.getElementById("goldIncome").innerText = json.goldIncome;
        document.getElementById("recruitsIncome").innerText = json.recruitsIncome;
        document.getElementById("horseIncome").innerText = json.horseIncome;
    } else {
        alert("HTTP-Error: " + response.status);
    }
});