import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, logoutUser as logoutApi } from "../api/auth.js";
import React from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res?.data) setUser(res.data);
      })
      .catch(() => {
        setUser(null); // session expired or not logged in — just clear user
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    try {
      await logoutApi();
    } catch {} // don't block logout even if API fails
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);