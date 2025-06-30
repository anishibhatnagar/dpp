import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AnomaliesPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const LIMIT = 50; // Products per page

  const fetchPage = (pageNum) => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/all-risky-products?page=${pageNum}&limit=${LIMIT}`)
      .then((res) => {
        setProducts(res.data.data);
        setTotalPages(res.data.total_pages);
        setPage(res.data.page);
        setLoading(false);
      })
      .catch(() => {
        console.error('Failed to fetch anomalies');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPage(1);
  }, []);

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchPage(newPage);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#c70000' }}>📊 All Products by Anomaly Score</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#ddd' }}>
                <th style={thStyle}>Product Name</th>
                <th style={thStyle}>Anomaly Score</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr
                  key={prod.product_id}
                  onClick={() => navigate(`/product/${prod.product_id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={tdStyle}>{prod.name}</td>
                  <td style={tdStyle}>{prod.anomaly_score}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button onClick={() => goToPage(page - 1)} disabled={page === 1} style={buttonStyle}>
              ⬅ Prev
            </button>
            <span style={{ margin: '0 10px' }}>
              Page {page} of {totalPages}
            </span>
            <button onClick={() => goToPage(page + 1)} disabled={page === totalPages} style={buttonStyle}>
              Next ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const thStyle = { padding: '10px', border: '1px solid #ccc' };
const tdStyle = { padding: '10px', borderBottom: '1px solid #eee' };
const buttonStyle = {
  padding: '8px 16px',
  backgroundColor: '#0071ce',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};
