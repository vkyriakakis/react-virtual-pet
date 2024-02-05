import logo from './logo.svg';
import "./App.css";
import { useState, useEffect } from 'react';

// If hunger and thrist reach the maximum, the pet dies
const MAX_HUNGER = 10;
const MAX_LOVE = 10;
const MAX_THIRST = 10;
const MAX_COLOR = 255;

// The unit of game time (in ms)
const TICK_DURATION = 3000;

// The *_INTERVAL constants concern the rate
// at which each stat increases as time passes
const THIRST_INTERVAL = 1;
const HUNGER_INTERVAL = 2;
const LOVE_INTERVAL = 3;

// These values concern the number of ticks that must pass for the
// baby growth stage to occur
const MAX_EGG_TICKS = 10;

// Same but for the child growth stage (the ticks are counted from t = 0)
const MAX_BABY_TICKS = 20;

// And for the rest of the stages
const MAX_CHILD_TICKS = 35;
const MAX_TEEN_TICKS = 55;

export default function App() {
  const [curName, setCurName] = useState(localStorage.getItem("curName"));

  function handleNameSubmit(newName) {
    setCurName(newName);
    localStorage.setItem("curName", newName);
  }

  function handleAbandonClick() {
    setCurName(null);
    localStorage.setItem("curName", null);
    localStorage.removeItem(curName);
  }

  // If the name is null, a saved game doesn't exist and
  // the name insertion form should be shown
  if (curName === null) {
    return (
      <>
        <Title />
        <NameInsertionForm handleSubmit={handleNameSubmit} />
      </>
    );
  }

  return (
    <>
      <Title />
      <CurrentGame name={curName} handleAbandonClick={handleAbandonClick} />
    </>
  );
}

function Title() {
  return (
    <>
      <h1>My Virtual Pet</h1>
    </>
  );
}

function Name({name}) {
  return (
    <>
      <h2>{name}</h2>
    </>
  );
}

