import React, { createContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../Instance/Axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/users/me");
      setAuthState({ isAuthenticated: true, user: response.data });
      console.log("[AuthContext] User: ", response);
    } catch (error) {
      setAuthState({ isAuthenticated: false, user: null });
      console.log("[AuthContext] Error: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      window.history.location = "/login";
      setAuthState({ isAuthenticated: false, user: null });
      console.log("user logout completed");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ authState, checkAuthStatus, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
