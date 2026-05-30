import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Header from './components/Header';
import Footer from './components/Footer';
import Novition from './pages/Novition';
import NovitionHasil from './pages/NovitionHasil';
import LengkapiData from './pages/LengkapiData';
import Profile from './pages/Profile';
import DetailArtikel from './pages/DetailArtikel';

const MainLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F2DCDB' }}>
      <Header />
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#6C0820', textAlign: 'center' }}>Riwayat Anak</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', color: '#6C0820' }}>
          Hasil Scan 1: Stunting Terdeteksi
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', color: '#6C0820' }}>
          Hasil Scan 2: Gizi Baik
        </div>
      </div>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <button style={scanButtonStyle} onClick={() => navigate('/novition')}>
          Scan Anak Stunting
        </button>
        <button style={artikelButtonStyle} onClick={() => navigate('/')}>
          Baca Artikel Edukasi
        </button>
      </div>
    </div>
  );
};

const scanButtonStyle = { background: '#6C0820', color: 'white', padding: '15px 25px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold', flex: 1 };
const artikelButtonStyle = { background: 'white', color: '#6C0820', padding: '15px 25px', borderRadius: '12px', border: '2px solid #6C0820', cursor: 'pointer', fontWeight: 'bold', flex: 1 };

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/novition" element={<Novition />} />
          <Route path="/novition-hasil" element={<NovitionHasil />} />
          <Route path="/lengkapi-data" element={<LengkapiData />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/artikel/:id" element={<DetailArtikel />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;