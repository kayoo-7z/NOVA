import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isLoggedIn = !!localStorage.getItem('token');

  const getIconColor = (path) => {
    if (path === '/feature') {
      return (location.pathname === '/' || location.pathname === '/feature') ? '#F2AEBC' : '#FFFFFF';
    }
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' ? '#F2AEBC' : '#FFFFFF';
    }
    return location.pathname === path ? '#F2AEBC' : '#FFFFFF';
  };

  return (
    <header style={headerStyle}>
      <div style={logoStyle} onClick={() => navigate('/')}>NOVA</div>
      
      <div style={rightSectionStyle}>
        <div style={iconGroupStyle}>
          <span 
            style={{ ...iconContainerStyle, color: getIconColor('/feature') }} 
            onClick={() => navigate('/feature')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </span>

          <span 
            style={{ ...iconContainerStyle, color: getIconColor('/dashboard') }} 
            onClick={() => navigate('/dashboard')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </span>

          <span 
            style={{ ...iconContainerStyle, color: getIconColor('/novition') }} 
            onClick={() => navigate('/novition')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </span>
        </div>

        {isLoggedIn ? (
          <span 
            style={{...iconContainerStyle, color: location.pathname === '/profile' ? '#F2AEBC' : '#FFFFFF'}} 
            onClick={() => navigate('/profile')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </span>
        ) : (
          <button onClick={() => navigate('/login')} style={loginButtonStyle}>
            Masuk
          </button>
        )}
      </div>
    </header>
  );
};

const headerStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '15px 50px', backgroundColor: '#3D5D91',
  position: 'sticky', top: 0, zIndex: 100, color: '#FFFFFF'
};
const logoStyle = { fontSize: '24px', fontWeight: 'bold', cursor: 'pointer' };
const rightSectionStyle = { display: 'flex', alignItems: 'center', gap: '30px' };
const iconGroupStyle = { display: 'flex', gap: '20px', alignItems: 'center' };
const iconContainerStyle = { cursor: 'pointer', display: 'flex', transition: '0.3s' };
const loginButtonStyle = {
  backgroundColor: '#FFBBEB', color: '#3D5D91', border: 'none',
  padding: '8px 25px', borderRadius: '20px', cursor: 'pointer',
  fontWeight: 'bold', fontSize: '14px'
};

export default Header;