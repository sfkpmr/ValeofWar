const boot = { iron: 25, attackDamage: 10, defenseDamage: 10 };
const bracer = { iron: 25, attackDamage: 5, defenseDamage: 10 };
const helmet = { iron: 50, attackDamage: 15, defenseDamage: 15 };
const lance = { lumber: 100, iron: 50, gold: 10, attackDamage: 25, defenseDamage: 10 };
const longbow = { lumber: 50, iron: 10, attackDamage: 20, defenseDamage: 30 };
const shield = { lumber: 50, iron: 25, attackDamage: 10, defenseDamage: 20 };
const spear = { lumber: 100, iron: 5, attackDamage: 10, defenseDamage: 25 };
const sword = { iron: 50, gold: 15, attackDamage: 10, defenseDamage: 10 };

function craftingCost(val) {
    let lumberCost = 0, ironCost = 0, goldCost = 0;

    boots = document.getElementById('boots').value;
    bracers = document.getElementById('bracers').value;
    helmets = document.getElementById('helmet').value;
    lances = document.getElementById('lance').value;
    longbows = document.getElementById('longbow').value;
    shields = document.getElementById('shield').value;
    spears = document.getElementById('spear').value;
    swords = document.getElementById('sword').value;

    lumberCost += lances * lance.lumber;
    lumberCost += longbows * longbow.lumber;
    lumberCost += shields * shield.lumber;
    lumberCost += spears * spear.lumber;

    ironCost += boots * boot.iron;
    ironCost += bracers * bracer.iron;
    ironCost += helmets * helmet.iron;
    ironCost += lances * lance.iron;
    ironCost += longbows * longbow.iron;
    ironCost += shields * shield.iron;
    ironCost += spears * spear.iron;
    ironCost += swords * sword.iron;

    goldCost += lances * lance.gold;
    goldCost += swords * sword.gold;

    document.getElementById("lumber").innerText = lumberCost;
    document.getElementById("iron").innerText = ironCost;
    document.getElementById("gold").innerText = goldCost;

}

document.getElementById("boots").addEventListener("input", craftingCost);
document.getElementById("bracers").addEventListener("input", craftingCost);
document.getElementById("helmet").addEventListener("input", craftingCost);
document.getElementById("lance").addEventListener("input", craftingCost);
document.getElementById("longbow").addEventListener("input", craftingCost);
document.getElementById("shield").addEventListener("input", craftingCost);
document.getElementById("spear").addEventListener("input", craftingCost);
document.getElementById("sword").addEventListener("input", craftingCost);
document.getElementById("bootAttackDamage").innerText = boot.attackDamage;
document.getElementById("bootDefenseDamage").innerText = boot.defenseDamage;
document.getElementById("bracerAttackDamage").innerText = bracer.attackDamage;
document.getElementById("bracerDefenseDamage").innerText = bracer.defenseDamage;
document.getElementById("helmetAttackDamage").innerText = helmet.attackDamage;
document.getElementById("helmetDefenseDamage").innerText = helmet.defenseDamage;
document.getElementById("lanceAttackDamage").innerText = lance.attackDamage;
document.getElementById("lanceDefenseDamage").innerText = lance.defenseDamage;
document.getElementById("longbowAttackDamage").innerText = longbow.attackDamage;
document.getElementById("longbowDefenseDamage").innerText = longbow.defenseDamage;
document.getElementById("shieldAttackDamage").innerText = shield.attackDamage;
document.getElementById("shieldDefenseDamage").innerText = shield.defenseDamage;
document.getElementById("spearAttackDamage").innerText = spear.attackDamage;
document.getElementById("spearDefenseDamage").innerText = spear.defenseDamage;
document.getElementById("swordAttackDamage").innerText = sword.attackDamage;
document.getElementById("swordDefenseDamage").innerText = sword.defenseDamage;