
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Phone, ArrowRight, Lock, EyeOff, Eye, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

const AdminLoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ phoneNumber: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { phoneNumber: "", password: "" };

    // Validate phone number
    if (!phoneNumber) {
      newErrors.phoneNumber = "Le numéro de téléphone est requis";
      valid = false;
    } else if (!/^(07|05|01)\d{8}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Format invalide (07, 05 ou 01 + 8 chiffres)";
      valid = false;
    }

    // Validate password
    if (!password) {
      newErrors.password = "Le mot de passe est requis";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Pour la démo, nous simulons un accès administrateur si le numéro commence par "07"
        if (phoneNumber.startsWith("07")) {
          // Rediriger vers le tableau de bord administrateur après connexion réussie
          await login(phoneNumber, password);
          navigate("/admin/dashboard");
        } else {
          throw new Error("Accès non autorisé. Seuls les administrateurs peuvent se connecter ici.");
        }
      } catch (error: any) {
        setErrors({
          ...errors,
          phoneNumber: error.message
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/30">
      <div className="flex-1 flex flex-col justify-center p-6">
        <motion.div 
          className="w-full max-w-md mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Logo Section */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <div className="h-20 w-20 rounded-3xl flex items-center justify-center relative overflow-hidden bg-gradient-to-tr from-primary via-secondary to-destructive shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <span className="text-white font-bold text-4xl relative z-10">W</span>
            </div>
          </motion.div>
          
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Panneau Administrateur
            </h1>
            <p className="text-muted-foreground mt-2 flex items-center justify-center gap-2">
              <ShieldAlert size={16} className="text-primary" />
              Accès réservé au personnel autorisé
            </p>
          </motion.div>
          
          {/* Form Section */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            variants={itemVariants}
          >
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="text-sm font-medium flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                Numéro de téléphone
              </label>
              <div className="relative">
                <input
                  id="phoneNumber"
                  type="tel"
                  className={`w-full p-4 rounded-2xl bg-background border ${
                    errors.phoneNumber 
                      ? 'border-destructive focus-visible:ring-destructive/30' 
                      : 'border-input focus-visible:ring-primary/20'
                  } shadow-sm focus-visible:ring-4 focus-visible:outline-none transition-all`}
                  placeholder="07XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              {errors.phoneNumber && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-xs mt-1 flex items-center gap-1"
                >
                  {errors.phoneNumber}
                </motion.p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <Lock size={16} className="text-primary" />
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full p-4 rounded-2xl bg-background border ${
                    errors.password 
                      ? 'border-destructive focus-visible:ring-destructive/30' 
                      : 'border-input focus-visible:ring-primary/20'
                  } shadow-sm focus-visible:ring-4 focus-visible:outline-none transition-all pr-12`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-xs mt-1 flex items-center gap-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>
            
            <motion.button
              type="submit"
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold flex items-center justify-center shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Accéder au Dashboard <ArrowRight size={18} className="ml-2" />
                </span>
              )}
            </motion.button>
          </motion.form>
          
          <motion.div 
            variants={itemVariants}
            className="mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Retour à{" "}
              <button 
                onClick={() => navigate("/")}
                className="text-primary font-medium hover:underline"
              >
                l'application client
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
