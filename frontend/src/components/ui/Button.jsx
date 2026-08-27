export function Button({
  children,
  variant = "primary", // primary | secondary | tertiary | ghost | danger
  size = "md", // sm | md | lg
  isLoading = false,
  isDisabled = false,
  icon,
  className = "",
  type = "button",
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      className={`sp-button btn-${variant} btn-${size} ${className}`}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <span className="btn-spinner" aria-label="Loading..." />
      ) : icon ? (
        <span className="btn-icon-wrap">{icon}</span>
      ) : null}
      <span className="btn-text">{children}</span>
    </button>
  );
}

export default Button;
