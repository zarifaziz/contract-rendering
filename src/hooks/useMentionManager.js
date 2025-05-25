import { useState, useEffect, useMemo } from 'react';
import { hexToRgb, sanitizeMentionValue, validateMentionValue } from '../utils/mentionUtils';

/**
 * Custom hook for managing mention state and synchronization
 * Handles extraction, storage, and updates of mention values throughout the document
 */
export const useMentionManager = (documentData) => {
  const [mentionValues, setMentionValues] = useState({});

  /**
   * Extracts all mentions from the document data and creates a centralized registry
   * @param {Array} data - The document data array
   * @returns {Object} - Object mapping mention IDs to their properties
   */
  const extractMentions = (data) => {
    const mentions = {};
    
    const traverse = (element) => {
      if (!element) return;
      
      if (element.type === 'mention' && element.id) {
        const value = element.value || (element.children && element.children[0] ? element.children[0].text : '');
        mentions[element.id] = {
          value: sanitizeMentionValue(value),
          color: element.color,
          title: element.title,
          variableType: element.variableType
        };
        console.log(`📝 Extracted mention: id="${element.id}", value="${mentions[element.id].value}"`);
      }
      
      if (element.children && Array.isArray(element.children)) {
        element.children.forEach(traverse);
      }
    };
    
    if (Array.isArray(data)) {
      data.forEach(traverse);
    }
    
    console.log('🎯 All extracted mentions:', mentions);
    return mentions;
  };

  // Memoize the mention extraction to avoid unnecessary recalculations
  const extractedMentions = useMemo(() => {
    return documentData ? extractMentions(documentData) : {};
  }, [documentData]);

  // Update mention values when document data changes
  useEffect(() => {
    console.log('🔄 Setting mention values:', extractedMentions);
    setMentionValues(extractedMentions);
  }, [extractedMentions]);

  /**
   * Updates the value of a mention across all instances
   * @param {string} id - The mention ID to update
   * @param {string} newValue - The new value to set
   */
  const updateMentionValue = (id, newValue) => {
    const sanitizedValue = sanitizeMentionValue(newValue);
    const currentMention = mentionValues[id];
    
    // Validate the new value if we have type information
    if (currentMention?.variableType) {
      const validation = validateMentionValue(sanitizedValue, currentMention.variableType);
      if (!validation.isValid) {
        console.warn(`⚠️ Invalid value for mention "${id}": ${validation.error}`);
        // You could show a user notification here in the future
      }
    }
    
    console.log(`✏️ Updating mention value: id="${id}", newValue="${sanitizedValue}"`);
    setMentionValues(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        value: sanitizedValue
      }
    }));
  };

  /**
   * Updates the color of a mention across all instances
   * @param {string} id - The mention ID to update
   * @param {string} newColor - The new color to set (hex or RGB format)
   */
  const updateMentionColor = (id, newColor) => {
    // Convert hex to RGB if needed (for consistency with original data format)
    const rgbColor = newColor.startsWith('#') ? hexToRgb(newColor) : newColor;
    
    console.log(`🎨 Updating mention color: id="${id}", newColor="${rgbColor}"`);
    setMentionValues(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        color: rgbColor
      }
    }));
  };

  /**
   * Updates multiple properties of a mention at once
   * @param {string} id - The mention ID to update
   * @param {Object} updates - Object containing the properties to update
   */
  const updateMention = (id, updates) => {
    const sanitizedUpdates = { ...updates };
    
    // Sanitize value if it's being updated
    if (sanitizedUpdates.value) {
      sanitizedUpdates.value = sanitizeMentionValue(sanitizedUpdates.value);
    }
    
    // Convert color if it's being updated
    if (sanitizedUpdates.color && sanitizedUpdates.color.startsWith('#')) {
      sanitizedUpdates.color = hexToRgb(sanitizedUpdates.color);
    }
    
    console.log(`🔄 Updating mention: id="${id}", updates:`, sanitizedUpdates);
    setMentionValues(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...sanitizedUpdates
      }
    }));
  };

  /**
   * Gets the current value for a specific mention
   * @param {string} id - The mention ID
   * @returns {Object|null} - The mention object or null if not found
   */
  const getMention = (id) => {
    return mentionValues[id] || null;
  };

  /**
   * Gets all mention IDs currently in the registry
   * @returns {Array} - Array of mention IDs
   */
  const getMentionIds = () => {
    return Object.keys(mentionValues);
  };

  /**
   * Validates all current mention values
   * @returns {Object} - Validation results for each mention
   */
  const validateAllMentions = () => {
    const validationResults = {};
    
    Object.entries(mentionValues).forEach(([id, mention]) => {
      if (mention.variableType) {
        validationResults[id] = validateMentionValue(mention.value, mention.variableType);
      } else {
        validationResults[id] = { isValid: true };
      }
    });
    
    return validationResults;
  };

  return {
    // State
    mentionValues,
    
    // Update functions
    updateMentionValue,
    updateMentionColor,
    updateMention,
    
    // Query functions
    getMention,
    getMentionIds,
    
    // Utility functions
    validateAllMentions
  };
}; 