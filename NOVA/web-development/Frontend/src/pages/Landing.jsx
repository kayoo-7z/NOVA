import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Landing = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  const resepLokal = [
    { id: 1, judul: 'Bubur Ikan Tarakan', ikon: '🍲', warna: '#F2AEBC' },
    { id: 2, judul: 'Puree Labu Kuning', ikon: '🥣', warna: '#FFBBEB' },
    { id: 3, judul: 'Tim Ayam Sayur', ikon: '🥘', warna: '#5A86CB' },
    { id: 4, judul: 'Bubur Udang Gurih', ikon: '🍜', warna: '#F2AEBC' },
    { id: 5, judul: 'Sari Buah Naga', ikon: '🥤', warna: '#FFBBEB' },
  ];

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        const response = await api.get('/api/articles/featured');
        setArticles(response.data.data.articles);
      } catch (error) {
        console.error('Gagal mengambil artikel:', error.response?.data || error.message);
        setArticles([]);
      } finally {
        setLoadingArticles(false);
      }
    };

    fetchFeaturedArticles();
  }, []);

  return (
    <div style={containerStyle}>
      {!isLoggedIn && (
        <div style={heroCardStyle}>
          <div style={textContentStyle}>
            <h2 style={mainTitleStyle}>N O V A - Sahabat Gizi dan Tumbuh Kembang Buah Hati</h2>
            <p style={subTitleStyle}>Monitoring Otomatis & Terintegrasi Untuk Masa Depan Anak</p>
            <button onClick={() => navigate('/register')} style={mulaiButtonStyle}>
              DAFTAR & CEK GIZI SEKARANG
            </button>
          </div>
        </div>
      )}

      <div style={sectionWrapperStyle}>
        <h3 style={sectionTitleStyle}>Resep MPASI Panganan Lokal</h3>
        <div style={horizontalScrollContainer}>
          {resepLokal.map((item) => (
            <div key={item.id} style={{ ...recipeCardStyle, backgroundColor: item.warna }}>
              <div style={recipeIconStyle}>{item.ikon}</div>
              <p style={recipeTitleStyle}>{item.judul}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionWrapperStyle}>
        <h3 style={sectionTitleStyle}>Tips & Edukasi untuk Ibu</h3>

        {loadingArticles ? (
          <p style={{ textAlign: 'center', color: '#3D5D91' }}>
            Memuat artikel...
          </p>
        ) : articles.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#3D5D91' }}>
            Belum ada artikel tersedia.
          </p>
        ) : (
          <div style={verticalListStyle}>
            {articles.map((article) => (
              <div key={article.id} style={articleCardStyle}>
                <div style={articleTextSide}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#6C0820' }}>
                    {article.title}
                  </h4>

                  <p style={{ margin: 0, fontSize: '14px', color: '#3D5D91', lineHeight: '1.4' }}>
                    {article.excerpt}
                  </p>

                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6B7280' }}>
                    Sumber: {article.source_name}
                  </p>
                </div>

                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={artikelButtonStyle}
                >
                  artikel
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const containerStyle = { padding: '30px 50px', backgroundColor: '#F2DCDB', minHeight: '100vh' };
const heroCardStyle = { backgroundColor: '#FFFFFF', padding: '60px', borderRadius: '30px', textAlign: 'center', marginBottom: '50px', border: '2px solid #6C0820', boxShadow: '0 4px 20px rgba(108, 8, 32, 0.1)' };
const textContentStyle = { maxWidth: '800px', margin: '0 auto' };
const mainTitleStyle = { fontSize: '32px', fontWeight: 'bold', color: '#6C0820', marginBottom: '15px' };
const subTitleStyle = { fontSize: '18px', color: '#3D5D91', marginBottom: '30px' };
const mulaiButtonStyle = { backgroundColor: '#6C0820', color: '#FFFFFF', border: 'none', padding: '15px 40px', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' };
const sectionWrapperStyle = { marginBottom: '40px' };
const sectionTitleStyle = { fontSize: '22px', fontWeight: 'bold', color: '#6C0820', marginBottom: '20px' };
const horizontalScrollContainer = { display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '15px', scrollbarWidth: 'none' };
const recipeCardStyle = { minWidth: '160px', padding: '25px 15px', borderRadius: '25px', textAlign: 'center', flexShrink: 0 };
const recipeIconStyle = { fontSize: '35px', marginBottom: '10px' };
const recipeTitleStyle = { fontSize: '14px', fontWeight: 'bold', margin: 0, color: '#6C0820' };
const verticalListStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const articleCardStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 30px', backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #6C0820' };
const articleTextSide = { flex: 1, paddingRight: '20px' };

const artikelButtonStyle = {
  backgroundColor: 'transparent',
  color: '#6C0820',
  border: '1px solid #6C0820',
  padding: '8px 25px',
  borderRadius: '15px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '13px',
  textDecoration: 'none',
};

export default Landing;