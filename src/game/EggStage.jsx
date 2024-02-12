import "../App.css";

import FavoriteIcon from '@mui/icons-material/Favorite';

import * as Constants from "../constants";

import { checkIsAlive } from './common';
import GameButton from './GameButton';

import Stat from '../pet/Stat';
import Need from '../pet/Need';
import Pet from '../pet/Pet';

export default function EggStage({pet, setPet}) {
  function handleHeatClick() {
    setPet(prevPet => ({
      ...prevPet,
      love: (prevPet.love < Constants.MAX_LOVE) ? prevPet.love + 1 : prevPet.love,
      red: (prevPet.red < Constants.MAX_COLOR) ? prevPet.red + Constants.COLOR_INCREASE : prevPet.red
    }));
  }

  function handleColdClick() {
    setPet(prevPet => ({
      ...prevPet,
      love: (prevPet.love < Constants.MAX_LOVE) ? prevPet.love + 1 : prevPet.love,
      blue: (prevPet.blue < Constants.MAX_COLOR) ? prevPet.blue + Constants.COLOR_INCREASE : prevPet.blue
    }));
  }

  function handleLifeClick() {
    setPet(prevPet => ({
      ...prevPet,
      love: (prevPet.love < Constants.MAX_LOVE) ? prevPet.love + 1 : prevPet.love,
      green: (prevPet.green < Constants.MAX_COLOR) ? prevPet.green + Constants.COLOR_INCREASE : prevPet.green
    }));
  }

  return (
    <>
      <div className="stats_container">
        <Stat label="Age" value={pet.ticks} />
      </div>

      <div className="needs_container">
        <Need icon={<FavoriteIcon />} value={pet.love} max_value={Constants.MAX_LOVE} />
      </div>

      <Pet pet={pet} />

      <div className="actions_container">
        <GameButton label="Heat" handleClick={handleHeatClick} condition={!checkIsAlive(pet) || pet.love === Constants.MAX_LOVE} />
        <GameButton label="Cold" handleClick={handleColdClick} condition={!checkIsAlive(pet) || pet.love === Constants.MAX_LOVE} />
        <GameButton label="Life" handleClick={handleLifeClick} condition={!checkIsAlive(pet) || pet.love === Constants.MAX_LOVE} />
      </div>
    </>
  );
}