
"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


const checkUserStatus = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      method: 'GET',
      credentials: 'include', 
    });

    if (response.ok) {
      const userData = await response.json();
      setUser(userData); 
    } else {
      setUser(null); 
    }
  } catch (error) {
    console.error("İstifadəçi statusu yoxlanarkən xəta:", error);
    setUser(null);
  } finally {
    setLoading(false); 
  };
};

  useEffect(() => {
    checkUserStatus();  
  }, []);

  async function login(email, password) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    setUser(await res.json()); 
  }

  async function logout() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  }

  const value = { user, isAuthenticated: !!user, loading, login, logout }; 

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
