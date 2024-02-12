import * as Constants from "../constants";

export function initPet() {
  return ({
    // ticks: The age of the pet in the game time unit
    ticks: 0,

    // thirst, hunger, love: Stats concerning the health of the pet
    thirst: 0,
    hunger: 0,
    love: Constants.MAX_LOVE,

    // red, green, blue: Store the color of the pet
    red: Constants.MIN_COLOR,
    green: Constants.MIN_COLOR,
    blue: Constants.MIN_COLOR,

    // str, int; The relation between STR and INT decides the appearance
    // of the ears, arms, and legs at each stage (only the ids are stored
    // in the pet, not the appearance itself)
    str: 0,
    int: 0,
    ears_id: 1,
    arms_id: 1,
    legs_id: 1
  });
}

export function parsePetOrNull(petJson) {  
  if (petJson === null) {
    return null;
  }

  return JSON.parse(petJson);
}

export function parsePetOrDefault(petJson) {
  if (petJson === null) {
    return initPet();
  }

  return JSON.parse(petJson);
}



