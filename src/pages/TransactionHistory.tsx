
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ChevronDown, ChevronUp, ArrowDown, Calendar, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

// Données temporaires pour les transactions
const mockTransactions = [
  {
    id: "TRX723491",
    date: "2023-05-12T10:45:00",
    type: "subscription",
    amount: 2000,
    status: "success",
    details: {
      operator: "Orange",
      phoneNumber: "0712345678",
      planName: "Pass Semaine 1000F",
      planType: "internet"
    }
  },
  {
    id: "TRX723492",
    date: "2023-05-10T14:20:00",
    type: "subscription",
    amount: 5000,
    status: "success",
    details: {
      operator: "MTN",
      phoneNumber: "0512345678",
      planName: "MTN MonthVoice",
      planType: "call"
    }
  },
  {
    id: "TRX723493",
    date: "2023-05-08T09:30:00",
    type: "transfer",
    amount: 10000,
    status: "success",
    details: {
      recipient: "Amadou Koné",
      phoneNumber: "0712345679"
    }
  },
  {
    id: "TRX723494",
    date: "2023-05-05T17:15:00",
    type: "subscription",
    amount: 500,
    status: "failed",
    details: {
      operator: "Moov",
      phoneNumber: "0112345678",
      planName: "Moov Call Day",
      planType: "call"
    }
  },
  {
    id: "TRX723495",
    date: "2023-05-03T12:00:00",
    type: "transfer",
    amount: 5000,
    status: "success",
    details: {
      recipient: "Fatou Touré",
      phoneNumber: "0512345680"
    }
  },
  {
    id: "TRX723496",
    date: "2023-05-01T08:45:00",
    type: "subscription",
    amount: 3000,
    status: "success",
    details: {
      operator: "Orange",
      phoneNumber: "0712345680",
      planName: "Pass Mois 3000F",
      planType: "internet"
    }
  },
  {
    id: "TRX723497",
    date: "2023-04-28T14:30:00",
    type: "transfer",
    amount: 20000,
    status: "success",
    details: {
      recipient: "Youssouf Bamba",
      phoneNumber: "0512345681"
    }
  },
  {
    id: "TRX723498",
    date: "2023-04-25T11:20:00",
    type: "subscription",
    amount: 300,
    status: "success",
    details: {
      operator: "Orange",
      phoneNumber: "0712345682",
      planName: "Pass Max It 300F",
      planType: "internet"
    }
  }
];

