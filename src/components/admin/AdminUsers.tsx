
import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, ChevronRight, Search, Download, Filter, 
  Check, X, Eye, BarChart3, RefreshCcw, UserCog, Ban, 
  User, Phone, Mail, MapPin, Calendar, Shield, ShieldAlert, Unlock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Types
interface UserData {
  id: string;
  phoneNumber: string;
  email?: string;
  name?: string;
  location?: string;
  status: "active" | "inactive" | "suspended" | "pending";
  role: "user" | "admin" | "moderator";
  accountType: "personal" | "business";
  registrationDate: string;
  lastLogin?: string;
  transactionCount: number;
  totalSpent: number;
  walletBalance: number;
  verificationStatus: "verified" | "unverified" | "pending";
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [suspendedUsers, setSuspendedUsers] = useState(0);
  const [selectedTab, setSelectedTab] = useState("all");
  const itemsPerPage = 10;
  const { toast } = useToast();

  // Générer des données fictives pour la démo
  useEffect(() => {
    const locations = ["Abidjan", "Bouaké", "Daloa", "Yamoussoukro", "San-Pédro", "Korhogo"];
    const statuses: Array<"active" | "inactive" | "suspended" | "pending"> = ["active", "inactive", "suspended", "pending"];
    const roles: Array<"user" | "admin" | "moderator"> = ["user", "user", "user", "user", "admin", "moderator"]; // Plus de chance d'avoir des users
    const accountTypes: Array<"personal" | "business"> = ["personal", "personal", "personal", "business"];
    const verificationStatuses: Array<"verified" | "unverified" | "pending"> = ["verified", "unverified", "pending"];
    const firstNames = ["Amadou", "Fatoumata", "Seydou", "Mariame", "Ibrahim", "Aminata", "Issouf", "Aïcha", "Moussa", "Rokia"];
    const lastNames = ["Diallo", "Touré", "Koné", "Bamba", "Ouattara", "Konaté", "Traoré", "Coulibaly", "Doumbia", "Sanogo"];
    
    const mockData: UserData[] = Array.from({ length: 50 }, (_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const transactionCount = Math.floor(Math.random() * 30);
      const totalSpent = Math.floor(Math.random() * 500000) + 5000;
      const walletBalance = Math.floor(Math.random() * 100000);
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Générer une date d'inscription aléatoire dans les 365 derniers jours
      const registrationDate = new Date();
      registrationDate.setDate(registrationDate.getDate() - Math.floor(Math.random() * 365));
      
      // Générer une date de dernière connexion plus récente
      const lastLogin = new Date();
      lastLogin.setDate(lastLogin.getDate() - Math.floor(Math.random() * 30));
      
      return {
        id: `USR${10000 + i}`,
        phoneNumber: `07${Math.floor(10000000 + Math.random() * 90000000)}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        name: `${firstName} ${lastName}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        status: status,
        role: roles[Math.floor(Math.random() * roles.length)],
        accountType: accountTypes[Math.floor(Math.random() * accountTypes.length)],
        registrationDate: registrationDate.toISOString(),
        lastLogin: status !== "inactive" ? lastLogin.toISOString() : undefined,
        transactionCount: transactionCount,
        totalSpent: totalSpent,
        walletBalance: walletBalance,
        verificationStatus: verificationStatuses[Math.floor(Math.random() * verificationStatuses.length)]
      };
    });
    
    // Trier par date d'inscription décroissante
    mockData.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
    
    // Calculer les statistiques
    const active = mockData.filter(user => user.status === "active").length;
    const suspended = mockData.filter(user => user.status === "suspended").length;
    
    setUsers(mockData);
    setFilteredUsers(mockData);
    setTotalUsers(mockData.length);
    setActiveUsers(active);
    setSuspendedUsers(suspended);
    setLoading(false);
  }, []);

