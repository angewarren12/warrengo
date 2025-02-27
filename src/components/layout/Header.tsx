
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check if dark mode is enabled by user preference or stored setting
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Logo */}
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-xl">I</span>
          </div>
          <h1 className="font-semibold text-lg">IvoirePay</h1>
        </div>
        
        {/* User and dark mode toggle */}
        <div className="flex items-center space-x-3">
          {user?.isAuthenticated && (
            <div className="text-sm mr-2">
              {user.phoneNumber}
            </div>
          )}
          
          <button
            onClick={toggleDarkMode}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors duration-200"
            aria-label={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
          >
            {isDarkMode ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
