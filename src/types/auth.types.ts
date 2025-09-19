export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'official';
  createdAt: string;
  updatedAt?: string;
  isVerified: boolean;
  phone?: string;
  organization?: string;
  profilePicture?: string;
  lastLoginAt?: string;
}

export type UserRole = 'user' | 'official';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: 'user' | 'official';
  phone?: string;
  organization?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser?: (user: Partial<User>) => void;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  timestamp?: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Form validation types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  phone?: string;
  organization?: string;
}

// Error types
export interface AuthError {
  message: string;
  field?: string;
  code?: string;
}

export interface ValidationErrors {
  [key: string]: string[];
}
