
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import SplashScreen from "@/components/SplashScreen";
import OnboardingPage from "@/components/OnboardingPage";
import LoginPage from "@/components/LoginPage";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";

// Pages
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import TransferService from "@/pages/TransferService";
import SubscriptionService from "@/pages/SubscriptionService";
import TransactionHistory from "@/pages/TransactionHistory"; // Ajout de la nouvelle page

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage("hasSeenOnboarding", false);
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage("isLoggedIn", false);

  useEffect(() => {
    // Afficher l'écran de démarrage pendant 2 secondes
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleOnboardingComplete = () => {
    setHasSeenOnboarding(true);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Afficher l'écran de démarrage
  if (showSplash) {
    return <SplashScreen />;
  }

  // Afficher l'onboarding si l'utilisateur ne l'a pas encore vu
  if (!hasSeenOnboarding) {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  // Afficher la page de connexion si l'utilisateur n'est pas connecté
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <TooltipProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/transfer" element={<TransferService />} />
              <Route path="/subscription" element={<SubscriptionService />} />
              <Route path="/history" element={<TransactionHistory />} /> {/* Nouvelle route pour l'historique */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Router>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
