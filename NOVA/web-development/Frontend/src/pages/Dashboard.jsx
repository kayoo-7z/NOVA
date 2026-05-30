import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <div style={contentWrapperStyle}>
        <h2 style={headerTitleStyle}>Riwayat Anak</h2>
        
        {/* Area Riwayat (Placeholder) */}
        <div style={riwayatListStyle}>
          <div style={riwayatCardStyle}>Hasil Scan 1: Stunting Terdeteksi</div>
          <div style={riwayatCardStyle}>Hasil Scan 2: Gizi Baik</div>
        </div>

        {/* Quick Access di bawah */}
        <div style={quickAccessContainerStyle}>
          <button style={scanButtonStyle} onClick={() => navigate('/novition')}>
            Scan Anak Stunting
          </button>
          <button style={artikelButtonStyle} onClick={() => navigate('/')}>
            Baca Artikel Edukasi
          </button>
        </div>
      </div>
    </div>
  );
};

// --- STYLING ---
const containerStyle = { 
  backgroundColor: '#F2DCDB', 
  minHeight: '100vh', 
  padding: '40px', 
  fontFamily: 'sans-serif' 
};

const contentWrapperStyle = { 
  maxWidth: '600px', 
  margin: '0 auto' 
};

const headerTitleStyle = { color: '#6C0820' };

const riwayatListStyle = { 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '15px', 
  marginBottom: '40px' 
};

const riwayatCardStyle = { 
  background: 'white', 
  padding: '20px', 
  borderRadius: '16px', 
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  color: '#6C0820'
};

const quickAccessContainerStyle = { 
  display: 'flex', 
  gap: '20px',
  justifyContent: 'center'
};

const scanButtonStyle = {
  background: '#6C0820', 
  color: 'white',
  padding: '15px 25px',
  borderRadius: '12px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  flex: 1
};

const artikelButtonStyle = {
  background: 'white',
  color: '#6C0820',
  padding: '15px 25px',
  borderRadius: '12px',
  border: '2px solid #6C0820',
  cursor: 'pointer',
  fontWeight: 'bold',
  flex: 1
};

export default Dashboard;