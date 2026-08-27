export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
  className = "",
}) {
  return (
    <div className={`sp-section-header ${className}`}>
      <div className="sp-section-header-main">
        {eyebrow && <span className="sp-section-eyebrow">{eyebrow}</span>}
        <h2 className="sp-section-title">{title}</h2>
        {subtitle && <p className="sp-section-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="sp-section-header-action">{action}</div>}
    </div>
  );
}

export default SectionHeader;
