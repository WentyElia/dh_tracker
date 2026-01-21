
const hopeValue = document.querySelector('.hopeValue');
const hpValue = document.querySelector('.hpValue');
const stressValue = document.querySelector('.stressValue');
const armorValue = document.querySelector('.armorValue');

const hopeMinus = document.querySelector('.minus');
const hopePlus = document.querySelector('.plus');
const hpMinus = document.querySelector('.clearHP');
const hpPlus = document.querySelector('.markHP');
const stressMinus = document.querySelector('.clearStress');
const stressPlus = document.querySelector('.markStress');
const armorMinus = document.querySelector('.clearArmor');
const armorPlus = document.querySelector('.markArmor');

const diceResults = document.querySelector('.last_roll_results');
const diceTotal = document.querySelector('.total_sum');

const dualityDiceLastRolls = document.querySelector('.last_roll_results_duality');
const dualityMod = document.querySelector('.duality_result_mod');
const dualityTotal = document.querySelector('.duality_sum');

// Default stats configuration
const defaultConfig = {
    hope: { min: 0, max: 6 },
    hp: { min: 0, max: 10 },
    stress: { min: 0, max: 10 },
    armor: { min: 0, max: 10 }
};

// Load config from localStorage or use defaults
function loadConfig() {
    const saved = localStorage.getItem('statsConfig');
    return saved ? JSON.parse(saved) : defaultConfig;
}

function saveConfig(config) {
    localStorage.setItem('statsConfig', JSON.stringify(config));
}

let statsConfig = loadConfig();

let isUpdating = false;
const COOLDOWN_MS = 100;

// Modal elements
const modal = document.getElementById('configModal');
const modalTitle = document.getElementById('modalTitle');
const minInput = document.getElementById('minInput');
const maxInput = document.getElementById('maxInput');
const saveButton = document.getElementById('saveConfig');
const closeButton = document.querySelector('.close');

let currentStat = null;

// Open modal when clicking on tracker title
document.querySelectorAll('.tracker_title').forEach(title => {
    const statName = title.getAttribute('data-stat');
    if (statName) {
        title.addEventListener('click', () => {
            currentStat = statName;
            modalTitle.textContent = `Configure ${title.textContent}`;
            minInput.value = statsConfig[statName].min;
            maxInput.value = statsConfig[statName].max;
            modal.style.display = 'block';
        });
    }
});

// Close modal
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Save configuration
saveButton.addEventListener('click', () => {
    if (currentStat) {
        statsConfig[currentStat].min = parseInt(minInput.value) || 0;
        statsConfig[currentStat].max = parseInt(maxInput.value) || 100;
        saveConfig(statsConfig);
        modal.style.display = 'none';
    }
});

renderHopeRings(parseInt(localStorage.getItem('hope') || '0'));
const savedHp = parseInt(localStorage.getItem('hp'));
if (savedHp === null || isNaN(savedHp)) {
    renderHpHearts(statsConfig.hp.max);
    localStorage.setItem('hp', statsConfig.hp.max);
} else {
    renderHpHearts(savedHp);
}

const savedStress = parseInt(localStorage.getItem('stress'));
if (savedStress === null || isNaN(savedStress)) {
    renderStressHearts(statsConfig.stress.max);
    localStorage.setItem('stress', statsConfig.stress.max);
} else {
    renderStressHearts(savedStress);
}

const savedArmor = parseInt(localStorage.getItem('armor'));
if (savedArmor === null || isNaN(savedArmor)) {
    renderArmorHearts(statsConfig.armor.max);
    localStorage.setItem('armor', statsConfig.armor.max);
} else {
    renderArmorHearts(savedArmor);
}

function renderHpHearts(value, animate = false) {
    const maxHearts = statsConfig.hp.max;
    hpValue.innerHTML = '';
    
    for (let i = 0; i < maxHearts; i++) {
        const heart = document.createElement('div');
        heart.className = 'hp-heart';
        
        if (i >= value) {
            heart.classList.add('broken');
            
            const crack = document.createElement('div');
            crack.className = 'crack';
            heart.appendChild(crack);
            
            if (animate && i === value) {
                heart.classList.add('animating');
                setTimeout(() => heart.classList.remove('animating'), 600);
            }
        }
        
        hpValue.appendChild(heart);
    }
}

