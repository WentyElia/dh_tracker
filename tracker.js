
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

// Initialize values from localStorage
hopeValue.textContent = localStorage.getItem('hope') || '0';
hpValue.textContent = localStorage.getItem('hp') || '0';
stressValue.textContent = localStorage.getItem('stress') || '0';
armorValue.textContent = localStorage.getItem('armor') || '0';

function updateCounter(element, change, statName) {
    let currentValue = parseInt(element.textContent) || 0;
    currentValue += change;

    const min = statsConfig[statName].min;
    const max = statsConfig[statName].max;
    currentValue = Math.max(min, Math.min(max, currentValue));
    
    element.textContent = currentValue;
    localStorage.setItem(statName, currentValue);
}

// Hoffnung (Hope) buttons
hopeMinus.addEventListener('click', () => updateCounter(hopeValue, -1, 'hope'));
hopePlus.addEventListener('click', () => updateCounter(hopeValue, 1, 'hope'));

// Lebenspunkte (HP) buttons
hpMinus.addEventListener('click', () => updateCounter(hpValue, -1, 'hp'));
hpPlus.addEventListener('click', () => updateCounter(hpValue, 1, 'hp'));

// Stress buttons
stressMinus.addEventListener('click', () => updateCounter(stressValue, -1, 'stress'));
stressPlus.addEventListener('click', () => updateCounter(stressValue, 1, 'stress'));

// Rüstungspunkte (Armor) buttons
armorMinus.addEventListener('click', () => updateCounter(armorValue, -1, 'armor'));
armorPlus.addEventListener('click', () => updateCounter(armorValue, 1, 'armor'));

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