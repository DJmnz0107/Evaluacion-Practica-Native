// components/config/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeoutId;
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'Usuario logueado' : 'Usuario no logueado');
      setUser(user);
      
      // Delay mínimo de 2 segundos para asegurar que se vea el splash
      timeoutId = setTimeout(() => {
        console.log('Auth loading terminado');
        setLoading(false);
      }, 2000);
    });

    // Cleanup function
    return () => {
      unsubscribe();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const value = {
    user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};