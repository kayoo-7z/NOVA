import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const LengkapiData = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    namaIbu: '',
    usiaIbu: '',
    namaAnak: '',
    tglLahir: '',
    jk: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSimpan = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      alert('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }

    try {
      const response = await api.post(
        '/api/lengkapi-data',
        {
          motherName: formData.namaIbu,
          motherAge: Number(formData.usiaIbu),
          childName: formData.namaAnak,
          birthDate: formData.tglLahir,
          gender: formData.jk,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Data berhasil disimpan:', response.data);

      alert('Data berhasil disimpan!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Gagal menyimpan data:', error.response?.data || error.message);

      alert(
        error.response?.data?.message ||
        'Gagal menyimpan data. Silakan coba lagi.'
      );
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Lengkapi Data Diri</h2>

      <form onSubmit={handleSimpan} style={formContainerStyle}>
        <div style={boxStyle}>
          <h3 style={boxTitleStyle}>Biodata Ibu</h3>

          <input
            name="namaIbu"
            placeholder="Nama Lengkap Ibu"
            value={formData.namaIbu}
            style={inputStyle}
            onChange={handleChange}
            required
          />

          <input
            name="usiaIbu"
            placeholder="Usia Ibu"
            type="number"
            value={formData.usiaIbu}
            style={inputStyle}
            onChange={handleChange}
            required
          />
        </div>

        <div style={boxStyle}>
          <h3 style={boxTitleStyle}>Biodata Anak</h3>

          <input
            name="namaAnak"
            placeholder="Nama Anak"
            value={formData.namaAnak}
            style={inputStyle}
            onChange={handleChange}
            required
          />

          <input
            name="tglLahir"
            type="date"
            value={formData.tglLahir}
            style={inputStyle}
            onChange={handleChange}
            required
          />

          <select
            name="jk"
            value={formData.jk}
            style={inputStyle}
            onChange={handleChange}
            required
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        <button type="submit" style={buttonStyle}>
          Simpan & Lanjut ke Dashboard
        </button>
      </form>
    </div>
  );
};

const containerStyle = { padding: '40px 20px', backgroundColor: '#F2DCDB', minHeight: '100vh', fontFamily: 'sans-serif' };
const titleStyle = { color: '#6C0820', textAlign: 'center', marginBottom: '30px' };
const formContainerStyle = { maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' };
const boxStyle = { background: '#FFFFFF', padding: '25px', borderRadius: '20px', border: '2px solid #3D5D91' };
const boxTitleStyle = { marginTop: '0', color: '#6C0820', fontSize: '18px' };
const inputStyle = { display: 'block', width: '100%', padding: '12px', margin: '10px 0', borderRadius: '12px', border: '1px solid #E5E7EB', boxSizing: 'border-box' };
const buttonStyle = {
  background: '#6C0820',
  color: '#FFFFFF',
  padding: '15px',
  borderRadius: '12px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px',
  marginTop: '10px',
};

export default LengkapiData;