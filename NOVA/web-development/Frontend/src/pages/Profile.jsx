import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Profile = () => {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    mother: null,
    child: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Profile data:', response.data);

        setProfileData(response.data.data);
      } catch (error) {
        console.error(
          'Gagal mengambil data profile:',
          error.response?.data || error.message
        );

        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/landing');
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return '-';

    return new Date(dateValue).toISOString().split('T')[0];
  };

  const { mother, child } = profileData;

  if (loading) {
    return (
      <div style={containerStyle}>
        <h2 style={titleStyle}>Profil Bunda</h2>
        <div style={emptyStyle}>
          <p>Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Profil Bunda</h2>

      {mother && child ? (
        <div style={contentWrapperStyle}>
          <div style={boxStyle}>
            <h3 style={boxTitleStyle}>Biodata Ibu</h3>
            <p>
              <strong>Nama:</strong> {mother.name}
            </p>
            <p>
              <strong>Usia:</strong> {mother.age} tahun
            </p>
          </div>

          <div style={boxStyle}>
            <h3 style={boxTitleStyle}>Biodata Anak</h3>
            <p>
              <strong>Nama:</strong> {child.name}
            </p>
            <p>
              <strong>Tanggal Lahir:</strong> {formatDate(child.birth_date)}
            </p>
            <p>
              <strong>Jenis Kelamin:</strong> {child.gender}
            </p>
          </div>

          <button onClick={handleLogout} style={logoutButtonStyle}>
            Keluar (Logout)
          </button>
        </div>
      ) : (
        <div style={emptyStyle}>
          <p>Belum ada data. Silakan lengkapi biodata Anda.</p>
          <button
            onClick={() => navigate('/lengkapi-data')}
            style={buttonStyle}
          >
            Lengkapi Data
          </button>
        </div>
      )}
    </div>
  );
};

const containerStyle = {
  padding: '40px 20px',
  backgroundColor: '#F2DCDB',
  minHeight: '100vh',
  fontFamily: 'sans-serif',
};

const titleStyle = {
  color: '#6C0820',
  textAlign: 'center',
  marginBottom: '30px',
};

const contentWrapperStyle = {
  maxWidth: '500px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const boxStyle = {
  background: '#FFFFFF',
  padding: '25px',
  borderRadius: '20px',
  border: '2px solid #3D5D91',
};

const boxTitleStyle = {
  marginTop: '0',
  color: '#6C0820',
  fontSize: '18px',
};

const buttonStyle = {
  background: '#6C0820',
  color: '#FFFFFF',
  padding: '12px 20px',
  borderRadius: '12px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const logoutButtonStyle = {
  ...buttonStyle,
  background: '#3D5D91',
  marginTop: '10px',
};

const emptyStyle = {
  textAlign: 'center',
  marginTop: '50px',
};

export default Profile;