function NameInsertionForm({handleSubmit}) {
  return (
    <div className="vpet_container">
      <form onSubmit={event => handleSubmit(event.target.elements.petName.value)}>
        <label>First name:</label>
        <input type="text" id="petName"/>
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

/*function parseIntWithoutNaN(str, defaultNum) {
  const num = parseInt(str);
  return isNaN(num) ? defaultNum : num;
}
*/

function parsePetOrDefault(petJson) {
  if (petJson === null) {
    return ({
      // ticks: The age of the pet in the game time unit
      ticks: 0,

      // thirst, hunger, love: Stats concerning the health of the pet
      thirst: 0,
      hunger: 0,
      love: MAX_LOVE,

      // red, green, blue: Store the color of the pet
      red: 0,
      green: 0,
      blue: 0,

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

  return JSON.parse(petJson);
}

function checkIsAlive(pet) {
  return (pet.hunger < MAX_HUNGER) && (pet.thirst < MAX_THIRST) && (pet.love > 0);
}

function computeAppearanceId(pet) {
  if (pet.int > pet.str) {
    return 0;
  }
  else if (pet.int == pet.str) {
    return 1;
  }

  return 2;
}

function CurrentGame({name, handleAbandonClick}) {
  // For the first render, check the local storage for previous values,
  // and load them if they exist
  const [pet, setPet] = useState(parsePetOrDefault(localStorage.getItem(name)));

  // Refresh the timeout everytime a timeout expires using
  // the ticks dependency. If the pet has died or left,
  // time stops
  useEffect(() => {
    if (checkIsAlive(pet)) {
      let timer = setTimeout(() => {
        // For the CHILD stage and beyond the thirst and hunger stats are introduced, and
        // love drops less frequently
        if (pet.ticks >= MAX_EGG_TICKS) {
          let shouldUpdateThirst = false;
          let shouldUpdateHunger = false;
          let shouldUpdateLove = false;

          let shouldUpdateEars = false;
          let shouldUpdateArms = false;
          let shouldUpdateLegs = false;

          if ((pet.ticks + 1) % THIRST_INTERVAL == 0) {
            shouldUpdateThirst = true;
          }        

          if ((pet.ticks + 1) % HUNGER_INTERVAL == 0) {
            shouldUpdateHunger = true;
          }

          if ((pet.ticks + 1) % LOVE_INTERVAL == 0) {
            shouldUpdateLove = true;
          }

          switch(pet.ticks) {
            case MAX_BABY_TICKS:
              shouldUpdateEars = true;
              break;
            case MAX_CHILD_TICKS:
              shouldUpdateArms = true;
              break;
            case MAX_TEEN_TICKS:
              shouldUpdateLegs = true;
              break;
            default:
              break;
          }

          setPet(prevPet => ({
            ...prevPet,
            ticks: prevPet.ticks + 1,
            thirst: (shouldUpdateThirst && (prevPet.thirst < MAX_THIRST)) ? prevPet.thirst + 1 : prevPet.thirst,
            hunger: (shouldUpdateHunger && (prevPet.hunger < MAX_HUNGER)) ? prevPet.hunger + 1 : prevPet.hunger,
            love: (shouldUpdateLove && (prevPet.love > 0)) ? prevPet.love - 1 : prevPet.love,
            ears_id: shouldUpdateEars ? computeAppearanceId(prevPet) : prevPet.ears_id,
            arms_id: shouldUpdateArms ? computeAppearanceId(prevPet) : prevPet.arms_id,
            legs_id: shouldUpdateLegs ? computeAppearanceId(prevPet) : prevPet.legs_id
          }));
        }
        // For the EGG stage always lower the love
        else {
          setPet(prevPet => ({
            ...prevPet,
            ticks: prevPet.ticks + 1,
            love: (prevPet.love > 0) ? prevPet.love - 1 : prevPet.love
          }));
        }
      }, TICK_DURATION);

      return () => clearTimeout(timer);
    }
  }, [pet.ticks]);

  // Store to local storage after every re-render (change in the pet's state)
  useEffect(() => {
      localStorage.setItem(name, JSON.stringify(pet));
  });

  // Click handlers
  function handleFeedClick() {
    setPet(prevPet => ({
      ...prevPet,
      hunger: (prevPet.hunger > 0) ? prevPet.hunger - 1 : prevPet.hunger
    }));
  }

  function handleWaterClick() {
    setPet(prevPet => ({
      ...prevPet,
      thirst: (prevPet.thirst > 0) ? prevPet.thirst - 1 : prevPet.thirst
    }));
  }

  function handlePlayClick() {
    setPet(prevPet => ({
      ...prevPet,
      love: (prevPet.love < 10) ? prevPet.love + 1 : prevPet.love,
      str: prevPet.str + 1
    }));
  }

  function handleStudyClick() {
    setPet(prevPet => ({
      ...prevPet,
      love: (prevPet.love < 10) ? prevPet.love + 1 : prevPet.love,
      int: prevPet.int + 1
    }));
  }

  function handleHeatClick() {
    setPet(prevPet => ({
      ...prevPet,
      love: (prevPet.love < 10) ? prevPet.love + 1 : prevPet.love,
      red: (prevPet.red < MAX_COLOR) ? prevPet.red + 30 : prevPet.red
    }));
  }

  function handleColdClick() {
    setPet(prevPet => ({
      ...prevPet,
      love: (prevPet.love < 10) ? prevPet.love + 1 : prevPet.love,
      blue: (prevPet.blue < MAX_COLOR) ? prevPet.blue + 30 : prevPet.blue
    }));
  }

  function handleLifeClick() {
    setPet(prevPet => ({
      ...prevPet,
      love: (prevPet.love < 10) ? prevPet.love + 1 : prevPet.love,
      green: (prevPet.green < MAX_COLOR) ? prevPet.green + 30 : prevPet.green
    }));
  }

  // For debugging
  function handleResetClick() {
    setPet(prevPet => ({
      ticks: 0,
      thirst: 0,
      hunger: 0,
      love: 10,
      red: 0,
      green: 0,
      blue: 0,
      str: 0,
      int: 0,
      ears_id: 1,
      arms_id: 1,
      legs_id: 1
    }));
  }

  // For the EGG stage
  if (pet.ticks < MAX_EGG_TICKS) {
    return (
      <div className="vpet_container">
        <Name name={name} />

        <div className="status_container">
          <Status label="Love" value={pet.love} />
          <Status label="Age" value={pet.ticks} />
        </div>

        <Pet pet={pet} />

        <div className="actions_container">
          <DisableableAction label="Heat" handleClick={handleHeatClick} condition={!checkIsAlive(pet) || pet.love == MAX_LOVE} />
          <DisableableAction label="Cold" handleClick={handleColdClick} condition={!checkIsAlive(pet) || pet.love == MAX_LOVE} />
          <DisableableAction label="Life" handleClick={handleLifeClick} condition={!checkIsAlive(pet) || pet.love == MAX_LOVE} />
          <Action label="Reset" handleClick={handleResetClick} />
          <Action label="Abandon" handleClick={handleAbandonClick} />
        </div>
      </div>
    );
  }

  // For the CHILD stage and beyond
  return (
    <div className="vpet_container">
      <Name name={name} />

      <div className="status_container">
        <Status label="Hunger" value={pet.hunger} />
        <Status label="Thirst" value={pet.thirst} />
        <Status label="Love" value={pet.love} />
        <Status label="Str" value={pet.str} />
        <Status label="Int" value={pet.int} />
        <Status label="Age" value={pet.ticks} />
      </div>

      <Pet pet={pet} />

      <div className="actions_container">
        <DisableableAction label="Feed" handleClick={handleFeedClick} condition={!checkIsAlive(pet) || pet.hunger == 0} />
        <DisableableAction label="Water" handleClick={handleWaterClick} condition={!checkIsAlive(pet) || pet.thirst == 0} />
        <DisableableAction label="Play" handleClick={handlePlayClick} condition={!checkIsAlive(pet) || pet.love == MAX_LOVE} />
        <DisableableAction label="Study" handleClick={handleStudyClick} condition={!checkIsAlive(pet) || pet.love == MAX_LOVE} />
        <Action label="Reset" handleClick={handleResetClick} />
        <Action label="Abandon" handleClick={handleAbandonClick} />
      </div>
    </div>
  );
}

function Pet({pet}) {
  const HIGH_HUNGER = 7;
  const HIGH_THIRST = 7;
  const HIGH_LOVE = 8;

  const MID_HUNGER = 4;
  const MID_THIRST = 4;
  const MID_LOVE = 6;

  const LOW_HUNGER = 2;
  const LOW_THIRST = 2;
  const LOW_LOVE = 3;

  // Depending on the corresponding id in the pet object,
  // a particular body part is chosen
  const ears = ["|\\ /|", "\\/ \\/", "/|\\"];
  const left_arms = ["o-", ">~", "@="];
  const right_arms = ["-o", "~<", "=@"];
  const legs = ["_| |_", " 0 0 ", "_T T_"];

  // Use the pet's needs to decide the face
  let face = "";
 
  if (pet.hunger == MAX_HUNGER || pet.thirst == MAX_THIRST || pet.love == 0) {
    face = "(X_X)";
  }
  else if (pet.ticks < MAX_EGG_TICKS) {
    face = "(0)";
  }
  else if (pet.hunger > HIGH_HUNGER || pet.thirst > HIGH_THIRST || pet.love < LOW_LOVE) {
    face = "(T_T)";
  }
  else if (pet.hunger > MID_HUNGER || pet.thirst > MID_THIRST || pet.love < MID_LOVE) {
    face = "(-_-)";
  }
  else if (pet.hunger > LOW_HUNGER || pet.thirst > LOW_THIRST || pet.love < HIGH_LOVE) {
    face = "(o_o)";
  }
  else {
    face = "(^_^)";
  }

  let pet_ears = "";
  let pet_left_arms = "";
  let pet_right_arms = "";
  let pet_legs = "";

  if (pet.ticks > MAX_BABY_TICKS) {
    pet_ears = ears[pet.ears_id];
  }

  if (pet.ticks > MAX_CHILD_TICKS) {
    pet_left_arms = left_arms[pet.arms_id];
    pet_right_arms = right_arms[pet.arms_id];
  }

  if (pet.ticks > MAX_TEEN_TICKS) {
    pet_legs = legs[pet.legs_id];
  }

  const colorStr = "rgb(" + pet.red + "," + pet.green + "," + pet.blue + ")";

  return (
    <div className="appearance_container" style={{color: colorStr}}>
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

function Status({label, value}) {
  return (
    <p>{label}: {value}</p>
  );
}

function Action({label, handleClick}) {
  return (
    <button onClick={handleClick}>{label}</button>
  );
}

function DisableableAction({label, handleClick, condition}) {
  return (
    <button disabled={condition} onClick={handleClick}>{label}</button>
  );
}