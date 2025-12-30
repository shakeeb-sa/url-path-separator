import React from 'react';
import { FaLink } from 'react-icons/fa';

const Header = () => {
  return (
    <header style={{ 
      background: 'white', 
      borderBottom: '1px solid var(--border)', 
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div className="main-content" style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 auto', height: '100%' }}>
        
        {/* Logo Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: 'var(--ah-blue)', 
            color: 'white', 
            width: '32px', 
            height: '32px', 
            borderRadius: '4px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '16px'
          }}>
            <FaLink />
          </div>
          <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--ah-dark)', letterSpacing: '-0.5px' }}>
            Path<span style={{ color: 'var(--ah-blue)' }}>Separator</span>
          </span>
        </div>
        
        {/* Right Side */}
        <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
           <span style={{ color: 'var(--text-muted)' }}>Batch URL Processor</span>
        </div>
      </div>
    </header>
  );
};

export default Header;