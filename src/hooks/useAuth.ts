import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('localStorage访问错误', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, isAuthenticated };
};