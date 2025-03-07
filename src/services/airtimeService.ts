
import { LAFRICAMOBILE_CONFIG, OPERATOR_CODES, getApiUrl } from "@/config/apiConfig";

// Types pour les réponses de l'API
interface AirtimeResponse {
  status: string;
  message: string;
  data?: any;
}

// Mode de simulation pour le développement et les tests
const SIMULATION_MODE = false;

// Fonction pour simuler une réponse API (pour le développement)
const simulateApiResponse = (success: boolean): Promise<AirtimeResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (success) {
        resolve({
          status: "success",
          message: "Opération réussie (simulation)",
          data: { simulated: true }
        });
      } else {
        resolve({
          status: "error",
          message: "Échec de l'opération (simulation)"
        });
      }
    }, 1000);
  });
};

// Fonction pour déterminer le code opérateur à partir du numéro de téléphone
const getOperatorCode = (phoneNumber: string): string => {
  if (!phoneNumber || phoneNumber.length < 2) return "";
  
  // Extraire les deux premiers chiffres (après le préfixe pays si présent)
  const prefix = phoneNumber.startsWith('+') 
    ? phoneNumber.substring(4, 6) 
    : phoneNumber.substring(0, 2);
    
  return OPERATOR_CODES[prefix] || "";
};

// Service pour les opérations de recharge de crédit téléphonique
export const airtimeService = {
  // Vérifier l'éligibilité d'un numéro pour la recharge
  async checkEligibility(phoneNumber: string): Promise<AirtimeResponse> {
    // Mode simulation pour le développement
    if (SIMULATION_MODE) {
      console.log("Mode simulation activé - checkEligibility");
      return simulateApiResponse(true);
    }
    
    try {
      console.log(`Vérification du numéro: ${phoneNumber}`);
      
      // Formatage du numéro selon les besoins de l'API
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+225${phoneNumber}`;
      console.log(`Numéro formaté: ${formattedNumber}`);
      
      // Déterminer l'opérateur à partir du numéro
      const operatorCode = getOperatorCode(phoneNumber);
      console.log(`Opérateur détecté: ${operatorCode}`);
      
      const requestBody = {
        phone: formattedNumber,
        operator: operatorCode,
        accountid: LAFRICAMOBILE_CONFIG.ACCESS_KEY
      };
      
      console.log("Corps de la requête:", JSON.stringify(requestBody));
      
      const apiUrl = getApiUrl("/airtime/check");
      console.log("URL de l'API:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa(`${LAFRICAMOBILE_CONFIG.ACCESS_KEY}:${LAFRICAMOBILE_CONFIG.ACCESS_PASSWORD}`)}`,
          "Origin": window.location.origin
        },
        mode: "cors",
        body: JSON.stringify(requestBody)
      });

      console.log('Réponse brute:', response);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur API:', errorText);
        throw new Error(`Erreur API: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Données de réponse:', data);
      return data;
    } catch (error) {
      console.error("Erreur lors de la vérification d'éligibilité:", error);
      
      // Traitement spécifique pour les erreurs CORS
      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        console.log("Détection d'une erreur CORS potentielle");
        return {
          status: "error",
          message: "Problème de connexion à l'API. Vérifiez votre connexion Internet ou contactez le support."
        };
      }
      
      return {
        status: "error",
        message: "Une erreur est survenue lors de la vérification du numéro"
      };
    }
  },

  // Effectuer une recharge de crédit
  async rechargeAirtime(phoneNumber: string, amount: number, reference: string): Promise<AirtimeResponse> {
    // Mode simulation pour le développement
    if (SIMULATION_MODE) {
      console.log("Mode simulation activé - rechargeAirtime");
      return simulateApiResponse(true);
    }
    
    try {
      // Formatage du numéro selon les besoins de l'API
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+225${phoneNumber}`;
      const operatorCode = getOperatorCode(phoneNumber);
      
      console.log(`Recharge pour ${formattedNumber}, montant: ${amount}, référence: ${reference}, opérateur: ${operatorCode}`);
      
      const requestBody = {
        phone: formattedNumber,
        amount: amount,
        reference: reference,
        operator: operatorCode,
        accountid: LAFRICAMOBILE_CONFIG.ACCESS_KEY,
        callback: window.location.origin + "/airtime/callback" // URL de callback dynamique
      };
      
      console.log("Corps de la requête de recharge:", JSON.stringify(requestBody));
      
      const apiUrl = getApiUrl("/airtime/topup");
      console.log("URL de l'API pour la recharge:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa(`${LAFRICAMOBILE_CONFIG.ACCESS_KEY}:${LAFRICAMOBILE_CONFIG.ACCESS_PASSWORD}`)}`,
          "Origin": window.location.origin
        },
        mode: "cors",
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur API lors de la recharge:', errorText);
        throw new Error(`Erreur API: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Réponse de recharge:', data);
      return data;
    } catch (error) {
      console.error("Erreur lors de la recharge:", error);
      
      // Traitement spécifique pour les erreurs CORS
      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        console.log("Détection d'une erreur CORS potentielle lors de la recharge");
        return {
          status: "error",
          message: "Problème de connexion à l'API. Vérifiez votre connexion Internet ou contactez le support."
        };
      }
      
      return {
        status: "error",
        message: "Une erreur est survenue lors de la recharge"
      };
    }
  },

  // Vérifier le solde du compte
  async checkBalance(): Promise<AirtimeResponse> {
    // Mode simulation pour le développement
    if (SIMULATION_MODE) {
      console.log("Mode simulation activé - checkBalance");
      return simulateApiResponse(true);
    }
    
    try {
      const apiUrl = getApiUrl("/airtime/balance");
      console.log("URL pour vérification du solde:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Authorization": `Basic ${btoa(`${LAFRICAMOBILE_CONFIG.ACCESS_KEY}:${LAFRICAMOBILE_CONFIG.ACCESS_PASSWORD}`)}`,
          "Origin": window.location.origin
        },
        mode: "cors"
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur API lors de la vérification du solde:', errorText);
        throw new Error(`Erreur API: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Solde du compte:', data);
      return data;
    } catch (error) {
      console.error("Erreur lors de la vérification du solde:", error);
      return {
        status: "error",
        message: "Une erreur est survenue lors de la vérification du solde"
      };
    }
  },

  // Récupérer l'historique des transactions
  async getTransactionHistory(): Promise<AirtimeResponse> {
    // Mode simulation pour le développement
    if (SIMULATION_MODE) {
      console.log("Mode simulation activé - getTransactionHistory");
      return simulateApiResponse(true);
    }
    
    try {
      const apiUrl = getApiUrl("/airtime/history");
      console.log("URL pour l'historique des transactions:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Authorization": `Basic ${btoa(`${LAFRICAMOBILE_CONFIG.ACCESS_KEY}:${LAFRICAMOBILE_CONFIG.ACCESS_PASSWORD}`)}`,
          "Origin": window.location.origin
        },
        mode: "cors"
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur API lors de la récupération de l\'historique:', errorText);
        throw new Error(`Erreur API: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Historique des transactions:', data);
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique:", error);
      return {
        status: "error",
        message: "Une erreur est survenue lors de la récupération de l'historique"
      };
    }
  }
};
