
// Définition des forfaits par opérateur et type
export const SUBSCRIPTION_PLANS = {
  "Orange": {
    "internet": [
      // Pass Max It
      { 
        id: "o-max-it-300", 
        name: "Pass Max It 300F", 
        category: "max-it",
        data: "1 Go", 
        validity: "1 jour", 
        price: 300,
        iconColor: "orange",
        description: "1 Go valable 1 jour",
        isNew: true
      },
      { 
        id: "o-max-it-500", 
        name: "Pass Max It 500F 3jrs", 
        category: "max-it",
        data: "2 Go", 
        validity: "3 jours", 
        price: 500,
        iconColor: "orange",
        description: "2 Go valables 3 jours",
        isNew: true
      },
      { 
        id: "o-max-it-1000", 
        name: "Pass Max It 1000F 7jrs", 
        category: "max-it",
        data: "3 Go + 150Mo Spotify", 
        validity: "7 jours", 
        price: 1000,
        iconColor: "gray",
        description: "3 Go + bonus Spotify valables 7 jours"
      },
      
      // Pass 1 à 3 jours
      { 
        id: "o-2jrs-200", 
        name: "Pass 2jrs 200F", 
        category: "1-3-jours",
        data: "220 Mo", 
        validity: "2 jours", 
        price: 200,
        iconColor: "orange",
        description: "220 Mo valables 2 jours"
      },
      { 
        id: "o-3jrs-300", 
        name: "Pass 3jrs 300F", 
        category: "1-3-jours",
        data: "340 Mo", 
        validity: "3 jours", 
        price: 300,
        iconColor: "orange",
        description: "340 Mo valables 3 jours"
      },
      { 
        id: "o-3jrs-400-videos", 
        name: "3jours 400F - Videos People", 
        category: "1-3-jours",
        data: "340 Mo + Videos People", 
        validity: "3 jours", 
        price: 400,
        iconColor: "gray",
        description: "340 Mo + accès Videos People valables 3 jours"
      },
      { 
        id: "o-3jrs-400-waw", 
        name: "Pass 3Jours 400F", 
        category: "1-3-jours",
        data: "340 Mo + WAW MUZIK", 
        validity: "3 jours", 
        price: 400,
        iconColor: "orange",
        description: "340 Mo + WAW MUZIK valables 3 jours"
      },
      { 
        id: "o-3jrs-500", 
        name: "Pass 3jrs 500F", 
        category: "1-3-jours",
        data: "750 Mo", 
        validity: "3 jours", 
        price: 500,
        iconColor: "gray",
        description: "750 Mo valables 3 jours"
      },
      { 
        id: "o-3jrs-700", 
        name: "3jours 700F - Videos Cuisine", 
        category: "1-3-jours",
        data: "750 Mo + Videos Cuisine", 
        validity: "3 jours", 
        price: 700,
        iconColor: "gray",
        description: "750 Mo + accès Videos Cuisine valables 3 jours"
      },

      // Pass Semaine
      { 
        id: "o-semaine-800", 
        name: "Pass Semaine 800F", 
        category: "semaine",
        data: "750 Mo + WAW MUZIK", 
        validity: "7 jours", 
        price: 800,
        iconColor: "gray",
        description: "750 Mo + WAW MUZIK valables 7 jours"
      },
      { 
        id: "o-semaine-1000", 
        name: "Pass Semaine 1000F", 
        category: "semaine",
        data: "1.5 Go + 150 Mo Spotify", 
        validity: "7 jours", 
        price: 1000,
        iconColor: "gray",
        description: "1.5 Go + bonus Spotify valables 7 jours"
      },
      { 
        id: "o-semaine-1200", 
        name: "Semaine 1200F - 1.5Go + Videos Flash Foot", 
        category: "semaine",
        data: "1.5 Go + Videos Flash Foot", 
        validity: "7 jours", 
        price: 1200,
        iconColor: "gray",
        description: "1.5 Go + accès Videos Flash Foot valables 7 jours"
      },
      { 
        id: "o-semaine-1500", 
        name: "Pass Semaine 1500F", 
        category: "semaine",
        data: "2.5 Go + 150 Mo Spotify", 
        validity: "7 jours", 
        price: 1500,
        iconColor: "gray",
        description: "2.5 Go + bonus Spotify valables 7 jours"
      },

      // Pass Mois
      { 
        id: "o-mois-2500", 
        name: "Pass Mois 2500F", 
        category: "mois",
        data: "3.5 Go + 500 Mo Spotify", 
        validity: "30 jours", 
        price: 2500,
        iconColor: "gray",
        description: "3.5 Go + bonus Spotify valables 30 jours"
      },
      { 
        id: "o-mois-3000", 
        name: "Pass Mois 3000F", 
        category: "mois",
        data: "2.7 Go + WAW MUZIK", 
        validity: "30 jours", 
        price: 3000,
        iconColor: "gray",
        description: "2.7 Go + WAW MUZIK valables 30 jours"
      },
      { 
        id: "o-mois-5000", 
        name: "Pass Mois 5000F", 
        category: "mois",
        data: "7.2 Go + 500 Mo Spotify", 
        validity: "30 jours", 
        price: 5000,
        iconColor: "gray",
        description: "7.2 Go + bonus Spotify valables 30 jours"
      },
      { 
        id: "o-mois-10000", 
        name: "Pass Mois 10000F", 
        category: "mois",
        data: "15 Go + 500 Mo Spotify", 
        validity: "30 jours", 
        price: 10000,
        iconColor: "gray",
        description: "15 Go + bonus Spotify valables 30 jours"
      },
      { 
        id: "o-mois-20000", 
        name: "Pass Mois 20000F", 
        category: "mois",
        data: "36 Go + 500 Mo Spotify", 
        validity: "30 jours", 
        price: 20000,
        iconColor: "gray",
        description: "36 Go + bonus Spotify valables 30 jours"
      },

      // Pass Social
      { 
        id: "o-social-300", 
        name: "Pass Social 300F", 
        category: "social",
        data: "450 Mo pour Facebook, Instagram", 
        validity: "3 jours", 
        price: 300,
        iconColor: "gray",
        description: "450 Mo dédiés aux réseaux sociaux valables 3 jours"
      },
      { 
        id: "o-social-tiktok-300", 
        name: "Pass Social TikTok 300F", 
        category: "social",
        data: "600 Mo pour TikTok + WAW MUZIK", 
        validity: "7 jours", 
        price: 300,
        iconColor: "gray",
        description: "600 Mo dédiés à TikTok + WAW MUZIK valables 7 jours"
      }
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
