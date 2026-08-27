import { useEffect } from "react";

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="sp-modal-backdrop" onClick={onClose}>
      <div className={`sp-modal-container ${className}`} onClick={(e) => e.stopPropagation()}>
        <div className="sp-modal-header">
          <h3 className="sp-modal-title">{title}</h3>
          <button type="button" className="sp-modal-close-btn" onClick={onClose} aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="sp-modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
