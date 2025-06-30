import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import RestockTimeline from '../components/restocktimeline';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const row = { display: 'flex', padding: '40px', gap: '30px' };
const leftPane = { width: '60%', fontFamily: 'Arial, sans-serif' };
const rightPane = { width: '40%' };
const backLink = { textDecoration: 'none', color: '#0071ce', fontWeight: 'bold' };
const errorStyle = { color: 'red', textAlign: 'center' };
const container = { maxWidth: '800px', margin: 'auto', padding: '40px', fontFamily: 'Arial, sans-serif' };
const header = { color: '#0071ce', marginBottom: '20px' };
const analysisBox = {
  background: '#f9f9f9',
  marginTop: '20px',
  borderRadius: '12px',
  padding: '16px',
  border: '1px solid #ddd',
  fontSize: '14px',
  fontFamily: 'Arial',
};

export default function ProductDetail() {
  const { pid } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/api/product/${pid}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setProduct(data);
      })
      .catch(() => setError("Server error"));
  }, [pid]);

  if (error) return <div style={container}><h2 style={errorStyle}>⚠️ {error}</h2></div>;
  if (!product) return <div style={container}><h2>Loading...</h2></div>;

  const chartData = {
    labels: ['Stock', 'Sales', 'Returns', 'Rating', 'Avg Margin', 'Last Week Sales'],
    datasets: [
      {
        label: 'Product Stats',
        data: [
          product.stock,
          product.sales,
          product.return_count,
          product.rating,
          product.avg_margin,
          product.last_week_sales || 0
        ],
        backgroundColor: ['#36a2eb', '#4bc0c0', '#ff6384', '#ff9f40', '#9966ff', '#9ccc65'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: `Anomaly Score: ${product.anomaly_score} (${product.is_anomalous ? '❗ Anomalous' : '✅ Normal'})`
      }
    },
  };

  const anomalyConclusion = () => {
    if (!product || !product.is_anomalous)
      return "✅ This product is behaving normally with no unusual patterns detected.";

    return (
      <>
        <p><strong>🧠 What is Anomaly Score?</strong> Indicates if a product's behavior is unusual based on sales, returns, rating, stock, etc.</p>
        <p><span style={{ color: '#d32f2f' }}><strong>📉 Anomaly Insight:</strong> {product.anomaly_description}</span></p>
        {product.anomaly_tags && product.anomaly_tags.length > 0 && (
          <p><strong>📌 Tags:</strong> {product.anomaly_tags.join(', ')}</p>
        )}
        <p><strong>✅ Recommended Action:</strong> Consider restocking, fixing quality, addressing high returns, or reviewing pricing.</p>
      </>
    );
  };

  const socialTrendSummary = () => {
  const trend = product.social_trend;
  if (!trend) return null;

  return (
    <>
      <p><strong>💬 Social Media Buzz:</strong> {trend.score} — {trend.score >= 70 ? "🚀 Trending!" : "📉 Low visibility."}</p>
      {product.trend_stock_note && (
        <p><strong>📦 Stock Advisory:</strong> {product.trend_stock_note}</p>
      )}
      {product.recommended_extra_units !== undefined && product.recommended_extra_units > 0 && (
        <p><strong>📊 Suggested Stock Boost:</strong> {product.recommended_extra_units} more units needed based on trend.</p>
      )}
      <p>
        {trend.score >= 70
          ? "🔥 Consider boosting stock or launching ads while demand is rising."
          : "👥 Maybe run promotions or influencer campaigns to improve engagement."}
      </p>
    </>
  );
};


  return (
    <div style={row}>
      <div style={leftPane}>
        <h1 style={header}>📦 {product.name}</h1>
        <p><b>Product ID:</b> {product.product_id}</p>
        <p><b>Category:</b> {product.category}</p>
        <p><b>Brand:</b> {product.brand}</p>
        <p><b>Supplier:</b> {product.supplier_name} ({product.supplier_origin})</p>
        <p><b>Certifications:</b> {product.supplier_certifications}</p>
        <p><b>Manufacture Date:</b> {product.manufacture_date}</p>
        <p><b>Expiry Date:</b> {product.expiry_date}</p>
        <p><b>Stock:</b> {product.stock}</p>
        <p><b>Next Restock:</b> {product.next_restock_date}</p>
        {product.estimated_next_restock && <p><b>📦 Estimated Arrival:</b> {product.estimated_next_restock}</p>}
        <p><b>Rating:</b> ⭐ {product.rating}</p>
        <p><b>Return Count:</b> {product.return_count}</p>
        <p><b>Sales:</b> {product.sales}</p>
        <p><b>Last Week Sales:</b> {product.last_week_sales}</p>
        <p><b>Compliance Docs:</b> {product.compliance_docs}</p>
        <p><b>Size:</b> {product.size}</p>
        <p><b>Box Dimensions:</b> {product.box_dimensions}</p>
        <p><b>Top Regions:</b> {product.top_regions}</p>
        <p><b>Recyclable:</b> {String(product.recyclable)}</p>
        <p><b>Reusable:</b> {String(product.reusable)}</p>
        <p><b>Reuse Info:</b> {product.reuse_info}</p>
        <p><b>Batch Number:</b> {product.batch_number}</p>
        <p><b>Brand Sentiment:</b> {product.brand_sentiment}</p>
        <p><b>Influencers:</b> {product.recent_influencers}</p>
        <p><b>Market Position:</b> {product.market_position}</p>
        <p><b>Production Cost:</b> ${product.production_cost}</p>
        <p><b>Retail Price:</b> ${product.retail_price}</p>
        <p><b>Avg Margin:</b> {product.avg_margin}%</p>
        <p><b>Reorder Prediction:</b> {product.reorder_prediction}</p>
        <br />
        <a href="/" style={backLink}>← Back to Home</a>
      </div>

      <div style={rightPane}>
        <Bar data={chartData} options={chartOptions} />

        <div style={analysisBox}>
          <h4 style={{ color: product.is_anomalous ? '#d32f2f' : '#388e3c' }}>
            {product.is_anomalous ? '❗ Anomaly Detected' : '✅ No Anomaly'}
          </h4>
          {anomalyConclusion()}
        </div>

        {product.restock_tracking && (
          <div style={analysisBox}>
            <h4 style={{ color: '#ff9800' }}>📦 Restock Timeline</h4>
            <RestockTimeline stages={product.restock_tracking} />
          </div>
        )}

        {product.social_trend && (
          <div style={analysisBox}>
            <h4 style={{ color: '#2d89ef' }}>🔥 Social Media Trend</h4>
            <p><strong>Hashtag:</strong> {product.social_trend.hashtag}</p>
            <p><strong>Platform:</strong> {product.social_trend.platform}</p>
            <p><strong>Sample:</strong> <em>{product.social_trend.sample}</em></p>
            {socialTrendSummary()}
          </div>
        )}

        {product.brand_dynamics && (
          <div style={analysisBox}>
            <h4 style={{ color: '#673ab7' }}>🏷️ Brand Dynamics</h4>
            <p><strong>Sentiment:</strong> {product.brand_dynamics.sentiment}</p>
            <p><strong>Top Influencers:</strong> {product.brand_dynamics.influencers}</p>
            <p><strong>Market Rank:</strong> {product.brand_dynamics.rank}</p>
            <p><strong>Advice:</strong> {product.brand_dynamics.advice}</p>
          </div>
        )}

        {product.supplier_analysis && (
          <div style={analysisBox}>
            <h4 style={{ color: '#d32f2f' }}>🔍 Supplier Evaluation</h4>
            <p><strong>Score:</strong> {product.supplier_analysis.score}</p>
            <p><strong>Return Ratio:</strong> {product.supplier_analysis.return_ratio}</p>
            <p>{product.supplier_analysis.change_recommendation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
