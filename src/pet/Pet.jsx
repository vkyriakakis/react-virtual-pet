import "../App.css";

import * as Constants from "../constants";

export default function Pet({pet}) {
  // Depending on the corresponding id in the pet object,
  // a particular body part is chosen
  const ears = ["|\\ /|", "\\/ \\/", "/|\\"];
  const left_arms = ["o-", ">~", "@="];
  const right_arms = ["-o", "~<", "=@"];
  const legs = ["_| |_", " 0 0 ", "_T T_"];

  const colorStr = "rgb(" + pet.red + "," + pet.green + "," + pet.blue + ")";

  // If the pet is an egg no body parts are needed
  if (pet.ticks < Constants.MAX_EGG_TICKS) {
    return (
      <div className="pet_container" style={{color: colorStr}}>
        (0)
      </div>
    );
  }

  // Use the pet's needs to decide the face
  let face = "";
 
  if (pet.hunger === Constants.MAX_HUNGER || pet.thirst === Constants.MAX_THIRST || pet.love === 0) {
    face = "(X_X)";
  }
  else if (pet.hunger > Constants.HIGH_HUNGER || pet.thirst > Constants.HIGH_THIRST || pet.love < Constants.LOW_LOVE) {
    face = "(T_T)";
  }
  else if (pet.hunger > Constants.MID_HUNGER || pet.thirst > Constants.MID_THIRST || pet.love < Constants.MID_LOVE) {
    face = "(-_-)";
  }
  else if (pet.hunger > Constants.LOW_HUNGER || pet.thirst > Constants.LOW_THIRST || pet.love < Constants.HIGH_LOVE) {
    face = "(o_o)";
  }
  else {
    face = "(^_^)";
  }

  let pet_ears = "";
  let pet_left_arms = "";
  let pet_right_arms = "";
  let pet_legs = "";

  // The pet grows ears after it goes into the CHILD stage
  if (pet.ticks > Constants.MAX_BABY_TICKS) {
    pet_ears = ears[pet.ears_id];
  }

  // In the TEENAGER stage, the pet grows arms
  if (pet.ticks > Constants.MAX_CHILD_TICKS) {
    pet_left_arms = left_arms[pet.arms_id];
    pet_right_arms = right_arms[pet.arms_id];
  }

  // Finally, in the ADULT stage, it grows legs
  if (pet.ticks > Constants.MAX_TEEN_TICKS) {
    pet_legs = legs[pet.legs_id];
  }

  return (
    <div className="pet_container" style={{color: colorStr}}>
      <div>
        {pet_ears}
      </div>

      <div>
        {pet_left_arms}{face}{pet_right_arms}
      </div>
      
      <div>
        {pet_legs}
      </div>
    </div>
  );
}