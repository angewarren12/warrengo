
import { LAFRICAMOBILE_CONFIG } from "@/config/apiConfig";

// Types pour les réponses de l'API
interface AirtimeResponse {
  status: string;
  message: string;
  data?: any;
}

// Service pour les opérations de recharge de crédit téléphonique
export const airtimeService = {
  // Vérifier l'éligibilité d'un numéro pour la recharge
  async checkEligibility(phoneNumber: string): Promise<AirtimeResponse> {
    try {
      const response = await fetch(`${LAFRICAMOBILE_CONFIG.BASE_URL}/airtime/check-eligibility`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa(`${LAFRICAMOBILE_CONFIG.ACCESS_KEY}:${LAFRICAMOBILE_CONFIG.ACCESS_PASSWORD}`)}`
        },
        body: JSON.stringify({
          phone: phoneNumber
        })
      });

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la vérification d'éligibilité:", error);
      return {
        status: "error",
        message: "Une erreur est survenue lors de la vérification du numéro"
      };
    }
  },

  // Effectuer une recharge de crédit
  async rechargeAirtime(phoneNumber: string, amount: number, reference: string): Promise<AirtimeResponse> {
    try {
      const response = await fetch(`${LAFRICAMOBILE_CONFIG.BASE_URL}/airtime/topup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa(`${LAFRICAMOBILE_CONFIG.ACCESS_KEY}:${LAFRICAMOBILE_CONFIG.ACCESS_PASSWORD}`)}`
        },
        body: JSON.stringify({
          phone: phoneNumber,
          amount: amount,
          reference: reference
        })
      });

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la recharge:", error);
      return {
        status: "error",
        message: "Une erreur est survenue lors de la recharge"
      };
    }
  },

  // Vérifier le solde du compte
  async checkBalance(): Promise<AirtimeResponse> {
    try {
      const response = await fetch(`${LAFRICAMOBILE_CONFIG.BASE_URL}/airtime/balance`, {
        method: "GET",
        headers: {
          "Authorization": `Basic ${btoa(`${LAFRICAMOBILE_CONFIG.ACCESS_KEY}:${LAFRICAMOBILE_CONFIG.ACCESS_PASSWORD}`)}`
        }
      });

      return await response.json();
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
    try {
      const response = await fetch(`${LAFRICAMOBILE_CONFIG.BASE_URL}/airtime/history`, {
        method: "GET",
        headers: {
          "Authorization": `Basic ${btoa(`${LAFRICAMOBILE_CONFIG.ACCESS_KEY}:${LAFRICAMOBILE_CONFIG.ACCESS_PASSWORD}`)}`
        }
      });

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique:", error);
      return {
        status: "error",
        message: "Une erreur est survenue lors de la récupération de l'historique"
      };
    }
  }
};
