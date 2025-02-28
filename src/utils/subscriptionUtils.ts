
import { OPERATORS, SUBSCRIPTION_PLANS, PAYMENT_METHODS } from "@/data/subscriptionData";

// Fonction pour valider le numéro de téléphone
export const validatePhoneNumber = (number: string) => {
  // Vérification du format: doit commencer par 01, 05 ou 07 et avoir 10 chiffres au total
  const phoneRegex = /^(01|05|07)[0-9]{8}$/;
  return phoneRegex.test(number);
};

// Fonction pour valider le numéro de paiement en fonction du moyen de paiement sélectionné
export const validatePaymentNumber = (number: string, paymentMethod: string) => {
  if (paymentMethod === "pay-later") {
    return true; // Pas de validation pour "Payer plus tard"
  }
  
  // Pour Wave, seule la longueur de 10 chiffres est requise
  if (paymentMethod === "wave") {
    return /^[0-9]{10}$/.test(number);
  }
  
  // Pour les autres moyens de paiement, vérifier le préfixe spécifique
  const selectedMethod = PAYMENT_METHODS.find(method => method.id === paymentMethod);
  if (selectedMethod && selectedMethod.prefix) {
    const regex = new RegExp(`^${selectedMethod.prefix}[0-9]{8}$`);
    return regex.test(number);
  }
  
  return false;
};

// Obtenir les forfaits disponibles en fonction de l'opérateur et du type
export const getAvailablePlans = (operator: string, subscriptionType: string) => {
  if (!operator) return [];
  
  return SUBSCRIPTION_PLANS[operator]?.[subscriptionType] || [];
};

// Obtenir le préfixe du moyen de paiement actuellement sélectionné
export const getPaymentMethodPrefix = (paymentMethod: string) => {
  const selectedMethod = PAYMENT_METHODS.find(method => method.id === paymentMethod);
  return selectedMethod?.prefix || "";
};

// Obtenir le nom du moyen de paiement pour l'affichage
export const getPaymentMethodName = (paymentMethod: string) => {
  if (paymentMethod === "pay-later") {
    return "Payer plus tard";
  }
  return PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name || paymentMethod;
};

// Calculer la commission et le total
export const calculateCommissionAndTotal = (planPrice: number, commissionPercentage: number) => {
  const commissionValue = Math.round(planPrice * commissionPercentage / 100);
  const total = planPrice + commissionValue;
  return { commission: commissionValue, total };
};
