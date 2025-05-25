import React from 'react';
import TextBlock from './TextBlock';
import './Clause.css';

const Clause = ({ element, clauseCounter, isTopLevel = false, parentType = 'unknown', mentionValues, updateMentionValue, updateMentionColor }) => {
  if (!element || element.type !== 'clause') {
    return (
      <TextBlock 
        element={element} 
        clauseCounter={clauseCounter} 
        parentType={parentType}
        mentionValues={mentionValues}
        updateMentionValue={updateMentionValue}
        updateMentionColor={updateMentionColor}
      />
    );
  }

  console.log(`📋 Processing clause: "${element.title || 'Untitled'}", isTopLevel: ${isTopLevel}, parentType: ${parentType}`);

  let clauseNumber;
  if (isTopLevel) {
    // Top-level clauses get main numbering
    clauseNumber = clauseCounter.incrementMain();
    console.log(`📋 Top-level clause assigned number: ${clauseNumber}`);
  } else {
    // Nested clauses get letter numbering (these are like lettered list items)
    clauseNumber = clauseCounter.incrementSub();
    console.log(`📋 Nested clause assigned letter: ${clauseNumber}`);
  }
  
  return (
    <div className={`clause ${!isTopLevel ? 'clause-nested' : ''}`}>
      <div className="clause-number">{clauseNumber}{isTopLevel ? '.' : ''}</div>
      <div className="clause-content">
        {element.children && element.children.map((child, index) => {
          // Handle nested clauses as lettered items
          if (child.type === 'clause') {
            return (
              <Clause 
                key={index} 
                element={child} 
                clauseCounter={clauseCounter} 
                isTopLevel={false} 
                parentType="clause"
                mentionValues={mentionValues}
                updateMentionValue={updateMentionValue}
                updateMentionColor={updateMentionColor}
              />
            );
          }
          return (
            <TextBlock 
              key={index} 
              element={child} 
              clauseCounter={clauseCounter} 
              parentType="clause"
              mentionValues={mentionValues}
              updateMentionValue={updateMentionValue}
              updateMentionColor={updateMentionColor}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Clause;
