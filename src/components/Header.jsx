import React from 'react';
import { FaLink, FaGithub } from 'react-icons/fa';

const Header = () => {
  return (
    <header style={{ 
      background: 'white', 
      borderBottom: '1px solid var(--ah-border)', 
      padding: '12px 0' 
    }}>
      <div className="main-content" style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* FIXED LINE BELOW: Added quotes around var(--ah-blue) */}
          <div style={{ background: 'var(--ah-blue)', color: 'white', padding: '6px', borderRadius: '4px' }}>
            <FaLink />
          </div>
          <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--ah-dark)' }}>PathSeparator</span>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', fontSize: '14px' }}>
           <a href="https://shakeeb-sa.github.io/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'var(--ah-text-muted)', fontWeight: 500 }}>Portfolio</a>
        </div>
      </div>
    </header>
  );
};

export default Header;