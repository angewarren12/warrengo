
import { Wifi, PhoneCall, Smartphone } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "./plansData";

// Définition des opérateurs en fonction des préfixes
export const OPERATORS: Record<string, string> = {
  "01": "Moov",
  "05": "MTN", 
  "07": "Orange"
};

// Définition des types de forfaits
export const SUBSCRIPTION_TYPES = [
  {
    id: "internet",
    name: "Pass Internet",
    iconName: "Wifi",
    description: "Forfaits data pour naviguer sur Internet"
  },
  {
    id: "call",
    name: "Pass Appel",
    iconName: "PhoneCall",
    description: "Forfaits pour appeler en toute liberté"
  }
];

// Définition des catégories de forfaits internet pour Orange
export const ORANGE_INTERNET_CATEGORIES = [
  { id: "max-it", name: "Pass Max It" },
  { id: "1-3-jours", name: "Pass 1 à 3 jours" },
  { id: "semaine", name: "Pass Semaine" },
  { id: "mois", name: "Pass Mois" },
  { id: "social", name: "Pass Social" }
];

// Définition des moyens de paiement avec leurs préfixes requis
export const PAYMENT_METHODS = [
  {
    id: "orange-money",
    name: "Orange Money",
    logo: "https://seeklogo.com/images/O/orange-money-logo-8F2AED308D-seeklogo.com.png", 
    prefix: "07",
    description: "Paiement via Orange Money"
  },
  {
    id: "moov-money",
    name: "Moov Money",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Moov_Money_Flooz.png", 
    prefix: "01",
    description: "Paiement via Moov Money"
  },
  {
    id: "mtn-money",
    name: "MTN Money",
    logo: "https://paytou.org/wp-content/uploads/2020/10/5-2.png", 
    prefix: "05",
    description: "Paiement via MTN Money"
  },
  {
    id: "wave",
    name: "Wave",
    logo: "https://yop.l-frii.com/wp-content/uploads/2025/02/WAVE-recrute-pour-ce-poste-22-fevrier-2025.png", 
    prefix: "",
    description: "Paiement via Wave"
  }
];

export { SUBSCRIPTION_PLANS };
export const COMMISSION_PERCENTAGE = 2;
