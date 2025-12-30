import React from 'react';

const StatsBar = ({ totalUrls, categorizedCount, otherCount }) => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
      gap: '16px', 
      marginBottom: '24px' 
    }}>
      <div className="card" style={{ padding: '16px', textAlign: 'center', marginBottom: 0 }}>
        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ah-blue)' }}>{totalUrls}</div>
        <div style={{ fontSize: '12px', color: 'var(--ah-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total URLs</div>
      </div>
      <div className="card" style={{ padding: '16px', textAlign: 'center', marginBottom: 0 }}>
        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ah-green)' }}>{categorizedCount}</div>
        <div style={{ fontSize: '12px', color: 'var(--ah-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Categorized</div>
      </div>
      <div className="card" style={{ padding: '16px', textAlign: 'center', marginBottom: 0 }}>
        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ah-red)' }}>{otherCount}</div>
        <div style={{ fontSize: '12px', color: 'var(--ah-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Uncategorized</div>
      </div>
    </div>
  );
};

export default StatsBar;