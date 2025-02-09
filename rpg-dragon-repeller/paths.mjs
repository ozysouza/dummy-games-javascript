// This module contains utility functions for updating the game UI.

export function setDescriptionText(text) {
    $("#text").text(text);
}

export function setDescriptionAppend(text) {
    $("#text").append(text);
}

export function setHealthText(text) {
    $("#healthText").text(text);
}

export function setGoldText(text) {
    $("#goldText").text(text);
}

export function setXpText(text) {
    $("#xpText").text(text);
}

export function setMonsterCSS(propety, value) {
    $("#monsterStats").css(propety, value);
}

export function setMonsterName(name) {
    $("#monsterName").text(name);
}

export function setMonsterHealth(health) {
    $("#monsterHealth").text(health);
}
