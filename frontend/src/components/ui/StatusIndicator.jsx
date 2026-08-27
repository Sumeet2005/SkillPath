export function StatusIndicator({
  isOnline = true,
  onlineLabel = "Neo4j Active",
  offlineLabel = "Connection Offline",
  className = "",
}) {
  return (
    <div className={`sp-status-indicator ${isOnline ? "online" : "offline"} ${className}`}>
      <span className="sp-status-dot" />
      <span className="sp-status-label">{isOnline ? onlineLabel : offlineLabel}</span>
    </div>
  );
}

export default StatusIndicator;
