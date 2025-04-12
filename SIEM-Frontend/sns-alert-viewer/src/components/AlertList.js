import React from 'react';

function AlertList({ alerts, onSelect, selectedAlert, sortOrder, onSortChange }) {
  return (
    <div>
      <h2 className="alert-heading">Alerts</h2>

      <label className="sort-label">Sort by:</label>

      <select
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value)}
        className="sort-dropdown"
      >
        <option value="time-desc">Time (Newest → Oldest)</option>
        <option value="time-asc">Time (Oldest → Newest)</option>
        <option value="severity-desc">Severity (High → Low)</option>
        <option value="severity-asc">Severity (Low → High)</option>
      </select>

      {alerts.length === 0 ? (
        <p>No alerts yet.</p>
      ) : (
        alerts.map((alert, index) => {
          const isSelected = selectedAlert && alert.Timestamp === selectedAlert.Timestamp;

          const severityMatch = alert?.Message?.match(/Severity Score:\s*(\d+)/);
          const severity = severityMatch ? severityMatch[1] : 'N/A';

          return (
            <div
              key={index}
              className={`alert-item ${isSelected ? 'alert-item-selected' : ''}`}
              onClick={() => onSelect(alert)}
            >
              <div className="alert-title">
                {alert.Subject || 'No Subject'}
              </div>

              <div className="severity-text">
                Severity: {severity}
              </div>
              <div className="alert-timestamp">
                {new Date(alert.Timestamp).toLocaleString()}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default AlertList;
