import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ProductDetail() {
  const { pid } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/api/product/${pid}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setProduct(data);
        }
      })
      .catch(() => setError("Server error"));
  }, [pid]);

  if (error) return <div style={container}><h2 style={errorStyle}>⚠️ {error}</h2></div>;
  if (!product) return <div style={container}><h2>Loading...</h2></div>;

  return (
    <div style={container}>
      <h1 style={header}>📦 {product.name}</h1>
      <p><b>Product ID:</b> {product.product_id}</p>
      <p><b>Category:</b> {product.category}</p>
      <p><b>Brand:</b> {product.brand}</p>
      <p><b>Supplier:</b> {product.supplier_name} ({product.supplier_origin})</p>
      <p><b>Certifications:</b> {product.supplier_certifications}</p>
      <p><b>Manufacture Date:</b> {product.manufacture_date}</p>
      <p><b>Expiry Date:</b> {product.expiry_date}</p>
      <p><b>Stock:</b> {product.stock} units</p>
      <p><b>Next Restock:</b> {product.next_restock_date}</p>
      <p><b>Rating:</b> ⭐ {product.rating}</p>
      <p><b>Return Count:</b> {product.return_count}</p>
      <p><b>Sales:</b> {product.sales}</p>
      <p><b>Compliance Docs:</b> {product.compliance_docs}</p>
      <p><b>Size:</b> {product.size}</p>
      <p><b>Box Dimensions:</b> {product.box_dimensions}</p>
      <p><b>Top Regions:</b> {product.top_regions}</p>
      <p><b>Recyclable:</b> {String(product.recyclable)}</p>
      <p><b>Reusable:</b> {String(product.reusable)}</p>
      <p><b>Reuse Info:</b> {product.reuse_info}</p>
      <p><b>Batch Number:</b> {product.batch_number}</p>
      <p><b>Brand Sentiment:</b> {product.brand_sentiment}</p>
      <p><b>Recent Influencers:</b> {product.recent_influencers}</p>
      <p><b>Market Position:</b> {product.market_position}</p>
      <p><b>Production Cost:</b> ${product.production_cost}</p>
      <p><b>Retail Price:</b> ${product.retail_price}</p>
      <p><b>Avg Margin:</b> {product.avg_margin}%</p>
      <p><b>Reorder Prediction:</b> {product.reorder_prediction}</p>

      <br />
      <a href="/" style={backLink}>← Back to Home</a>
    </div>
  );
}

// Styling
const container = {
  maxWidth: '800px',
  margin: 'auto',
  padding: '40px',
  fontFamily: 'Arial, sans-serif',
};

const header = {
  color: '#0071ce',
  marginBottom: '20px',
};

const errorStyle = {
  color: 'red',
  textAlign: 'center',
};

const backLink = {
  textDecoration: 'none',
  color: '#0071ce',
  fontWeight: 'bold',
};
