import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      console.log('Register success:', response.data);

      alert('Pendaftaran berhasil. Silakan login.');
      navigate('/login');
    } catch (error) {
      console.error('Register error:', error);

      alert(
        error.response?.data?.message ||
        'Pendaftaran gagal. Silakan coba lagi.'
      );
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleRegister} style={formStyle}>
        <h2 style={headerStyle}>NOVA</h2>

        <input
          name="name"
          placeholder="Nama Lengkap"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={inputStyle}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={inputStyle}
          required
        />

        <div style={passwordContainerStyle}>
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={passwordInputStyle}
            required
          />

          <div onClick={() => setShowPassword(!showPassword)} style={eyeIconStyle}>
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </div>
        </div>

        <button type="submit" style={buttonStyle}>Daftar</button>

        <p style={footerTextStyle}>
          Sudah punya akun? <Link to="/login" style={linkStyle}>Masuk</Link>
        </p>
      </form>
    </div>
  );
};

const containerStyle = { backgroundColor: '#F2DCDB', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' };
const formStyle = { background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', width: '400px', boxSizing: 'border-box' };
const headerStyle = { color: '#6C0820', textAlign: 'center', marginBottom: '30px', marginTop: '0' };
const inputStyle = { display: 'block', margin: '15px 0', padding: '12px', width: '100%', borderRadius: '12px', border: '1px solid #E5E7EB', boxSizing: 'border-box' };
const passwordContainerStyle = { position: 'relative', width: '100%', margin: '15px 0' };
const passwordInputStyle = { display: 'block', padding: '12px', paddingRight: '45px', width: '100%', borderRadius: '12px', border: '1px solid #E5E7EB', boxSizing: 'border-box' };
const eyeIconStyle = { position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6B7280' };
const buttonStyle = { background: '#6C0820', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', width: '100%', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px', textTransform: 'capitalize' };
const footerTextStyle = { textAlign: 'center', marginTop: '20px', fontSize: '14px' };
const linkStyle = { color: '#6C0820', fontWeight: 'bold', textDecoration: 'none' };

export default Register;