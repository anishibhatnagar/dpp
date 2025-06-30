export default function RestockTimeline({ stages }) {
  return (
    <div style={timelineBox}>
      <h4>🚚 Restock Tracking</h4>
      <ul style={timelineList}>
        {stages.map((stage, i) => (
          <li key={i} style={timelineItem}>
            <strong>{stage.stage}</strong> - {stage.status}
            <div style={{ fontSize: '12px', color: 'gray' }}>{stage.timestamp}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const timelineBox = {
  marginTop: '20px',
  padding: '16px',
  border: '1px solid #ddd',
  borderRadius: '12px',
  background: '#f0f8ff',
};

const timelineList = {
  listStyle: 'none',
  padding: 0,
};

const timelineItem = {
  marginBottom: '10px',
};
