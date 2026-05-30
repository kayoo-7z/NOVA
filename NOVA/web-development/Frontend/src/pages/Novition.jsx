import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Novition = () => {
  const [data, setData] = useState({ bb: '', tb: '' });
  const navigate = useNavigate();

  const handleTes = () => {
    const status = data.bb < 10 ? "Stunting Terdeteksi" : "Gizi Baik";
    localStorage.setItem('terakhirScan', status);
    navigate('/novition-hasil');
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#6C0820', textAlign: 'center', marginBottom: '30px' }}>Scan Anak Stunting</h2>
      
      <div style={contentWrapperStyle}>
        <div style={uploadBoxStyle}>
          <p style={{ color: '#6C0820' }}>Klik untuk upload foto anak</p>
          <input type="file" style={{ marginTop: '10px' }} />
        </div>

        <div style={formBoxStyle}>
          <h3 style={{ color: '#6C0820', marginTop: 0 }}>Input Data Antropometri</h3>
          
          <label style={labelStyle}>Berat Badan (kg)</label>
          <input 
            type="number" 
            placeholder="Contoh: 10" 
            style={inputStyle} 
            onChange={(e) => setData({...data, bb: e.target.value})} 
          />

          <label style={labelStyle}>Tinggi Badan (cm)</label>
          <input 
            type="number" 
            placeholder="Contoh: 80" 
            style={inputStyle} 
            onChange={(e) => setData({...data, tb: e.target.value})} 
          />

          <button style={buttonStyle} onClick={handleTes}>Tes Sekarang</button>
        </div>
      </div>
    </div>
  );
};

const containerStyle = { padding: '40px', backgroundColor: '#F2DCDB', minHeight: '100vh', fontFamily: 'sans-serif' };
const contentWrapperStyle = { display: 'flex', gap: '30px', maxWidth: '800px', margin: '0 auto', flexWrap: 'wrap' };
const uploadBoxStyle = { flex: 1, minWidth: '300px', height: '250px', background: '#FFFFFF', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #6C0820' };
const formBoxStyle = { flex: 1, minWidth: '300px', background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' };
const labelStyle = { display: 'block', fontSize: '14px', color: '#3D5D91', fontWeight: 'bold', marginTop: '15px' };
const inputStyle = { display: 'block', width: '100%', padding: '12px', margin: '8px 0', borderRadius: '12px', border: '1px solid #D1D5DB', boxSizing: 'border-box' };
const buttonStyle = { background: '#6C0820', color: 'white', padding: '12px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold', width: '100%', marginTop: '20px' };

export default Novition;