function renderStressHearts(value, animate = false) {
    const maxHearts = statsConfig.stress.max;
    stressValue.innerHTML = '';
    
    for (let i = 0; i < maxHearts; i++) {
        const heart = document.createElement('div');
        heart.className = 'stress-heart';
        
        if (i >= value) {
            heart.classList.add('broken');
            
            const crack = document.createElement('div');
            crack.className = 'crack';
            heart.appendChild(crack);
            
            if (animate && i === value) {
                heart.classList.add('animating');
                setTimeout(() => heart.classList.remove('animating'), 600);
            }
        }
        
        stressValue.appendChild(heart);
    }
}

function renderArmorHearts(value, animate = false) {
    const maxHearts = statsConfig.armor.max;
    armorValue.innerHTML = '';
    
    for (let i = 0; i < maxHearts; i++) {
        const heart = document.createElement('div');
        heart.className = 'armor-heart';
        
        if (i >= value) {
            heart.classList.add('broken');
            
            const crack = document.createElement('div');
            crack.className = 'crack';
            heart.appendChild(crack);
            
            if (animate && i === value) {
                heart.classList.add('animating');
                setTimeout(() => heart.classList.remove('animating'), 600);
            }
        }
        
        armorValue.appendChild(heart);
    }
}

function renderHopeRings(value, animate = false) {
    const maxRings = statsConfig.hope.max;
    hopeValue.innerHTML = '';

    for (let i = 0; i < maxRings; i++) {
        const ring = document.createElement('div');
        ring.className = 'hope-ring';

        if (i < value) {
            ring.classList.add('filled');

            const sunburst = document.createElement('div');
            sunburst.className = 'sunburst';

            for (let j = 0; j < 8; j++) {
                const ray = document.createElement('div');
                ray.className = 'sunray';
                const angle = (j * 360) / 8;
                ray.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
                sunburst.appendChild(ray);
            }

            ring.appendChild(sunburst);

            if (animate && i === value - 1) {
                ring.classList.add('animating');
                setTimeout(() => ring.classList.remove('animating'), 800);
            }
        }

        hopeValue.appendChild(ring);
    }
}

function updateCounter(element, change, statName) {
    if (isUpdating) return;
    isUpdating = true;

    let currentValue = parseInt(element.textContent) || 0;
    currentValue += change;

    const min = statsConfig[statName].min;
    const max = statsConfig[statName].max;
    currentValue = Math.max(min, Math.min(max, currentValue));

    element.textContent = currentValue;
    localStorage.setItem(statName, currentValue);

    setTimeout(() => isUpdating = false, COOLDOWN_MS);
}

function updateHopeCounter(change) {
    if (isUpdating) return;
    isUpdating = true;

    let currentValue = parseInt(localStorage.getItem('hope') || '0');
    currentValue += change;

    const min = statsConfig.hope.min;
    const max = statsConfig.hope.max;
    currentValue = Math.max(min, Math.min(max, currentValue));
    
    renderHopeRings(currentValue, change > 0);
    localStorage.setItem('hope', currentValue);
    
    setTimeout(() => isUpdating = false, COOLDOWN_MS);
}

function updateHpCounter(change) {
    if (isUpdating) return;
    isUpdating = true;
    
    let currentValue = parseInt(localStorage.getItem('hp') || statsConfig.hp.max);
    currentValue += change;
    
    const min = statsConfig.hp.min;
    const max = statsConfig.hp.max;
    currentValue = Math.max(min, Math.min(max, currentValue));
    
    renderHpHearts(currentValue, change < 0);
    localStorage.setItem('hp', currentValue);
    
    setTimeout(() => isUpdating = false, COOLDOWN_MS);
}

