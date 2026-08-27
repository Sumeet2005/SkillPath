export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
  className = "",
  ...props
}) {
  return (
    <div className={`sp-search-wrapper ${className}`}>
      <span className="sp-input-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="sp-input has-icon"
        {...props}
      />
      {value && onClear && (
        <button type="button" className="sp-search-clear-btn" onClick={onClear} aria-label="Clear search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default SearchInput;
