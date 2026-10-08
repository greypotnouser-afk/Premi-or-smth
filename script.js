// Game State Variables
let bossHP = 1000;
const maxBossHP = 1000;
let playerHP = 200;
const maxPlayerHP = 200;
let healCooldown = 0;
let isGameActive = false;
let turnInProgress = false;

// Custom list of funny localized boss counter-attacks
const bossAttacks = [
    { name: "Deploying straight to Production on Friday", minDamage: 12, maxDamage: 22, text: " PREMIUM pushed untested code to prod! Your codebase is smoking!" },
    { name: "Missing Semicolon curse", minDamage: 10, maxDamage: 18, text: " PREMIUM threw a SyntaxError! It compile-failed your health!" },
    { name: "Severe coffee deprivation lash", minDamage: 14, maxDamage: 24, text: " PREMIUM hasn't had caffeine today. He lashed out with brutal logic!" },
    { name: "Passive-Aggressive Code Review", minDamage: 8, maxDamage: 16, text: " PREMIUM requested 34 changes on your PR! That hurt your sanity." },
    { name: "Vibe Check", minDamage: 15, maxDamage: 20, text: " PREMIUM vibe-checked you with high-speed sass!" },
    { name: "Rickroll link generation", minDamage: 5, maxDamage: 10, text: " PREMIUM tricked you into clicking a broken link! Ouch." }
];

// Boss Ultimate
const ultimateAttack = {
    name: "FORCING Sudo Force Push (ULTIMATE)",
    minDamage: 30,
    maxDamage: 45,
    text: " PREMIUM ENTERED PANIC MODE! Sudo Force Pushing bugs straight to your system!"
};

// Falling back grace handler in case they're on mobile/offline
function handleImageError(img) {
    img.style.display = 'none';
    const parent = img.parentElement;
    parent.classList.add('flex', 'items-center', 'justify-center', 'text-rose-500', 'font-black', 'text-xl', 'bg-[#1a1824]');
    parent.innerText = 'PREMIUM';
}

// Start screen game transition
function startGame() {
    document.getElementById('intro-overlay').style.display = 'none';
    isGameActive = true;
    logAction("", "The duel begins! Go get 'em!", "text-yellow-400 font-bold animate-pulse");
}

// Log actions to screen
function logAction(icon, message, textColorClass = "text-gray-300") {
    const logBox = document.getElementById('battle-log');
    const newLog = document.createElement('div');
    newLog.className = `${textColorClass} border-b border-zinc-900 pb-1.5`;
    newLog.innerHTML = `<span class="text-rose-400 font-extrabold mr-1">${icon}</span> ${message}`;
    logBox.appendChild(newLog);
    logBox.scrollTop = logBox.scrollHeight;
}

// Player Actions: Attack
function playerAttack() {
    if (!isGameActive || turnInProgress) return;
    turnInProgress = true;

    // Attack damage calculate
    const damage = Math.floor(Math.random() * 31) + 15; // 15 to 45 damage
    bossHP = Math.max(0, bossHP - damage);
    
    // Render damage
    updateUI();
    
    // Screen shaking VFX
    const bossCard = document.getElementById('boss-card');
    bossCard.classList.add('shake-hit');
    setTimeout(() => bossCard.classList.remove('shake-hit'), 350);

    logAction("⚔", `You hit PREMIUM for ${damage} damage!`, "text-cyan-400 font-bold");

    // Game end check
    if (bossHP <= 0) {
        endDuel(true);
        return;
    }

    // Cooldown turn tracker
    advanceCooldowns();

    // AI/Boss Counter-Attack after slight delay
    setTimeout(() => {
        if (isGameActive) bossTurn();
    }, 800);
}

// Player Actions: Heal
function playerHeal() {
    if (!isGameActive || turnInProgress || healCooldown > 0) return;
    turnInProgress = true;

    const healAmt = Math.floor(Math.random() * 21) + 35; // 35 to 55 HP
    playerHP = Math.min(maxPlayerHP, playerHP + healAmt);
    healCooldown = 4; // Start cooldown (current turn uses it, so 3 turns remaining next turn)
    
    updateUI();
    logAction("", `You patch yourself up, restoring ${healAmt} HP!`, "text-emerald-400 font-bold");

    advanceCooldowns();

    // Boss strikes back
    setTimeout(() => {
        if (isGameActive) bossTurn();
    }, 800);
}

