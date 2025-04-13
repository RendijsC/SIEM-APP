import React from 'react';

// Component to render a list of alerts with sorting and selection
function AlertList({ alerts, onSelect, selectedAlert, sortOrder, onSortChange }) {
  return (
    <div>
      <h2 className="alert-heading">Alerts</h2>

      <label className="sort-label">Sort by:</label>
      {/* Drop down for selecting sort order */}
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


      {/* Conditional rendering: show message if no alerts are present */}
      {alerts.length === 0 ? (
        <p>No alerts yet.</p>
      ) : (
        // Map through the list of alerts and render each one
        alerts.map((alert, index) => {
          // Check if this alert is the currently selected one
          const isSelected = selectedAlert && alert.Timestamp === selectedAlert.Timestamp;

          // Extract the severity score from the message
          const severityMatch = alert?.Message?.match(/Severity Score:\s*(\d+)/);
          const severity = severityMatch ? severityMatch[1] : 'N/A';

          return (
            <div
              key={index}
              className={`alert-item ${isSelected ? 'alert-item-selected' : ''}`}
              onClick={() => onSelect(alert)}
            >
              {/* Display the alert subject or fallback if not provided */}
              <div className="alert-title">
                {alert.Subject || 'No Subject'}
              </div>

              {/* Display parsed severity value */}
              <div className="severity-text">
                Severity: {severity}
              </div>
              {/* Show timestamp in readable format */}
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
