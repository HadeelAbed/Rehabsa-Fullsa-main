import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  registeredUsers: User[];
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("dashboard_user");
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { /* ignore */ }
    }
    const regRaw = localStorage.getItem("registered_users");
    if (regRaw) {
      try { setRegisteredUsers(JSON.parse(regRaw)); } catch { /* ignore */ }
    }
  }, []);

  const login = async (email: string, _password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users: User[] = JSON.parse(localStorage.getItem("registered_users") || "[]");
    const found = users.find(u => u.email === email);
    const name = found?.name || email.split("@")[0] || "User";
    const userData: User = { name, email };
    localStorage.setItem("dashboard_user", JSON.stringify(userData));
    setUser(userData);
    setRegisteredUsers(users);
  };

  const register = async (name: string, email: string, _password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const users: User[] = JSON.parse(localStorage.getItem("registered_users") || "[]");
    users.push({ name, email });
    localStorage.setItem("registered_users", JSON.stringify(users));
    setRegisteredUsers(users);
  };

  const logout = () => {
    localStorage.removeItem("dashboard_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, registeredUsers, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
