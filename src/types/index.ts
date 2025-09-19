// src/types/index.ts
// Auth types
export type {
  User,
  UserRole,
  LoginCredentials,
  SignupData,
  AuthState,
  AuthContextType,
  AuthResponse
} from './auth.types';

// Report types
export type {
  Location,
  HazardType,
  SeverityLevel,
  ReportStatus,
  SocialMentionsData,
  SocialCorrelationData,
  HazardReport,
  CreateReportData,
  ReportVerification,
  ReportFilters,
  ReportsContextType,
  ReportStats,
  ReportResponse
} from './report.types';

// Social types
export type {
  SocialPlatform,
  SentimentType,
  TrendDirection,
  SocialMention,
  SocialMetrics,
  SocialCorrelation,
  SocialSearchParams,
  SocialContextType,
  SocialApiResponse,
  SocialAnalysisResult,
  NLPAnalysisRequest,
  NLPAnalysisResponse
} from './social.types';

// Map types
export type {
  MapPosition,
  MapBounds,
  MapMarkerData,
  MapCluster,
  MapFilterOptions,
  MapLayer,
  HeatmapDataPoint,
  MapContext,
  MapHooks
} from './map.types';

// Common utility types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  timestamp?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
  timestamp: string;
}

// Generic form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'file' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => string | null;
  };
  options?: Array<{ value: string; label: string }>;
}

// File upload types
export interface FileUpload {
  file: File;
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadProgress?: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

// Theme types
export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    text: string;
  };
  darkMode: boolean;
}

// Environment types
export interface EnvConfig {
  API_URL: string;
  SOCIAL_API_URL: string;
  NLP_API_URL: string;
  WS_URL: string;
  APP_ENV: 'development' | 'staging' | 'production';
  APP_VERSION: string;
  SENTRY_DSN?: string;
  ANALYTICS_ID?: string;
}