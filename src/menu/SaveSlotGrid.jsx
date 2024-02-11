import "../App.css";

import SaveSlot from './SaveSlot';

export default function SaveSlotGrid({savedPets, handlePetDelete}) {
  const saveSlots = savedPets.map(([name, pet]) => <SaveSlot 
    key={name} 
    name={name} 
    pet={pet} 
    handlePetDelete = {handlePetDelete}
  />);

  return (
    <div className="save_slot_grid_container">
      {saveSlots}
    </div>
  );
}
