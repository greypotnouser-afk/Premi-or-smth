
let bossHP = 1000;
const maxBossHP = 1000;
let playerHP = 200;
const maxPlayerHP = 200;
let healCooldown = 0;
let isGameActive = false;
let turnInProgress = false;


const bossAttacks = [
    { name: "Deploying straight to Production on Friday", minDamage: 12, maxDamage: 22, text: "PREMIUM pushed untested code to prod. Your codebase is smoking." },
    { name: "Missing Semicolon curse", minDamage: 10, maxDamage: 18, text: "PREMIUM threw a SyntaxError. It compile-failed your health." },
    { name: "Severe coffee deprivation lash", minDamage: 14, maxDamage: 24, text: "PREMIUM hasn't had caffeine today. He lashed out with brutal logic." },
    { name: "Passive-Aggressive Code Review", minDamage: 8, maxDamage: 16, text: "PREMIUM requested 34 changes on your PR. That hurt your sanity." },
    { name: "Vibe Check", minDamage: 15, maxDamage: 20, text: "PREMIUM vibe-checked you with high-speed sass." },
    { name: "Rickroll link generation", minDamage: 5, maxDamage: 10, text: "PREMIUM tricked you into clicking a broken link. Ouch." }
];

// Boss Ultimate
const ultimateAttack = {
    name: "FORCING Sudo Force Push (ULTIMATE)",
    minDamage: 30,
    maxDamage: 45,
    text: "SYSTEM WARNING: PREMIUM ENTERED PANIC MODE. Sudo Force Pushing bugs straight to your system."
};

function handleImageError(img) {
    img.style.display = 'none';
    const parent = img.parentElement;
    parent.classList.add('flex', 'items-center', 'justify-center', 'text-rose-500', 'font-black', 'text-xl', 'bg-[#1a1824]');
    parent.innerText = 'PREMIUM';
}

function startGame() {
    const overlay = document.getElementById('intro-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
        overlay.style.display = 'none';
    }
    
    isGameActive = true;
    logAction("The duel begins. Go get 'em.", "text-yellow-400 font-bold animate-pulse");
}

function logAction(message, textColorClass = "text-gray-300") {
    const logBox = document.getElementById('battle-log');
    if (!logBox) return;
    const newLog = document.createElement('div');
    newLog.className = `${textColorClass} border-b border-zinc-900 pb-1.5`;
    newLog.innerHTML = `> ${message}`; 
a logBox.appendChild(newLog);
    logBox.scrollTop = logBox.scrollHeight;
}

function playerAttack() {
    if (!isGameActive || turnInProgress) return;
    turnInProgress = true;

    const damage = Math.floor(Math.random() * 31) + 15; 
    bossHP = Math.max(0, bossHP - damage);
    
    updateUI();
    
    const bossCard = document.getElementById('boss-card');
    bossCard.classList.add('shake-hit');
    setTimeout(() => bossCard.classList.remove('shake-hit'), 350);

    logAction(`You hit PREMIUM for ${damage} damage.`, "text-cyan-400 font-bold");

    if (bossHP <= 0) {
        endDuel(true);
        return;
    }

    advanceCooldowns();

    setTimeout(() => {
        if (isGameActive) bossTurn();
    }, 800);
}

function playerHeal() {
    if (!isGameActive || turnInProgress || healCooldown > 0) return;
    turnInProgress = true;

    const healAmt = Math.floor(Math.random() * 21) + 35; 
    playerHP = Math.min(maxPlayerHP, playerHP + healAmt);
    healCooldown = 4; 
    
    updateUI();
    logAction(`You patch yourself up, restoring ${healAmt} HP.`, "text-emerald-400 font-bold");

    advanceCooldowns();

    setTimeout(() => {
        if (isGameActive) bossTurn();
    }, 800);
}

function advanceCooldowns() {
    if (healCooldown > 0) {
        healCooldown--;
    }
    updateCooldownUI();
}

function updateCooldownUI() {
    const cdOverlay = document.getElementById('heal-cooldown');
    if (healCooldown > 0) {
        cdOverlay.classList.remove('hidden');
        cdOverlay.innerText = `CD: ${healCooldown}T`;
    } else {
        cdOverlay.classList.add('hidden');
    }
}

