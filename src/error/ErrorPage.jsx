import "../App.css";

import { useRouteError } from "react-router-dom";

import ErrorPet from './ErrorPet';
import Title from '../header/Title';

export default function ErrorPage() {
  const error = useRouteError();

  console.log(error);

  return (
    <div className="error_page_container">
      <div className="header_container">
        <Title />
      </div>

      <div className="error_message_container">
        <h1>{error.status}</h1>
        <i>{error.data}</i>
        <ErrorPet />
      </div>
    </div>  
  );
}

