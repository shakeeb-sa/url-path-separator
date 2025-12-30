import React, { useState } from 'react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import ResultGroup from './components/ResultGroup';
import { DEFAULT_CATEGORIES, processUrls } from './utils/categories';
import { FaTrash, FaDownload, FaFilter } from 'react-icons/fa';

function App() {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState({});
  const [filter, setFilter] = useState('');

  const handleSeparate = () => {
    const res = processUrls(inputText, DEFAULT_CATEGORIES);
    setResults(res);
  };

  const handleReset = () => {
    if (window.confirm("Clear everything?")) {
      setInputText('');
      setResults({});
    }
  };

  const handleDownload = () => {
    let content = "";
    Object.keys(results).forEach(key => {
      if (results[key].length > 0) {
        const label = DEFAULT_CATEGORIES.find(c => c.id === key)?.label || "Other / Uncategorized";
        content += `=== ${label} ===\n${results[key].join('\n')}\n\n`;
      }
    });
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "separated_urls.txt";
    a.click();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!"); // Ideally use a Toast component
  };

  // Stats Calculation
  const totalUrls = Object.values(results).flat().length;
  const otherCount = results['other']?.length || 0;
  const categorizedCount = totalUrls - otherCount;

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Batch URL Separator</h2>
            <p style={{ color: 'var(--ah-text-muted)' }}>Paste raw URLs to categorize them by path structure.</p>
          </div>
        </div>

        {/* Input Area */}
        <div className="card">
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`https://example.com/profile/user1\nhttps://example.com/forum/topic123\nhttps://example.com/random-page`}
            rows={8}
            style={{ marginBottom: '16px' }}
          />
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={handleSeparate}>
              Separate URLs
            </button>
            <button className="btn-secondary" onClick={handleDownload} disabled={totalUrls === 0}>
              <FaDownload /> Download Report
            </button>
            <button className="btn-text" onClick={handleReset} style={{ marginLeft: 'auto', color: 'var(--ah-red)' }}>
              <FaTrash /> Clear All
            </button>
          </div>
        </div>

        {/* Results Area */}
        {totalUrls > 0 && (
          <div>
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
                <h4 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--ah-text-muted)', marginBottom: '10px' }}>Categorized</h4>
                {DEFAULT_CATEGORIES
                  .filter(cat => cat.label.includes(filter))
                  .map(cat => (
                    <ResultGroup 
                      key={cat.id} 
                      id={cat.id} 
                      label={cat.label} 
                      urls={results[cat.id]} 
                      onCopy={copyToClipboard}
                    />
                ))}
              </div>

              {/* Other/Uncategorized Column */}
              <div>
                <h4 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--ah-text-muted)', marginBottom: '10px' }}>Uncategorized</h4>
                <ResultGroup 
                  id="other" 
                  label="Other / Unmatched" 
                  urls={results['other']} 
                  onCopy={copyToClipboard} 
                />
              </div>
            </div>
          </div>
        )}

      </main>

      <footer style={{ textAlign: 'center', padding: '30px', color: 'var(--ah-text-muted)', fontSize: '13px', borderTop: '1px solid var(--ah-border)', marginTop: 'auto', background: 'white' }}>
        &copy; {new Date().getFullYear()} PathSeparator Tool. Inspired by Ahrefs Design.
      </footer>
    </div>
  );
}

export default App;