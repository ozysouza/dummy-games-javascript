// This script controls the game's logic, including character stats, navigation, combat, and inventory.

import * as path from "./paths.mjs";  // Importing UI update functions

// Player's starting stats
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let invetory = ["stick"];

// Weapon list with attack power
const weapons = [
    { name: "stick", power: 5 },
    { name: "dagger", power: 30 },
    { name: "claw hammer", power: 50 },
    { name: "sword", power: 100 }
];

// Monster list with difficulty levels
const monsters = [
    { name: "Slime", level: 2, health: 15 },
    { name: "Fanged Beast", level: 8, health: 60 },
    { name: "Dragon", level: 20, health: 300 }
];

// Game locations and their corresponding actions
const locations = [
    {
        name: "town square",
        btnText: ["Go to Store", "Go to Cave", "Fight Dragon!"],
        btnFunctions: [goStore, goCave, fightDragon],
        text: 'You are in the Town Square. You see a sign that says "store".'
    },
    {
        name: "store",
        btnText: ["Buy 10 health (10 gold)", "Buy Weapon (30 gold)", "Go to Town Square"],
        btnFunctions: [buyHealth, buyWeapon, goTown],
        text: "You entered the Store."
    },
    {
        name: "cave",
        btnText: ["Fight slime", "Fight fanged beast", "Go to Town Square"],
        btnFunctions: [fightSlime, fightBeast, goTown],
        text: "You entered the cave. You see some monsters."
    },
    {
        name: "fight",
        btnText: ["Attack", "Dodge", "Run"],
        btnFunctions: [attack, dodge, goTown],
        text: "You are fighting a monster."
    },
    {
        name: "kill monster",
        btnText: ["Go to Town Square", "Go to Town Square", "Go to Town Square"],
        btnFunctions: [goTown, goTown, easterEgg],
        text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
    },
    {
        name: "lose",
        btnText: ["REPLAY?", "REPLAY?", "REPLAY?"],
        btnFunctions: [restart, restart, restart],
        text: "You die. 💀"
    },
    {
        name: "win",
        btnText: ["REPLAY?", "REPLAY?", "REPLAY?"],
        btnFunctions: [restart, restart, restart],
        text: "You defeated the dragon! You won the game! 🎉🎉🎉"
    },
    {
        name: "easter egg",
        btnText: ["2", "8", "Go to Town Square?"],
        btnFunctions: [pickTwo, pickEight, goTown],
        text: "You found a secret game. Pick a number above!"
    }
];

// initialize buttons
path.clickOn("#btn-store", goStore);
path.clickOn("#btn-cave", goCave);
path.clickOn("#btn-dragon", fightDragon);

// Updates the game UI when moving to a new location.
function update(location) {
    path.setMonsterCSS("display", "none");
    $("#btn-store").text(location["btnText"][0]);
    $("#btn-cave").text(location["btnText"][1]);
    $("#btn-dragon").text(location["btnText"][2]);

    $("#btn-store").off("click");
    $("#btn-cave").off("click");
    $("#btn-dragon").off("click");

    path.clickOn("#btn-store", location["btnFunctions"][0]);
    path.clickOn("#btn-cave", location["btnFunctions"][1]);
    path.clickOn("#btn-dragon", location["btnFunctions"][2]);

    path.setDescriptionText(location.text);
}

// This function handles the process of buying a new weapon if the player has enough gold and isn't already holding the most powerful weapon.
function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {  // Check if the player doesn't have the most powerful weapon.
        if (gold >= 30) {  // Check if the player has enough gold (30) to buy a weapon.
            gold -= 30;  // Deduct 30 gold from the player's balance.
            currentWeapon++;  // Move to the next weapon in the inventory.
            let newWeapon = weapons[currentWeapon].name;  // Get the name of the newly purchased weapon.
            path.setGoldText(gold);  // Update the gold display.
            invetory.push(newWeapon);  // Add the new weapon to the inventory.
            path.setDescriptionText(`You now have a new ${newWeapon}.
                In your inventory you have: ${invetory}`);  // Inform the player about the new weapon and update the inventory.
        }
        else {
            path.setDescriptionText("You do not have enough gold to buy Weapon.");  // Inform the player if they don't have enough gold.
        }
    }
    else {
        path.setDescriptionText("You already have the most powerful Weapon.");  // Inform the player if they already own the most powerful weapon.
        $("#btn-cave").text("Sell weapon for 15 gold");  // Change the button text to indicate they can sell the weapon instead.
        path.clickOn("#btn-cave", sellWeapon);  // Add a click event to sell the weapon for gold.
    }
}

// This function allows the player to sell a weapon from their inventory for gold, if they have more than one weapon.
function sellWeapon() {
    if (invetory.length > 1) {  // Check if the player has more than one weapon to sell.
        gold += 15;  // Add 15 gold to the player's balance for selling the weapon.
        path.setGoldText(gold);  // Update the gold display.
        let currentWeapon = invetory.shift();  // Remove the first weapon from the inventory (sell it).
        path.setDescriptionText(`You sold a ${currentWeapon}.`);  // Inform the player that they sold a weapon.
    }
    else {
        path.setDescriptionText("Don't sell your only weapon!");  // Inform the player they can't sell their only weapon.
    }
}

// This function allows the player to buy health, if they have enough gold to do so.
function buyHealth() {
    if (gold >= 10) {  // Check if the player has enough gold (10) to buy health.
        gold -= 10;  // Deduct 10 gold from the player's balance.
        health += 10;  // Add 10 health to the player's total.
        path.setHealthText(health);  // Update the health display.
        path.setGoldText(gold);  // Update the gold display.
        path.setDescriptionText("You bought 10 Health.");  // Inform the player they bought health.
    }
    else {
        path.setDescriptionText("You do not have enough gold to buy Health.");  // Inform the player if they don't have enough gold.
    }
}

