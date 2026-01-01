import React, { useState, useRef } from 'react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import ResultGroup from './components/ResultGroup';
import Toolbar from './components/Toolbar';
import CategoryManager from './components/CategoryManager';
import { DEFAULT_CATEGORIES, processUrls, cleanData } from './utils/categories';
import { readExcelFile, readMasterExcel, generateSmartExcel } from './utils/excelUtils';
import { FaDownload, FaFilter, FaMagic, FaFileExcel, FaSpinner, FaDatabase, FaPlus } from 'react-icons/fa';

function App() {
  // State
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState({}); // Represents NEW data
  const [masterData, setMasterData] = useState({}); // Represents OLD data (Stock file)
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Config
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [options, setOptions] = useState({ removeDuplicates: true, trimParams: false });
  const [showManager, setShowManager] = useState(false);

  // Refs
  const rawFileRef = useRef(null);
  const masterFileRef = useRef(null);

  // 1. Logic to Process Input Text (Only New Data)
  const handleSeparate = () => {
    if (!inputText.trim()) return;
    const rawUrlArray = inputText.split(/\r?\n/);
    const cleanedUrls = cleanData(rawUrlArray, options);
    const res = processUrls(cleanedUrls, categories);
    setResults(res);
  };

  const handleReset = () => {
    if (window.confirm("Reset everything? (Clears Input, Results, and Master File)")) {
      setInputText('');
      setResults({});
      setMasterData({});
      if(rawFileRef.current) rawFileRef.current.value = "";
      if(masterFileRef.current) masterFileRef.current.value = "";
    }
  };

  // 2. Upload NEW Raw Data
  const handleRawUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsLoading(true);
    try {
      const excelUrls = await readExcelFile(file);
      const textUrls = inputText.split(/\r?\n/).filter(u => u.trim() !== "");
      const combined = [...textUrls, ...excelUrls];
      setInputText(combined.join('\n'));
      
      // Auto-process
      const cleanedUrls = cleanData(combined, options);
      const res = processUrls(cleanedUrls, categories);
      setResults(res);
    } catch (error) {
      alert("Error parsing Raw Excel file.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Upload MASTER (Stock) File
  const handleMasterUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsLoading(true);
    try {
      const data = await readMasterExcel(file, categories);
      setMasterData(data);
    } catch (error) {
      console.error(error);
      alert("Error parsing Master file. Ensure it is a valid Categorized_Links.xlsx");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Export Final Report
  const handleDownloadExcel = () => {
    generateSmartExcel(results, masterData, categories);
  };

  // Stats
  const totalNew = Object.values(results).flat().length;
  const totalOld = Object.values(masterData).flat().length;
  
  const otherCount = results['other']?.length || 0;
  const categorizedCount = totalNew - otherCount;

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '12px', fontWeight: 800 }}>Batch URL Organizer</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
            1. (Optional) Load previous Stock File.<br/>
            2. Paste or Upload New Links.<br/>
            3. Export Merged File with Reports.
          </p>
        </div>

        {showManager && (
            <CategoryManager 
              categories={categories} 
              setCategories={setCategories} 
              onClose={() => setShowManager(false)} 
            />
        )}

        {/* --- STEP 1: MASTER FILE LOADER --- */}
        <div className="card" style={{ padding: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: totalOld > 0 ? '#F0F9FF' : 'white', borderColor: totalOld > 0 ? 'var(--ah-blue)' : 'var(--border)' }}>
            <div>
                <h4 style={{marginBottom: '4px'}}>1. Master Stock File</h4>
                <p style={{fontSize: '13px', color: 'var(--text-muted)'}}>
                    {totalOld > 0 
                        ? `Loaded: ${totalOld} links from previous database.` 
                        : "Upload your previous Categorized_Links.xlsx (Optional)"}
                </p>
            </div>
            
            <input 
                type="file" 
                accept=".xlsx" 
                ref={masterFileRef} 
                onChange={handleMasterUpload} 
                style={{ display: 'none' }} 
            />
            <button className="btn-secondary" onClick={() => masterFileRef.current.click()}>
                <FaDatabase style={{ color: totalOld > 0 ? 'var(--ah-blue)' : '#666' }} />
                {totalOld > 0 ? "Update Master" : "Load Master"}
            </button>
        </div>

        {/* --- STEP 2: RAW INPUT --- */}
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
              placeholder={`Paste NEW links here...`}
              rows={6}
              style={{ marginBottom: '16px', border: '1px solid #E1E4E8' }}
            />
            
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button className="btn-primary" onClick={handleSeparate}>
                <FaMagic /> Process Text
              </button>

              <input 
                type="file" 
                accept=".xlsx, .xls" 
                ref={rawFileRef} 
                onChange={handleRawUpload} 
                style={{ display: 'none' }} 
              />
              <button 
                className="btn-secondary" 
                onClick={() => rawFileRef.current.click()}
                disabled={isLoading}
              >
                {isLoading ? <FaSpinner className="spin" /> : <FaPlus />} 
                {isLoading ? 'Reading...' : 'Add Raw Excel'}
              </button>

              {/* EXPORT BUTTON */}
              <div style={{ marginLeft: 'auto' }}>
                 <button 
                  className="btn-success" 
                  onClick={handleDownloadExcel} 
                  disabled={totalNew === 0 && totalOld === 0}
                  style={{ backgroundColor: '#217346', color: 'white', borderColor: '#217346' }}
                >
                  <FaFileExcel /> Export Merged Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- RESULTS PREVIEW (Shows ONLY New Data) --- */}
        {totalNew > 0 && (
          <div style={{ marginTop: '32px' }}>
            <StatsBar 
              totalUrls={totalNew} 
              categorizedCount={categorizedCount} 
              otherCount={otherCount} 
            />
            <p style={{fontSize: '12px', color: '#666', marginBottom: '10px', fontStyle: 'italic'}}>
                * Preview showing newly added links only. Master file data will be merged on export.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px' }}>New Results</h3>
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
                      onCopy={() => {}}
                    />
                ))}
              </div>

              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>Uncategorized</h4>
                <ResultGroup 
                  id="other" 
                  label="Other / Unmatched" 
                  urls={results['other'] || []} 
                  onCopy={() => {}} 
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

// Spin Animation Style
const style = document.createElement('style');
style.textContent = `
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { 100% { transform: rotate(360deg); } }
`;
document.head.appendChild(style);

export default App;