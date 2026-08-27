export function Card({
  children,
  surface = "surface", // deep | surface | elevated
  bordered = true,
  hoverable = false,
  interactive = false,
  className = "",
  onClick,
  ...props
}) {
  return (
    <div
      className={`sp-card card-surface-${surface} ${bordered ? "card-bordered" : ""} ${hoverable ? "card-hoverable" : ""} ${interactive ? "card-interactive" : ""} ${className}`}
      onClick={interactive ? onClick : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