function goStore() {
    update(locations[1]);
}

function goCave() {
    update(locations[2]);
}

function goTown() {
    update(locations[0]);
}

function fightSlime() {
    fighting = 0;
    goFight();
}

function fightBeast() {
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
}

// This function begins a fight with a monster, updating the game state and UI with relevant information.
function goFight() {
    update(locations[3]);  // Update the game path to the "fight" location.
    monsterHealth = monsters[fighting].health;  // Get the monster's initial health.
    path.setMonsterCSS("display", "block");  // Make the monster visible on the screen.
    path.setMonsterName(monsters[fighting].name);  // Display the monster's name.
    path.setMonsterHealth(monsters[fighting].health);  // Display the monster's health.
}

// This function executes an attack during the player's turn.
function attack() {
    path.setDescriptionText(`The ${monsters[fighting].name} attacks.`);  // Describe the monster's attack.
    path.setDescriptionAppend(`You will attack it with your ${weapons[currentWeapon].name}.`);  // Describe the player's weapon.

    // Check if the player's attack hits the monster.
    if (isMonsterHit()) {
        health -= getMonsterAttackValue(monsters[fighting].level);  // Subtract health if hit.
        monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;  // Subtract monster health if hit.
    }
    else {
        health -= getMonsterAttackValue(monsters[fighting].level);  // Subtract health if the attack misses.
        path.setDescriptionText("You miss.");  // Inform the player they missed.
    }

    path.setMonsterHealth(monsterHealth);  // Update monster's health in the UI.
    path.setHealthText(health);  // Update player's health in the UI.

    // Check if the player or the monster has been defeated.
    if (health <= 0) {
        lose();  // Player loses.
    }
    else if (monsterHealth <= 0) {
        fighting === 2 ? winGame() : defeatMonster();  // If monster is defeated, check if it's the last monster.
    }

    // Randomly check if the player's weapon breaks.
    if (Math.random() <= .1 && invetory.length !== 1) {
        path.setDescriptionAppend(`Your ${invetory.pop()} broke!`);  // Notify the player their weapon broke.
        currentWeapon--;  // Switch to the previous weapon in the inventory.
    }
}

// This function calculates the monster's attack value based on its level.
function getMonsterAttackValue(level) {
    let hit = (level * 5) - (Math.floor(Math.random() * xp));  // Calculate the hit value.
    return hit;  // Return the calculated hit value.
}

// This function checks if the monster's attack hits the player.
function isMonsterHit() {
    return Math.random() > .2 || health < 20;  // If random chance is greater than 0.2 or player health is low, the attack hits.
}

// This function handles the scenario when the player dodges an attack.
function dodge() {
    path.setDescriptionText(`You dodge the attack from the ${monsters[fighting].name}.`);  // Inform the player they dodged the attack.
}

// This function handles the monster being defeated and rewards the player with gold and XP.
function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7);  // Add gold based on monster's level.
    xp += monsters[fighting].level;  // Add XP based on monster's level.
    path.setGoldText(gold);  // Update the gold display.
    path.setXpText(xp);  // Update the XP display.
    update(locations[4]);  // Update the game path to the "defeat" location.
}

// This function handles the scenario when the player loses the game.
function lose() {
    path.setHealthText("💀");  // Display a skull to indicate death.
    update(locations[5]);  // Update the game path to the "lose" location.
}

// This function handles the scenario when the player wins the game.
function winGame() {
    update(locations[6]);  // Update the game path to the "win" location.
}

// This function restarts the game, resetting all stats to their initial values.
function restart() {
    xp = 0;  // Reset XP to 0.
    health = 100;  // Reset health to 100.
    gold = 50;  // Reset gold to 50.
    currentWeapon = 0;  // Reset the current weapon to the first weapon.
    invetory = ["stick"];  // Reset the inventory to just a stick.
    path.setGoldText(gold);  // Update the gold display.
    path.setHealthText(health);  // Update the health display.
    path.setXpText(xp);  // Update the XP display.
    location.reload();  // Reload the game to restart.
}

// This function activates an easter egg event in the game.
function easterEgg() {
    update(locations[7]);  // Update the game path to the "easter egg" location.
}

// This function triggers the "pick" function with a guess of 2.
function pickTwo() {
    pick(2);
}

// This function triggers the "pick" function with a guess of 8.
function pickEight() {
    pick(8);
}

// This function executes a number guessing game and rewards or punishes the player.
function pick(guess) {
    let numbers = [];  // Initialize an empty array to store random numbers.
    path.setDescriptionText(`You picked ${guess}. \nHere are the random numbers: `);  // Inform the player about their guess.

    // Generate 10 random numbers between 0 and 10.
    for (let index = 0; index < 10; index++) {
        numbers.push(Math.floor(Math.random() * 11));  // Push each random number into the array.
        path.setDescriptionAppend(`${numbers[index]}, `);  // Display each number.
    }

    // Check if the guessed number is in the generated numbers array.
    if (numbers.indexOf(guess) !== -1) {
        path.setDescriptionAppend("Right! You win 20 gold!");  // If correct, award 20 gold.
        gold += 20;  // Increase gold by 20.
        path.setGoldText(gold);  // Update the gold display.
    }
    else {
        path.setDescriptionAppend("Wrong! You lose 10 health!");  // If incorrect, lose 10 health.
        health -= 10;  // Subtract 10 from health.
        path.setHealthText(health);  // Update the health display.

        // Check if health drops to 0 or below, triggering a loss.
        if (health <= 0) {
            lose();  // Player loses if health reaches 0.
        }
    }
}