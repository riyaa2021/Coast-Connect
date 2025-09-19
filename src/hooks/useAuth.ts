// src/hooks/useAuth.ts
import { useAuthContext } from '../contexts/AuthContext';

const useAuth = () => {
  const context = useAuthContext();
  
  // Additional auth-related logic can be added here
  const isOfficial = context.user?.role === 'official';
  const isUser = context.user?.role === 'user';
  
  return {
    ...context,
    isOfficial,
    isUser,
  };
};

export default useAuth;