  // Filtrer les utilisateurs en fonction des critères
  useEffect(() => {
    let filtered = [...users];
    
    // Appliquer le filtre par onglet
    if (selectedTab === "active") {
      filtered = filtered.filter(user => user.status === "active");
    } else if (selectedTab === "suspended") {
      filtered = filtered.filter(user => user.status === "suspended");
    } else if (selectedTab === "inactive") {
      filtered = filtered.filter(user => user.status === "inactive");
    } else if (selectedTab === "admin") {
      filtered = filtered.filter(user => user.role === "admin" || user.role === "moderator");
    }
    
    // Appliquer la recherche
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.phoneNumber.includes(searchQuery) || 
        user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Appliquer le filtre de statut spécifique
    if (statusFilter) {
      filtered = filtered.filter(user => user.status === statusFilter);
    }
    
    // Appliquer le filtre de rôle
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(filtered);
    setCurrentPage(1); // Réinitialiser à la première page après filtrage
  }, [searchQuery, statusFilter, roleFilter, users, selectedTab]);

  // Calculer les pages
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Fonctions pour la pagination
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Changement de statut utilisateur
  const changeUserStatus = (userId: string, newStatus: "active" | "inactive" | "suspended" | "pending") => {
    // Mettre à jour l'état local
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    );
    
    setUsers(updatedUsers);
    
