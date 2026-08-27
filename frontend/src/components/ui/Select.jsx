export function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = "-- Select option --",
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <div className={`sp-select-group ${className}`}>
      {label && <label className="sp-select-label">{label}</label>}
      <div className="sp-select-wrapper">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="sp-select"
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="sp-select-chevron">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
    </div>
  );
}

export default Select;
