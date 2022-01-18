function offerLimits() {

    let sellAmount = parseInt(document.getElementById("sellAmount").value);
    let buyAmount = parseInt(document.getElementById("buyAmount").value);

    if (sellAmount < 0 || isNaN(sellAmount)) {
        document.getElementById('sellAmount').value = 0;
    } else if (sellAmount > 9999) {
        document.getElementById('sellAmount').value = 9999;
    }
    if (buyAmount < 0 || isNaN(buyAmount)) {
        document.getElementById('buyAmount').value = 0;
    } else if (buyAmount > 9999) {
        document.getElementById('buyAmount').value = 9999;
    }
}

document.getElementById("buyAmount").addEventListener("input", offerLimits);
document.getElementById("sellAmount").addEventListener("input", offerLimits);