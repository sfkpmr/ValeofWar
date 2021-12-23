var socket = io();

//fix
socket.on('sync', async function () {
    console.log("Socket connected.")
    await fetch(`/getUser/${socket.id}`)
});

socket.on('updateGrain', async function (msg) {
    document.getElementById("grain").innerHTML = msg;
});
socket.on('updateLumber', async function (msg) {
    document.getElementById("lumber").innerHTML = msg;
});
socket.on('updateStone', async function (msg) {
    document.getElementById("stone").innerHTML = msg;
});
socket.on('updateIron', async function (msg) {
    document.getElementById("iron").innerHTML = msg;
});
socket.on('updateGold', async function (msg) {
    document.getElementById("gold").innerHTML = msg;
});
socket.on('updateRecruits', async function (msg) {
    document.getElementById("recruits").innerHTML = msg;
});
socket.on('updateHorses', async function (msg) {
    document.getElementById("horses").innerHTML = msg;
});
socket.on('updateArchers', async function (msg) {
    document.getElementById("archers").innerHTML = msg;
});
socket.on('updateSpearmen', async function (msg) {
    document.getElementById("spearmen").innerHTML = msg;
});
socket.on('updateSwordsmen', async function (msg) {
    document.getElementById("swordsmen").innerHTML = msg;
});
socket.on('updateHorsemen', async function (msg) {
    document.getElementById("horsemen").innerHTML = msg;
});
socket.on('updateKnights', async function (msg) {
    document.getElementById("knights").innerHTML = msg;
});
socket.on('updateBatteringRams', async function (msg) {
    document.getElementById("batteringrams").innerHTML = msg;
});
socket.on('updateSiegeTowers', async function (msg) {
    document.getElementById("siegetowers").innerHTML = msg;
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