import logo from './logo.svg';
import "./App.css";
import { useState, useEffect } from 'react';

// If hunger and thrist reach the maximum, the pet dies
const MAX_HUNGER = 10;
const MAX_LOVE = 10;
const MAX_THIRST = 10;

// The *_INTERVAL constants concern the rate
// at which each stat increases as time passes
const THIRST_INTERVAL = 1;
const HUNGER_INTERVAL = 2;
const LOVE_INTERVAL = 3;

// These values concern the number of ticks that must pass for the
// next growth stage to occur

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
        <input type="submit" defaultValue="Submit" />
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
      ticks: 0,
      thirst: 0,
      hunger: 0,
      love: MAX_LOVE
    });
  }

  return JSON.parse(petJson);
}

function checkIsAlive(pet) {
  return (pet.hunger < MAX_HUNGER) && (pet.thirst < MAX_THIRST) && (pet.love > 0);
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
        let shouldUpdateThirst = false;
        let shouldUpdateHunger = false;
        let shouldUpdateLove = false;

        if ((pet.ticks + 1) % THIRST_INTERVAL == 0) {
          shouldUpdateThirst = true;
        }        

        if ((pet.ticks + 1) % HUNGER_INTERVAL == 0) {
          shouldUpdateHunger = true;
        }

        if ((pet.ticks + 1) % LOVE_INTERVAL == 0) {
          shouldUpdateLove = true;
        }

        setPet(prevPet => ({
          ticks: prevPet.ticks + 1,
          thirst: (shouldUpdateThirst && (prevPet.thirst < MAX_THIRST)) ? prevPet.thirst + 1 : prevPet.thirst,
          hunger: (shouldUpdateHunger && (prevPet.hunger < MAX_HUNGER)) ? prevPet.hunger + 1 : prevPet.hunger,
          love: (shouldUpdateLove && (prevPet.love > 0)) ? prevPet.love - 1 : prevPet.love
        }));
      }, 10000);

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

  function handlePetClick() {
    setPet(prevPet => ({
      ...prevPet,
      love: (prevPet.love < 10) ? prevPet.love + 1 : prevPet.love
    }));
  }

  // For debugging
  function handleResetClick() {
    setPet(prevPet => ({
      ticks: 0,
      thirst: 0,
      hunger: 0,
      love: 10
    }));
  }

  return (
    <div className="vpet_container">
      <Name name={name} />

      <div className="status_container">
        <Status label="Hunger" value={pet.hunger} />
        <Status label="Thirst" value={pet.thirst} />
        <Status label="Love" value={pet.love} />
        <Status label="Age" value={pet.ticks} />
      </div>

      <Pet pet={pet} />

      <div className="actions_container">
        <DisableableAction label="Feed" handleClick={handleFeedClick} pet={pet} />
        <DisableableAction label="Water" handleClick={handleWaterClick} pet={pet} />
        <DisableableAction label="Pet" handleClick={handlePetClick} pet={pet} />
        <Action label="Reset" handleClick={handleResetClick} pet={pet} />
        <Action label="Abandon" handleClick={handleAbandonClick} pet={pet} />
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

  let appearance = "";

  // Use the pet's needs to decide the depiction
  if (pet.hunger == MAX_HUNGER || pet.thirst == MAX_THIRST) {
    appearance = "[DIED]";
  }
  else if (pet.love == 0) {
    appearance = "[LEFT]";
  }
  else if (pet.hunger > HIGH_HUNGER || pet.thirst > HIGH_THIRST || pet.love < LOW_LOVE) {
    appearance = "T_T";
  }
  else if (pet.hunger > MID_HUNGER || pet.thirst > MID_THIRST || pet.love < MID_LOVE) {
    appearance = "-_-";
  }
  else if (pet.hunger > LOW_HUNGER || pet.thirst > LOW_THIRST || pet.love < HIGH_LOVE) {
    appearance = "o_o";
  }
  else {
    appearance = "^_^";
  }

  return (
    <h1>{appearance}</h1>
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

function DisableableAction({label, handleClick, pet}) {
  return (
    <button disabled={!checkIsAlive(pet)} onClick={handleClick}>{label}</button>
  );
}