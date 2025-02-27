
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import { User, Phone, Globe, LogOut, ArrowRight } from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Stats for the user
  const userStats = [
    {
      label: "Transferts",
      value: "3",
      icon: <Phone size={16} className="text-primary" />,
    },
    {
      label: "Souscriptions",
      value: "5",
      icon: <Globe size={16} className="text-accent" />,
    },
  ];
  
  const handleLogout = () => {
    logout();
  };

  return (
    <Layout>
      <div className="page-container">
        {/* Profile header */}
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-muted mb-4 flex items-center justify-center">
            <User size={40} className="text-muted-foreground" />
          </div>
          <h1 className="text-xl font-bold">{user?.phoneNumber}</h1>
          <p className="text-muted-foreground">Membre depuis Juin 2023</p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 animate-fade-in">
          {userStats.map((stat, index) => (
            <div key={index} className="glass-card rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
        
        {/* Profile actions */}
        <div className="space-y-4 animate-fade-in">
          <button className="w-full p-4 rounded-xl border border-border flex justify-between items-center hover:bg-muted/50 transition-colors">
            <span className="font-medium">Mes informations</span>
            <span className="text-muted-foreground">
              <ArrowRight size={16} />
            </span>
          </button>
          
          <button className="w-full p-4 rounded-xl border border-border flex justify-between items-center hover:bg-muted/50 transition-colors">
            <span className="font-medium">Historique des transactions</span>
            <span className="text-muted-foreground">
              <ArrowRight size={16} />
            </span>
          </button>
          
          <button className="w-full p-4 rounded-xl border border-border flex justify-between items-center hover:bg-muted/50 transition-colors">
            <span className="font-medium">Paramètres</span>
            <span className="text-muted-foreground">
              <ArrowRight size={16} />
            </span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full p-4 rounded-xl border border-border flex justify-between items-center hover:bg-destructive/10 hover:border-destructive/50 transition-colors text-destructive"
          >
            <span className="font-medium">Déconnexion</span>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
