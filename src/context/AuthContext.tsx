
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type User = {
  phoneNumber: string;
  isAuthenticated: boolean;
  fullName?: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  login: (phoneNumber: string, password: string) => Promise<void>;
  register: (phoneNumber: string, password: string, fullName: string, email: string) => Promise<void>;
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

  // Mock register function - in a real app this would connect to an API
  const register = async (phoneNumber: string, password: string, fullName: string, email: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simple validation
      if (password.length < 6) {
        throw new Error("Le mot de passe doit contenir au moins 6 caractères");
      }
      
      // In a real app, you would actually create the user in your backend
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      });
      
      // Note: We don't automatically log the user in, they need to go to login page
      // This is a common pattern for most apps
      
      return Promise.resolve();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue lors de l'inscription",
      });
      return Promise.reject(error);
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
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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
