// This script controls the game's logic, including character stats, navigation, combat, and inventory.

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