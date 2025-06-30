import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QRScanner from '../components/qrcode';
import axios from 'axios';

export default function Home() {
  const [pid, setPid] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [topRisky, setTopRisky] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const loadRiskyProducts = () => {
    axios.get('http://localhost:5000/api/top-risky-products')
      .then(res => setTopRisky(res.data))
      .catch(err => {
        console.error("Error loading risky products:", err);
        setTopRisky([]);
      });
  };

  useEffect(() => {
    if (location.pathname === "/") {
      loadRiskyProducts();
    }
  }, [location]);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🔍 Walmart Digital Product Passport</h1>

      {/* 🔎 Search & QR */}
      <div style={styles.searchRow}>
        <input
          type="text"
          value={pid}
          onChange={(e) => setPid(e.target.value)}
          placeholder="Enter or scan Product ID"
          style={styles.input}
        />
        <button onClick={() => navigate(`/product/${pid}`)} style={styles.button}>Search</button>
        <button onClick={() => setShowScanner(!showScanner)} style={styles.button}>
          {showScanner ? 'Hide QR' : 'Scan QR'}
        </button>
      </div>

      {showScanner && <QRScanner closeScanner={() => setShowScanner(false)} />}

      {/* 📊 Stats */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={styles.subheader}>📊 Quick Stats</h2>
        <div style={styles.statsRow}>
          <div style={styles.statBox}>📦 1,200 units in stock</div>
          <div style={styles.statBox}>💰 Sales up by 12%</div>
          <div style={styles.statBox}>🔁 Next Restock: 2 days</div>
        </div>

        {/* ⚠️ Anomalies Only */}
        {topRisky.length > 0 ? (
          <div style={styles.anomalyWrapper}>
            <h3 onClick={() => navigate('/anomalies')} style={styles.riskHeader}>
              🚨 ANOMALIES DETECTED
            </h3>
            <div style={styles.anomalyBox}>
              {topRisky.map(p => (
                <div
                  key={p.product_id}
                  style={styles.anomalyItem}
                  onClick={() => navigate(`/product/${p.product_id}`)}
                >
                  🔹 {p.name} <span style={{ fontSize: '13px' }}>(Score: {p.anomaly_score})</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <h3 style={{ marginTop: '30px', color: 'gray' }}>✅ No current anomalies detected.</h3>
        )}
      </div>
    </div>
  );
}

// 🖌️ Styles
const styles = {
  container: {
    maxWidth: '1100px',
    margin: 'auto',
    padding: '40px 20px',
  },
  header: {
    color: '#0071ce',
    textAlign: 'center',
    fontSize: '26px',
  },
  subheader: {
    color: '#0071ce',
    marginBottom: '15px',
  },
  searchRow: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  input: {
    padding: '10px',
    width: '300px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 16px',
    backgroundColor: '#0071ce',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  statsRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  statBox: {
    backgroundColor: '#e6f4ff',
    padding: '20px',
    borderRadius: '8px',
    minWidth: '200px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  anomalyWrapper: {
    marginTop: '40px',
    maxWidth: '340px',
    width: '100%',
  },
  riskHeader: {
    color: '#c70000',
    marginBottom: '10px',
    cursor: 'pointer',
    fontSize: '18px',
    textAlign: 'left',
  },
  anomalyBox: {
    backgroundColor: '#ffe6e6',
    padding: '16px',
    border: '2px solid red',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  anomalyItem: {
    padding: '6px 10px',
    cursor: 'pointer',
    backgroundColor: '#fff0f0',
    marginBottom: '6px',
    borderRadius: '5px',
    width: '100%',
  },
};
