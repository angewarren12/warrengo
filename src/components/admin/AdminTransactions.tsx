
import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, ChevronRight, Search, Download, Filter, 
  Check, X, Eye, BarChart3, RefreshCcw, BanIcon, ListFilter,
  FileSpreadsheet, Calendar, CreditCard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
interface Transaction {
  id: string;
  phoneNumber: string;
  recipientPhone?: string;
  recipientName?: string;
  operator?: string;
  amount: number;
  status: "completed" | "pending" | "failed" | "refunded";
  date: string;
  paymentMethod: string;
  fee: number;
  type: "subscription" | "transfer" | "deposit" | "withdrawal";
}

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const itemsPerPage = 12;
  const { toast } = useToast();

  // Générer des données fictives pour la démo
  useEffect(() => {
    const operators = ["Orange", "MTN", "Moov"];
    const paymentMethods = ["Mobile Money", "Carte bancaire", "WarrenGo Wallet"];
    const statuses: Array<"completed" | "pending" | "failed" | "refunded"> = ["completed", "pending", "failed", "refunded"];
    const types: Array<"subscription" | "transfer" | "deposit" | "withdrawal"> = ["subscription", "transfer", "deposit", "withdrawal"];
    const names = [
      "Amadou Diallo", "Fatoumata Touré", "Seydou Koné", "Mariame Bamba", 
      "Ibrahim Ouattara", "Aminata Konaté", "Issouf Traoré", "Aïcha Coulibaly"
    ];
    
    const mockData: Transaction[] = Array.from({ length: 70 }, (_, i) => {
      const randomAmount = Math.floor(Math.random() * 19000) + 1000;
      const fee = Math.round(randomAmount * 0.02);
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      // Générer une date aléatoire dans les 30 derniers jours
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      const transaction: Transaction = {
        id: `TRX${100000 + i}`,
        phoneNumber: `07${Math.floor(10000000 + Math.random() * 90000000)}`,
        amount: randomAmount,
        status: randomStatus,
        date: date.toISOString(),
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        fee: fee,
        type: randomType
      };
      
      // Ajouter des détails spécifiques en fonction du type de transaction
      if (randomType === "subscription") {
        transaction.operator = operators[Math.floor(Math.random() * operators.length)];
      } else if (randomType === "transfer") {
        transaction.recipientPhone = `05${Math.floor(10000000 + Math.random() * 90000000)}`;
        transaction.recipientName = names[Math.floor(Math.random() * names.length)];
      }
      
      return transaction;
    });
    
    // Trier par date décroissante
    mockData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Calculer les totaux
    const total = mockData.reduce((sum, tx) => sum + tx.amount, 0);
    const fees = mockData.reduce((sum, tx) => sum + tx.fee, 0);
    
    setTransactions(mockData);
    setFilteredTransactions(mockData);
    setTotalAmount(total);
    setTotalFees(fees);
    setTotalTransactions(mockData.length);
    setLoading(false);
  }, []);

  // Filtrer les transactions en fonction de l'onglet sélectionné
  useEffect(() => {
    let filtered = [...transactions];
    
    // Appliquer le filtre par type
    if (selectedTab !== "all") {
      filtered = filtered.filter(tx => tx.type === selectedTab);
    }
    
    // Appliquer la recherche
    if (searchQuery) {
      filtered = filtered.filter(tx => 
        tx.phoneNumber.includes(searchQuery) || 
        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.recipientPhone && tx.recipientPhone.includes(searchQuery)) ||
        (tx.recipientName && tx.recipientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tx.operator && tx.operator.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Appliquer le filtre de statut
    if (statusFilter) {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }
    
    // Appliquer le filtre de type spécifique
    if (typeFilter) {
      filtered = filtered.filter(tx => tx.type === typeFilter);
    }
    
    // Appliquer le filtre de date
    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.date);
        
        if (dateRange.from && dateRange.to) {
          return txDate >= dateRange.from && txDate <= dateRange.to;
        } else if (dateRange.from) {
          return txDate >= dateRange.from;
        } else if (dateRange.to) {
          return txDate <= dateRange.to;
        }
        
        return true;
      });
    }
    
    setFilteredTransactions(filtered);
    setCurrentPage(1); // Réinitialiser à la première page après filtrage
  }, [searchQuery, statusFilter, typeFilter, dateRange, transactions, selectedTab]);

  // Calculer les pages
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  // Fonctions pour la pagination
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Changement de statut
  const changeStatus = (txId: string, newStatus: "completed" | "pending" | "failed" | "refunded") => {
    // Mettre à jour l'état local
    const updatedTransactions = transactions.map(tx => 
      tx.id === txId ? { ...tx, status: newStatus } : tx
    );
    
    setTransactions(updatedTransactions);
    
    // Notification
    toast({
      title: "Statut mis à jour",
      description: `La transaction ${txId} est maintenant ${
        newStatus === "completed" ? "complétée" : 
        newStatus === "pending" ? "en attente" : 
        newStatus === "refunded" ? "remboursée" : "échouée"
      }`,
    });
  };

  // Fonction d'exportation CSV
  const exportToCSV = () => {
    toast({
      title: "Exportation en cours",
      description: "Le fichier CSV des transactions sera téléchargé dans quelques instants"
    });
    
    // Simuler un téléchargement
    setTimeout(() => {
      toast({
        title: "Exportation terminée",
        description: "Le fichier a été téléchargé avec succès"
      });
    }, 1500);
  };

  // Fonction de rafraîchissement
  const refreshData = () => {
    setLoading(true);
    
    // Simuler un chargement
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Données actualisées",
        description: "Les transactions ont été mises à jour"
      });
    }, 800);
  };

  // Formatage de date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Obtenir le statut avec la couleur et l'icône appropriées
  const getStatusBadge = (status: "completed" | "pending" | "failed" | "refunded") => {
    switch(status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check size={12} className="mr-1" />
            Terminée
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <RefreshCcw size={12} className="mr-1" />
            En attente
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X size={12} className="mr-1" />
            Échouée
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CreditCard size={12} className="mr-1" />
            Remboursée
          </span>
        );
    }
  };

  // Obtenir l'icône pour le type de transaction
  const getTypeIcon = (type: "subscription" | "transfer" | "deposit" | "withdrawal") => {
    switch(type) {
      case "subscription":
        return <CreditCard className="text-primary" size={16} />;
      case "transfer":
        return <RefreshCcw className="text-violet-500" size={16} />;
      case "deposit":
        return <ChevronRight className="text-green-500" size={16} />;
      case "withdrawal":
        return <ChevronLeft className="text-amber-500" size={16} />;
    }
  };

  // Obtenir le libellé pour le type de transaction
  const getTypeLabel = (type: "subscription" | "transfer" | "deposit" | "withdrawal") => {
    switch(type) {
      case "subscription":
        return "Forfait";
      case "transfer":
        return "Transfert";
      case "deposit":
        return "Dépôt";
      case "withdrawal":
        return "Retrait";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gestion des Transactions</h1>
          <div className="flex space-x-2">
            <button 
              className="p-2 rounded-full hover:bg-muted"
              onClick={() => refreshData()}
              aria-label="Rafraîchir les données"
            >
              <RefreshCcw size={18} />
            </button>
            <button 
              className="p-2 rounded-full hover:bg-muted"
              onClick={() => exportToCSV()}
              aria-label="Exporter en CSV"
            >
              <FileSpreadsheet size={18} />
            </button>
          </div>
        </div>
        
        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Nombre de Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTransactions}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <Filter size={12} className="mr-1" />
                {filteredTransactions.length} affichées
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Volume Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAmount.toLocaleString()} F</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <CreditCard size={12} className="mr-1" />
                {filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0).toLocaleString()} F filtrés
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenus (Frais)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFees.toLocaleString()} F</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <BarChart3 size={12} className="mr-1" />
                {Math.round(totalFees / totalAmount * 100)}% du volume
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Onglets et filtres */}
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <TabsList className="grid grid-cols-5 w-full sm:w-auto">
              <TabsTrigger value="all">Tout</TabsTrigger>
              <TabsTrigger value="subscription">Forfaits</TabsTrigger>
              <TabsTrigger value="transfer">Transferts</TabsTrigger>
              <TabsTrigger value="deposit">Dépôts</TabsTrigger>
              <TabsTrigger value="withdrawal">Retraits</TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2">
              <button 
                className="inline-flex items-center px-3 py-2 border border-input rounded-md bg-background hover:bg-muted text-sm"
                onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
              >
                <Calendar size={16} className="mr-2" />
                Filtrer par date
              </button>
              
              <button 
                className={`inline-flex items-center px-3 py-2 border rounded-md bg-background hover:bg-muted text-sm ${
                  statusFilter ? "border-primary text-primary" : "border-input"
                }`}
                onClick={() => setStatusFilter(statusFilter ? null : "completed")}
              >
                <Filter size={16} className="mr-2" />
                {statusFilter ? getStatusBadge(statusFilter as any) : "Statut"}
                {statusFilter && (
                  <X 
                    size={16} 
                    className="ml-2 hover:text-destructive" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setStatusFilter(null);
                    }}
                  />
                )}
              </button>
            </div>
          </div>
          
          {/* Panneau de filtre par date (affiché conditionnellement) */}
          {isDateFilterOpen && (
            <div className="p-4 bg-muted/20 rounded-md mb-4 border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date de début</label>
                  <input 
                    type="date" 
                    className="w-full border border-input p-2 rounded-md bg-background"
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : null;
                      setDateRange({...dateRange, from: date});
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date de fin</label>
                  <input 
                    type="date" 
                    className="w-full border border-input p-2 rounded-md bg-background"
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : null;
                      setDateRange({...dateRange, to: date});
                    }}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button 
                  className="px-3 py-1 bg-destructive/10 text-destructive text-sm hover:bg-destructive/20 rounded-md"
                  onClick={() => {
                    setDateRange({ from: null, to: null });
                    setIsDateFilterOpen(false);
                  }}
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          )}
          
          {/* Barre de recherche */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Rechercher par ID, téléphone, nom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Tableau des transactions */}
          <div className="overflow-x-auto rounded-md border">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground">ID</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground">Date</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground">Type</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground">Détails</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground">Montant</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground">Frais</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground">Statut</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-muted-foreground">
                          Aucune transaction trouvée
                        </td>
                      </tr>
                    ) : (
                      currentTransactions.map((tx) => (
                        <tr key={tx.id} className="border-t hover:bg-muted/30">
                          <td className="py-3 px-4 font-medium text-sm">{tx.id}</td>
                          <td className="py-3 px-4 text-sm">{formatDate(tx.date)}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              {getTypeIcon(tx.type)}
                              <span className="ml-2">{getTypeLabel(tx.type)}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {tx.type === "subscription" ? (
                              <div>
                                <div className="font-medium">{tx.operator}</div>
                                <div className="text-sm text-muted-foreground">{tx.phoneNumber}</div>
                              </div>
                            ) : tx.type === "transfer" ? (
                              <div>
                                <div className="font-medium">{tx.recipientName}</div>
                                <div className="text-sm text-muted-foreground">De: {tx.phoneNumber} → À: {tx.recipientPhone}</div>
                              </div>
                            ) : (
                              <div className="text-sm">{tx.phoneNumber}</div>
                            )}
                          </td>
                          <td className="py-3 px-4 font-medium">{tx.amount.toLocaleString()} F</td>
                          <td className="py-3 px-4 text-muted-foreground">{tx.fee.toLocaleString()} F</td>
                          <td className="py-3 px-4">
                            {getStatusBadge(tx.status)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button 
                                className="p-1 rounded-full hover:bg-muted"
                                aria-label="Voir les détails"
                              >
                                <Eye size={16} />
                              </button>
                              
                              {/* Menu de changement de statut */}
                              <div className="relative group">
                                <button 
                                  className="p-1 rounded-full hover:bg-muted"
                                  aria-label="Changement de statut"
                                >
                                  <BarChart3 size={16} />
                                </button>
                                
                                <div className="hidden group-hover:block absolute z-50 right-0 mt-1 bg-background border border-border rounded-md shadow-lg py-1 min-w-[150px]">
                                  <button 
                                    className="w-full text-left px-4 py-1.5 text-sm hover:bg-muted flex items-center"
                                    onClick={() => changeStatus(tx.id, "completed")}
                                  >
                                    <Check size={14} className="mr-2 text-green-500" /> Terminée
                                  </button>
                                  <button 
                                    className="w-full text-left px-4 py-1.5 text-sm hover:bg-muted flex items-center"
                                    onClick={() => changeStatus(tx.id, "pending")}
                                  >
                                    <RefreshCcw size={14} className="mr-2 text-yellow-500" /> En attente
                                  </button>
                                  <button 
                                    className="w-full text-left px-4 py-1.5 text-sm hover:bg-muted flex items-center"
                                    onClick={() => changeStatus(tx.id, "failed")}
                                  >
                                    <X size={14} className="mr-2 text-red-500" /> Échouée
                                  </button>
                                  <button 
                                    className="w-full text-left px-4 py-1.5 text-sm hover:bg-muted flex items-center"
                                    onClick={() => changeStatus(tx.id, "refunded")}
                                  >
                                    <CreditCard size={14} className="mr-2 text-blue-500" /> Remboursée
                                  </button>
                                </div>
                              </div>
                              
                              <button 
                                className="p-1 rounded-full hover:bg-muted text-destructive"
                                aria-label="Bloquer la transaction"
                              >
                                <BanIcon size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Affichage de {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredTransactions.length)} sur {filteredTransactions.length}
                    </div>
                    <div className="flex space-x-1">
                      <button 
                        className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => 
                          page === 1 || 
                          page === totalPages || 
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        )
                        .map((page, index, array) => {
                          // Afficher "..." entre les pages non consécutives
                          const showEllipsis = index > 0 && page - array[index - 1] > 1;
                          
                          return (
                            <React.Fragment key={page}>
                              {showEllipsis && (
                                <span className="px-3 py-1.5 text-muted-foreground">...</span>
                              )}
                              <button 
                                className={`px-3 py-1.5 rounded-md ${
                                  currentPage === page 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'hover:bg-muted'
                                }`}
                                onClick={() => goToPage(page)}
                              >
                                {page}
                              </button>
                            </React.Fragment>
                          );
                        })
                      }
                      
                      <button 
                        className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminTransactions;
