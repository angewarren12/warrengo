
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./context/AuthContext";
import SplashScreen from "./components/SplashScreen";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import OnboardingPage from "./components/OnboardingPage";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import TransferService from "./pages/TransferService";
import SubscriptionService from "./pages/SubscriptionService";
import TransactionHistory from "./pages/TransactionHistory";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Import des composants d'administration
import AdminLayout from "./components/admin/AdminLayout";
import AdminIndex from "./components/admin/AdminIndex";
import AdminLoginPage from "./components/admin/AdminLoginPage";
import AdminDashboard from "./components/admin/AdminDashboard";

import "./App.css";
import { useEffect } from "react";

function App() {
  // Gestion du thème
  useEffect(() => {
    // Vérifier si le thème existe dans le localStorage
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // Appliquer le thème dark si préféré ou stocké
    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Routes principales de l'application */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<Layout />}>
            <Route path="/welcome" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transfer" element={<TransferService />} />
            <Route path="/subscription" element={<SubscriptionService />} />
            <Route path="/history" element={<TransactionHistory />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          
          {/* Routes d'administration */}
          <Route path="/admin" element={<AdminIndex />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            {/* Ajouter d'autres routes d'administration ici au besoin */}
            <Route path="users" element={<AdminDashboard />} />
            <Route path="transactions" element={<AdminDashboard />} />
            <Route path="statistics" element={<AdminDashboard />} />
            <Route path="alerts" element={<AdminDashboard />} />
            <Route path="settings" element={<AdminDashboard />} />
            <Route path="support" element={<AdminDashboard />} />
          </Route>
          
          {/* Route 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
