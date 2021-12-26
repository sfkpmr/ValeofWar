var socket = io();

socket.on('sync', async function () {
    console.log("Socket connected.")
    await fetch(`/api/getUser/${socket.id}`)
});

socket.on('updateGrain', async function (data) {
    document.getElementById("grain").innerHTML = data;
});
socket.on('updateLumber', async function (data) {
    document.getElementById("lumber").innerHTML = data;
});
socket.on('updateStone', async function (data) {
    document.getElementById("stone").innerHTML = data;
});
socket.on('updateIron', async function (data) {
    document.getElementById("iron").innerHTML = data;
});
socket.on('updateGold', async function (data) {
    document.getElementById("gold").innerHTML = data;
});
socket.on('updateRecruits', async function (data) {
    document.getElementById("recruits").innerHTML = data;
});
socket.on('updateHorses', async function (data) {
    document.getElementById("horses").innerHTML = data;
});
socket.on('updateArchers', async function (data) {
    document.getElementById("archers").innerHTML = data;
});
socket.on('updateSpearmen', async function (data) {
    document.getElementById("spearmen").innerHTML = data;
});
socket.on('updateSwordsmen', async function (data) {
    document.getElementById("swordsmen").innerHTML = data;
});
socket.on('updateHorsemen', async function (data) {
    document.getElementById("horsemen").innerHTML = data;
});
socket.on('updateKnights', async function (data) {
    document.getElementById("knights").innerHTML = data;
});
socket.on('updateBatteringRams', async function (data) {
    document.getElementById("batteringrams").innerHTML = data;
});
socket.on('updateSiegeTowers', async function (data) {
    document.getElementById("siegetowers").innerHTML = data;
});
socket.on('updatePower', async function () {
    let attackResponse = await fetch("/api/getAttackPower");
    let defenseResponse = await fetch("/api/getDefensePower");

    if (attackResponse.ok) {
        let json = await attackResponse.json();
        document.getElementById("attack").innerHTML = json;
    } else {
        alert("HTTP-Error: " + attackResponse.status);
    }

    if (defenseResponse.ok) {
        let json = await defenseResponse.json();
        document.getElementById("defense").innerHTML = json;
    } else {
        alert("HTTP-Error: " + defenseResponse.status);
    }
});
socket.on('getGrainIncome', async function () {
    let response = await fetch("/api/getGrainIncome");

    if (response.ok) {
        let json = await response.json();
        document.getElementById("grainIncome").innerHTML = json;
    } else {
        alert("HTTP-Error: " + response.status);
    }
});
socket.on('getLumberIncome', async function () {
    let response = await fetch("/api/getLumberIncome");

    if (response.ok) {
        let json = await response.json();
        document.getElementById("lumberIncome").innerHTML = json;
    } else {
        alert("HTTP-Error: " + response.status);
    }
});
socket.on('getStoneIncome', async function () {
    let response = await fetch("/api/getStoneIncome");

    if (response.ok) {
        let json = await response.json();
        document.getElementById("stoneIncome").innerHTML = json;
    } else {
        alert("HTTP-Error: " + response.status);
    }
});
socket.on('getIronIncome', async function () {
    let response = await fetch("/api/getIronIncome");

    if (response.ok) {
        let json = await response.json();
        document.getElementById("ironIncome").innerHTML = json;
    } else {
        alert("HTTP-Error: " + response.status);
    }
});
socket.on('getGoldIncome', async function () {
    let response = await fetch("/api/getGoldIncome");

    if (response.ok) {
        let json = await response.json();
        document.getElementById("goldIncome").innerHTML = json;
    } else {
        alert("HTTP-Error: " + response.status);
    }
});