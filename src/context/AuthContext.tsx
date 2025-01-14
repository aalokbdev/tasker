import React, { createContext, useContext, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import { apiLogin } from "../services/api.ts";
import { useNavigate } from "react-router-dom";

// Define the structure of the user object
type User = {
  role: string;
  username: string;
  userId: string;
} | null;

// Define the structure of the AuthContext value
interface AuthContextType {
  user: User;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

// Create the context with a default value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return { role: payload.role, username: payload.username, userId: payload.id };
      } catch (error) {
        console.error("Invalid token:", error);
        Cookies.remove("token");
        return null;
      }
    }
    return null;
  });

  const navigate = useNavigate();

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await apiLogin(credentials);
      if (response.token) {
        Cookies.set("token", response.token);

        try {
          const payload = JSON.parse(atob(response.token.split(".")[1]));
          setUser({ role: payload.role, username: payload.username, userId: payload.id });

          if (payload.role === "Admin") {
            navigate("/admin");
          } else if (payload.role === "User") {
            navigate("/user");
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          Cookies.remove("token");
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
