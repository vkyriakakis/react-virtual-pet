import "../App.css";

import { useState } from 'react';
import { useLoaderData, Link, redirect } from "react-router-dom";

import SaveSlotGrid from './SaveSlotGrid';
import NameInsertionForm from './NameInsertionForm';

import Title from '../header/Title';
import Pet from '../pet/Pet';
import { parsePetOrNull, initPet } from '../pet/petUtils';

// Reads and returns all pets from local storage
export function loader() {
  let savedPets = [];

  // If curName in the local storage is set, redirect immediately to
  // the page of the corresponding pet
  let curName = localStorage.getItem("curName");
  curName = (curName !== null) ? JSON.parse(curName) : null; 
  if (curName !== null) {
    return redirect("/" + curName);
  }

  Object.keys(localStorage).forEach(key => {
    if (key !== "curName") {
      let pet = parsePetOrNull(localStorage.getItem(key));
      savedPets.push([key, pet]);
    }
  });

  return savedPets;
}

// Creates a new pet and stores it into local storage,
// afterwards it redirects to the newly created pet page
export async function action({ request }) {
  const formData = await request.formData();
  const petName = Object.fromEntries(formData).petName;

  // Create the pet only if it isn't already in local storage
  const pet = localStorage.getItem(petName);
  if (pet !== null) {
    throw new Response("Pet Already Existed", { status: 409 });
  }

  localStorage.setItem(petName, JSON.stringify(initPet()));

  return redirect(`/${petName}`);
}

export function Menu() {
  const savedPets = useLoaderData();

  return (
    <div className="menu_container">
      <div className="header_container">
        <Title />
      </div>
      
      <NameInsertionForm />
      <SaveSlotGrid savedPets={savedPets} />
    </div>
  );
}