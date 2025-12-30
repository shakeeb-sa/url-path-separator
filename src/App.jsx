import React, { useState } from 'react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import ResultGroup from './components/ResultGroup';
import Toolbar from './components/Toolbar';
import CategoryManager from './components/CategoryManager';
import { DEFAULT_CATEGORIES, processUrls, cleanData } from './utils/categories';
import { FaDownload, FaFilter, FaMagic } from 'react-icons/fa';

function App() {
  // State for Input & Data
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState({});
  const [filter, setFilter] = useState('');
  
  // State for Configuration
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [options, setOptions] = useState({
    removeDuplicates: true,
    trimParams: false
  });
  const [showManager, setShowManager] = useState(false);

  const handleSeparate = () => {
    if (!inputText.trim()) return;

    // 1. Convert text string to array
    let rawUrls = inputText.split(/\r?\n/);

    // 2. Clean Data (Dedup, Trim, Empty lines)
    const cleanedUrls = cleanData(rawUrls, options);

    // 3. Process with Dynamic Categories
    const res = processUrls(cleanedUrls, categories);
    
    setResults(res);
  };

  const handleReset = () => {
    if (window.confirm("Clear all input and results?")) {
      setInputText('');
      setResults({});
    }
  };

  const handleDownload = () => {
    let content = "";
    // Export categorized groups
    categories.forEach(cat => {
      if (results[cat.id] && results[cat.id].length > 0) {
        content += `=== ${cat.label} ===\n${results[cat.id].join('\n')}\n\n`;
      }
    });
    
    // Export Uncategorized
    if (results['other'] && results['other'].length > 0) {
        content += `=== Other / Unmatched ===\n${results['other'].join('\n')}\n\n`;
    }
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "separated_urls.txt";
    a.click();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You might want to add a toast notification library here later
  };

  // Stats Calculation
  const totalUrls = Object.values(results).flat().length;
  const otherCount = results['other']?.length || 0;
  const categorizedCount = totalUrls - otherCount;

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
    <h2 style={{ fontSize: '28px', marginBottom: '12px', fontWeight: 800 }}>Batch URL Organizer</h2>
    <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
      Paste your raw URL list below. We'll clean the data and automatically categorize links based on their path structure.
    </p>
</div>

        {/* Configuration Area */}
        {showManager && (
          <CategoryManager 
            categories={categories} 
            setCategories={setCategories} 
            onClose={() => setShowManager(false)} 
          />
        )}

        {/* Input Area */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          
          <Toolbar 
            options={options} 
            setOptions={setOptions} 
            onReset={handleReset}
            onConfigure={() => setShowManager(!showManager)}
          />

          <div style={{ padding: '20px' }}>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`https://example.com/profile/user1\nhttps://example.com/forum/topic123\nhttps://example.com/random-page`}
              rows={8}
              style={{ marginBottom: '16px', border: '1px solid #E1E4E8' }}
            />
            
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={handleSeparate}>
                <FaMagic /> Separate URLs
              </button>
              <button className="btn-secondary" onClick={handleDownload} disabled={totalUrls === 0}>
                <FaDownload /> Download Report
              </button>
            </div>
          </div>
        </div>

        {/* Results Area */}
        {totalUrls > 0 && (
          <div style={{ marginTop: '32px' }}>
            <StatsBar 
              totalUrls={totalUrls} 
              categorizedCount={categorizedCount} 
              otherCount={otherCount} 
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px' }}>Results</h3>
              <div style={{ position: 'relative', width: '250px' }}>
                <FaFilter style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                <input 
                  type="text" 
                  placeholder="Filter categories..." 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{ paddingLeft: '32px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', alignItems: 'start' }}>
              {/* Categorized Column */}
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>Categorized</h4>
                {categories
                  .filter(cat => cat.label.toLowerCase().includes(filter.toLowerCase()))
                  .map(cat => (
                    <ResultGroup 
                      key={cat.id} 
                      id={cat.id} 
                      label={cat.label} 
                      urls={results[cat.id] || []} 
                      onCopy={copyToClipboard}
                    />
                ))}
              </div>

              {/* Other/Uncategorized Column */}
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>Uncategorized</h4>
                <ResultGroup 
                  id="other" 
                  label="Other / Unmatched" 
                  urls={results['other'] || []} 
                  onCopy={copyToClipboard} 
                />
              </div>
            </div>
          </div>
        )}

      </main>

      <footer style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '13px', borderTop: '1px solid var(--border)', marginTop: 'auto', background: 'white' }}>
        &copy; {new Date().getFullYear()} PathSeparator Tool.
      </footer>
    </div>
  );
}

export default App;