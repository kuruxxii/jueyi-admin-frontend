"use client";

import { createContext, useState, useEffect, useContext } from "react";

type AuthContext = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContext | null>(null);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check initial authentication status when the app loads
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/admin/auth/status",
          { credentials: "include" }
        );
        const result = await response.json();
        if (result.isAuthenticated) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };
    checkAuthStatus();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:4000/admin/auth/logout", {
        credentials: "include",
        method: "POST",
      });
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }
  return context;
}
