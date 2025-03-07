
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import SplashScreen from "@/components/SplashScreen";
import LoginPage from "@/components/LoginPage";
import RegisterPage from "@/components/RegisterPage";
import OnboardingPage from "@/components/OnboardingPage";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import TransferService from "@/pages/TransferService";
import SubscriptionService from "@/pages/SubscriptionService";
import TransactionHistory from "@/pages/TransactionHistory";
import AirtimeRecharge from "@/pages/AirtimeRecharge";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/transfer" element={<TransferService />} />
          <Route path="/subscription" element={<SubscriptionService />} />
          <Route path="/history" element={<TransactionHistory />} />
          <Route path="/airtime" element={<AirtimeRecharge />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
