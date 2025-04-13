
import React, { useEffect, useState } from 'react';
import './App.css';
import AlertList from './components/AlertList';
import AlertDetail from './components/AlertDetail';

function App() {
  // State to hold all incoming alerts
  const [alerts, setAlerts] = useState([]);
  // State to track the currently selected alert for detail view
  const [selectedAlert, setSelectedAlert] = useState(null);
  // State to handle sort order of the alerts list
  const [sortOrder, setSortOrder] = useState('time-desc');

  // Load alerts from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem('alerts');
    if (saved) {
      setAlerts(JSON.parse(saved));
    }
  }, []);

  // Save alerts to localStorage whenever alerts state changes
  useEffect(() => {
    localStorage.setItem('alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Establish WebSocket connection to backend server on mount
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:4000');

    // Handle incoming messages (SNS alert broadcast from backend)
    socket.onmessage = (event) => {
      const alert = JSON.parse(event.data);// Parse JSON alert
      setAlerts(prev => [alert, ...prev]); // Prepend to alerts array
    };

    socket.onerror = (err) => console.error('WebSocket error:', err);

    // Cleanup WebSocket connection on unmount
    return () => socket.close();
  }, []);

  // Helper to extract numeric severity score from message content
  const getSeverityScore = (message) => {
    const match = message?.match(/Severity Score:\s*(\d+)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Sort alerts based on selected sort order
  const sortedAlerts = [...alerts].sort((a, b) => {
    if (sortOrder.startsWith('severity')) {
      const aScore = getSeverityScore(a.Message);
      const bScore = getSeverityScore(b.Message);
      return sortOrder === 'severity-asc' ? aScore - bScore : bScore - aScore;
    }
  
    if (sortOrder.startsWith('time')) {
      const aTime = new Date(a.Timestamp).getTime();
      const bTime = new Date(b.Timestamp).getTime();
      return sortOrder === 'time-asc' ? aTime - bTime : bTime - aTime;
    }
  
    return 0;
  });

  // Count number of alerts in each severity bucket
  const severityBuckets = alerts.reduce((acc, alert) => {
    const score = getSeverityScore(alert.Message);
    if (score >= 8) acc.high++;
    else if (score >= 5) acc.medium++;
    else acc.low++;
    return acc;
  }, { high: 0, medium: 0, low: 0 });
  
  const { high, medium, low } = severityBuckets;

  // Render dashboard layout
  return (
    <>
      <div className="header-bar">🔐 SIEM Dashboard </div>
      <div className="summary-bar">
      <div>📊 Total Alerts: <strong>{alerts.length}</strong></div>
      <div>🔴 High: <strong>{high}</strong></div>
      <div>🟠 Medium: <strong>{medium}</strong></div>
      <div>🟢 Low: <strong>{low}</strong></div>
      </div>
      <div className="app-container">
        <div className="panel alert-list">
          <AlertList
            alerts={sortedAlerts}
            onSelect={setSelectedAlert}
            selectedAlert={selectedAlert}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />
        </div>
        <div className="panel alert-detail">
          <AlertDetail alert={selectedAlert} />
        </div>
      </div>
    </>
  );
}

export default App;
  

