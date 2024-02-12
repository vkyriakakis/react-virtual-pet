import "../App.css";

import FavoriteIcon from '@mui/icons-material/Favorite';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

import * as Constants from "../constants";

import { checkIsAlive } from './common';
import GameButton from './GameButton';

import Stat from '../pet/Stat';
import Need from '../pet/Need';
import Pet from '../pet/Pet';

export default function PetStage({pet, setPet}) {
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
      love: (prevPet.love < Constants.MAX_LOVE) ? prevPet.love + 1 : prevPet.love,
      str: prevPet.str + 1
    }));
  }

  function handleStudyClick() {
    setPet(prevPet => ({
      ...prevPet,
      love: (prevPet.love < Constants.MAX_LOVE) ? prevPet.love + 1 : prevPet.love,
      int: prevPet.int + 1
    }));
  }

  return (
    <>
      <div className="stats_container">
        <div>
          <Stat label="Age" value={pet.ticks} />
          <Stat label="Strength" value={pet.str} />
          <Stat label="Intelligence" value={pet.int} />
        </div>
      </div>

      <div className="needs_container">
        <Need icon={<RestaurantIcon />} value={Constants.MAX_HUNGER - pet.hunger} max_value={Constants.MAX_HUNGER} />
        <Need icon={<WaterDropIcon />} value={Constants.MAX_THIRST - pet.thirst} max_value={Constants.MAX_THIRST} />
        <Need icon={<FavoriteIcon />} value={pet.love} max_value={Constants.MAX_LOVE} />
      </div>

      <Pet pet={pet} />

      <div className="actions_container">
        <div className="pet_actions_container">
          <GameButton label="Feed" handleClick={handleFeedClick} condition={!checkIsAlive(pet) || pet.hunger === 0} />
          <GameButton label="Water" handleClick={handleWaterClick} condition={!checkIsAlive(pet) || pet.thirst === 0} />
          <GameButton label="Play" handleClick={handlePlayClick} condition={!checkIsAlive(pet) || pet.love === Constants.MAX_LOVE} />
          <GameButton label="Study" handleClick={handleStudyClick} condition={!checkIsAlive(pet) || pet.love === Constants.MAX_LOVE} />
        </div>
      </div>
    </>
  );
}
