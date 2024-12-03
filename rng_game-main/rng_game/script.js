// Kansverdeling per rarity
const rarityChance = {
    Common: 0.001,
    Uncommon: 30,
    Rare: 10,
    Epic: 5,
    Legendary: 4,
    Godly: 0.001, // 0.01%
    Impossible: 50 // 0.001%
};

// Basis items met naam en rarity
const rawItems = [
  // Common
  { name: "charmander", rarity: "Common" },
  { name: "squirtle", rarity: "Common" },
  { name: "bulbasaur", rarity: "Common" },
  { name: "Tengu", rarity: "Common" },
  { name: "Kappa", rarity: "Common" },
  { name: "Goblin", rarity: "Common" },
  { name: "Imp", rarity: "Common" },
  { name: "Slime", rarity: "Common" },
  { name: "Grub", rarity: "Common" },
  { name: "Rabbit", rarity: "Common" },
  { name: "Sparrow", rarity: "Common" },
  { name: "Frog", rarity: "Common" },

  // Uncommon
  { name: "Charmeleon", rarity: "Uncommon" },
  { name: "Wartortle", rarity: "Uncommon" },
  { name: "Ivysaur", rarity: "Uncommon" },
  { name: "Oni", rarity: "Uncommon" },
  { name: "Dullahan", rarity: "Uncommon" },
  { name: "Kitsune", rarity: "Uncommon" },
  { name: "Yeti", rarity: "Uncommon" },
  { name: "Basilisk", rarity: "Uncommon" },
  { name: "Manticore", rarity: "Uncommon" },
  { name: "Cyclops", rarity: "Uncommon" },

  // Rare
  { name: "Charizard", rarity: "Rare" },
  { name: "Blastoise", rarity: "Rare" },
  { name: "Venusaur", rarity: "Rare" },
  { name: "Raijin", rarity: "Epic" },
  { name: "Fujin", rarity: "Epic" },
  { name: "Sekhmet", rarity: "Rare" },
  { name: "Anubis", rarity: "Legendary" },
  { name: "Griffin", rarity: "Rare" },
  { name: "Enkidu", rarity: "Rare" },
  { name: "Minotaur", rarity: "Rare" },
  { name: "Celtic Wolf", rarity: "Rare" },

  // Epic
  { name: "Hercules", rarity: "Epic" },
  { name: "Achilles", rarity: "Epic" },
  { name: "Perseus", rarity: "Epic" },
  { name: "Raijin", rarity: "Epic" },
  { name: "Fujin", rarity: "Epic" },
  { name: "Bastet", rarity: "Epic" },
  { name: "Set", rarity: "Epic" },
  { name: "Basilisk", rarity: "Epic" },
  { name: "Red-Eyes Black Dragon", rarity: "Epic" },
  { name: "Yami Yugi", rarity: "Epic" },
  { name: "Kraken", rarity: "Epic" },
  { name: "Cerberus", rarity: "Epic" },

  // Legendary
  { name: "Cerberus", rarity: "Legendary" },
  { name: "Medusa", rarity: "Legendary" },
  { name: "Cyclops", rarity: "Legendary" },
  { name: "Dark Magician", rarity: "Rare" },
  { name: "Blue-Eyes White Dragon", rarity: "Legendary" },
  { name: "Exodia", rarity: "Legendary" },
  { name: "Tiamat", rarity: "Legendary" },
  { name: "Hydra", rarity: "Legendary" },
  { name: "Phoenix", rarity: "Legendary" },
  { name: "Mew", rarity: "Legendary" },
  { name: "Mewtwo", rarity: "Legendary" },
  { name: "Lugia", rarity: "Legendary" },
  { name: "Ho-Oh", rarity: "Legendary" },
  { name: "Rayquaza", rarity: "Legendary" },
  { name: "Groudon", rarity: "Legendary" },
  { name: "Kyogre", rarity: "Legendary" },
  { name: "Zygarde", rarity: "Legendary" },
  { name: "Exodia", rarity: "Legendary" },

  // Godly
  { name: "Zeus", rarity: "Godly" },
  { name: "Poseidon", rarity: "Godly" },
  { name: "Athena", rarity: "Godly" },
  { name: "Hades", rarity: "Godly" },
  { name: "Apollo", rarity: "Godly" },
  { name: "Artemis", rarity: "Godly" },
  { name: "Hermes", rarity: "Godly" },
  { name: "Ares", rarity: "Godly" },
  { name: "Hera", rarity: "Godly" },
  { name: "Amaterasu", rarity: "Godly" },
  { name: "Susanoo", rarity: "Godly" },
  { name: "Tsukuyomi", rarity: "Godly" },
  { name: "Ra", rarity: "Godly" },
  { name: "Osiris", rarity: "Godly" },
  { name: "Isis", rarity: "Godly" },
  { name: "Horus", rarity: "Godly" },
  { name: "Shiva", rarity: "Godly" },
  { name: "Vishnu", rarity: "Godly" },

  // Mythological and Legendary
  { name: "Gilgamesh", rarity: "Epic" },
  { name: "Marduk", rarity: "Godly" },
  { name: "Tengu", rarity: "Uncommon" },
  { name: "Sphinx", rarity: "Legendary" },
  { name: "Jörmungandr", rarity: "Legendary" },
  { name: "Basilisk", rarity: "Epic" },
  { name: "Chimera", rarity: "Legendary" },

  // impossibles
  { name: "RoanSharks", rarity: "Impossible" },
  { name: "casis1005", rarity: "Impossible" },
  { name: "poinsenops", rarity: "Impossible" },
];

