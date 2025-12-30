import React from 'react';
import { FaTrash, FaEraser, FaCut, FaCog } from 'react-icons/fa';

const Toolbar = ({ options, setOptions, onReset, onConfigure }) => {
  
  const toggleOption = (key) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '12px 16px',
      background: '#FAFBFC',
      borderBottom: '1px solid var(--border)',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Data Cleaning:
        </span>
        
        <button 
          className={options.removeDuplicates ? 'btn-primary' : 'btn-secondary'}
          onClick={() => toggleOption('removeDuplicates')}
          style={{ padding: '6px 12px', fontSize: '13px' }}
          title="Remove duplicate URLs"
        >
          <FaCut size={12} /> Dedup
        </button>

        <button 
          className={options.trimParams ? 'btn-primary' : 'btn-secondary'}
          onClick={() => toggleOption('trimParams')}
          style={{ padding: '6px 12px', fontSize: '13px' }}
          title="Remove ?ref=... from URLs"
        >
          <FaEraser size={12} /> Trim Params
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="btn-secondary" onClick={onConfigure}>
          <FaCog size={12} /> Configure Categories
        </button>
        <button className="btn-danger" onClick={onReset} style={{ padding: '6px 12px', fontSize: '13px' }}>
          <FaTrash size={12} /> Clear
        </button>
      </div>
    </div>
  );
};

export default Toolbar;