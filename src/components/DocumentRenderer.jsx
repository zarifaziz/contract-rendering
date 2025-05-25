import React, { useState, useRef, useEffect } from 'react';
import TextBlock from './TextBlock';
import './DocumentRenderer.css';

// Enhanced clause counter utility
const createClauseCounter = () => {
  let mainCount = 0;
  let subClauseCount = 0;
  
  return {
    incrementMain: () => {
      mainCount++;
      subClauseCount = 0; // Reset sub-clause counter for new main clause
      console.log(`🔢 incrementMain() called - mainCount: ${mainCount}, subClauseCount reset to: ${subClauseCount}`);
      return mainCount;
    },
    incrementSub: () => {
      subClauseCount++;
      const letter = String.fromCharCode(96 + subClauseCount);
      console.log(`🔤 incrementSub() called - subClauseCount: ${subClauseCount}, letter: ${letter}`);
      return `(${letter})`;
    },
    current: () => mainCount,
    reset: () => {
      console.log(`🔄 Counter reset - mainCount: ${mainCount} -> 0, subClauseCount: ${subClauseCount} -> 0`);
      mainCount = 0;
      subClauseCount = 0;
    }
  };
};

const DocumentRenderer = ({ data, mentionValues, updateMentionValue, updateMentionColor }) => {
  const clauseCounterRef = useRef(null);
  const [renderKey, setRenderKey] = useState(0);

  // Initialize clause counter only once
  if (!clauseCounterRef.current) {
    clauseCounterRef.current = createClauseCounter();
  }

  // Reset counter when data changes
  useEffect(() => {
    console.log(`🔄 useEffect triggered - data changed, resetting counter and incrementing renderKey`);
    if (clauseCounterRef.current) {
      clauseCounterRef.current.reset();
      setRenderKey(prev => prev + 1); // Force re-render with reset counter
    }
  }, [data]);

  const renderElement = (element, index, parentType = 'document-section') => {
    if (!element) return null;

    console.log(`🎯 DocumentRenderer.renderElement() - element.type: ${element.type}, title: "${element.title || 'N/A'}", index: ${index}, parentType: ${parentType}`);

    // Use TextBlock which will handle all elements including clauses recursively
    return (
      <TextBlock 
        key={`${renderKey}-${index}`} 
        element={element} 
        clauseCounter={clauseCounterRef.current} 
        parentType={parentType}
        mentionValues={mentionValues}
        updateMentionValue={updateMentionValue}
        updateMentionColor={updateMentionColor}
      />
    );
  };

  const renderDocument = (documentData) => {
    if (!documentData || !Array.isArray(documentData)) return null;

    return documentData.map((section, index) => (
      <div key={`section-${renderKey}-${index}`} className="document-section">
        {section.children && section.children.map((element, elementIndex) => 
          renderElement(element, elementIndex, 'document-section')
        )}
      </div>
    ));
  };

  return (
    <div className="document-container">
      <div className="document-content">
        {renderDocument(data)}
      </div>
    </div>
  );
};

export default DocumentRenderer; 