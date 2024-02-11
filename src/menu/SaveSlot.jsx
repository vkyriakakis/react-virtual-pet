import "../App.css";

import { Link } from "react-router-dom";

import PetDeletionButton from './PetDeletionButton';

import Pet from '../pet/Pet';
import Stat from '../pet/Stat';

export default function SaveSlot({name, pet, handlePetDelete}) {
  return (
    <div>
      <Link to={name} style={{ textDecoration: 'none' }}>
        <div className="save_slot_container">
          <h2>{name}</h2>
          <Pet pet={pet} />
          <Stat label="Age" value={pet.ticks} />
        </div>
      </Link>

      <PetDeletionButton name={name}  handlePetDelete={handlePetDelete} />
    </div>
  );
}