// Advance Cooldown tracker
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

// Boss counter attack logic
function bossTurn() {
    let dmg = 0;
    let move;

    // Determine if Boss uses Ultimate (<30% HP)
    const hpPercentage = (bossHP / maxBossHP) * 100;
    const isCritical = hpPercentage < 30;

    if (isCritical && Math.random() < 0.45) {
        // Critical Ultimate Move triggers!
        move = ultimateAttack;
        dmg = Math.floor(Math.random() * (move.maxDamage - move.minDamage + 1)) + move.minDamage;
        logAction("", move.text, "text-yellow-400 font-black animate-pulse");
    } else {
        // Regular casual move
        move = bossAttacks[Math.floor(Math.random() * bossAttacks.length)];
        dmg = Math.floor(Math.random() * (move.maxDamage - move.minDamage + 1)) + move.minDamage;
        logAction("", move.text, "text-rose-400");
    }

    playerHP = Math.max(0, playerHP - dmg);
    updateUI();

    logAction("", `PREMIUM inflicts ${dmg} damage to your sanity!`, "text-red-500 font-bold");

    if (playerHP <= 0) {
        endDuel(false);
    } else {
        turnInProgress = false; // Turn concludes safely
    }
}

// Update UI
function updateUI() {
    // Boss
    document.getElementById('boss-hp').innerText = bossHP;
    const bossPercent = (bossHP / maxBossHP) * 100;
    document.getElementById('boss-hp-bar').style.width = `${bossPercent}%`;

    // Active Critical HP phase changes (Under 30% HP)
    const bossCard = document.getElementById('boss-card');
    const badge = document.getElementById('boss-badge');
    if (bossPercent < 30) {
        bossCard.classList.add('critical-hp-flash');
        badge.classList.remove('hidden');
    } else {
        bossCard.classList.remove('critical-hp-flash');
        badge.classList.add('hidden');
    }

    // Player
    document.getElementById('player-hp').innerText = playerHP;
    const playerPercent = (playerHP / maxPlayerHP) * 100;
    document.getElementById('player-hp-bar').style.width = `${playerPercent}%`;

    // Style warning if player low HP (<25%)
    const status = document.getElementById('player-status');
    if (playerPercent <= 25) {
        status.innerText = " CRITICAL";
        status.className = "text-xs tracking-widest text-red-500 animate-pulse";
    } else {
        status.innerText = "READY";
        status.className = "text-xs tracking-widest text-emerald-400";
    }
}

// Handle Duel Ending
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
        title.innerText = " VICTORY!";
        title.className = "text-5xl font-black tracking-widest text-emerald-400";
        desc.innerHTML = `<span class="text-white block font-black text-3xl mb-2">alr gng 🫩✌💔</span><span class="text-lg text-emerald-300">Wow, you actually broke the bug server & managed to defeat the boss, Premium! Respect earned.</span>`;
        endBox.style.backgroundColor = '#0b1d12';
        endBox.style.borderColor = '#10b981';
    } else {
        title.innerText = " GAME OVER";
        title.className = "text-5xl font-black tracking-widest text-rose-500";
        desc.innerHTML = `<span class="text-white block font-black text-3xl mb-2">gg u better try harder next time lil bro</span><span class="text-lg text-rose-300">PREMIUM totally wiped the floor with your bugs. Reload and try your luck again!</span>`;
        endBox.style.backgroundColor = '#1c0c0e';
        endBox.style.borderColor = '#ef4444';
    }
}

// Reset game to fresh
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

    // Clear Log
    const logBox = document.getElementById('battle-log');
    logBox.innerHTML = '';
    logAction("", "Game reset! Bring it on!", "text-yellow-400 font-bold");
}
