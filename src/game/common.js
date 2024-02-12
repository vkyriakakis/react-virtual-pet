import * as Constants from "../constants";

export function checkIsAlive(pet) {
  return (pet.hunger < Constants.MAX_HUNGER) && (pet.thirst < Constants.MAX_THIRST) && (pet.love > 0);
}