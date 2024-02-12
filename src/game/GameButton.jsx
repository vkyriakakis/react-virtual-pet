import "../App.css";

export default function GameButton({label, handleClick, condition}) {
  return (
    <button className="game_button" disabled={condition} onClick={handleClick}>{label}</button>
  );
}