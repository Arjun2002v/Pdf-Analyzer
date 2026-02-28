import React, { useState } from 'react';

const PdfImport = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null);
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a PDF file first.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('pdf', file);

        try {
            const response = await fetch('http://localhost:5000/api/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to analyze PDF');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pdf-import-container">
            <div className="upload-card glass">
                <h2>AI PDF Analyzer</h2>
                <p>Upload a PDF to get an instant AI-powered summary and key insights.</p>
                
                <div className="file-input-wrapper">
                    <input 
                        type="file" 
                        accept="application/pdf" 
                        onChange={handleFileChange} 
                        id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload" className="file-label">
                        {file ? file.name : 'Choose PDF File'}
                    </label>
                </div>

                <button 
                    onClick={handleUpload} 
                    disabled={loading || !file}
                    className="analyze-button"
                >
                    {loading ? 'Analyzing...' : 'Analyze PDF'}
                </button>

                {error && <p className="error-message">{error}</p>}
            </div>

            {loading && (
                <div className="loader-container">
                    <div className="spinner"></div>
                    <p>Extracting wisdom from your document...</p>
                </div>
            )}

            {result && (
                <div className="result-card glass fade-in">
                    <h3>Analysis Result</h3>
                    <div className="analysis-content">
                        {result.analysis}
                    </div>
                    <div className="snippet">
                        <h4>Extracted Text Snippet:</h4>
                        <p>{result.text}...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PdfImport;
