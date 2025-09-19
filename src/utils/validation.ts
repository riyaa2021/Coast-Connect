// src/utils/validation.ts
import { VALIDATION } from './constants';
import {type LoginCredentials, type SignupData, type CreateReportData,type Location } from '../types';

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): string[] => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
  } else if (!VALIDATION.EMAIL_REGEX.test(email)) {
    errors.push('Invalid email format');
  }
  
  return errors;
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      errors.push(`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long`);
    }
    
    // Check for at least one number
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    // Check for at least one letter
    if (!/[a-zA-Z]/.test(password)) {
      errors.push('Password must contain at least one letter');
    }
  }
  
  return errors;
};

/**
 * Validate name
 */
export const validateName = (name: string): string[] => {
  const errors: string[] = [];
  
  if (!name) {
    errors.push('Name is required');
  } else if (name.trim().length < VALIDATION.NAME_MIN_LENGTH) {
    errors.push(`Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters long`);
  } else if (!/^[a-zA-Z\s]+$/.test(name)) {
    errors.push('Name can only contain letters and spaces');
  }
  
  return errors;
};

/**
 * Validate phone number
 */
export const validatePhone = (phone: string): string[] => {
  const errors: string[] = [];
  
  if (phone && !VALIDATION.PHONE_REGEX.test(phone)) {
    errors.push('Invalid phone number format');
  }
  
  return errors;
};

/**
 * Validate coordinates
 */
export const validateCoordinates = (lat: number, lng: number): string[] => {
  const errors: string[] = [];
  
  if (isNaN(lat) || isNaN(lng)) {
    errors.push('Invalid coordinates');
  } else {
    if (lat < VALIDATION.COORDINATES.LAT_MIN || lat > VALIDATION.COORDINATES.LAT_MAX) {
      errors.push('Latitude must be between -90 and 90 degrees');
    }
    
    if (lng < VALIDATION.COORDINATES.LNG_MIN || lng > VALIDATION.COORDINATES.LNG_MAX) {
      errors.push('Longitude must be between -180 and 180 degrees');
    }
  }
  
  return errors;
};

/**
 * Validate location object
 */
