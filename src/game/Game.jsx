import "../App.css";

import { useLoaderData } from "react-router-dom";

import Title from '../header/Title';
import Name from '../header/Name';

import CurrentGame from './CurrentGame';

import { parsePetOrNull } from '../pet/petUtils';

export function loader({ params }) {
  const pet = parsePetOrNull(localStorage.getItem(params.petName));

  // If the pet is not found, throw 404
  if (pet === null) {
    throw new Response("Pet Not Found", { status: 404 });
  }

  // Set the curName in local storage to the name of the newly loaded pet,
  // so that it will automatically load again the next time the user accesses the game
  localStorage.setItem("curName", JSON.stringify(params.petName));

  return [params.petName, pet];
}

export function Game() {
  const [petName, savedPet] = useLoaderData();

  return (
    <div className="game_container">
      <div className="header_container">
        <Title />
        <Name name={petName} />
      </div>

      <CurrentGame savedPet={savedPet} name={petName} />
    </div>
  );
}


