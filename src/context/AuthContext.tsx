
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type User = {
  phoneNumber: string;
  isAuthenticated: boolean;
};

type AuthContextType = {
  user: User | null;
  login: (phoneNumber: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>("user", null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock login function - in a real app this would connect to an API
  const login = async (phoneNumber: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simple validation - in a real app you would validate against a backend
      if (password.length < 6) {
        throw new Error("Mot de passe invalide");
      }
      
      // Set authenticated user
      setUser({
        phoneNumber,
        isAuthenticated: true
      });
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre espace",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message || "Veuillez vérifier vos identifiants",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    navigate("/");
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt!",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
