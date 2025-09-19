// src/utils/constants.ts

// Application constants
export const APP_NAME = 'Ocean Hazard Platform';
export const APP_VERSION = '1.0.0';
export const ORGANIZATION = 'INCOIS';

// Hazard types
export const HAZARD_TYPES = {
  TSUNAMI: 'tsunami',
  STORM_SURGE: 'storm_surge',
  HIGH_WAVES: 'high_waves',
  COASTAL_FLOODING: 'coastal_flooding',
  ABNORMAL_TIDE: 'abnormal_tide',
} as const;

export const HAZARD_TYPE_LABELS = {
  [HAZARD_TYPES.TSUNAMI]: 'Tsunami',
  [HAZARD_TYPES.STORM_SURGE]: 'Storm Surge',
  [HAZARD_TYPES.HIGH_WAVES]: 'High Waves',
  [HAZARD_TYPES.COASTAL_FLOODING]: 'Coastal Flooding',
  [HAZARD_TYPES.ABNORMAL_TIDE]: 'Abnormal Tide',
};

// Severity levels
export const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const SEVERITY_COLORS = {
  [SEVERITY_LEVELS.LOW]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-500',
    hex: '#16a34a',
  },
  [SEVERITY_LEVELS.MEDIUM]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-500',
    hex: '#ca8a04',
  },
  [SEVERITY_LEVELS.HIGH]: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-500',
    hex: '#ea580c',
  },
  [SEVERITY_LEVELS.CRITICAL]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-600',
    hex: '#dc2626',
  },
};

// Report statuses
export const REPORT_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  INVESTIGATING: 'investigating',
} as const;

export const REPORT_STATUS_COLORS = {
  [REPORT_STATUS.PENDING]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    hex: '#ca8a04',
  },
  [REPORT_STATUS.VERIFIED]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    hex: '#16a34a',
  },
  [REPORT_STATUS.REJECTED]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    hex: '#dc2626',
  },
  [REPORT_STATUS.INVESTIGATING]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    hex: '#2563eb',
  },
};

// User roles
export const USER_ROLES = {
  USER: 'user',
  OFFICIAL: 'official',
} as const;

// Social media platforms
export const SOCIAL_PLATFORMS = {
  TWITTER: 'twitter',
  FACEBOOK: 'facebook',
  INSTAGRAM: 'instagram',
  YOUTUBE: 'youtube',
  TIKTOK: 'tiktok',
} as const;

export const PLATFORM_COLORS = {
  [SOCIAL_PLATFORMS.TWITTER]: '#1DA1F2',
  [SOCIAL_PLATFORMS.FACEBOOK]: '#4267B2',
  [SOCIAL_PLATFORMS.INSTAGRAM]: '#E4405F',
  [SOCIAL_PLATFORMS.YOUTUBE]: '#FF0000',
  [SOCIAL_PLATFORMS.TIKTOK]: '#000000',
};

export const PLATFORM_ICONS = {
  [SOCIAL_PLATFORMS.TWITTER]: '𝕏',
  [SOCIAL_PLATFORMS.FACEBOOK]: '👥',
  [SOCIAL_PLATFORMS.INSTAGRAM]: '📷',
  [SOCIAL_PLATFORMS.YOUTUBE]: '📺',
  [SOCIAL_PLATFORMS.TIKTOK]: '🎵',
};

// Sentiment types
export const SENTIMENT_TYPES = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  NEUTRAL: 'neutral',
  CONCERN: 'concern',
  PANIC: 'panic',
} as const;

export const SENTIMENT_COLORS = {
  [SENTIMENT_TYPES.POSITIVE]: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    hex: '#16a34a',
  },
  [SENTIMENT_TYPES.NEGATIVE]: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    hex: '#dc2626',
  },
  [SENTIMENT_TYPES.NEUTRAL]: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    hex: '#6b7280',
  },
  [SENTIMENT_TYPES.CONCERN]: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    hex: '#ea580c',
  },
  [SENTIMENT_TYPES.PANIC]: {
    bg: 'bg-red-200',
    text: 'text-red-900',
    hex: '#991b1b',
  },
};

// Map defaults
export const MAP_DEFAULTS = {
  CENTER: {
    INDIA: [20.5937, 78.9629] as [number, number],
    MUMBAI: [19.0760, 72.8777] as [number, number],
    CHENNAI: [13.0827, 80.2707] as [number, number],
    KOCHI: [9.9312, 76.2673] as [number, number],
  },
  ZOOM: {
    COUNTRY: 5,
    STATE: 7,
    CITY: 10,
    DETAILED: 13,
  },
  TILE_URLS: {
    OPENSTREETMAP: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    SATELLITE: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  },
};

// Time constants
export const TIME_RANGES = {
  LAST_HOUR: '1h',
  LAST_6_HOURS: '6h',
  LAST_24_HOURS: '24h',
  LAST_WEEK: '7d',
  LAST_MONTH: '30d',
} as const;

// File upload constants
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    VIDEOS: ['video/mp4', 'video/webm', 'video/ogg'],
    DOCUMENTS: ['application/pdf', 'text/plain'],
  },
  MAX_FILES: 5,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5,
};

// API timeouts
export const TIMEOUTS = {
  DEFAULT: 30000, // 30 seconds
  UPLOAD: 300000, // 5 minutes
  ANALYSIS: 60000, // 1 minute
};

// Validation constants
export const VALIDATION = {
  EMAIL_REGEX: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  TITLE_MIN_LENGTH: 5,
  DESCRIPTION_MIN_LENGTH: 10,
  COORDINATES: {
    LAT_MIN: -90,
    LAT_MAX: 90,
    LNG_MIN: -180,
    LNG_MAX: 180,
  },
};

// Emergency contacts
export const EMERGENCY_CONTACTS = {
  NATIONAL_EMERGENCY: '112',
  COAST_GUARD: '1554',
  INCOIS: '040-23886047',
  NDRF: '011-26701700',
};

// Social media thresholds
export const SOCIAL_THRESHOLDS = {
  HIGH_ENGAGEMENT: 1000,
  VIRAL_THRESHOLD: 10000,
  INFLUENCER_FOLLOWERS: 10000,
  TRENDING_MENTIONS: 100,
  CORRELATION_CONFIDENCE: 0.7,
  URGENCY_SCORE: {
    LOW: 0.3,
    MEDIUM: 0.6,
    HIGH: 0.8,
    CRITICAL: 0.9,
  },
};

// Notification types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

// WebSocket event types
export const WS_EVENTS = {
  MENTION_UPDATE: 'mention_update',
  REPORT_UPDATE: 'report_update',
  ALERT: 'alert',
  SYSTEM_STATUS: 'system_status',
  PING: 'ping',
  PONG: 'pong',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  THEME: 'theme',
  MAP_PREFERENCES: 'mapPreferences',
  NOTIFICATION_SETTINGS: 'notificationSettings',
} as const;

// Environment variables
export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  SOCIAL_API_URL: import.meta.env.VITE_SOCIAL_API_URL || 'http://localhost:3001/api/social',
  NLP_API_URL: import.meta.env.VITE_NLP_API_URL || 'http://localhost:3002/api/nlp',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws',
  APP_ENV: import.meta.env.MODE || 'development',
} as const;