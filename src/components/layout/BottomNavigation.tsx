
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, User, Send, Smartphone, Clock } from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();
  
  // Déterminer si un lien est actif
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background/90 backdrop-blur-md z-40">
      <div className="flex justify-around max-w-md mx-auto">
        <NavLink
          to="/dashboard"
          className={`flex flex-col items-center justify-center p-3 ${
            isActive('/dashboard') 
              ? 'text-primary font-medium' 
              : 'text-muted-foreground'
          }`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Accueil</span>
        </NavLink>
        
        <NavLink
          to="/transfer"
          className={`flex flex-col items-center justify-center p-3 ${
            isActive('/transfer') 
              ? 'text-primary font-medium' 
              : 'text-muted-foreground'
          }`}
        >
          <Send size={20} />
          <span className="text-xs mt-1">Transfert</span>
        </NavLink>
        
        <NavLink
          to="/subscription"
          className={`flex flex-col items-center justify-center p-3 ${
            isActive('/subscription') 
              ? 'text-primary font-medium' 
              : 'text-muted-foreground'
          }`}
        >
          <Smartphone size={20} />
          <span className="text-xs mt-1">Forfaits</span>
        </NavLink>
        
        <NavLink
          to="/history"
          className={`flex flex-col items-center justify-center p-3 ${
            isActive('/history') 
              ? 'text-primary font-medium' 
              : 'text-muted-foreground'
          }`}
        >
          <Clock size={20} />
          <span className="text-xs mt-1">Historique</span>
        </NavLink>
        
        <NavLink
          to="/profile"
          className={`flex flex-col items-center justify-center p-3 ${
            isActive('/profile') 
              ? 'text-primary font-medium' 
              : 'text-muted-foreground'
          }`}
        >
          <User size={20} />
          <span className="text-xs mt-1">Profil</span>
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNavigation;