// Interface pour les transactions
interface Transaction {
  id: string;
  date: string;
  type: "subscription" | "transfer";
  amount: number;
  status: "success" | "failed" | "pending";
  details: any;
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedTrx, setExpandedTrx] = useState<string | null>(null);
  const navigate = useNavigate();

  // Filtrer les transactions en fonction du type
  useEffect(() => {
    if (filter === "all") {
      setTransactions(mockTransactions);
    } else {
      setTransactions(mockTransactions.filter(trx => trx.type === filter));
    }
  }, [filter]);

  // Filtrer les transactions en fonction de la recherche
  useEffect(() => {
    if (searchQuery.trim() === "") {
      // Si pas de recherche, juste appliquer le filtre de type
      if (filter === "all") {
        setTransactions(mockTransactions);
      } else {
        setTransactions(mockTransactions.filter(trx => trx.type === filter));
      }
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = mockTransactions.filter(trx => {
        // Filtrer d'abord par type si nécessaire
        if (filter !== "all" && trx.type !== filter) return false;
        
        // Puis filtrer par recherche
        return (
          trx.id.toLowerCase().includes(query) ||
          (trx.type === "subscription" && 
            (trx.details.phoneNumber.includes(query) || 
             trx.details.planName.toLowerCase().includes(query))) ||
          (trx.type === "transfer" && 
            (trx.details.recipient.toLowerCase().includes(query) || 
             trx.details.phoneNumber.includes(query)))
        );
      });
      
      setTransactions(filtered);
    }
  }, [searchQuery, filter]);

  // Formater le prix
  const formatPrice = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Formater la date en format lisible
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatage court de la date (pour les groupes)
  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      month: 'long', 
      day: 'numeric'
    });
  };

  // Déterminer si une transaction appartient à aujourd'hui
  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Déterminer si une transaction appartient à hier
  const isYesterday = (dateString: string) => {
    const date = new Date(dateString);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();
  };

  // Trier et grouper les transactions par date
  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const groups: { [key: string]: Transaction[] } = {};
    
    transactions.forEach(trx => {
      let groupKey = "";
      
      if (isToday(trx.date)) {
        groupKey = "Aujourd'hui";
      } else if (isYesterday(trx.date)) {
        groupKey = "Hier";
      } else {
        groupKey = formatShortDate(trx.date);
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      
      groups[groupKey].push(trx);
    });
    
    return groups;
  };

  // Obtenir les groupes de transactions
  const transactionGroups = groupTransactionsByDate(transactions);

  return (
    <Layout>
      <div className="page-container pt-4 pb-24">
        <h1 className="text-xl font-bold mb-6">Historique des transactions</h1>
        
        {/* Barre de recherche et filtres */}
        <div className="mb-5 space-y-3">
          <div className="flex items-center gap-2 bg-muted/30 border rounded-lg p-2">
            <Search size={18} className="text-muted-foreground ml-1" />
            <input
              type="text"
              placeholder="Rechercher une transaction..."
              className="bg-transparent border-none w-full focus:outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted/80"
            >
              <Filter size={18} className="text-muted-foreground" />
            </button>
          </div>
          
          {showFilters && (
            <div className="rounded-lg border bg-card shadow-sm p-3 animate-fade-in">
              <Tabs defaultValue={filter} onValueChange={setFilter}>
                <TabsList className="grid grid-cols-3 mb-2">
                  <TabsTrigger value="all">Tout</TabsTrigger>
                  <TabsTrigger value="subscription">Forfaits</TabsTrigger>
                  <TabsTrigger value="transfer">Transferts</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center justify-between mt-3 text-sm">
                  <button className="flex items-center gap-1 text-muted-foreground">
                    <Calendar size={16} />
                    <span>Filtrer par date</span>
                  </button>
                  <Badge variant="outline" className="gap-1 cursor-pointer">
                    <span>Statut</span>
                    <ChevronDown size={14} />
                  </Badge>
                </div>
              </Tabs>
            </div>
          )}
        </div>
        
        {/* Liste des transactions */}
        {transactions.length === 0 ? (
          <div className="text-center p-8 rounded-xl border bg-muted/20">
            <p className="text-muted-foreground">Aucune transaction trouvée</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(transactionGroups).map(([date, trxs]) => (
              <div key={date} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-1 bg-muted flex-grow rounded-full"></div>
                  <h3 className="text-sm font-medium text-muted-foreground whitespace-nowrap">{date}</h3>
                  <div className="h-1 bg-muted flex-grow rounded-full"></div>
                </div>
                
                <div className="space-y-3">
                  {trxs.map((trx) => (
                    <Card 
                      key={trx.id} 
                      className="border-muted shadow-sm overflow-hidden"
                    >
                      <CardContent className="p-0">
                        <div 
                          className="p-4 cursor-pointer"
                          onClick={() => setExpandedTrx(expandedTrx === trx.id ? null : trx.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center
                                ${trx.type === "subscription" ? "bg-primary/10" : "bg-accent/10"}`}>
                                {trx.type === "subscription" ? (
                                  <Smartphone size={20} className="text-primary" />
                                ) : (
                                  <ArrowDown size={20} className="text-accent" />
                                )}
                              </div>
                              
                              <div>
                                <h4 className="font-medium text-base">
                                  {trx.type === "subscription" 
                                    ? `Forfait ${trx.details.operator}` 
                                    : `Transfert à ${trx.details.recipient}`}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {trx.type === "subscription"
                                    ? trx.details.planName
                                    : `Vers ${trx.details.phoneNumber}`}
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <span className={`font-semibold ${trx.status === "failed" ? "text-destructive" : ""}`}>
                                -{formatPrice(trx.amount)} F
                              </span>
                              <div className="flex items-center justify-end mt-1">
                                <Badge 
                                  variant="outline"
                                  className={`text-xs ${
                                    trx.status === "success" 
                                      ? "bg-green-50 text-green-700 border-green-200" 
                                      : trx.status === "failed" 
                                        ? "bg-red-50 text-red-700 border-red-200"
                                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                  }`}
                                >
                                  {trx.status === "success" ? "Réussi" : trx.status === "failed" ? "Échoué" : "En attente"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-muted-foreground">{formatDate(trx.date)}</p>
                            {expandedTrx === trx.id ? (
                              <ChevronUp size={16} className="text-muted-foreground" />
                            ) : (
                              <ChevronDown size={16} className="text-muted-foreground" />
                            )}
                          </div>
                        </div>
                        
                        {expandedTrx === trx.id && (
                          <div className="border-t p-4 bg-muted/10 space-y-3 animate-fade-in">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">ID Transaction</span>
                              <span className="text-sm font-medium">{trx.id}</span>
                            </div>
                            
                            {trx.type === "subscription" && (
                              <>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Numéro</span>
                                  <span className="text-sm font-medium">{trx.details.phoneNumber}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Forfait</span>
                                  <span className="text-sm font-medium">{trx.details.planName}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Type</span>
                                  <span className="text-sm font-medium">
                                    {trx.details.planType === "internet" ? "Forfait Internet" : "Forfait Appel"}
                                  </span>
                                </div>
                              </>
                            )}
                            
                            {trx.type === "transfer" && (
                              <>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Destinataire</span>
                                  <span className="text-sm font-medium">{trx.details.recipient}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Numéro</span>
                                  <span className="text-sm font-medium">{trx.details.phoneNumber}</span>
                                </div>
                              </>
                            )}
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Montant</span>
                              <span className="text-sm font-medium">{formatPrice(trx.amount)} F</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Status</span>
                              <Badge 
                                variant="outline"
                                className={`text-xs ${
                                  trx.status === "success" 
                                    ? "bg-green-50 text-green-700 border-green-200" 
                                    : trx.status === "failed" 
                                      ? "bg-red-50 text-red-700 border-red-200"
                                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                }`}
                              >
                                {trx.status === "success" ? "Réussi" : trx.status === "failed" ? "Échoué" : "En attente"}
                              </Badge>
                            </div>
                            
                            <button 
                              className="w-full flex items-center justify-center gap-1 text-primary font-medium mt-3 p-2 rounded-lg border border-primary/20 hover:bg-primary/5"
                              onClick={() => navigate(`/transaction/${trx.id}`)}
                            >
                              <span>Voir les détails</span>
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TransactionHistory;
