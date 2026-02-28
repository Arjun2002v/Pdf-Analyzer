import React from 'react';
import './App.css';
import PdfImport from './components/PdfImport';

function App() {
  return (
    <div className="app-container">
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      
      <main className="main-content">
        <PdfImport />
      </main>

      <footer className="app-footer">
        <p>Built with React + OpenAI</p>
      </footer>
    </div>
  );
}

export default App;