export const validateLocation = (location: Location): ValidationResult => {
  const errors: Record<string, string[]> = {};
  
  // Validate coordinates
  const coordErrors = validateCoordinates(location.lat, location.lng);
  if (coordErrors.length > 0) {
    errors.coordinates = coordErrors;
  }
  
  // Validate address
  if (!location.address || location.address.trim().length === 0) {
    errors.address = ['Address is required'];
  } else if (location.address.trim().length < 5) {
    errors.address = ['Address must be at least 5 characters long'];
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate login credentials
 */
export const validateLoginCredentials = (credentials: LoginCredentials): ValidationResult => {
  const errors: Record<string, string[]> = {};
  
  // Validate email
  const emailErrors = validateEmail(credentials.email);
  if (emailErrors.length > 0) {
    errors.email = emailErrors;
  }
  
  // Validate password (basic check for login)
  if (!credentials.password) {
    errors.password = ['Password is required'];
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate signup data
 */
export const validateSignupData = (data: SignupData): ValidationResult => {
  const errors: Record<string, string[]> = {};
  
  // Validate name
  const nameErrors = validateName(data.name);
  if (nameErrors.length > 0) {
    errors.name = nameErrors;
  }
  
  // Validate email
  const emailErrors = validateEmail(data.email);
  if (emailErrors.length > 0) {
    errors.email = emailErrors;
  }
  
  // Validate password
  const passwordErrors = validatePassword(data.password);
  if (passwordErrors.length > 0) {
    errors.password = passwordErrors;
  }
  
  // Validate password confirmation
  if (!data.confirmPassword) {
    errors.confirmPassword = ['Password confirmation is required'];
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = ['Passwords do not match'];
  }
  
  // Validate phone (optional)
  if (data.phone) {
    const phoneErrors = validatePhone(data.phone);
    if (phoneErrors.length > 0) {
      errors.phone = phoneErrors;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate report data
 */
export const validateReportData = (data: CreateReportData): ValidationResult => {
  const errors: Record<string, string[]> = {};
  
  // Validate title
  if (!data.title) {
    errors.title = ['Title is required'];
  } else if (data.title.trim().length < VALIDATION.TITLE_MIN_LENGTH) {
    errors.title = [`Title must be at least ${VALIDATION.TITLE_MIN_LENGTH} characters long`];
  } else if (data.title.trim().length > 100) {
    errors.title = ['Title must be less than 100 characters'];
  }
  
  // Validate description
  if (!data.description) {
    errors.description = ['Description is required'];
  } else if (data.description.trim().length < VALIDATION.DESCRIPTION_MIN_LENGTH) {
    errors.description = [`Description must be at least ${VALIDATION.DESCRIPTION_MIN_LENGTH} characters long`];
  } else if (data.description.trim().length > 2000) {
    errors.description = ['Description must be less than 2000 characters'];
  }
  
  // Validate hazard type
  const validHazardTypes = ['tsunami', 'storm_surge', 'high_waves', 'coastal_flooding', 'abnormal_tide'];
  if (!data.hazardType) {
    errors.hazardType = ['Hazard type is required'];
  } else if (!validHazardTypes.includes(data.hazardType)) {
    errors.hazardType = ['Invalid hazard type'];
  }
  
  // Validate severity
  const validSeverities = ['low', 'medium', 'high', 'critical'];
  if (!data.severity) {
    errors.severity = ['Severity level is required'];
  } else if (!validSeverities.includes(data.severity)) {
    errors.severity = ['Invalid severity level'];
  }
  
  // Validate location
  const locationValidation = validateLocation(data.location);
  if (!locationValidation.isValid) {
    errors.location = Object.values(locationValidation.errors).flat();
  }
  
  // Validate images (optional)
  if (data.images && data.images.length > 0) {
    const imageErrors: string[] = [];
    
    if (data.images.length > 5) {
      imageErrors.push('Maximum 5 images allowed');
    }
    
    for (let i = 0; i < data.images.length; i++) {
      const file = data.images[i];
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        imageErrors.push(`File ${file.name} is too large (max 10MB)`);
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        imageErrors.push(`File ${file.name} is not a supported image format`);
      }
    }
    
    if (imageErrors.length > 0) {
      errors.images = imageErrors;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate file upload
 */
export const validateFileUpload = (
  file: File,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
    maxNameLength?: number;
  } = {}
): ValidationResult => {
  const errors: Record<string, string[]> = {};
  const fileErrors: string[] = [];
  
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4'],
    maxNameLength = 255
  } = options;
  
  // Check file size
  if (file.size > maxSize) {
    fileErrors.push(`File is too large (max ${Math.round(maxSize / 1024 / 1024)}MB)`);
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    fileErrors.push('Unsupported file type');
  }
  
  // Check file name length
  if (file.name.length > maxNameLength) {
    fileErrors.push(`File name is too long (max ${maxNameLength} characters)`);
  }
  
  // Check for potentially dangerous file extensions
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (dangerousExtensions.includes(fileExtension)) {
    fileErrors.push('File type not allowed for security reasons');
  }
  
  if (fileErrors.length > 0) {
    errors.file = fileErrors;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate search parameters
 */
export const validateSearchParams = (params: {
  query?: string;
  dateRange?: { start: string; end: string };
  location?: { lat: number; lng: number; radius: number };
}): ValidationResult => {
  const errors: Record<string, string[]> = {};
  
  // Validate query
  if (params.query && params.query.trim().length > 500) {
    errors.query = ['Search query is too long (max 500 characters)'];
  }
  
  // Validate date range
  if (params.dateRange) {
    const { start, end } = params.dateRange;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const now = new Date();
    
    if (isNaN(startDate.getTime())) {
      errors.dateRange = ['Invalid start date'];
    } else if (isNaN(endDate.getTime())) {
      errors.dateRange = ['Invalid end date'];
    } else if (startDate > endDate) {
      errors.dateRange = ['Start date must be before end date'];
    } else if (endDate > now) {
      errors.dateRange = ['End date cannot be in the future'];
    } else if (startDate < new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)) {
      errors.dateRange = ['Date range cannot exceed 1 year ago'];
    }
  }
  
  // Validate location
  if (params.location) {
    const { lat, lng, radius } = params.location;
    const coordErrors = validateCoordinates(lat, lng);
    
    if (coordErrors.length > 0) {
      errors.location = coordErrors;
    } else {
      if (radius <= 0 || radius > 1000) {
        errors.location = ['Radius must be between 1 and 1000 kilometers'];
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate URL
 */
export const validateUrl = (url: string): string[] => {
  const errors: string[] = [];
  
  if (!url) {
    errors.push('URL is required');
  } else {
    try {
      new URL(url);
    } catch {
      errors.push('Invalid URL format');
    }
  }
  
  return errors;
};

/**
 * Sanitize HTML content
 */
export const sanitizeHtml = (content: string): string => {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate and sanitize user input
 */
export const sanitizeInput = (input: string, maxLength: number = 1000): string => {
  if (!input) return '';
  
  return input
    .trim()
    .substring(0, maxLength)
    .replace(/[<>]/g, ''); // Remove potential HTML tags
};

/**
 * Check if string contains profanity (basic implementation)
 */
export const containsProfanity = (text: string): boolean => {
  // Basic profanity filter - in production, use a comprehensive library
  const profanityWords = ['spam', 'abuse', 'offensive']; // Add actual profanity words
  const lowerText = text.toLowerCase();
  
  return profanityWords.some(word => lowerText.includes(word));
};

/**
 * Validate content for safety
 */
export const validateContentSafety = (content: string): ValidationResult => {
  const errors: Record<string, string[]> = {};
  const contentErrors: string[] = [];
  
  if (containsProfanity(content)) {
    contentErrors.push('Content contains inappropriate language');
  }
  
  // Check for potential spam patterns
  const urlCount = (content.match(/https?:\/\//g) || []).length;
  if (urlCount > 3) {
    contentErrors.push('Content contains too many URLs');
  }
  
  // Check for excessive capitalization
  const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
  if (capsRatio > 0.7 && content.length > 20) {
    contentErrors.push('Content contains excessive capitalization');
  }
  
  if (contentErrors.length > 0) {
    errors.content = contentErrors;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};