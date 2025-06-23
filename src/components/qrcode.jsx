import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { useNavigate } from 'react-router-dom';

export default function QRScanner({ closeScanner }) {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleScan = (result) => {
    if (result?.text) {
      navigate(`/product/${result.text}`);
      closeScanner();
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError('Camera access failed');
  };

  return (
    <div>
      <h3>📷 Scan QR Code</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <QrReader
        scanDelay={300}
        onResult={(result, error) => {
          if (result) handleScan(result);
          if (error) handleError(error);
        }}
        constraints={{ facingMode: 'environment' }}
        style={{ width: '100%' }}
      />
      <button onClick={closeScanner} style={{ marginTop: '10px' }}>❌ Close Scanner</button>
    </div>
  );
}
