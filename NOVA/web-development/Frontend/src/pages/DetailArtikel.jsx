import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DetailArtikel = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const dataArtikel = {
    "101": { judul: "Tips Gizi Ibu Menyusui", isi: "Penuhi nutrisi harian agar kualitas ASI tetap terjaga. Konsumsi makanan kaya protein, zat besi, dan vitamin untuk mendukung tumbuh kembang bayi yang optimal serta menjaga kesehatan Bunda." },
    "102": { judul: "Mengenal Tekstur MPASI", isi: "Panduan tahapan tekstur makanan sesuai usia bayi. Dimulai dari bubur halus pada usia 6 bulan, kemudian meningkat ke tekstur yang lebih kasar seiring bertambahnya usia anak agar kemampuan mengunyah berkembang baik." },
    "103": { judul: "Cara Mengatasi Anak GTM", isi: "Langkah saat si kecil mulai mogok makan. Ciptakan suasana makan yang menyenangkan, jangan memaksa anak, kenalkan variasi menu baru, dan atur jadwal makan yang teratur agar anak lebih antusias." }
  };

  const artikel = dataArtikel[id] || { judul: "Artikel Tidak Ditemukan", isi: "Konten yang Anda cari tidak tersedia." };

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate('/')} style={backButtonStyle}>
        ← Kembali
      </button>
      
      <div style={contentBoxStyle}>
        <h2 style={titleStyle}>{artikel.judul}</h2>
        <p style={textStyle}>{artikel.isi}</p>
      </div>
    </div>
  );
};

const containerStyle = { padding: '40px 20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' };
const backButtonStyle = { background: 'none', border: 'none', color: '#3D5D91', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' };
const contentBoxStyle = { background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
const titleStyle = { color: '#6C0820', marginTop: '0' };
const textStyle = { color: '#4B5563', lineHeight: '1.6' };

export default DetailArtikel;