// Kansverdeling per rarity
const rarityChance = {
    Common: 50,
    Uncommon: 30,
    Rare: 10,
    Epic: 5,
    Legendary: 4,
    Godly: 0.01, // 0.01%
    Impossible: 0.001 // 0.001%
};

// Functie om items te laden vanuit items.json
async function loadItems() {
    const response = await fetch('items.json');
    const items = await response.json();
    return items;
}

// Functie om de kans voor elk item te berekenen
async function calculateChances() {
    const rawItems = await loadItems();
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
let items = [];
calculateChances().then(calculatedItems => {
    items = calculatedItems;
});

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
let rollsLeft = 5; // Aantal rolls per dag
let lastRollTime = localStorage.getItem('lastRollTime') ? new Date(localStorage.getItem('lastRollTime')) : new Date();

// Functie om een item te selecteren op basis van kansen
function roll() {
    if (isRolling || rollsLeft <= 0) return; // Stop als er al gerold wordt of geen rolls meer over zijn
    isRolling = true;

    const rollButton = document.getElementById("rollButton1");
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

    // Verminder het aantal rolls
    rollsLeft--;
    localStorage.setItem('rollsLeft', rollsLeft);
    localStorage.setItem('lastRollTime', new Date());

    // Update the rolls left display
    updateRollsLeft();
}

function rollx10() {
    if (isRolling || rollsLeft < 10) return; // Stop als er al gerold wordt of onvoldoende rolls over zijn
    isRolling = true;

    const rollButton = document.getElementById("rollButton2");
    const resultDiv = document.getElementById("result");

    // Disable knop en toon tijdelijk een laadbericht
    rollButton.disabled = true;
    resultDiv.innerText = "Rolling..."; // Tijdelijke tekst totdat de vertraging voorbij is

    const results = []; // Array om alle resultaten op te slaan

    // Functie om één roll uit te voeren
    function singleRoll() {
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

        rollsLeft--; // Verminder het aantal rolls
        localStorage.setItem('rollsLeft', rollsLeft);

        // Voeg het resultaat toe aan de resultatenlijst
        results.push({ text: resultText, className: resultClass });
    }

    // Voer 10 rolls uit
    for (let i = 0; i < 10; i++) {
        if (rollsLeft > 0) {
            singleRoll();
        } else {
            break; // Stop als er geen rolls meer over zijn
        }
    }

    // Zet de timer voor de vertraging (1,5 seconde)
    setTimeout(() => {
        // Combineer alle resultaten in één string en toon ze
        resultDiv.innerHTML = results.map(r => `<div class="${r.className}">${r.text}</div>`).join("");
        rollButton.disabled = false; // Zet de knop weer aan
        isRolling = false; // Herstel de status

        // Update de inventory weergave
        updateInventory();

        // Update de rolls left display
        updateRollsLeft();
    }, 1500); // 1500 milliseconden (1,5 seconde) vertraging

    // Sla de laatste roll-tijd op
    localStorage.setItem('lastRollTime', new Date());
}

function rollx100() {
    if (isRolling || rollsLeft < 100) return; // Stop als er al gerold wordt of onvoldoende rolls over zijn
    isRolling = true;

    const rollButton = document.getElementById("rollButton3");
    const resultDiv = document.getElementById("result");

    // Disable knop en toon tijdelijk een laadbericht
    rollButton.disabled = true;
    resultDiv.innerText = "Rolling..."; // Tijdelijke tekst totdat de vertraging voorbij is

    const results = []; // Array om alle resultaten op te slaan

    // Functie om één roll uit te voeren
    function singleRoll() {
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

        rollsLeft--; // Verminder het aantal rolls
        localStorage.setItem('rollsLeft', rollsLeft);

        // Voeg het resultaat toe aan de resultatenlijst
        results.push({ text: resultText, className: resultClass });
    }

    // Voer 10 rolls uit
    for (let i = 0; i < 100; i++) {
        if (rollsLeft > 0) {
            singleRoll();
        } else {
            break; // Stop als er geen rolls meer over zijn
        }
    }

    // Zet de timer voor de vertraging (1,5 seconde)
    setTimeout(() => {
        // Combineer alle resultaten in één string en toon ze
        resultDiv.innerHTML = results.map(r => `<div class="${r.className}">${r.text}</div>`).join("");
        rollButton.disabled = false; // Zet de knop weer aan
        isRolling = false; // Herstel de status

        // Update de inventory weergave
        updateInventory();

        // Update de rolls left display
        updateRollsLeft();
    }, 1500); // 1500 milliseconden (1,5 seconde) vertraging

    // Sla de laatste roll-tijd op
    localStorage.setItem('lastRollTime', new Date());
}

function rollx1000() {
    if (isRolling || rollsLeft < 1000) return; // Stop als er al gerold wordt of onvoldoende rolls over zijn
    isRolling = true;

    const rollButton = document.getElementById("rollButton4");
    const resultDiv = document.getElementById("result");

    // Disable knop en toon tijdelijk een laadbericht
    rollButton.disabled = true;
    resultDiv.innerText = "Rolling..."; // Tijdelijke tekst totdat de vertraging voorbij is

    const results = []; // Array om alle resultaten op te slaan

    // Functie om één roll uit te voeren
    function singleRoll() {
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

        rollsLeft--; // Verminder het aantal rolls
        localStorage.setItem('rollsLeft', rollsLeft);

        // Voeg het resultaat toe aan de resultatenlijst
        results.push({ text: resultText, className: resultClass });
    }

    // Voer 10 rolls uit
    for (let i = 0; i < 1000; i++) {
        if (rollsLeft > 0) {
            singleRoll();
        } else {
            break; // Stop als er geen rolls meer over zijn
        }
    }

    // Zet de timer voor de vertraging (1,5 seconde)
    setTimeout(() => {
        // Combineer alle resultaten in één string en toon ze
        resultDiv.innerHTML = results.map(r => `<div class="${r.className}">${r.text}</div>`).join("");
        rollButton.disabled = false; // Zet de knop weer aan
        isRolling = false; // Herstel de status

        // Update de inventory weergave
        updateInventory();

        // Update de rolls left display
        updateRollsLeft();
    }, 1500); // 1500 milliseconden (1,5 seconde) vertraging

    // Sla de laatste roll-tijd op
    localStorage.setItem('lastRollTime', new Date());
}

function rollx10000() {
    if (isRolling || rollsLeft < 10000) return; // Stop als er al gerold wordt of onvoldoende rolls over zijn
    isRolling = true;

    const rollButton = document.getElementById("rollButton5");
    const resultDiv = document.getElementById("result");

    // Disable knop en toon tijdelijk een laadbericht
    rollButton.disabled = true;
    resultDiv.innerText = "Rolling..."; // Tijdelijke tekst totdat de vertraging voorbij is

    const results = []; // Array om alle resultaten op te slaan

    // Functie om één roll uit te voeren
    function singleRoll() {
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

        rollsLeft--; // Verminder het aantal rolls
        localStorage.setItem('rollsLeft', rollsLeft);

        // Voeg het resultaat toe aan de resultatenlijst
        results.push({ text: resultText, className: resultClass });
    }

    // Voer 10 rolls uit
    for (let i = 0; i < 10000; i++) {
        if (rollsLeft > 0) {
            singleRoll();
        } else {
            break; // Stop als er geen rolls meer over zijn
        }
    }

    // Zet de timer voor de vertraging (1,5 seconde)
    setTimeout(() => {
        // Combineer alle resultaten in één string en toon ze
        resultDiv.innerHTML = results.map(r => `<div class="${r.className}">${r.text}</div>`).join("");
        rollButton.disabled = false; // Zet de knop weer aan
        isRolling = false; // Herstel de status

        // Update de inventory weergave
        updateInventory();

        // Update de rolls left display
        updateRollsLeft();
    }, 1500); // 1500 milliseconden (1,5 seconde) vertraging

    // Sla de laatste roll-tijd op
    localStorage.setItem('lastRollTime', new Date());
}

function rollx100000() {
    if (isRolling || rollsLeft < 100000) return; // Stop als er al gerold wordt of onvoldoende rolls over zijn
    isRolling = true;

    const rollButton = document.getElementById("rollButton6");
    const resultDiv = document.getElementById("result");

    // Disable knop en toon tijdelijk een laadbericht
    rollButton.disabled = true;
    resultDiv.innerText = "Rolling..."; // Tijdelijke tekst totdat de vertraging voorbij is

    const results = []; // Array om alle resultaten op te slaan

    // Functie om één roll uit te voeren
    function singleRoll() {
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

        rollsLeft--; // Verminder het aantal rolls
        localStorage.setItem('rollsLeft', rollsLeft);

        // Voeg het resultaat toe aan de resultatenlijst
        results.push({ text: resultText, className: resultClass });
    }

    // Voer 10 rolls uit
    for (let i = 0; i < 100000; i++) {
        if (rollsLeft > 0) {
            singleRoll();
        } else {
            break; // Stop als er geen rolls meer over zijn
        }
    }

    // Zet de timer voor de vertraging (1,5 seconde)
    setTimeout(() => {
        // Combineer alle resultaten in één string en toon ze
        resultDiv.innerHTML = results.map(r => `<div class="${r.className}">${r.text}</div>`).join("");
        rollButton.disabled = false; // Zet de knop weer aan
        isRolling = false; // Herstel de status

        // Update de inventory weergave
        updateInventory();

        // Update de rolls left display
        updateRollsLeft();
    }, 1500); // 1500 milliseconden (1,5 seconde) vertraging

    // Sla de laatste roll-tijd op
    localStorage.setItem('lastRollTime', new Date());
}

function rollx1000000() {
    if (isRolling || rollsLeft < 1000000) return; // Stop als er al gerold wordt of onvoldoende rolls over zijn
    isRolling = true;

    const rollButton = document.getElementById("rollButton6");
    const resultDiv = document.getElementById("result");

    // Disable knop en toon tijdelijk een laadbericht
    rollButton.disabled = true;
    resultDiv.innerText = "Rolling..."; // Tijdelijke tekst totdat de vertraging voorbij is

    const results = []; // Array om alle resultaten op te slaan

    // Functie om één roll uit te voeren
    function singleRoll() {
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

        rollsLeft--; // Verminder het aantal rolls
        localStorage.setItem('rollsLeft', rollsLeft);

        // Voeg het resultaat toe aan de resultatenlijst
        results.push({ text: resultText, className: resultClass });
    }

    // Voer 10 rolls uit
    for (let i = 0; i < 1000000; i++) {
        if (rollsLeft > 0) {
            singleRoll();
        } else {
            break; // Stop als er geen rolls meer over zijn
        }
    }

    // Zet de timer voor de vertraging (1,5 seconde)
    setTimeout(() => {
        // Combineer alle resultaten in één string en toon ze
        resultDiv.innerHTML = results.map(r => `<div class="${r.className}">${r.text}</div>`).join("");
        rollButton.disabled = false; // Zet de knop weer aan
        isRolling = false; // Herstel de status

        // Update de inventory weergave
        updateInventory();

        // Update de rolls left display
        updateRollsLeft();
    }, 1500); // 1500 milliseconden (1,5 seconde) vertraging

    // Sla de laatste roll-tijd op
    localStorage.setItem('lastRollTime', new Date());
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
        listItem.textContent = `${item.rarity}: ${item.name} x${item.count} ($: ${item.value})`;

        // Voeg een verkoopknop toe aan elk item
        const sellButton = document.createElement("button");
        sellButton.textContent = "Sell";
        sellButton.onclick = () => sellCard(item.name);
        listItem.appendChild(sellButton);

        inventoryList.appendChild(listItem);
    }
}

