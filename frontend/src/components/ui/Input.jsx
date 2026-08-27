export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  error,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <div className={`sp-input-group ${className}`}>
      {label && <label className="sp-input-label">{label}</label>}
      <div className="sp-input-wrapper">
        {icon && <span className="sp-input-icon">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`sp-input ${icon ? "has-icon" : ""} ${error ? "has-error" : ""}`}
          {...props}
        />
      </div>
      {error && <span className="sp-input-error-msg">{error}</span>}
    </div>
  );
}

export default Input;
