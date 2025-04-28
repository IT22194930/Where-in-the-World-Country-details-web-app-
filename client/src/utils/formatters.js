/**
 * Formats a number as a readable string with commas as thousand separators
 * @param {number} num - The number to format
 * @param {boolean} addPlus - Whether to add a plus sign for positive numbers
 * @returns {string} The formatted number
 */
export const formatNumber = (num, addPlus = false) => {
  if (num === undefined || num === null) return 'N/A';
  
  const formatted = num.toLocaleString();
  
  if (addPlus && num > 0) {
    return `+${formatted}`;
  }
  
  return formatted;
};

/**
 * Formats a percentage value for display
 * @param {number} value - The percentage value (0-100)
 * @param {boolean} includeSymbol - Whether to include the % symbol
 * @returns {string} The formatted percentage
 */
export const formatPercentage = (value, includeSymbol = true) => {
  if (value === undefined || value === null) return 'N/A';
  
  const formatted = value.toFixed(1);
  
  if (includeSymbol) {
    return `${formatted}%`;
  }
  
  return formatted;
};