import React from 'react';
import './Mention.css';

const Mention = ({ element, mentionValues, updateMentionValue, updateMentionColor }) => {
  const { id, color, children, title, value } = element;
  
  // Get the current value from the centralized mention state
  // Fall back to element's original value if not found in centralized state
  const currentMention = mentionValues && id ? mentionValues[id] : null;
  const displayValue = currentMention 
    ? currentMention.value 
    : (value || (children && children[0] ? children[0].text : ''));
  
  // Use centralized color if available, otherwise fall back to element color
  const displayColor = currentMention ? currentMention.color : color;
  
  // Use centralized title if available, otherwise fall back to element title
  const displayTitle = currentMention ? currentMention.title : title;
  
  // Debug logging
  console.log(`🏷️ Mention render: id="${id}", originalValue="${value}", displayValue="${displayValue}", hasCentralizedValue=${!!currentMention}`);
  
  const style = {
    backgroundColor: displayColor,
    color: '#fff',
    padding: '2px 6px',
    borderRadius: '3px',
    display: 'inline-block',
    fontSize: '0.9em',
    fontWeight: '500'
  };

  return (
    <span 
      className="mention" 
      style={style} 
      title={displayTitle}
      data-mention-id={id} // Add data attribute for future editing functionality
    >
      {displayValue}
    </span>
  );
};

export default Mention;
