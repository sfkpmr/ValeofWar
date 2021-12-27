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
document.getElementById("bootAttackDamage").innerHTML = boot.attackDamage;
document.getElementById("bootDefenseDamage").innerHTML = boot.defenseDamage;
document.getElementById("bracerAttackDamage").innerHTML = bracer.attackDamage;
document.getElementById("bracerDefenseDamage").innerHTML = bracer.defenseDamage;
document.getElementById("helmetAttackDamage").innerHTML = helmet.attackDamage;
document.getElementById("helmetDefenseDamage").innerHTML = helmet.defenseDamage;
document.getElementById("lanceAttackDamage").innerHTML = lance.attackDamage;
document.getElementById("lanceDefenseDamage").innerHTML = lance.defenseDamage;
document.getElementById("longbowAttackDamage").innerHTML = longbow.attackDamage;
document.getElementById("longbowDefenseDamage").innerHTML = longbow.defenseDamage;
document.getElementById("shieldAttackDamage").innerHTML = shield.attackDamage;
document.getElementById("shieldDefenseDamage").innerHTML = shield.defenseDamage;
document.getElementById("spearAttackDamage").innerHTML = spear.attackDamage;
document.getElementById("spearDefenseDamage").innerHTML = spear.defenseDamage;
document.getElementById("swordAttackDamage").innerHTML = sword.attackDamage;
document.getElementById("swordDefenseDamage").innerHTML = sword.defenseDamage;