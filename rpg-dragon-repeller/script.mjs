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