function updateStressCounter(change) {
    if (isUpdating) return;
    isUpdating = true;
    
    let currentValue = parseInt(localStorage.getItem('stress') || statsConfig.stress.max);
    currentValue += change;
    
    const min = statsConfig.stress.min;
    const max = statsConfig.stress.max;
    currentValue = Math.max(min, Math.min(max, currentValue));
    
    renderStressHearts(currentValue, change < 0);
    localStorage.setItem('stress', currentValue);
    
    setTimeout(() => isUpdating = false, COOLDOWN_MS);
}

function updateArmorCounter(change) {
    if (isUpdating) return;
    isUpdating = true;
    
    let currentValue = parseInt(localStorage.getItem('armor') || statsConfig.armor.max);
    currentValue += change;
    
    const min = statsConfig.armor.min;
    const max = statsConfig.armor.max;
    currentValue = Math.max(min, Math.min(max, currentValue));
    
    renderArmorHearts(currentValue, change < 0);
    localStorage.setItem('armor', currentValue);
    
    setTimeout(() => isUpdating = false, COOLDOWN_MS);
}

// Hoffnung (Hope) buttons
hopeMinus.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateHopeCounter(-1);
});

hopePlus.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateHopeCounter(1);
});

// Lebenspunkte (HP) buttons - C restores HP, M marks damage (breaks heart)
hpMinus.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateHpCounter(1);
});

hpPlus.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateHpCounter(-1);
});

// Stress buttons - C restores, M marks damage
stressMinus.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateStressCounter(1);
});

stressPlus.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateStressCounter(-1);
});

// Rüstungspunkte (Armor) buttons - C restores, M marks damage
armorMinus.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateArmorCounter(1);
});

armorPlus.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateArmorCounter(-1);
});


// Tab switching functionality
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');

        // Remove active class from all tabs and buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Resize dice when switching to dice tab
        if (tabName === 'dice' && typeof diceInstances !== 'undefined') {
            setTimeout(() => {
                diceInstances.forEach(dice => dice.resize());
            }, 50);
        }
    });
});

document.querySelectorAll('.rollDiceBtn').forEach(btn => {
    btn.addEventListener('click', function() {
        if(isUpdating) return;
        isUpdating = true;
        
        const diceId = this.id;
        const diceValue = parseInt(this.dataset.diceValue); 
        
        const result = Math.floor(Math.random() * diceValue) + 1;
        
        const sublabel = this.querySelector('.dice_sublabel');
        if (sublabel) {
            sublabel.textContent ++;
            sublabel.classList.remove('hidden');
        }

        if (diceResults) {
            const resultDiv = document.createElement('div');
            resultDiv.textContent = `D${diceValue}: ${result}`;
            diceResults.appendChild(resultDiv);
        }

        if(diceTotal){
            const currentTotal = parseInt(diceTotal.textContent) || 0;
            diceTotal.textContent = currentTotal + result;
        }

        setTimeout(() => isUpdating = false, COOLDOWN_MS);
    });
});

document.querySelectorAll('.clearDice').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.dice_sublabel').forEach(sublabel => {
            sublabel.textContent = '0';
            sublabel.classList.add('hidden');
        diceResults.innerHTML = '';
        diceTotal.textContent = '0';
        });
    });
});

document.querySelectorAll('.rollDualityBtn').forEach(btn => {
    btn.addEventListener('click', function() {
        if(isUpdating) return;
        isUpdating = true;
        const die1 = Math.floor(Math.random() * 12) + 1;
        const die2 = Math.floor(Math.random() * 12) + 1;
        const result = die1 + die2;

        if (dualityDiceLastRolls)  {
            dualityDiceLastRolls.innerHTML = `Hope: ${die1} \n Fear: ${die2}`;
        }

        if (dualityTotal) {
            dualityTotal.textContent = result;
        }

        if (dualityMod) {
            dualityMod.textContent = die1 > die2 ? "Hope" : (die1 < die2 ? "Fear" : "Crit");
        }
        setTimeout(() => isUpdating = false, COOLDOWN_MS);
    });
});

document.querySelectorAll('.clearDualityDice').forEach(btn => { 
    btn.addEventListener('click', function() {
        dualityDiceLastRolls.innerHTML = '';
        dualityTotal.textContent = '0';
        dualityMod.textContent = '';
    });
});


