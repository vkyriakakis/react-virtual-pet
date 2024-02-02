import logo from './logo.svg';
import "./App.css";
import { useState, useEffect } from 'react';

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
  console.log(petJson);

  let pet = JSON.parse(petJson);

  if (pet === null) {
    return ({
      ticks: 0,
      thirst: 0,
      hunger: 0,
      love: 10
    });
  }

  return pet;
}

function checkIsAlive(pet) {
  return (pet.hunger < 10) && (pet.thirst < 10) && (pet.love > 0);
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
        let shouldUpdateHunger = false;
        let shouldUpdateLove = false;

        if ((pet.ticks + 1) % 2 == 0) {
          shouldUpdateHunger = true;
        }

        if ((pet.ticks + 1) % 3 == 0) {
          shouldUpdateLove = true;
        }

        setPet(prevPet => ({
          ticks: prevPet.ticks + 1,
          thirst: (prevPet.thirst < 10) ? prevPet.thirst + 1 : prevPet.thirst,
          hunger: (shouldUpdateHunger && (prevPet.hunger < 10)) ? prevPet.hunger + 1 : prevPet.hunger,
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
  let appearance = "";

  // Use the pet's needs to decide the depiction
  if (pet.hunger == 10 || pet.thirst == 10) {
    appearance = "[DIED]";
  }
  else if (pet.love == 0) {
    appearance = "[LEFT]";
  }
  else if (pet.hunger > 7 || pet.thirst > 7 || pet.love < 3) {
    appearance = "T_T";
  }
  else if (pet.hunger > 4 || pet.thirst > 4 || pet.love < 7) {
    appearance = "-_-";
  }
  else if (pet.hunger > 2 || pet.thirst > 2 || pet.love < 8) {
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