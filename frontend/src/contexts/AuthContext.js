import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from "../Instance/Axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async()=> {
        const token = localStorage.getItem("token");
        if (token) {
          setUser({ token });
          try {
            const res = await axiosInstance.get("/users/me");
            setUser(res.data);
          } catch (err) {
            console.error(err);
          }
        }
    }
    fetchUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
