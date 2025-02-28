
import React from "react";
import { Wifi, PhoneCall } from "lucide-react";

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
    icon: <Wifi size={20} />,
    description: "Forfaits data pour naviguer sur Internet"
  },
  {
    id: "call",
    name: "Pass Appel",
    icon: <PhoneCall size={20} />,
    description: "Forfaits pour appeler en toute liberté"
  }
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

// Définition des forfaits par opérateur et type
export const SUBSCRIPTION_PLANS: Record<string, Record<string, any[]>> = {
  "Orange": {
    "internet": [
      { id: "o-i-1", name: "Pass Jour", data: "150 Mo", validity: "24h", price: 500, description: "Internet valable 24h" },
      { id: "o-i-2", name: "Pass Hebdo", data: "1 Go", validity: "7 jours", price: 2000, description: "Internet valable 7 jours" },
      { id: "o-i-3", name: "Pass Mensuel", data: "5 Go", validity: "30 jours", price: 5000, description: "Internet valable 30 jours" },
      { id: "o-i-4", name: "Pass Illimité", data: "Illimité", validity: "24h", price: 1000, description: "Internet illimité pour 24h" },
      { id: "o-i-5", name: "Pass Nuit", data: "3 Go", validity: "De 00h à 6h", price: 500, description: "Internet nocturne uniquement" }
    ],
    "call": [
      { id: "o-c-1", name: "Pass Jour", minutes: "30 min", validity: "24h", price: 500, description: "Appels valables 24h" },
      { id: "o-c-2", name: "Pass Hebdo", minutes: "120 min", validity: "7 jours", price: 2000, description: "Appels valables 7 jours" },
      { id: "o-c-3", name: "Pass Mensuel", minutes: "500 min", validity: "30 jours", price: 5000, description: "Appels valables 30 jours" },
      { id: "o-c-4", name: "Pass Famille", minutes: "60 min", validity: "24h", price: 1000, description: "Appels vers 3 numéros favoris" }
    ]
  },
  "MTN": {
    "internet": [
      { id: "m-i-1", name: "Y'ello Day", data: "200 Mo", validity: "24h", price: 500, description: "Internet valable 24h" },
      { id: "m-i-2", name: "Y'ello Week", data: "1.5 Go", validity: "7 jours", price: 2000, description: "Internet valable 7 jours" },
      { id: "m-i-3", name: "Y'ello Month", data: "6 Go", validity: "30 jours", price: 5000, description: "Internet valable 30 jours" },
      { id: "m-i-4", name: "Y'ello Max", data: "Illimité", validity: "24h", price: 1000, description: "Internet illimité pour 24h" }
    ],
    "call": [
      { id: "m-c-1", name: "MTN OneDayCalling", minutes: "45 min", validity: "24h", price: 500, description: "Appels valables 24h" },
      { id: "m-c-2", name: "MTN WeekTalk", minutes: "150 min", validity: "7 jours", price: 2000, description: "Appels valables 7 jours" },
      { id: "m-c-3", name: "MTN MonthVoice", minutes: "600 min", validity: "30 jours", price: 5000, description: "Appels valables 30 jours" }
    ]
  },
  "Moov": {
    "internet": [
      { id: "mo-i-1", name: "Moov Data Day", data: "100 Mo", validity: "24h", price: 500, description: "Internet valable 24h" },
      { id: "mo-i-2", name: "Moov Data Week", data: "800 Mo", validity: "7 jours", price: 1500, description: "Internet valable 7 jours" },
      { id: "mo-i-3", name: "Moov Data Month", data: "4 Go", validity: "30 jours", price: 5000, description: "Internet valable 30 jours" },
      { id: "mo-i-4", name: "Moov Night Surf", data: "2 Go", validity: "De 00h à 6h", price: 500, description: "Internet nocturne uniquement" }
    ],
    "call": [
      { id: "mo-c-1", name: "Moov Call Day", minutes: "25 min", validity: "24h", price: 500, description: "Appels valables 24h" },
      { id: "mo-c-2", name: "Moov Call Week", minutes: "100 min", validity: "7 jours", price: 1500, description: "Appels valables 7 jours" },
      { id: "mo-c-3", name: "Moov Call Month", minutes: "400 min", validity: "30 jours", price: 4500, description: "Appels valables 30 jours" },
      { id: "mo-c-4", name: "Moov All Network", minutes: "15 min", validity: "24h", price: 500, description: "Appels vers tous les réseaux" }
    ]
  }
};

export const COMMISSION_PERCENTAGE = 2;
