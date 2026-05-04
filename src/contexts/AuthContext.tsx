import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string;
  userName: string;
  token: string | null;
  login: (token: string, email: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userEmail: "",
  userName: "",
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("querio_token"));
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("querio_email") || "");
  const [userName, setUserName] = useState(() => localStorage.getItem("querio_name") || "");
  
  const isAuthenticated = !!token;

  useEffect(() => {
    if (token) {
      localStorage.setItem("querio_token", token);
      localStorage.setItem("querio_email", userEmail);
      localStorage.setItem("querio_name", userName);
    } else {
      localStorage.removeItem("querio_token");
      localStorage.removeItem("querio_email");
      localStorage.removeItem("querio_name");
    }
  }, [token, userEmail, userName]);

  const login = (newToken: string, email: string, name: string) => {
    setToken(newToken);
    setUserEmail(email);
    setUserName(name);
  };

  const logout = () => {
    setToken(null);
    setUserEmail("");
    setUserName("");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, userName, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
