import React from 'react';
import ReactMarkdown from 'react-markdown';

function AlertDetail({ alert }) {
  return (
    <div className="alert-detail">
      <h2 style={{ marginBottom: '16px' }}>Alert Details</h2>
      {alert ? (
        <ReactMarkdown>{alert.Message}</ReactMarkdown>
      ) : (
        'Select an alert to view details.'
      )}
    </div>
  );
}

export default AlertDetail;