// Functie om de kans voor elk item te berekenen
function calculateChances() {
    const itemCounts = { Common: 0, Uncommon: 0, Rare: 0, Epic: 0, Legendary: 0, Godly: 0, Impossible: 0 };

    // Telling van het aantal items per rarity
    rawItems.forEach(item => {
        itemCounts[item.rarity]++;
    });

    // Bereken de kans per item op basis van de rarity
    const itemsWithChances = rawItems.map(item => {
        const chancePerRarity = rarityChance[item.rarity] / itemCounts[item.rarity];
        return { ...item, chance: chancePerRarity };
    });

    return itemsWithChances;
}

// Verkrijg items met berekende kansen
const items = calculateChances();

// Functie om de inventory uit localStorage te laden
function loadInventory() {
    const savedInventory = localStorage.getItem('inventory');
    return savedInventory ? JSON.parse(savedInventory) : {};
}

// Functie om de inventory op te slaan in localStorage
function saveInventory(inventory) {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

// Inventory object om bij te houden hoeveel van elk item je hebt
let inventory = loadInventory();
let isRolling = false; // Voorkomt spammen

// Functie om een item te selecteren op basis van kansen
function roll() {
    if (isRolling) return; // Stop als er al gerold wordt
    isRolling = true;

    const rollButton = document.getElementById("rollButton");
    const resultDiv = document.getElementById("result");

    // Disable knop en toon tijdelijk een laadbericht
    rollButton.disabled = true;
    resultDiv.innerText = "Rolling...";  // Tijdelijke tekst totdat de vertraging voorbij is

    // Genereer een willekeurig nummer tussen 0 en 100
    const random = Math.random() * 100;
    let cumulativeChance = 0;
    let resultText = "Nothing";
    let resultClass = "";

    for (const item of items) {
        cumulativeChance += item.chance;
        if (random <= cumulativeChance) {
            resultText = `🎉 You got a ${item.rarity}: ${item.name}!`;
            resultClass = item.rarity.toLowerCase(); // Set the class based on rarity

            // Voeg item toe aan de inventory of verhoog de teller
            if (inventory[item.name]) {
                inventory[item.name].count += 1;
            } else {
                inventory[item.name] = { ...item, count: 1 };
            }

            // Sla de inventory op in localStorage
            saveInventory(inventory);
            break;
        }
    }

    // Zet de timer voor de vertraging (1,5 seconde)
    setTimeout(() => {
        // Toon het resultaat na de vertraging
        resultDiv.innerText = resultText;
        resultDiv.className = `result ${resultClass}`; // Apply the class to the result div
        rollButton.disabled = false;  // Zet de knop weer aan
        isRolling = false;  // Herstel de status

        // Update de inventory weergave
        updateInventory();
    }, 1500); // 1500 milliseconden (1,5 seconde) vertraging
}

// Functie om de inventory weer te geven, gesorteerd op zeldzaamheid
function updateInventory() {
    const inventoryList = document.getElementById("inventory");
    inventoryList.innerHTML = ""; // Maak de lijst leeg voordat je hem bijwerkt

    // Sorteer de inventory op basis van de rarity (Common bovenaan, Godly onderaan)
    const sortedItems = Object.values(inventory).sort((a, b) => {
        const rarityOrder = {
            "Common": 1,
            "Uncommon": 2,
            "Rare": 3,
            "Epic": 4,
            "Legendary": 5,
            "Godly": 6,
            "Impossible": 7
        };

        return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    });

    // Voeg de items toe aan de lijst
    for (const item of sortedItems) {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.rarity}: ${item.name} x${item.count}`;
        inventoryList.appendChild(listItem);
    }
}

// Initialiseren van de inventory na het laden van de pagina
document.addEventListener("DOMContentLoaded", function () {
    // Laad de inventory uit localStorage
    inventory = loadInventory();

    // Toon de inventory zodra de pagina wordt geladen
    updateInventory();
});


