
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
      console.log(`Vérification du numéro: ${phoneNumber}`);
      
      // Formatage du numéro selon les besoins de l'API (peut nécessiter un préfixe pays)
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+225${phoneNumber}`;
      console.log(`Numéro formaté: ${formattedNumber}`);
      
      const response = await fetch(`${LAFRICAMOBILE_CONFIG.BASE_URL}/airtime/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa(`${LAFRICAMOBILE_CONFIG.ACCESS_KEY}:${LAFRICAMOBILE_CONFIG.ACCESS_PASSWORD}`)}`
        },
        body: JSON.stringify({
          phone: formattedNumber
        })
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
      return {
        status: "error",
        message: "Une erreur est survenue lors de la vérification du numéro"
      };
    }
  },

  // Effectuer une recharge de crédit
  async rechargeAirtime(phoneNumber: string, amount: number, reference: string): Promise<AirtimeResponse> {
    try {
      // Formatage du numéro selon les besoins de l'API
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+225${phoneNumber}`;
      
      console.log(`Recharge pour ${formattedNumber}, montant: ${amount}, référence: ${reference}`);
      
      const response = await fetch(`${LAFRICAMOBILE_CONFIG.BASE_URL}/airtime/topup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa(`${LAFRICAMOBILE_CONFIG.ACCESS_KEY}:${LAFRICAMOBILE_CONFIG.ACCESS_PASSWORD}`)}`
        },
        body: JSON.stringify({
          phone: formattedNumber,
          amount: amount,
          reference: reference
        })
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
    try {
      const response = await fetch(`${LAFRICAMOBILE_CONFIG.BASE_URL}/airtime/history`, {
        method: "GET",
        headers: {
          "Authorization": `Basic ${btoa(`${LAFRICAMOBILE_CONFIG.ACCESS_KEY}:${LAFRICAMOBILE_CONFIG.ACCESS_PASSWORD}`)}`
        }
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
