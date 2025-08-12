/**
 * Utility function to generate unique IDs for different rate lists
 * @param {string} rateListName - The name of the rate list (e.g., "CGSH", "Mediassist")
 * @param {number} sequenceNumber - The sequence number for this rate list
 * @returns {string} - The generated unique ID (e.g., "CG00001", "MR00002")
 */
const generateUniqueId = (rateListName, sequenceNumber) => {
  // Define prefix mappings for different rate list names
  const prefixMap = {
    'CGSH': 'CG',
    'CGHS': 'CG',
    'CGHS RATE LIST': 'CG',
    'MEDIASSIST': 'MD',
    'MEDI ASSIST': 'MD',
    'MEDI-ASSIST': 'MD',
    'MEDIASSIST RATE LIST': 'MD',
    'MEDI ASSIST RATE LIST': 'MD',
    'CASH': 'CS',
    'CASH RATE LIST': 'CS',
    'CHARITY': 'CH',
    'CHARITY RATE LIST': 'CH',
    'TPA': 'TP',
    'TPA RATE LIST': 'TP',
    'INSURANCE': 'IN',
    'INSURANCE WITH NO TP': 'IN',
    'INSURANCE WITH NO TPA': 'IN',
    'INSURANCE RATE LIST': 'IN',
    'INSURANCE WITH NO TP RATE LIST': 'IN',
    'INSURANCE WITH NO TPA RATE LIST': 'IN',
    'GOVERNMENT': 'GV',
    'GOVERNMENT RATE LIST': 'GV',
    'CORPORATE': 'CP',
    'CORPORATE PRIVATE': 'CP',
    'CORPORATE PUBLIC': 'CP',
    'CORPORATE RATE LIST': 'CP',
    'CORPORATE PRIVATE RATE LIST': 'CP',
    'CORPORATE PUBLIC RATE LIST': 'CP',
    'GIPSAA': 'GP',
    'GIPSAA RATE LIST': 'GP',
    'GIPSA RATE LIST': 'GP',
    'MJPJAY': 'MJ',
    'MJPJAY RATE LIST': 'MJ',
    'INFOSIS': 'IF',
    'INFOSIS RATE LIST': 'IF',
    'GENERAL': 'GN',
    'GENERAL RATE LIST': 'GN',
    'EMERGENCY': 'EM',
    'EMERGENCY RATE LIST': 'EM',
    'WALKIN': 'WK',
    'WALKIN RATE LIST': 'WK',
    'DAYCARE': 'DC',
    'DAYCARE RATE LIST': 'DC',
    'IPD': 'IP',
    'IPD RATE LIST': 'IP',
    'OPD': 'OP',
    'OPD RATE LIST': 'OP'
  };

  // Get the prefix from the mapping, or generate one from the name
  let prefix = prefixMap[rateListName?.toUpperCase()];
  
  if (!prefix) {
    // If no mapping found, create prefix from first 2 letters of the name
    prefix = rateListName?.substring(0, 2)?.toUpperCase() || 'SR';
  }

  // Format the sequence number with leading zeros (5 digits)
  const formattedSequence = sequenceNumber.toString().padStart(5, '0');
  
  return `${prefix}${formattedSequence}`;
};

/**
 * Extract prefix and sequence number from a unique ID
 * @param {string} uniqueId - The unique ID (e.g., "CG00001")
 * @returns {object} - Object containing prefix and sequence number
 */
const parseUniqueId = (uniqueId) => {
  if (!uniqueId || typeof uniqueId !== 'string') {
    return { prefix: '', sequenceNumber: 0 };
  }

  // Extract prefix (first 2 characters) and sequence number (remaining characters)
  const prefix = uniqueId.substring(0, 2);
  const sequencePart = uniqueId.substring(2);
  const sequenceNumber = parseInt(sequencePart, 10) || 0;

  return { prefix, sequenceNumber };
};

/**
 * Get the next sequence number for a rate list
 * @param {Array} existingCodes - Array of existing codes for the rate list
 * @param {string} rateListName - The name of the rate list
 * @returns {number} - The next sequence number
 */
const getNextSequenceNumber = (existingCodes, rateListName) => {
  if (!existingCodes || !Array.isArray(existingCodes)) {
    return 1;
  }

  // Get the prefix for this rate list
  const prefixMap = {
    'CGSH': 'CG',
    'CGHS': 'CG',
    'CGHS RATE LIST': 'CG',
    'MEDIASSIST': 'MD',
    'MEDI ASSIST': 'MD',
    'MEDI-ASSIST': 'MD',
    'MEDIASSIST RATE LIST': 'MD',
    'MEDI ASSIST RATE LIST': 'MD',
    'CASH': 'CS',
    'CASH RATE LIST': 'CS',
    'CHARITY': 'CH',
    'CHARITY RATE LIST': 'CH',
    'TPA': 'TP',
    'TPA RATE LIST': 'TP',
    'INSURANCE': 'IN',
    'INSURANCE WITH NO TP': 'IN',
    'INSURANCE WITH NO TPA': 'IN',
    'INSURANCE RATE LIST': 'IN',
    'INSURANCE WITH NO TP RATE LIST': 'IN',
    'INSURANCE WITH NO TPA RATE LIST': 'IN',
    'GOVERNMENT': 'GV',
    'GOVERNMENT RATE LIST': 'GV',
    'CORPORATE': 'CP',
    'CORPORATE PRIVATE': 'CP',
    'CORPORATE PUBLIC': 'CP',
    'CORPORATE RATE LIST': 'CP',
    'CORPORATE PRIVATE RATE LIST': 'CP',
    'CORPORATE PUBLIC RATE LIST': 'CP',
    'GIPSAA': 'GP',
    'GIPSAA RATE LIST': 'GP',
    'GIPSA RATE LIST': 'GP',
    'MJPJAY': 'MJ',
    'MJPJAY RATE LIST': 'MJ',
    'INFOSIS': 'IF',
    'INFOSIS RATE LIST': 'IF',
    'GENERAL': 'GN',
    'GENERAL RATE LIST': 'GN',
    'EMERGENCY': 'EM',
    'EMERGENCY RATE LIST': 'EM',
    'WALKIN': 'WK',
    'WALKIN RATE LIST': 'WK',
    'DAYCARE': 'DC',
    'DAYCARE RATE LIST': 'DC',
    'IPD': 'IP',
    'IPD RATE LIST': 'IP',
    'OPD': 'OP',
    'OPD RATE LIST': 'OP'
  };

  const prefix = prefixMap[rateListName?.toUpperCase()] || rateListName?.substring(0, 2)?.toUpperCase() || 'SR';

  // Find the highest sequence number for this prefix
  let maxSequence = 0;
  
  existingCodes.forEach(code => {
    if (code && typeof code === 'string' && code.startsWith(prefix)) {
      const { sequenceNumber } = parseUniqueId(code);
      if (sequenceNumber > maxSequence) {
        maxSequence = sequenceNumber;
      }
    }
  });

  return maxSequence + 1;
};

module.exports = {
  generateUniqueId,
  parseUniqueId,
  getNextSequenceNumber
}; 