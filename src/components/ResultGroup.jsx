// src/components/ResultGroup.jsx
import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronRight, FaCopy } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ResultGroup = ({ id, label, urls, onCopy }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!urls || urls.length === 0) return null;

  return (
    <div style={{ 
      background: 'white', 
      border: '1px solid var(--border)', 
      marginBottom: '10px', 
      borderRadius: '4px',
      overflow: 'hidden' 
    }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          padding: '12px 16px', 
          cursor: 'pointer', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: isOpen ? '#FAFBFC' : 'white',
          borderBottom: isOpen ? '1px solid var(--border)' : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isOpen ? <FaChevronDown size={12} color="#666" /> : <FaChevronRight size={12} color="#666" />}
          <span style={{ fontWeight: 600, fontSize: '14px' }}>{label || id}</span>
          <span style={{ 
            background: '#F0F4F8', 
            padding: '2px 8px', 
            borderRadius: '12px', 
            fontSize: '11px', 
            fontWeight: 700,
            color: 'var(--text-muted)'
          }}>
            {urls.length}
          </span>
        </div>
        
        <button 
          className="btn-secondary" 
          onClick={(e) => {
             e.stopPropagation();
             onCopy(urls.join('\n'));
          }}
          style={{ padding: '4px 8px', fontSize: '12px' }}
        >
          <FaCopy />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '16px', background: '#FFFFFF', borderTop: '1px solid #eee' }}>
              <pre style={{ 
                margin: 0, 
                fontFamily: 'var(--font-mono)', 
                fontSize: '12px', 
                color: 'var(--text-main)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                lineHeight: '1.5'
              }}>
                {urls.join('\n')}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResultGroup;