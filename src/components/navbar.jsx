import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>Walmart DPP</div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/admin" style={styles.link}>Admin</Link>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 24px',
    backgroundColor: '#0071ce',
    color: 'white',
    fontSize: '18px',
    alignItems: 'center',
  },
  logo: {
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
  },
};
