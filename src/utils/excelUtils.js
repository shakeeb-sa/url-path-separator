import * as XLSX from 'xlsx';

// Helper: Sanitize Sheet Name
const sanitizeSheetName = (label) => {
  if (!label) return "Sheet";
  let safeName = label.replace(/[\\/?*[\]:]/g, "").trim(); 
  if (safeName.length === 0) safeName = "Sheet";
  return safeName.substring(0, 31);
};

// 1. Read RAW Excel (Flatten all URLs for processing)
export const readExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        let allUrls = [];
        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          rows.forEach(row => {
            row.forEach(cell => {
              if (cell && typeof cell === 'string' && cell.includes('http')) {
                allUrls.push(cell.trim());
              }
            });
          });
        });
        resolve(allUrls);
      } catch (error) { reject(error); }
    };
    reader.readAsArrayBuffer(file);
  });
};

// 2. Read MASTER Excel (Preserve Categories)
export const readMasterExcel = (file, categories) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Structure: { 'profile': ['url1'], 'forum': ['url2'] }
        const masterData = {};

        workbook.SheetNames.forEach(sheetName => {
          // Skip the Report sheet if it exists
          if (sheetName.includes("Report")) return;

          const sheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          
          // Extract URLs from column A (assuming structure from our generator)
          const urls = [];
          rows.forEach((row, index) => {
             // Skip header row if it says "URL List"
             if (index === 0 && row[0] === "URL List") return;
             if (row[0] && typeof row[0] === 'string' && row[0].includes('http')) {
               urls.push(row[0].trim());
             }
          });

          // Match Sheet Name to Category ID
          // We try to find which category label produces this sheet name
          let matchedId = 'other';
          
          // Reverse lookup: Find category where sanitized label == sheetName
          const cat = categories.find(c => sanitizeSheetName(c.label).toLowerCase() === sheetName.toLowerCase());
          
          if (cat) {
            matchedId = cat.id;
          } else if (sheetName.toLowerCase() === 'uncategorized') {
            matchedId = 'other';
          }

          if (!masterData[matchedId]) masterData[matchedId] = [];
          masterData[matchedId] = [...masterData[matchedId], ...urls];
        });

        resolve(masterData);
      } catch (error) { reject(error); }
    };
    reader.readAsArrayBuffer(file);
  });
};

// 3. Generate Smart Excel with Merge & Report
export const generateSmartExcel = (newResults, masterData, categories) => {
  try {
    const workbook = XLSX.utils.book_new();
    const usedSheetNames = new Set();
    
    // --- A. GENERATE REPORT SHEET ---
    const reportRows = [
      ["Extraction Report", new Date().toLocaleString()],
      ["", "", "", ""],
      ["Category", "Previous Links", "New Links", "Total Links"]
    ];

    let grandTotalOld = 0;
    let grandTotalNew = 0;

    // We iterate categories to build the stats
    // We also prepare the merged data for the next step
    const mergedData = {};

    [...categories, { id: 'other', label: 'Uncategorized' }].forEach(cat => {
        const oldUrls = masterData[cat.id] || [];
        // Deduplicate: Don't add a new link if it already exists in Master
        const oldSet = new Set(oldUrls);
        const uniqueNewUrls = (newResults[cat.id] || []).filter(u => !oldSet.has(u));

        const countOld = oldUrls.length;
        const countNew = uniqueNewUrls.length;

        if (countOld > 0 || countNew > 0) {
            reportRows.push([cat.label, countOld, countNew, countOld + countNew]);
            grandTotalOld += countOld;
            grandTotalNew += countNew;
            
            // Store merged for sheet creation
            mergedData[cat.id] = {
                label: cat.label,
                allUrls: [...oldUrls, ...uniqueNewUrls]
            };
        }
    });

    // Report Footer
    reportRows.push(["", "", "", ""]);
    reportRows.push(["TOTAL", grandTotalOld, grandTotalNew, grandTotalOld + grandTotalNew]);

    const reportSheet = XLSX.utils.aoa_to_sheet(reportRows);
    reportSheet['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, reportSheet, "Extraction Report");


    // --- B. GENERATE DATA SHEETS ---
    Object.keys(mergedData).forEach(catId => {
        const { label, allUrls } = mergedData[catId];
        
        const sheetData = [["URL List"], ...allUrls.map(u => [u])];
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        worksheet['!cols'] = [{ wch: 60 }];

        let sheetName = sanitizeSheetName(label);
        
        // Handle Sheet Name Duplicates
        if (usedSheetNames.has(sheetName)) {
            let counter = 1;
            while (usedSheetNames.has(`${sheetName.substring(0, 28)}_${counter}`)) {
              counter++;
            }
            sheetName = `${sheetName.substring(0, 28)}_${counter}`;
        }
        usedSheetNames.add(sheetName);

        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    XLSX.writeFile(workbook, "Categorized_Links.xlsx");

  } catch (error) {
    console.error("Export Error:", error);
    alert("Failed to export.");
  }
};