function bossTurn() {
    let dmg = 0;
    let move;

    const hpPercentage = (bossHP / maxBossHP) * 100;
    const isCritical = hpPercentage < 30;

    if (isCritical && Math.random() < 0.45) {
        move = ultimateAttack;
        dmg = Math.floor(Math.random() * (move.maxDamage - move.minDamage + 1)) + move.minDamage;
        logAction(move.text, "text-yellow-400 font-black animate-pulse");
    } else {
        move = bossAttacks[Math.floor(Math.random() * bossAttacks.length)];
        dmg = Math.floor(Math.random() * (move.maxDamage - move.minDamage + 1)) + move.minDamage;
        logAction(move.text, "text-rose-400");
    }

    playerHP = Math.max(0, playerHP - dmg);
    updateUI();

    logAction(`PREMIUM inflicts ${dmg} damage to your sanity.`, "text-red-500 font-bold");

    if (playerHP <= 0) {
        endDuel(false);
    } else {
        turnInProgress = false; 
    }
}

function updateUI() {
    document.getElementById('boss-hp').innerText = bossHP;
    const bossPercent = (bossHP / maxBossHP) * 100;
    document.getElementById('boss-hp-bar').style.width = `${bossPercent}%`;

    const bossCard = document.getElementById('boss-card');
    const badge = document.getElementById('boss-badge');
    if (bossPercent < 30) {
        bossCard.classList.add('critical-hp-flash');
        badge.classList.remove('hidden');
    } else {
        bossCard.classList.remove('critical-hp-flash');
        badge.classList.add('hidden');
    }

    document.getElementById('player-hp').innerText = playerHP;
    const playerPercent = (playerHP / maxPlayerHP) * 100;
    document.getElementById('player-hp-bar').style.width = `${playerPercent}%`;

    const status = document.getElementById('player-status');
    if (playerPercent <= 25) {
        status.innerText = "CRITICAL";
        status.className = "text-xs tracking-widest text-red-500 animate-pulse";
    } else {
        status.innerText = "READY";
        status.className = "text-xs tracking-widest text-emerald-400";
    }
}

function endDuel(isPlayerVictory) {
    isGameActive = false;
    turnInProgress = false;

    const overlay = document.getElementById('end-overlay');
    const endBox = document.getElementById('end-box');
    const title = document.getElementById('end-title');
    const desc = document.getElementById('end-desc');

    overlay.classList.remove('hidden');
    overlay.classList.add('flex');

    setTimeout(() => {
        endBox.classList.remove('scale-95');
        endBox.classList.add('scale-100');
    }, 50);

    if (isPlayerVictory) {
        title.innerText = "VICTORY";
        title.className = "text-5xl font-black tracking-widest text-emerald-400";
        desc.innerHTML = `<span class="text-white block font-black text-3xl mb-2">alr gng 🫩✌💔</span>`;
        endBox.style.backgroundColor = '#0b1d12';
        endBox.style.borderColor = '#10b981';
    } else {
        title.innerText = "GAME OVER";
        title.className = "text-5xl font-black tracking-widest text-rose-500";
        desc.innerHTML = `<span class="text-white block font-black text-3xl mb-2">gg u better try harder next time lil bro</span>`;
        endBox.style.backgroundColor = '#1c0c0e';
        endBox.style.borderColor = '#ef4444';
    }
}

function resetGame() {
    bossHP = 1000;
    playerHP = 200;
    healCooldown = 0;
    isGameActive = true;
    turnInProgress = false;

    document.getElementById('end-overlay').classList.add('hidden');
    document.getElementById('end-overlay').classList.remove('flex');
    document.getElementById('end-box').classList.add('scale-95');
    document.getElementById('end-box').classList.remove('scale-100');

    updateUI();
    updateCooldownUI();

    const logBox = document.getElementById('battle-log');
    logBox.innerHTML = '';
    logAction("Game reset. Bring it on.", "text-yellow-400 font-bold");
}

document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startGame);
    }
});