// Functie om de rollen over te zetten
function updateRollsLeft() {
    const rollsLeftDiv = document.getElementById("rolesleft");
    rollsLeftDiv.innerText = `Rolls Left: ${rollsLeft}`;
}

// Functie om kaarten te verkopen
function sellCard(cardName) {
    if (inventory[cardName]) {
        const cardValue = inventory[cardName].value;
        rollsLeft += cardValue; // Voeg rolls toe op basis van de waarde van de kaart
        inventory[cardName].count--;

        if (inventory[cardName].count <= 0) {
            delete inventory[cardName];
        }

        saveInventory(inventory);
        updateInventory();
        localStorage.setItem('rollsLeft', rollsLeft);
        updateRollsLeft();
    }
}

// Functie om de timer voor rolls te resetten
function resetRolls() {
    const now = new Date();
    const timeDiff = now - lastRollTime;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff >= 24) {
        rollsLeft = 5;
        localStorage.setItem('rollsLeft', rollsLeft);
        lastRollTime = now;
        localStorage.setItem('lastRollTime', lastRollTime);
        updateRollsLeft();
    }
}

// Functie om rolls elke minuut te verhogen
function incrementRolls() {
    rollsLeft++;
    localStorage.setItem('rollsLeft', rollsLeft);
    updateRollsLeft();
}

// Initialiseren van de inventory na het laden van de pagina
document.addEventListener("DOMContentLoaded", async function () {
    // Laad de inventory uit localStorage
    inventory = loadInventory();
    rollsLeft = localStorage.getItem('rollsLeft') ? parseInt(localStorage.getItem('rollsLeft')) : 5;
    lastRollTime = localStorage.getItem('lastRollTime') ? new Date(localStorage.getItem('lastRollTime')) : new Date();

    // Reset rolls als het een nieuwe dag is
    resetRolls();

    // Laad items en bereken kansen
    items = await calculateChances();

    // Toon de inventory zodra de pagina wordt geladen
    updateInventory();

    // Update the rolls left display
    updateRollsLeft();

    // Start interval om elke minuut rolls te verhogen
    setInterval(incrementRolls, 60000); // 60000 milliseconden = 1 minuut
});