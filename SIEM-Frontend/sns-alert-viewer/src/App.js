
import React, { useEffect, useState } from 'react';
import './App.css';
import AlertList from './components/AlertList';
import AlertDetail from './components/AlertDetail';

function App() {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [sortOrder, setSortOrder] = useState('time-desc');

  useEffect(() => {
    const saved = localStorage.getItem('alerts');
    if (saved) {
      setAlerts(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:4000');

    socket.onmessage = (event) => {
      const alert = JSON.parse(event.data);
      setAlerts(prev => [alert, ...prev]);
    };

    socket.onerror = (err) => console.error('WebSocket error:', err);

    return () => socket.close();
  }, []);

  const getSeverityScore = (message) => {
    const match = message?.match(/Severity Score:\s*(\d+)/);
    return match ? parseFloat(match[1]) : 0;
  };

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

  const severityBuckets = alerts.reduce((acc, alert) => {
    const score = getSeverityScore(alert.Message);
    if (score >= 8) acc.high++;
    else if (score >= 5) acc.medium++;
    else acc.low++;
    return acc;
  }, { high: 0, medium: 0, low: 0 });
  
  const { high, medium, low } = severityBuckets;

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
  

