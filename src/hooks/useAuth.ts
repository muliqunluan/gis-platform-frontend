import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      // 同时检查 cookie 和 localStorage
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
        || localStorage.getItem('token');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('认证检查错误', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, isAuthenticated };
};