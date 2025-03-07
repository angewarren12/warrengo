
import { useState, useEffect } from "react";
import { 
  ChevronLeft, ChevronRight, Search, Download, Filter, 
  Check, X, Eye, BarChart3, ListFilter, RefreshCcw, UserCog
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Types
interface Transaction {
  id: string;
  phoneNumber: string;
  operator: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  paymentMethod: string;
  fee: number;
}

const AdminDashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [operatorFilter, setOperatorFilter] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const itemsPerPage = 10;
  const { toast } = useToast();

  // Générer des données fictives pour la démo
  useEffect(() => {
    const operators = ["Orange", "MTN", "Moov"];
    const paymentMethods = ["Mobile Money", "Carte bancaire", "WarrenGo Wallet"];
    const statuses: Array<"completed" | "pending" | "failed"> = ["completed", "pending", "failed"];
    
    const mockData: Transaction[] = Array.from({ length: 50 }, (_, i) => {
      const randomAmount = Math.floor(Math.random() * 9000) + 1000;
      const fee = Math.round(randomAmount * 0.02);
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Générer une date aléatoire dans les 30 derniers jours
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      return {
        id: `TRX${100000 + i}`,
        phoneNumber: `07${Math.floor(10000000 + Math.random() * 90000000)}`,
        operator: operators[Math.floor(Math.random() * operators.length)],
        amount: randomAmount,
        status: randomStatus,
        date: date.toISOString(),
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        fee: fee
      };
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

  // Appliquer les filtres de recherche et de statut
  useEffect(() => {
    let filtered = [...transactions];
    
    // Appliquer la recherche (sur le numéro de téléphone ou l'ID de transaction)
    if (searchQuery) {
      filtered = filtered.filter(tx => 
        tx.phoneNumber.includes(searchQuery) || 
        tx.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Appliquer le filtre de statut
    if (statusFilter) {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }
    
    // Appliquer le filtre d'opérateur
    if (operatorFilter) {
      filtered = filtered.filter(tx => tx.operator === operatorFilter);
    }
    
    setFilteredTransactions(filtered);
    setCurrentPage(1); // Réinitialiser à la première page après filtrage
  }, [searchQuery, statusFilter, operatorFilter, transactions]);

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

  // Changement de statut (pour la démo uniquement)
  const changeStatus = (txId: string, newStatus: "completed" | "pending" | "failed") => {
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
        newStatus === "pending" ? "en attente" : "échouée"
      }`,
    });
  };

  // Fonction d'exportation CSV (pour la démo)
  const exportToCSV = () => {
    toast({
      title: "Exportation en cours",
      description: "Le fichier CSV des transactions sera téléchargé dans quelques instants"
    });
    
    // Dans une application réelle, nous générerions et téléchargerions un fichier CSV ici
    setTimeout(() => {
      toast({
        title: "Exportation terminée",
        description: "Le fichier a été téléchargé avec succès"
      });
    }, 1500);
  };

  // Fonction de rafraîchissement (pour la démo)
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
  const getStatusBadge = (status: "completed" | "pending" | "failed") => {
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
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Tableau de Bord Administrateur</h1>
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
              <Download size={18} />
            </button>
          </div>
        </div>
        
        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total des Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTransactions}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredTransactions.length} affichées
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Montant Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAmount.toLocaleString()} F</div>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0).toLocaleString()} F filtrés
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total des Frais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFees.toLocaleString()} F</div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(totalFees / totalAmount * 100)}% du montant total
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Filtres et recherche */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Rechercher par numéro ou ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex space-x-2">
            <div className="relative inline-block">
              <button 
                className="inline-flex items-center px-3 py-2 border border-input rounded-md bg-background hover:bg-muted"
                onClick={() => setStatusFilter(statusFilter ? null : "completed")}
              >
                <Filter size={16} className="mr-2" />
                {statusFilter ? getStatusBadge(statusFilter as any) : "Tous les statuts"}
              </button>
              <div className="absolute right-2 top-2">
                {statusFilter && (
                  <button 
                    className="h-4 w-4 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center"
                    onClick={() => setStatusFilter(null)}
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="relative inline-block">
              <button 
                className="inline-flex items-center px-3 py-2 border border-input rounded-md bg-background hover:bg-muted"
                onClick={() => setOperatorFilter(operatorFilter ? null : "Orange")}
              >
                <ListFilter size={16} className="mr-2" />
                {operatorFilter || "Tous les opérateurs"}
              </button>
              <div className="absolute right-2 top-2">
                {operatorFilter && (
                  <button 
                    className="h-4 w-4 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center"
                    onClick={() => setOperatorFilter(null)}
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tableau des transactions */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">ID</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Date</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Numéro</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Opérateur</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Montant</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Méthode</th>
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
                    <tr key={tx.id} className="border-b hover:bg-muted/30">
                      <td className="py-3 px-4 font-medium">{tx.id}</td>
                      <td className="py-3 px-4 text-sm">{formatDate(tx.date)}</td>
                      <td className="py-3 px-4">{tx.phoneNumber}</td>
                      <td className="py-3 px-4">{tx.operator}</td>
                      <td className="py-3 px-4 font-medium">{tx.amount.toLocaleString()} F</td>
                      <td className="py-3 px-4">{tx.paymentMethod}</td>
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
                            </div>
                          </div>
                          
                          <button 
                            className="p-1 rounded-full hover:bg-muted"
                            aria-label="Gérer l'utilisateur"
                          >
                            <UserCog size={16} />
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
              <div className="flex items-center justify-between mt-4">
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
    </div>
  );
};

export default AdminDashboard;
