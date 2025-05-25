import React from 'react';
import Mention from './Mention';
import Clause from './Clause';

const TextBlock = ({ element, clauseCounter, parentType = 'unknown', mentionValues, updateMentionValue, updateMentionColor }) => {
  if (!element) return null;

  // Handle text nodes
  if (element.text !== undefined) {
    let content = element.text;
    let style = {};

    // Apply formatting
    if (element.bold) {
      style.fontWeight = 'bold';
    }
    if (element.italic) {
      style.fontStyle = 'italic';
    }
    if (element.underline) {
      style.textDecoration = 'underline';
    }

    // Handle line breaks in text
    if (content.includes('\n')) {
      const parts = content.split('\n');
      return (
        <span style={style}>
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              {part}
              {index < parts.length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
      );
    }

    return <span style={style}>{content}</span>;
  }

  // Handle mention elements
  if (element.type === 'mention') {
    return (
      <Mention 
        element={element} 
        mentionValues={mentionValues}
        updateMentionValue={updateMentionValue}
        updateMentionColor={updateMentionColor}
      />
    );
  }

  // Handle clause elements
  if (element.type === 'clause') {
    // Determine if this clause should be top-level based on its parent
    const isTopLevel = parentType === 'p' || parentType === 'block' || parentType === 'document-section';
    console.log(`🏗️ TextBlock processing clause: "${element.title || 'Untitled'}", parentType: ${parentType}, isTopLevel: ${isTopLevel}`);
    return (
      <Clause 
        element={element} 
        clauseCounter={clauseCounter} 
        isTopLevel={isTopLevel} 
        parentType={parentType}
        mentionValues={mentionValues}
        updateMentionValue={updateMentionValue}
        updateMentionColor={updateMentionColor}
      />
    );
  }

  // Handle other elements with children
  if (element.children) {
    const children = element.children.map((child, index) => (
      <TextBlock 
        key={index} 
        element={child} 
        clauseCounter={clauseCounter} 
        parentType={element.type}
        mentionValues={mentionValues}
        updateMentionValue={updateMentionValue}
        updateMentionColor={updateMentionColor}
      />
    ));

    // Apply formatting to container
    let style = {};
    if (element.bold) style.fontWeight = 'bold';
    if (element.italic) style.fontStyle = 'italic';
    if (element.underline) style.textDecoration = 'underline';

    switch (element.type) {
      case 'h1':
        return <h1 style={style}>{children}</h1>;
      case 'h4':
        return <h4 style={style}>{children}</h4>;
      case 'p':
        // Prevent nested <p> tags by rendering a <div> if parentType is 'p'
        if (parentType === 'p') {
          return <div style={style}>{children}</div>;
        }
        return <p style={style}>{children}</p>;
      case 'ul':
        return <ul style={style}>{children}</ul>;
      case 'li':
        return <li style={style}>{children}</li>;
      case 'lic':
        return <span style={style}>{children}</span>;
      case 'block':
        return <div className="block" style={style}>{children}</div>;
      default:
        return <span style={style}>{children}</span>;
    }
  }

  return null;
};

export default TextBlock;
