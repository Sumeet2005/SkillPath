export function Stat({
  value,
  label,
  icon,
  className = "",
}) {
  return (
    <div className={`sp-stat-block ${className}`}>
      {icon && <div className="sp-stat-icon-wrap">{icon}</div>}
      <div className="sp-stat-text-stack">
        <span className="sp-stat-value">{value}</span>
        <span className="sp-stat-label">{label}</span>
      </div>
    </div>
  );
}

export default Stat;
