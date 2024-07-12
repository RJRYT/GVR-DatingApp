import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from "../Instance/Axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    const fetchUser = async()=> {
        console.log("[AuthContext] Token: ", token);
        if (token && token !== 'undefined') {
          try {
            const res = await axiosInstance.get("/users/me");
            console.log("[AuthContext] User: ", res);
            setUser(res.data);
          } catch (err) {
            console.log("[AuthContext] Error: ", err);
            setUser(null);
            localStorage.removeItem("token");
            setToken(null);
          }
        }
    }
    fetchUser();
  }, [token]);

  const login = (userData) => {
    setUser(userData);
  };

  const addToken = (authToken) => {
    setToken(authToken);
    localStorage.setItem("token", authToken);
  };


  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    console.log("user logout completed");
  };

  return (
    <AuthContext.Provider value={{ user, token, addToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
