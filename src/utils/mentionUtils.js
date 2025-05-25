/**
 * Utility functions for mention management and validation
 */

/**
 * Converts hex color to RGB format
 * @param {string} hex - Hex color string (e.g., "#ff0000")
 * @returns {string} - RGB color string (e.g., "rgb(255, 0, 0)")
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex; // Return original if invalid hex
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Sanitizes mention value to prevent XSS and ensure valid content
 * @param {string} value - The mention value to sanitize
 * @returns {string} - Sanitized value
 */
export const sanitizeMentionValue = (value) => {
  if (typeof value !== 'string') return '';
  
  // Remove HTML tags and trim whitespace
  return value
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>&"']/g, (match) => { // Escape special characters
      const escapeMap = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#x27;'
      };
      return escapeMap[match];
    })
    .trim();
};

/**
 * Validates mention value based on variable type
 * @param {string} value - The value to validate
 * @param {string} variableType - The type of variable (Date, Number, Text, etc.)
 * @returns {Object} - { isValid: boolean, error?: string }
 */
export const validateMentionValue = (value, variableType) => {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: 'Value is required' };
  }

  switch (variableType?.toLowerCase()) {
    case 'date':
      const dateRegex = /^\w+\s+\d{1,2},\s+\d{4}$/; // e.g., "November 17, 2021"
      if (!dateRegex.test(value)) {
        return { 
          isValid: false, 
          error: 'Date must be in format "Month DD, YYYY"' 
        };
      }
      break;
      
    case 'number':
      if (isNaN(Number(value))) {
        return { 
          isValid: false, 
          error: 'Value must be a valid number' 
        };
      }
      break;
      
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return { 
          isValid: false, 
          error: 'Value must be a valid email address' 
        };
      }
      break;
      
    default:
      // For text or unknown types, just check for reasonable length
      if (value.length > 200) {
        return { 
          isValid: false, 
          error: 'Value is too long (max 200 characters)' 
        };
      }
  }

  return { isValid: true };
};

/**
 * Groups mentions by their variable type
 * @param {Object} mentionValues - Object mapping mention IDs to their properties
 * @returns {Object} - Object grouping mentions by type
 */
export const groupMentionsByType = (mentionValues) => {
  const groups = {};
  
  Object.entries(mentionValues).forEach(([id, mention]) => {
    const type = mention.variableType || 'text';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push({ id, ...mention });
  });
  
  return groups;
};

/**
 * Creates a summary of mention statistics
 * @param {Object} mentionValues - Object mapping mention IDs to their properties
 * @returns {Object} - Statistics object
 */
export const getMentionStatistics = (mentionValues) => {
  const mentions = Object.values(mentionValues);
  const types = groupMentionsByType(mentionValues);
  
  return {
    total: mentions.length,
    byType: Object.keys(types).reduce((acc, type) => {
      acc[type] = types[type].length;
      return acc;
    }, {}),
    uniqueValues: new Set(mentions.map(m => m.value)).size,
    averageValueLength: mentions.length > 0 
      ? Math.round(mentions.reduce((sum, m) => sum + m.value.length, 0) / mentions.length)
      : 0
  };
}; 