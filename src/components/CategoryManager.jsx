import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

const CategoryManager = ({ categories, setCategories, onClose }) => {
  const [newLabel, setNewLabel] = useState('');

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    const id = newLabel.toLowerCase().replace(/[^a-z0-9]/g, '');
    const newCat = { id, label: newLabel.trim() };
    setCategories([...categories, newCat]);
    setNewLabel('');
  };

  const handleRemove = (id) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <div className="card" style={{ marginBottom: '20px', padding: '0' }}>
      <div style={{ 
        padding: '12px 20px', 
        borderBottom: '1px solid var(--border)', 
        background: '#FAFBFC',
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ fontSize: '15px', margin: 0 }}>Configure Categories</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', padding: 0 }}>
          <FaTimes />
        </button>
      </div>

      <div style={{ padding: '20px' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Add text segments to search for in URLs. The order matters (top priority first).
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input 
            type="text" 
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="e.g. /shop/ or ?product_id="
            style={{ flex: 1 }}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button className="btn-accent" onClick={handleAdd}>
            <FaPlus /> Add Rule
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
          {categories.map((cat) => (
            <div key={cat.id} style={{ 
              background: '#F0F4F8', 
              border: '1px solid #DCE0E5', 
              borderRadius: '20px', 
              padding: '4px 12px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <code>{cat.label}</code>
              <FaTimes 
                style={{ cursor: 'pointer', color: '#999' }} 
                onClick={() => handleRemove(cat.id)}
                size={10}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;