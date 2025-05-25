import React, { useState, useEffect } from 'react';
import DocumentRenderer from './components/DocumentRenderer';
import { useMentionManager } from './hooks/useMentionManager';
import './App.css';

function App() {
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the custom hook for mention management
  const {
    mentionValues,
    updateMentionValue,
    updateMentionColor
  } = useMentionManager(documentData);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const response = await fetch('/data/input.json');
        if (!response.ok) {
          throw new Error('Failed to load document data');
        }
        const data = await response.json();
        setDocumentData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, []);

  if (loading) {
    return (
      <div className="App">
        <div className="loading">Loading document...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="App">
      <DocumentRenderer 
        data={documentData} 
        mentionValues={mentionValues}
        updateMentionValue={updateMentionValue}
        updateMentionColor={updateMentionColor}
      />
    </div>
  );
}

export default App;
