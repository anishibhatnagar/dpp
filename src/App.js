import Navbar from './components/navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import ProductDetail from './pages/productdetail';
import AdminDashboard from './pages/admindashboard'; 
import AnomaliesPage from './pages/anomalies';
// Add admin route if you want it visible now

function App() {
  return (
    <Router>
      <Navbar /> {/* ✅ Display the Walmart-style navbar on every page */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:pid" element={<ProductDetail />} />
        <Route path="/admin" element={<AdminDashboard />} /> {/* Optional: placeholder for admin */}
        <Route path="/anomalies" element={<AnomaliesPage />} />

      </Routes>
    </Router>
  );
}

export default App;
