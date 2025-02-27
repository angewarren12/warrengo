
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SplashScreen from "@/components/SplashScreen";
import OnboardingPage from "@/components/OnboardingPage";
import LoginPage from "@/components/LoginPage";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding] = useLocalStorage("hasSeenOnboarding", false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user?.isAuthenticated) {
      navigate("/dashboard");
      return;
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      if (hasSeenOnboarding) {
        setShowLogin(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [hasSeenOnboarding, navigate, user]);
  
  if (isLoading) {
    return <SplashScreen />;
  }
  
  if (showLogin) {
    return <LoginPage />;
  }
  
  return <OnboardingPage />;
};

export default Index;
