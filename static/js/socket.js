var socket = io();

socket.on('sync', async function () {
    console.log("Socket connected.")
    await fetch(`/api/getUser/${socket.id}`)
});

socket.on('updateGrain', async function (data) {
    document.getElementById("grain").innerText = data;
});
socket.on('updateLumber', async function (data) {
    document.getElementById("lumber").innerText = data;
});
socket.on('updateStone', async function (data) {
    document.getElementById("stone").innerText = data;
});
socket.on('updateIron', async function (data) {
    document.getElementById("iron").innerText = data;
});
socket.on('updateGold', async function (data) {
    document.getElementById("gold").innerText = data;
});
socket.on('updateRecruits', async function (data) {
    document.getElementById("recruits").innerText = data;
});
socket.on('updateHorses', async function (data) {
    document.getElementById("horses").innerText = data;
});
socket.on('updateArchers', async function (data) {
    document.getElementById("archers").innerText = data;
});
socket.on('updateSpearmen', async function (data) {
    document.getElementById("spearmen").innerText = data;
});
socket.on('updateSwordsmen', async function (data) {
    document.getElementById("swordsmen").innerText = data;
});
socket.on('updateHorsemen', async function (data) {
    document.getElementById("horsemen").innerText = data;
});
socket.on('updateKnights', async function (data) {
    document.getElementById("knights").innerText = data;
});
socket.on('updateBatteringRams', async function (data) {
    document.getElementById("batteringrams").innerText = data;
});
socket.on('updateSiegeTowers', async function (data) {
    document.getElementById("siegetowers").innerText = data;
});
socket.on('updatePower', async function () {
    let attackResponse = await fetch("/api/getAttackPower");
    let defenseResponse = await fetch("/api/getDefensePower");

    if (attackResponse.ok) {
        let json = await attackResponse.json();
        document.getElementById("attack").innerText = json;
    } else {
        alert("HTTP-Error: " + attackResponse.status);
    }

    if (defenseResponse.ok) {
        let json = await defenseResponse.json();
        document.getElementById("defense").innerText = json;
    } else {
        alert("HTTP-Error: " + defenseResponse.status);
    }
});
socket.on('getGrainIncome', async function () {
    let response = await fetch("/api/getGrainIncome");

    if (response.ok) {
        let json = await response.json();
        document.getElementById("grainIncome").innerText = json;
    } else {
        alert("HTTP-Error: " + response.status);
    }
});
socket.on('getLumberIncome', async function () {
    let response = await fetch("/api/getLumberIncome");

    if (response.ok) {
        let json = await response.json();
        document.getElementById("lumberIncome").innerText = json;
    } else {
        alert("HTTP-Error: " + response.status);
    }
});
socket.on('getStoneIncome', async function () {
    let response = await fetch("/api/getStoneIncome");

    if (response.ok) {
        let json = await response.json();
        document.getElementById("stoneIncome").innerText = json;
    } else {
        alert("HTTP-Error: " + response.status);
    }
});
socket.on('getIronIncome', async function () {
    let response = await fetch("/api/getIronIncome");

    if (response.ok) {
        let json = await response.json();
        document.getElementById("ironIncome").innerText = json;
    } else {
        alert("HTTP-Error: " + response.status);
    }
});
socket.on('getGoldIncome', async function () {
    let response = await fetch("/api/getGoldIncome");

    if (response.ok) {
        let json = await response.json();
        document.getElementById("goldIncome").innerText = json;
    } else {
        alert("HTTP-Error: " + response.status);
    }
});
socket.on('getRecruitsIncome', async function () {
    let response = await fetch("/api/getRecruitsIncome");

    if (response.ok) {
        let json = await response.json();
        document.getElementById("recruitsIncome").innerText = json;
    } else {
        alert("HTTP-Error: " + response.status);
    }
});
socket.on('getHorseIncome', async function () {
    let response = await fetch("/api/getHorseIncome");

    if (response.ok) {
        let json = await response.json();
        document.getElementById("horseIncome").innerText = json;
    } else {
        alert("HTTP-Error: " + response.status);
    }
});