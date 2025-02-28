
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import { User, Phone, Globe, LogOut, ArrowRight, ChevronRight, Bell, Shield, CreditCard, HelpCircle, Settings } from "lucide-react";
import { motion } from "framer-motion";

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

  // Profile menu sections
  const accountSection = [
    {
      title: "Mes informations personnelles",
      icon: <User size={18} className="text-primary" />,
      action: () => console.log("Navigate to personal info"),
    },
    {
      title: "Paramètres de notification",
      icon: <Bell size={18} className="text-blue-500" />,
      action: () => console.log("Navigate to notifications"),
    },
    {
      title: "Sécurité et confidentialité",
      icon: <Shield size={18} className="text-green-500" />,
      action: () => console.log("Navigate to security"),
    },
  ];

  const financialSection = [
    {
      title: "Méthodes de paiement",
      icon: <CreditCard size={18} className="text-violet-500" />,
      action: () => console.log("Navigate to payment methods"),
    },
    {
      title: "Historique des transactions",
      icon: <Globe size={18} className="text-orange-500" />,
      action: () => navigate("/history"),
    },
  ];

  const supportSection = [
    {
      title: "Aide et support",
      icon: <HelpCircle size={18} className="text-blue-400" />,
      action: () => console.log("Navigate to help"),
    },
    {
      title: "Paramètres de l'application",
      icon: <Settings size={18} className="text-gray-500" />,
      action: () => console.log("Navigate to settings"),
    },
  ];
  
  const handleLogout = () => {
    logout();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const MenuSection = ({ title, items }: { title: string, items: any[] }) => (
    <motion.div
      variants={itemVariants}
      className="mb-6"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-2 px-1">{title}</h3>
      <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border">
        {items.map((item, index) => (
          <motion.button
            key={index}
            whileTap={{ scale: 0.98 }}
            onClick={item.action}
            className={`w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors ${
              index !== items.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="flex items-center">
              {item.icon}
              <span className="ml-3 font-medium">{item.title}</span>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  return (
    <Layout>
      <motion.div 
        className="page-container pb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile header */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col items-center mb-8"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-4 flex items-center justify-center border-4 border-background shadow-lg">
            <User size={50} className="text-primary" />
          </div>
          <h1 className="text-xl font-bold">{user?.fullName || user?.phoneNumber}</h1>
          <p className="text-muted-foreground">Membre de WarrenGo</p>
        </motion.div>
        
        {/* Stats */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          {userStats.map((stat, index) => (
            <div key={index} className="bg-card rounded-xl p-4 text-center border border-border shadow-sm">
              <div className="flex justify-center mb-2">
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
        
        {/* Profile menu sections */}
        <MenuSection title="COMPTE" items={accountSection} />
        <MenuSection title="FINANCES" items={financialSection} />
        <MenuSection title="ASSISTANCE" items={supportSection} />
        
        {/* Logout button */}
        <motion.button 
          variants={itemVariants}
          onClick={handleLogout}
          className="w-full mt-4 p-4 rounded-xl flex items-center justify-center border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={18} className="mr-2" />
          <span className="font-medium">Déconnexion</span>
        </motion.button>
        
        <motion.div 
          variants={itemVariants}
          className="text-center mt-8"
        >
          <p className="text-xs text-muted-foreground">WarrenGo v1.0.0</p>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Profile;
