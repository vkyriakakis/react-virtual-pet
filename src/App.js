import logo from './logo.svg';
import "./App.css";
import { useState, useEffect } from 'react';

export default function App() {
  const [name, setName] = useState(localStorage.getItem("name"));

  function handleNameSubmit(newName) {
    setName(newName);
    localStorage.setItem("name", newName);
  }

  function handleAbandonClick() {
    setName(null);
    localStorage.clear();
  }

  // If the name is null, a saved game doesn't exist and
  // the name insertion form should be shown
  if (name === null) {
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
      <CurrentGame name={name} handleAbandonClick={handleAbandonClick} />
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

function parseIntWithoutNaN(str, defaultNum) {
  const num = parseInt(str);
  return isNaN(num) ? defaultNum : num;
}

function CurrentGame({name, handleAbandonClick}) {
  // For the first render, check the local storage for previous values,
  // and load them if they exist
  const [hunger, setHunger] = useState(parseIntWithoutNaN(localStorage.getItem("hunger"), 0));
  const [thirst, setThirst] = useState(parseIntWithoutNaN(localStorage.getItem("thirst"), 0));
  const [love, setLove] = useState(parseIntWithoutNaN(localStorage.getItem("love"), 10));
  const [ticks, setTicks] = useState(parseIntWithoutNaN(localStorage.getItem("ticks"), 0));

  // Refresh the timeout everytime a timeout expires using
  // the ticks dependency
  useEffect(() => {
    let timer = setTimeout(() => {
      setTicks(ticks => ticks + 1);
      setThirst(thirst => (thirst < 10) ? thirst + 1 : thirst);

      if ((ticks + 1) % 2 == 0) {
        setHunger(hunger => (hunger < 10) ? hunger + 1 : hunger);
      }

      if ((ticks + 1) % 3 == 0) {
        setLove(love => (love > 0) ? love - 1 : love);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [ticks]);

  // Store to local storage after every re-render (change in the pet's state)
  useEffect(() => {
      localStorage.setItem("hunger", hunger);
  }, [hunger]);

  useEffect(() => {
      localStorage.setItem("thirst", thirst);
  }, [thirst]);

  useEffect(() => {
      localStorage.setItem("love", love);
  }, [love]);

  useEffect(() => {
      localStorage.setItem("ticks", ticks);
  }, [ticks]);

  // Click handlers
  function handleFeedClick() {
    setHunger(hunger => (hunger > 0) ? hunger - 1 : hunger);
  }

  function handleWaterClick() {
    setThirst(thirst => (thirst > 0) ? thirst - 1 : thirst);
  }

  function handlePetClick() {
    setLove(love => (love < 10) ? love + 1 : love);
  }

  // For debugging
  function handleResetClick() {
    setHunger(0);
    setThirst(0);
    setLove(10);
    setTicks(0);
  }

  return (
    <div className="vpet_container">
      <Name name={name} />

      <div className="status_container">
        <Status label="Hunger" value={hunger} />
        <Status label="Thirst" value={thirst} />
        <Status label="Love" value={love} />
        <Status label="Age" value={ticks} />
      </div>

      <Pet hunger={hunger} thirst={thirst} love={love} />

      <div className="actions_container">
        <DisableableAction label="Feed" handleClick={handleFeedClick} hunger={hunger} thirst={thirst} love={love} />
        <DisableableAction label="Water" handleClick={handleWaterClick} hunger={hunger} thirst={thirst} love={love} />
        <DisableableAction label="Pet" handleClick={handlePetClick} hunger={hunger} thirst={thirst} love={love} />
        <Action label="Reset" handleClick={handleResetClick} hunger={hunger} thirst={thirst} love={love} />
        <Action label="Abandon" handleClick={handleAbandonClick} hunger={hunger} thirst={thirst} love={love} />
      </div>
    </div>
  );
}

function Pet({hunger, thirst, love}) {
  let appearance = "";

  // Use the pet's needs to decide the depiction
  if (hunger == 10 || thirst == 10) {
    appearance = "[DIED]";
  }
  else if (love == 0) {
    appearance = "[LEFT]";
  }
  else if (hunger > 7 || thirst > 7 || love < 3) {
    appearance = "T_T";
  }
  else if (hunger > 4 || thirst > 4 || love < 7) {
    appearance = "-_-";
  }
  else if (hunger > 2 || thirst > 2 || love < 8) {
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

function DisableableAction({label, handleClick, hunger, thirst, love}) {
  let isAlive = (hunger < 10) && (thirst < 10) && (love > 0);

  return (
    <button disabled={!isAlive} onClick={handleClick}>{label}</button>
  );
}