
# URL Path Separator 🌐

**URL Path Separator** is a specialized web utility built with **React** and **Vite** designed to analyze and categorize large lists of URLs. It intelligently breaks down URL structures to help SEO professionals and developers identify content patterns, group pages by directory levels, and export organized data for site audits.

## 🚀 Key Features

-   **Intelligent Path Analysis**: Automatically deconstructs URLs into individual path segments (e.g., `/blog/category/post`) to reveal site architecture.
    
-   **Dynamic Categorization**: Group URLs based on shared directories or specific keywords using a customizable category management system.
    
-   **Real-time Statistics**: View immediate data breakdowns, including total URL counts, unique domain counts, and path depth analysis via an integrated stats bar.
    
-   **Excel Export Engine**: Instantly download your categorized results into professionally formatted `.xlsx` files for further reporting.
    
-   **Interactive Results Grid**: Explore processed data through a responsive UI that highlights different URL groups and their associated metrics.
    
-   **Privacy-First Processing**: All URL parsing and data manipulation happen locally in your browser, ensuring your private link lists are never sent to an external server.
    

## 🛠️ Technical Stack

-   **Frontend**: React.js with Vite for optimized development and production builds.
    
-   **State Management**: React Hooks (useState, useMemo) for handling high-frequency data processing.
    
-   **Utilities**:
    
    -   **SheetJS (XLSX)**: For robust Excel file generation and parsing.
        
    -   **Custom URL Utils**: Bespoke logic for handling complex URL patterns and encoding.
        
-   **Styling**: Modern CSS with a focus on data visualization and clear hierarchical layouts.
    

## 📁 Project Structure

Plaintext

```
src/
├── components/       # UI components (CategoryManager, StatsBar, ResultGroup)
├── utils/            # Core logic (Excel utilities, path parsing logic)
├── App.jsx           # Main application logic and data flow
├── index.css         # Global styles and theme definitions
└── main.jsx          # Application entry point
``` 

## ⚙️ Installation & Usage

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/url-path-separator.git
    cd url-path-separator
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start the development server**:
    ```bash
    npm run dev
    ```
4.  **Analyze Data**:
    * Paste your list of URLs into the input area.
    * Define your categories or use the automatic directory separator.
    * Review the grouped results and click **"Download Excel"** to save your report. 

---
*Created by [Shakeeb](https://shakeeb-sa.github.io/) to simplify complex URL data management
```
