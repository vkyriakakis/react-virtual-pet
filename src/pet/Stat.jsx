import "../App.css";

export default function Stat({label, value}) {
  return (
    <div className="single_stat_container">
      <div className="stat_label">{label}</div>
      <div className="stat_value">{value}</div>
    </div>
  );
}
