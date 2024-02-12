import "../App.css";

import { useState, useEffect } from 'react';

import FavoriteIcon from '@mui/icons-material/Favorite';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

import * as Constants from "../constants";
import EggStage from './EggStage';
import PetStage from './PetStage';
import { parsePetOrDefault } from '../pet/petUtils';
import { checkIsAlive } from './common';

// Determines which part to use for the ears, arms etc 
// based on the current relationship between Intelligence and Strength
function computeAppearanceId(pet) {
  if (pet.int > pet.str) {
    return 0;
  }
  else if (pet.int === pet.str) {
    return 1;
  }

  return 2;
}

export default function CurrentGame({savedPet, name}) {
  // For the first render, check the local storage for previous values,
  // and load them if they exist
  const [pet, setPet] = useState(savedPet);

  // Refresh the timeout everytime a timeout expires using
  // the ticks dependency. If the pet has died or left,
  // time stops
  useEffect(() => {
    if (checkIsAlive(pet)) {
      let timer = setTimeout(() => {
        // For the CHILD stage and beyond the thirst and hunger stats are introduced, and
        // love drops less frequently
        if (pet.ticks >= Constants.MAX_EGG_TICKS) {
          let shouldUpdateThirst = false;
          let shouldUpdateHunger = false;
          let shouldUpdateLove = false;

          let shouldUpdateEars = false;
          let shouldUpdateArms = false;
          let shouldUpdateLegs = false;

          if ((pet.ticks + 1) % Constants.THIRST_INTERVAL === 0) {
            shouldUpdateThirst = true;
          }        

          if ((pet.ticks + 1) % Constants.HUNGER_INTERVAL === 0) {
            shouldUpdateHunger = true;
          }

          if ((pet.ticks + 1) % Constants.LOVE_INTERVAL === 0) {
            shouldUpdateLove = true;
          }

          switch(pet.ticks) {
            case Constants.MAX_BABY_TICKS:
              shouldUpdateEars = true;
              break;
            case Constants.MAX_CHILD_TICKS:
              shouldUpdateArms = true;
              break;
            case Constants.MAX_TEEN_TICKS:
              shouldUpdateLegs = true;
              break;
            default:
              break;
          }

          setPet(prevPet => ({
            ...prevPet,
            ticks: prevPet.ticks + 1,
            thirst: (shouldUpdateThirst && (prevPet.thirst < Constants.MAX_THIRST)) ? prevPet.thirst + 1 : prevPet.thirst,
            hunger: (shouldUpdateHunger && (prevPet.hunger < Constants.MAX_HUNGER)) ? prevPet.hunger + 1 : prevPet.hunger,
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
      }, Constants.TICK_DURATION);

      return () => clearTimeout(timer);
    }
  }, [pet.ticks]);

  // Store to local storage after every re-render (change in the pet's state)
  useEffect(() => {
      localStorage.setItem(name, JSON.stringify(pet));
  });

  // For the EGG stage
  if (pet.ticks < Constants.MAX_EGG_TICKS) {
    return (
      <EggStage 
        pet={pet} 
        setPet={setPet}
      />
    );
  }

  // For the CHILD stage and beyond
  return (
    <PetStage
      pet={pet}
      setPet={setPet}
    />
  );
}
