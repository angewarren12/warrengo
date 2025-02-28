
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  Phone, 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  EyeOff, 
  Eye 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState<FormErrors>({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });
  
  const validateStep1 = () => {
    const newErrors = { ...errors };
    let valid = true;
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Le nom complet est requis";
      valid = false;
    } else {
      newErrors.fullName = "";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
      valid = false;
    } else {
      newErrors.email = "";
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Le numéro de téléphone est requis";
      valid = false;
    } else if (!/^(07|05|01)\d{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Format invalide (07, 05 ou 01 + 8 chiffres)";
      valid = false;
    } else {
      newErrors.phoneNumber = "";
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const validateStep2 = () => {
    const newErrors = { ...errors };
    let valid = true;
    
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
      valid = false;
    } else {
      newErrors.password = "";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      valid = false;
    } else {
      newErrors.confirmPassword = "";
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };
  
  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 2 && validateStep2()) {
      try {
        await register(
          formData.phoneNumber,
          formData.password,
          formData.fullName,
          formData.email
        );
        // Registration successful, navigate to login
        navigate("/login");
      } catch (error) {
        console.error("Registration error:", error);
      }
    }
  };
  
  // Animation variants
  const pageVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };
  
  // First step with personal info
  const renderStep1 = () => (
    <motion.div 
      key="step1"
      custom={-1}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full flex flex-col space-y-5"
    >
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
          <User size={16} className="text-primary" />
          Nom complet
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          className={`w-full p-4 rounded-2xl bg-background border ${
            errors.fullName 
              ? 'border-destructive focus-visible:ring-destructive/30' 
              : 'border-input focus-visible:ring-primary/20'
          } shadow-sm focus-visible:ring-4 focus-visible:outline-none transition-all`}
          placeholder="Votre nom complet"
          value={formData.fullName}
          onChange={handleChange}
        />
        {errors.fullName && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-destructive text-xs mt-1"
          >
            {errors.fullName}
          </motion.p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
          <Mail size={16} className="text-primary" />
          Adresse email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className={`w-full p-4 rounded-2xl bg-background border ${
            errors.email 
              ? 'border-destructive focus-visible:ring-destructive/30' 
              : 'border-input focus-visible:ring-primary/20'
          } shadow-sm focus-visible:ring-4 focus-visible:outline-none transition-all`}
          placeholder="exemple@email.com"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-destructive text-xs mt-1"
          >
            {errors.email}
          </motion.p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="phoneNumber" className="text-sm font-medium flex items-center gap-2">
          <Phone size={16} className="text-primary" />
          Numéro de téléphone
        </label>
        <input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          className={`w-full p-4 rounded-2xl bg-background border ${
            errors.phoneNumber 
              ? 'border-destructive focus-visible:ring-destructive/30' 
              : 'border-input focus-visible:ring-primary/20'
          } shadow-sm focus-visible:ring-4 focus-visible:outline-none transition-all`}
          placeholder="07XXXXXXXX"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        {errors.phoneNumber && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-destructive text-xs mt-1"
          >
            {errors.phoneNumber}
          </motion.p>
        )}
      </div>
      
      <motion.button
        type="button"
        onClick={handleNextStep}
        className="w-full p-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold flex items-center justify-center shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Continuer <ArrowRight size={18} className="ml-2" />
      </motion.button>
    </motion.div>
  );
  
  // Second step with password
  const renderStep2 = () => (
    <motion.div 
      key="step2"
      custom={1}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full flex flex-col space-y-5"
    >
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
          <Lock size={16} className="text-primary" />
          Mot de passe
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            className={`w-full p-4 rounded-2xl bg-background border ${
              errors.password 
                ? 'border-destructive focus-visible:ring-destructive/30' 
                : 'border-input focus-visible:ring-primary/20'
            } shadow-sm focus-visible:ring-4 focus-visible:outline-none transition-all pr-12`}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
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
            className="text-destructive text-xs mt-1"
          >
            {errors.password}
          </motion.p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
          <Check size={16} className="text-primary" />
          Confirmer le mot de passe
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            className={`w-full p-4 rounded-2xl bg-background border ${
              errors.confirmPassword 
                ? 'border-destructive focus-visible:ring-destructive/30' 
                : 'border-input focus-visible:ring-primary/20'
            } shadow-sm focus-visible:ring-4 focus-visible:outline-none transition-all pr-12`}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button 
            type="button"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-destructive text-xs mt-1"
          >
            {errors.confirmPassword}
          </motion.p>
        )}
      </div>
      
      <div className="flex gap-3 pt-4">
        <motion.button
          type="button"
          onClick={handlePrevStep}
          className="w-1/3 p-4 rounded-2xl bg-muted border border-input text-foreground font-semibold flex items-center justify-center hover:bg-muted/80 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft size={18} className="mr-2" /> Retour
        </motion.button>
        
        <motion.button
          type="submit"
          className="w-2/3 p-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold flex items-center justify-center shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
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
              Inscription en cours...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              S'inscrire <ArrowRight size={18} className="ml-2" />
            </span>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
  
  // Step indicators
  const renderStepIndicators = () => (
    <div className="flex justify-center space-x-2 mb-6">
      <motion.div 
        className={`h-2 w-${step === 1 ? "12" : "6"} rounded-full transition-all duration-300 ${
          step === 1 ? "bg-gradient-to-r from-primary to-secondary" : "bg-muted"
        }`}
        animate={{
          width: step === 1 ? 48 : 24,
          backgroundColor: step === 1 ? "#8B5CF6" : "#E2E8F0"
        }}
      />
      <motion.div 
        className={`h-2 w-${step === 2 ? "12" : "6"} rounded-full transition-all duration-300 ${
          step === 2 ? "bg-gradient-to-r from-primary to-secondary" : "bg-muted"
        }`}
        animate={{
          width: step === 2 ? 48 : 24,
          backgroundColor: step === 2 ? "#8B5CF6" : "#E2E8F0"
        }}
      />
    </div>
  );
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/30">
      <div className="flex-1 flex flex-col justify-center p-6">
        <div className="w-full max-w-md mx-auto">
          {/* Logo Section */}
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <div className="h-20 w-20 rounded-3xl flex items-center justify-center relative overflow-hidden bg-gradient-to-tr from-primary via-secondary to-destructive shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <span className="text-white font-bold text-4xl relative z-10">I</span>
            </div>
          </motion.div>
          
          {/* Header Section */}
          <motion.div 
            className="text-center mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 24 }}
          >
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Créer un compte
            </h1>
            <p className="text-muted-foreground mt-2">
              {step === 1 
                ? "Commencez par renseigner vos informations personnelles" 
                : "Sécurisez votre compte avec un mot de passe"}
            </p>
          </motion.div>
          
          {/* Step Indicators */}
          {renderStepIndicators()}
          
          {/* Form */}
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait" custom={step}>
              {step === 1 ? renderStep1() : renderStep2()}
            </AnimatePresence>
          </form>
          
          {/* Login Link */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-muted-foreground">
              Vous avez déjà un compte?{" "}
              <button 
                onClick={() => navigate("/login")}
                className="text-primary font-medium hover:underline"
              >
                Se connecter
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
