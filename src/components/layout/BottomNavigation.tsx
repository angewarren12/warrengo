
import { useNavigate, useLocation } from "react-router-dom";
import { Globe, Phone, User } from "lucide-react";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    {
      label: "Services",
      path: "/services",
      icon: <Globe size={20} />,
    },
    {
      label: "Accueil",
      path: "/dashboard",
      icon: <Phone size={20} />,
    },
    {
      label: "Profil",
      path: "/profile",
      icon: <User size={20} />,
    },
  ];
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-t border-border">
      <nav className="h-16 flex items-center justify-around">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center space-y-1 w-1/3 h-full transition-all duration-300 ${
              isActive(item.path)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="relative">
              {item.icon}
              {isActive(item.path) && (
                <span className="absolute -bottom-1 left-1/2 w-1 h-1 bg-primary rounded-full transform -translate-x-1/2"></span>
              )}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default BottomNavigation;
