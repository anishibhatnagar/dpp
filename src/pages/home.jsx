import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../components/qrcode';

export default function Home() {
  const [pid, setPid] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🔍 Walmart Digital Product Passport</h1>

      {/* Search and QR Scanner */}
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

      {showScanner && (
        <div style={{ marginTop: '10px' }}>
          <QRScanner closeScanner={() => setShowScanner(false)} />
        </div>
      )}

      {/* Quick Stats */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={styles.subheader}>📊 Quick Stats</h2>
        <div style={styles.statsRow}>
          <div style={styles.statBox}>📦 1,200 units in stock</div>
          <div style={styles.statBox}>💰 Sales up by 12%</div>
          <div style={styles.statBox}>🔁 Next Restock: 2 days</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
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
};
