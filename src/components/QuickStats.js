import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function QuickStats() {
  const [mostAnomalous, setMostAnomalous] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/top-anomaly')
      .then(res => setMostAnomalous(res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>📈 Quick Stats</h2>
      {mostAnomalous ? (
        <div style={{
          background: '#fff3cd',
          padding: '10px',
          borderRadius: '6px',
          marginTop: '10px'
        }}>
          <p><b>Most Anomalous Product:</b> {mostAnomalous.name}</p>
          <p><b>Anomaly Score:</b> {mostAnomalous.anomaly_score}</p>
        </div>
      ) : (
        <p>Loading anomaly stats...</p>
      )}
    </div>
  );
}
