
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Phone, ArrowRight } from "lucide-react";

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ phoneNumber: "", password: "" });
  const { login, isLoading } = useAuth();

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
      await login(phoneNumber, password);
    }
  };

  return (
    <div className="page-container flex flex-col justify-center">
      <div className="glass-card rounded-xl p-8 mb-8 animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-primary"></div>
            <span className="text-white font-bold text-3xl relative z-10">I</span>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2">Bienvenue</h1>
        <p className="text-muted-foreground text-center mb-8">Connectez-vous pour continuer</p>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="text-sm font-medium">
                Numéro de téléphone
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <Phone size={16} />
                </span>
                <input
                  id="phoneNumber"
                  type="tel"
                  className={`input-field pl-10 ${errors.phoneNumber ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  placeholder="07XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                className={`input-field ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading}
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
                  Se connecter <ArrowRight size={16} className="ml-2" />
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <p className="text-center text-sm text-muted-foreground">
        Pour démonstration, utilisez n'importe quel numéro valide et un mot de passe de plus de 6 caractères.
      </p>
    </div>
  );
};

export default LoginPage;
