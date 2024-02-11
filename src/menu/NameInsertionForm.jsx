import "../App.css";

import { Form } from "react-router-dom";

export default function NameInsertionForm() {
  return (
    <div className="new_game_form_container">
      <Form method="post" action="/">
        <label>New pet name:</label>
        <br />
        <input className="new_game_input" type="text" name="petName" id="petName"/>
      </Form>
    </div>
  );
}