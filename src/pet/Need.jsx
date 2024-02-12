import "../App.css";

export default function Need({icon, value, max_value}) {
  const widthStr = ((value / max_value) * 100) + "%";

  return (
    <div className="single_need_container">
      {icon}

      <div className="need_empty_progress_bar">
        <div className="need_filled_progress_bar" style={{width: widthStr}}></div>
      </div>
    </div>
  );
}