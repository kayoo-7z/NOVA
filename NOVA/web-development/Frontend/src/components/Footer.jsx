import React from 'react';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <p style={{ margin: 0 }}>© 2026 NOVA - Nutrition Optimization for Vitality & Advancement</p>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: '#3D5D91', // Lapis Lazuli
  color: 'white',
  padding: '20px 50px',
  fontSize: '14px',
  textAlign: 'left'
};

export default Footer;