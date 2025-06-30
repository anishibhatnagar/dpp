import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function ChartPanel({ product }) {
  const data = {
    labels: ['Stock', 'Sales', 'Rating', 'Returns'],
    datasets: [
      {
        label: 'Product Analytics',
        data: [product.stock, product.sales, product.rating, product.return_count],
        backgroundColor: ['#0071ce', '#28a745', '#ffc107', '#dc3545']
      }
    ]
  };

  return (
    <div style={{ width: '100%', marginTop: '30px' }}>
      <h3>📊 Product Analytics</h3>
      <Bar data={data} />
    </div>
  );
}
