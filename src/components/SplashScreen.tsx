import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [hasSeenOnboarding] = useLocalStorage("hasSeenOnboarding", false);
  const [user] = useLocalStorage("user", null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setLoaded(true);
      
      const nextTimer = setTimeout(() => {
        // If the user has seen onboarding and is logged in, go to dashboard
        if (hasSeenOnboarding && user?.isAuthenticated) {
          navigate("/dashboard");
        } 
        // If user has seen onboarding but is not logged in, go to login
        else if (hasSeenOnboarding) {
          navigate("/login");
        } 
        // Otherwise, go to onboarding
        else {
          navigate("/onboarding");
        }
      }, 1000); // Wait 1 second after animation completes
      
      return () => clearTimeout(nextTimer);
    }, 2000); // Show splash for 2 seconds
    
    return () => clearTimeout(timer);
  }, [navigate, hasSeenOnboarding, user]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="relative">
        <div className={`flex flex-col items-center transition-all duration-700 ${
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}>
          {/* Logo */}
          <div className="h-24 w-24 rounded-2xl bg-primary flex items-center justify-center mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-primary"></div>
            <span className="text-white font-bold text-5xl relative z-10">I</span>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">IvoirePay</h1>
          <p className="text-muted-foreground">Transferts & Pass mobiles</p>
        </div>
        
        {/* Loading indicator */}
        <div className={`mt-12 flex justify-center transition-opacity duration-300 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}>
          <div className="h-1.5 w-24 bg-muted overflow-hidden rounded-full">
            <div className="h-full bg-primary animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
