import logo from './logo.svg';
import "./App.css";
import { useState, useEffect } from 'react';

export default function App() {
  // For the first render, check the local storage for previous values,
  // and load them if they exist
  const [hunger, setHunger] = useState(parseInt(localStorage.getItem("hunger")));
  const [thirst, setThirst] = useState(parseInt(localStorage.getItem("thirst")));
  const [love, setLove] = useState(parseInt(localStorage.getItem("love")));
  const [ticks, setTicks] = useState(parseInt(localStorage.getItem("ticks")));

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
      <div className="status_container">
        <Status label="Hunger" value={hunger} />
        <Status label="Thirst" value={thirst} />
        <Status label="Love" value={love} />
        <Status label="Age" value={ticks} />
      </div>

      <Pet hunger={hunger} thirst={thirst} love={love} />

      <div className="actions_container">
        <Action label="Feed" handleClick={handleFeedClick} />
        <Action label="Water" handleClick={handleWaterClick} />
        <Action label="Pet" handleClick={handlePetClick} />
        <Action label="Reset" handleClick={handleResetClick} />
      </div>
    </div>
  );
}

function Pet({hunger, thirst, love}) {
  let appearance = "";

  // Use the pet's needs to decide the depiction
  if (hunger > 7 || thirst > 7 || love < 3) {
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