    // Notification
    toast({
      title: "Statut mis à jour",
      description: `L'utilisateur ${userId} est maintenant ${
        newStatus === "active" ? "actif" : 
        newStatus === "inactive" ? "inactif" : 
        newStatus === "suspended" ? "suspendu" : "en attente"
      }`,
    });
  };

  // Fonction d'exportation CSV
  const exportToCSV = () => {
    toast({
      title: "Exportation en cours",
      description: "Le fichier CSV des utilisateurs sera téléchargé dans quelques instants"
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
        description: "La liste des utilisateurs a été mise à jour"
      });
    }, 800);
  };

  // Formatage de date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  // Obtenir le badge de statut avec la couleur et l'icône appropriées
  const getStatusBadge = (status: "active" | "inactive" | "suspended" | "pending") => {
    switch(status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <Check size={12} />
            Actif
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1">
            <X size={12} />
            Inactif
          </Badge>
        );
      case "suspended":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <Ban size={12} />
            Suspendu
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
            <RefreshCcw size={12} />
            En attente
          </Badge>
        );
    }
  };

  // Obtenir le badge de rôle
  const getRoleBadge = (role: "user" | "admin" | "moderator") => {
    switch(role) {
      case "admin":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1">
            <ShieldAlert size={12} />
            Admin
          </Badge>
        );
      case "moderator":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <Shield size={12} />
            Modérateur
          </Badge>
        );
      case "user":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1">
            <User size={12} />
            Utilisateur
          </Badge>
        );
    }
  };

  // Obtenir le badge de vérification
  const getVerificationBadge = (status: "verified" | "unverified" | "pending") => {
    switch(status) {
      case "verified":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <Check size={12} />
            Vérifié
          </Badge>
        );
      case "unverified":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1">
            <X size={12} />
            Non vérifié
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
            <RefreshCcw size={12} />
            En attente
          </Badge>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Total des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <Filter size={12} className="mr-1" />
                {filteredUsers.length} affichés
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Utilisateurs actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <Check size={12} className="mr-1 text-green-500" />
                {Math.round((activeUsers / totalUsers) * 100)}% du total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Comptes suspendus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suspendedUsers}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <Ban size={12} className="mr-1 text-red-500" />
                {Math.round((suspendedUsers / totalUsers) * 100)}% du total
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Onglets et filtres */}
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <TabsList className="grid grid-cols-5 w-full sm:w-auto">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="active">Actifs</TabsTrigger>
              <TabsTrigger value="inactive">Inactifs</TabsTrigger>
              <TabsTrigger value="suspended">Suspendus</TabsTrigger>
              <TabsTrigger value="admin">Admins</TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2">
              <div className="relative inline-block">
                <button 
                  className={`inline-flex items-center px-3 py-2 border rounded-md bg-background hover:bg-muted text-sm ${
                    statusFilter ? "border-primary text-primary" : "border-input"
                  }`}
                  onClick={() => setStatusFilter(statusFilter ? null : "active")}
                >
                  <Filter size={16} className="mr-2" />
                  {statusFilter ? getStatusBadge(statusFilter as any) : "Statut"}
                </button>
                <div className="absolute right-2 top-2">
                  {statusFilter && (
                    <button 
                      className="h-4 w-4 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        setStatusFilter(null);
                      }}
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="relative inline-block">
                <button 
                  className={`inline-flex items-center px-3 py-2 border rounded-md bg-background hover:bg-muted text-sm ${
                    roleFilter ? "border-primary text-primary" : "border-input"
                  }`}
                  onClick={() => setRoleFilter(roleFilter ? null : "admin")}
                >
                  <Shield size={16} className="mr-2" />
                  {roleFilter ? getRoleBadge(roleFilter as any) : "Rôle"}
                </button>
                <div className="absolute right-2 top-2">
                  {roleFilter && (
                    <button 
                      className="h-4 w-4 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRoleFilter(null);
                      }}
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Barre de recherche */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Rechercher par ID, téléphone, nom, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Tableau des utilisateurs */}
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
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground">Utilisateur</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground">Contact</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground">Localisation</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground">Statut</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground">Rôle</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground">Vérification</th>
                      <th className="py-3 px-4 text-left font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-muted-foreground">
                          Aucun utilisateur trouvé
                        </td>
                      </tr>
                    ) : (
                      currentUsers.map((user) => (
                        <tr key={user.id} className="border-t hover:bg-muted/30">
                          <td className="py-3 px-4 font-medium text-sm">{user.id}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                                <User size={16} className="text-muted-foreground" />
                              </div>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {user.accountType === "business" ? "Compte Professionnel" : "Compte Personnel"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Phone size={14} className="mr-2 text-muted-foreground" />
                                {user.phoneNumber}
                              </div>
                              {user.email && (
                                <div className="flex items-center text-sm">
                                  <Mail size={14} className="mr-2 text-muted-foreground" />
                                  {user.email}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <MapPin size={16} className="mr-2 text-muted-foreground" />
                              {user.location || "Non spécifié"}
                            </div>
                          </td>
                          <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                          <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                          <td className="py-3 px-4">{getVerificationBadge(user.verificationStatus)}</td>
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
                                  <UserCog size={16} />
                                </button>
                                
                                <div className="hidden group-hover:block absolute z-50 right-0 mt-1 bg-background border border-border rounded-md shadow-lg py-1 min-w-[160px]">
                                  <button 
                                    className="w-full text-left px-4 py-1.5 text-sm hover:bg-muted flex items-center"
                                    onClick={() => changeUserStatus(user.id, "active")}
                                  >
                                    <Check size={14} className="mr-2 text-green-500" /> Activer
                                  </button>
                                  <button 
                                    className="w-full text-left px-4 py-1.5 text-sm hover:bg-muted flex items-center"
                                    onClick={() => changeUserStatus(user.id, "suspended")}
                                  >
                                    <Ban size={14} className="mr-2 text-red-500" /> Suspendre
                                  </button>
                                  <button 
                                    className="w-full text-left px-4 py-1.5 text-sm hover:bg-muted flex items-center"
                                    onClick={() => changeUserStatus(user.id, "inactive")}
                                  >
                                    <X size={14} className="mr-2 text-gray-500" /> Désactiver
                                  </button>
                                </div>
                              </div>
                              
                              <button 
                                className="p-1 rounded-full hover:bg-muted text-primary"
                                aria-label="Réinitialiser le mot de passe"
                              >
                                <Unlock size={16} />
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
                      Affichage de {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredUsers.length)} sur {filteredUsers.length}
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

export default AdminUsers;
