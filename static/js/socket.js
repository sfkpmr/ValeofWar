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
        document.getElementById("spyAttack").innerText = json.spyAttack;
        document.getElementById("spyDefense").innerText = json.spyDefense;
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
socket.on('updateCountDown', async function () {
    let response = await fetch("/api/getTimeToNextUpdate");
    if (response.ok) {
        let json = await response.json();
        const date = new Date().getTime();
        countDownDate = new Date(date + json);
        timerFunction();
    } else {
        alert("HTTP-Error: " + response.status);
    }
});
socket.on('error', async function (message) {
    console.log(message)
    myFunction(message);
});

async function main() {
    let response = await fetch("/api/getTimeToNextUpdate");
    if (response.ok) {
        let json = await response.json();
        const date = new Date().getTime();
        countDownDate = new Date(date + json);
        timerFunction();
    } else {
        alert("HTTP-Error: " + response.status);
    }
}

main();

var countDownDate;

function timerFunction() {

    //console.log("pelle", countDownDate)
    // Update every second
    var x = setInterval(function () {
        // Get current time
        var now = new Date().getTime();

        var distance = countDownDate - now;

        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("time").innerHTML = minutes + "m " + seconds + "s ";

        if (distance < 0) {
            clearInterval(x);
            document.getElementById("time").innerHTML = "Per 15 min";
        }
    }, 1000);
}

function myFunction(message) {
    // Get the snackbar DIV
    document.getElementById("error").innerText = message;
    var x = document.getElementById("snackbar");
  
    // Add the "show" class to DIV
    x.className = "show";
  
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }