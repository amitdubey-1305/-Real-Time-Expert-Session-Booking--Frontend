import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data.data);
        } catch (error) {
          console.error("Auth check failed", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.data);
  };

  const register = async (name, email, phone, password) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { name, email, phone, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
