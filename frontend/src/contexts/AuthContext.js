import React, { createContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../Instance/Axios";
import { toast } from "react-toastify";

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
    } catch (error) {
      setAuthState({ isAuthenticated: false, user: null });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const logout = async () => {
    try {
      setAuthState({ isAuthenticated: false, user: null });
      await axiosInstance.post("/auth/logout");
      toast.warning("Logout completed");
      window.history.location = "/login";
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
