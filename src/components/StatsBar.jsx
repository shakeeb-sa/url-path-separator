import React from 'react';

const StatCard = ({ label, value, color, bg }) => (
  <div className="card" style={{ 
    padding: '20px', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    borderTop: `3px solid ${color}` 
  }}>
    <div style={{ 
      fontSize: '32px', 
      fontWeight: 700, 
      color: color, 
      lineHeight: 1,
      marginBottom: '8px' 
    }}>
      {value}
    </div>
    <div style={{ 
      fontSize: '11px', 
      fontWeight: 700, 
      color: 'var(--text-muted)', 
      textTransform: 'uppercase', 
      letterSpacing: '0.5px' 
    }}>
      {label}
    </div>
  </div>
);

const StatsBar = ({ totalUrls, categorizedCount, otherCount }) => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
      gap: '20px', 
      marginBottom: '32px' 
    }}>
      <StatCard 
        label="Total URLs" 
        value={totalUrls} 
        color="var(--ah-blue)" 
      />
      <StatCard 
        label="Categorized" 
        value={categorizedCount} 
        color="var(--success)" 
      />
      <StatCard 
        label="Uncategorized" 
        value={otherCount} 
        color={otherCount > 0 ? "var(--ah-orange)" : "var(--text-muted)"} 
      />
    </div>
  );
};

export default StatsBar;