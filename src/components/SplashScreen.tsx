
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [hasSeenOnboarding] = useLocalStorage("hasSeenOnboarding", false);
  const [user] = useLocalStorage("user", null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    console.log("SplashScreen mounted");
    // Simulate loading assets
    const timer = setTimeout(() => {
      setLoaded(true);
      console.log("SplashScreen loaded set to true");
      
      const nextTimer = setTimeout(() => {
        console.log("Navigation timer triggered");
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
      <div className="relative w-full max-w-xs px-4">
        <div className={`flex flex-col items-center transition-all duration-700 ${
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}>
          {/* Logo with vibrant gradient */}
          <div className="h-24 w-24 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden bg-gradient-to-tr from-[#8B5CF6] via-[#D946EF] to-[#F97316]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <span className="text-white font-bold text-5xl relative z-10">I</span>
          </div>
          
          <h1 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#D946EF]">IvoirePay</h1>
          <p className="text-muted-foreground">Transferts & Pass mobiles</p>
        </div>
        
        {/* Loading indicator with vibrant color */}
        <div className={`mt-12 flex justify-center transition-opacity duration-300 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}>
          <div className="h-1.5 w-36 bg-muted overflow-hidden rounded-full">
            <div className="h-full w-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
