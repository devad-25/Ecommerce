import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export interface AuthUser {
  id: string;
  phone: string;
  name: string;
  email: string;
  avatar_url: string;
  created_at: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string) => Promise<{ success: boolean; isNew: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "ecomstore_user_id";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const storedId = localStorage.getItem(STORAGE_KEY);
      if (storedId) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", storedId)
          .single();

        if (data && !error) {
          setUser(data as AuthUser);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  const login = async (
    phone: string,
  ): Promise<{ success: boolean; isNew: boolean; error?: string }> => {
    const normalizedPhone = phone.replace(/[^\d+]/g, "");

    // Check if user exists
    const { data: existing, error: selectError } = await supabase
      .from("users")
      .select("*")
      .eq("phone", normalizedPhone)
      .single();

    if (existing && !selectError) {
      setUser(existing as AuthUser);
      localStorage.setItem(STORAGE_KEY, existing.id);
      return { success: true, isNew: false };
    }

    // Create new user
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({ phone: normalizedPhone })
      .select()
      .single();

    if (newUser && !insertError) {
      setUser(newUser as AuthUser);
      localStorage.setItem(STORAGE_KEY, newUser.id);
      return { success: true, isNew: true };
    }

    return {
      success: false,
      isNew: false,
      error: insertError?.message || "Failed to login. Please try again.",
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    if (!user) return;

    const { error } = await supabase
      .from("users")
      .update(data)
      .eq("id", user.id);

    if (!error) {
      setUser((prev) => (prev ? { ...prev, ...data } : prev));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
