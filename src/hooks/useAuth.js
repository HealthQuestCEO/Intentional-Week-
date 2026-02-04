import { useState, useEffect, useContext, createContext } from 'react';
import { onAuthChange, signInWithGoogle, signOut } from '../services/firebase';
import { initializeUserData } from '../services/storage';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthProvider() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      if (authUser) {
        // Initialize user data in storage
        initializeUserData(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    setError(null);
    const result = await signInWithGoogle();
    if (result.error) {
      setError(result.error);
    }
    return result;
  };

  const logout = async () => {
    setError(null);
    const result = await signOut();
    if (result.error) {
      setError(result.error);
    }
    return result;
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };
}

export { AuthContext };
