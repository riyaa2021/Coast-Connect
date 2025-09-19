// src/utils/index.ts

// Constants
export * from './constants';

// Helper functions
export * from './helpers';

// Social media utilities
export * from './socialHelpers';

// Validation utilities
export * from './validation';

// Common utility functions for easy import
export {
  // Date/Time
  formatDate,
  getRelativeTime,
  
  // Formatting
  formatNumber,
  formatPercentage,
  formatFileSize,
  truncateText,
  capitalizeWords,
  
  // Validation
  isValidEmail,
  isValidCoordinates,
  isImageFile,
  
  // Data manipulation
  sortByKey,
  groupBy,
  unique,
  isEmpty,
  removeEmpty,
  deepClone,
  
  // UI utilities
  scrollToElement,
  copyToClipboard,
  downloadAsFile,
  getCurrentLocation,
  
  // Performance
  debounce,
  throttle,
  
  // Styling helpers
  getSeverityStyles,
  getStatusStyles,
  getSentimentStyles,
  formatHazardType,
} from './helpers';

// Social media specific exports
export {
  calculateTotalEngagement,
  getDominantSentiment,
  isViralMention,
  isInfluencerMention,
  calculateSocialUrgencyScore,
  generateSocialAlert,
  extractTrendingHashtags,
  getPlatformStats,
} from './socialHelpers';

// Validation specific exports
export {
  validateEmail,
  validatePassword,
  validateName,
  validateLoginCredentials,
  validateSignupData,
  validateReportData,
  validateFileUpload,
  validateContentSafety,
  sanitizeInput,
  sanitizeHtml,
} from './validation';

export type { ValidationResult } from './validation';