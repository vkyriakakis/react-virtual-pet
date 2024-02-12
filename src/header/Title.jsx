import "../App.css";

import { Link } from "react-router-dom";

export default function Title() {
  // Except acting as a link to the front-page,
  // the curName in local storage must also be cleared
  // to prevent looping back to the current pet page
  return (
    <Link to="/" onClick={() => localStorage.setItem("curName", JSON.stringify(null))} style={{ textDecoration: 'none' }}>
      <div className="title_container">
        My Virtual Pet
      </div>
    </Link>
  );
}
