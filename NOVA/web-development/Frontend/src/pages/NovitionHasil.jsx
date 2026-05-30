import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NovitionHasil = () => {
  const navigate = useNavigate();
  const [hasil, setHasil] = useState('');

  useEffect(() => {
    // Ambil hasil dari localStorage (disimpan saat di halaman scanner)
    const data = localStorage.getItem('terakhirScan') || 'Hasil belum tersedia';
    setHasil(data);
  }, []);

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Hasil Analisis</h2>
      <div style={boxStyle}>
        <p style={hasilTextStyle}>{hasil}</p>
      </div>
      <button onClick={() => navigate('/novition')} style={buttonStyle}>
        Tes Ulang
      </button>
    </div>
  );
};

const containerStyle = { padding: '40px 20px', backgroundColor: '#F2DCDB', minHeight: '100vh', textAlign: 'center' };
const titleStyle = { color: '#6C0820', marginBottom: '30px' };
const boxStyle = { background: '#E8F5E9', padding: '40px', borderRadius: '20px', border: '2px solid #3D5D91', maxWidth: '400px', margin: '0 auto 20px' };
const hasilTextStyle = { fontSize: '20px', fontWeight: 'bold', color: '#6C0820' };
const buttonStyle = { background: '#6C0820', color: 'white', padding: '15px 30px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold' };

export default NovitionHasil;