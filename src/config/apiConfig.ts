
export const LAFRICAMOBILE_CONFIG = {
  ACCESS_KEY: "WARRENGO_01",
  ACCESS_PASSWORD: "wMCPIQ4hw8hiYNN",
  BASE_URL: "https://api.lafricamobile.com/v1",
  // Utiliser un proxy CORS en mode développement si nécessaire
  USE_CORS_PROXY: true,
  CORS_PROXY_URL: "https://cors-anywhere.herokuapp.com/"
};

// Codes des opérateurs selon la documentation LAfricaMobile
export const OPERATOR_CODES = {
  "01": "MOOV", // Code pour Moov
  "05": "MTN",  // Code pour MTN
  "07": "ORANGE" // Code pour Orange
};

// Fonction pour obtenir l'URL de l'API avec ou sans proxy CORS
export const getApiUrl = (endpoint: string): string => {
  if (LAFRICAMOBILE_CONFIG.USE_CORS_PROXY) {
    return `${LAFRICAMOBILE_CONFIG.CORS_PROXY_URL}${LAFRICAMOBILE_CONFIG.BASE_URL}${endpoint}`;
  }
  return `${LAFRICAMOBILE_CONFIG.BASE_URL}${endpoint}`;
};
