export function Badge({
  children,
  variant = "purple", // purple | cyan | green | amber | red | neutral
  size = "md", // sm | md | lg
  className = "",
}) {
  return (
    <span className={`sp-badge badge-${variant} badge-${size} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
