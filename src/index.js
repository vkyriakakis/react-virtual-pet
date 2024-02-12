import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import './index.css';
import ErrorPage from './error/ErrorPage';

import { Menu, loader as menuLoader, action as newGameAction } from './menu/Menu';
import { loader as deleteLoader, action as deletePetAction } from './menu/petDelete';

import { Game, loader as gameLoader } from './game/Game';

import "typeface-josefin-sans";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Menu />,
    loader: menuLoader,
    action: newGameAction,
    errorElement: <ErrorPage />,
  },
  {
    path: "/:petName",
    element: <Game />,
    loader: gameLoader,
    errorElement: <ErrorPage />,
  },
  {
    path: "/:petName/delete",
    loader: deleteLoader,
    action: deletePetAction,
    errorElement: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>
);
