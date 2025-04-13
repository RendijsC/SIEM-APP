import React from 'react';
import ReactMarkdown from 'react-markdown';

// Component to display detailed view of a selected alert

function AlertDetail({ alert }) {
  return (
    <div className="alert-detail">
      <h2 style={{ marginBottom: '16px' }}>Alert Details</h2>

      {/* If an alert is selected, render its message content as markdown */}
      {alert ? (
        <ReactMarkdown>{alert.Message}</ReactMarkdown>
      ) : (
        // If no alert is selected, show placeholder text
        'Select an alert to view details.'
      )}
    </div>
  );
}

export default AlertDetail;


