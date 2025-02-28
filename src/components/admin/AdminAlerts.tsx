
import React, { useState, useEffect } from "react";
import { 
  Bell, AlertTriangle, Info, Check, RefreshCcw, Filter, ChevronDown, 
  AlertCircle, Clock, CheckCircle, Search, X, Settings, Eye, Calendar,
  Users
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Types pour les alertes
type AlertSeverity = "critical" | "warning" | "info";
type AlertStatus = "active" | "resolved" | "investigating";
type AlertType = "system" | "security" | "transaction" | "user";

interface SystemAlert {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  severity: AlertSeverity;
  status: AlertStatus;
  type: AlertType;
  source?: string;
  affectedComponents?: string[];
  resolvedAt?: string;
  assigned?: string;
}

const AdminAlerts = () => {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | null>(null);
  const [typeFilter, setTypeFilter] = useState<AlertType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Générer des données fictives pour la démo
  useEffect(() => {
    const alertTypes: AlertType[] = ["system", "security", "transaction", "user"];
    const severityLevels: AlertSeverity[] = ["critical", "warning", "info"];
    const statusOptions: AlertStatus[] = ["active", "resolved", "investigating"];
    
    const systemComponents = [
      "API Gateway", "Base de données", "Système de paiement", 
      "Service d'authentification", "Service de notification"
    ];
    
    const alertTitles = [
      {
        system: [
          "Échec de la sauvegarde de la base de données", 
          "Temps de réponse de l'API élevé", 
          "Erreur du serveur d'application",
          "Capacité du stockage presque atteinte",
          "Service indisponible"
        ],
        security: [
          "Tentatives d'authentification multiples échouées", 
          "Activité suspecte détectée", 
          "Vulnérabilité de sécurité identifiée",
          "Tentative d'accès non autorisé",
          "Mise à jour de sécurité critique requise"
        ],
        transaction: [
          "Taux d'échec de transaction élevé", 
          "Retards dans le traitement des paiements", 
          "Anomalie dans les volumes de transaction",
          "Erreur récurrente de paiement",
          "Problème de conciliation des paiements"
        ],
        user: [
          "Activité suspecte sur le compte utilisateur", 
          "Pics inhabituels d'inscriptions", 
          "Comportement anormal d'utilisateur détecté",
          "Compte utilisateur potentiellement compromis",
          "Utilisation abusive détectée"
        ]
      }
    ];
    
    // Générer des alertes aléatoires
    const mockAlerts: SystemAlert[] = Array.from({ length: 30 }, (_, i) => {
      // Générer un timestamp dans les 7 derniers jours
      const now = new Date();
      const timestamp = new Date(
        now.getTime() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
      ).toISOString();
      
      const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      
      // Choisir un titre en fonction du type
      const titles = alertTitles[0][type];
      const title = titles[Math.floor(Math.random() * titles.length)];
      
      // Description générique basée sur le titre
      const description = `Alerte ${severity === "critical" ? "critique" : 
        severity === "warning" ? "importante" : "informative"} concernant ${title.toLowerCase()}.`;
      
      // Composants affectés (seulement pour les alertes système)
      const affectedComponents = type === "system" 
        ? [
            systemComponents[Math.floor(Math.random() * systemComponents.length)],
            systemComponents[Math.floor(Math.random() * systemComponents.length)]
          ].filter((v, i, a) => a.indexOf(v) === i) // Éliminer les doublons
        : undefined;
      
      // Date de résolution (seulement pour les alertes résolues)
      const resolvedAt = status === "resolved" 
        ? new Date(
            new Date(timestamp).getTime() + Math.floor(Math.random() * 12 * 60 * 60 * 1000)
          ).toISOString()
        : undefined;
        
      return {
        id: `ALT${10000 + i}`,
        title,
        description,
        timestamp,
        severity,
        status,
        type,
        source: type === "system" ? "Système de monitoring" : 
                type === "security" ? "Service de sécurité" : 
                type === "transaction" ? "Module de paiement" : "Analyse comportementale",
        affectedComponents,
        resolvedAt,
        assigned: status !== "resolved" ? "Équipe technique" : undefined
      };
    });
    
    // Trier les alertes par timestamp (les plus récentes d'abord)
    mockAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    setAlerts(mockAlerts);
    setFilteredAlerts(mockAlerts);
    setLoading(false);
  }, []);

  // Filtrer les alertes
  useEffect(() => {
    let filtered = [...alerts];
    
    // Filtrer par onglet
    if (selectedTab === "active") {
      filtered = filtered.filter(alert => alert.status === "active");
    } else if (selectedTab === "investigating") {
      filtered = filtered.filter(alert => alert.status === "investigating");
    } else if (selectedTab === "resolved") {
      filtered = filtered.filter(alert => alert.status === "resolved");
    }
    
    // Filtrer par sévérité
    if (severityFilter) {
      filtered = filtered.filter(alert => alert.severity === severityFilter);
    }
    
    // Filtrer par type
    if (typeFilter) {
      filtered = filtered.filter(alert => alert.type === typeFilter);
    }
    
    // Filtrer par recherche
    if (searchQuery) {
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredAlerts(filtered);
  }, [selectedTab, severityFilter, typeFilter, searchQuery, alerts]);

  // Rafraîchir les données
  const refreshData = () => {
    setLoading(true);
    
    // Simuler un chargement
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Données actualisées",
        description: "Les alertes ont été mises à jour avec succès"
      });
    }, 800);
  };

  // Mettre à jour le statut d'une alerte
  const updateAlertStatus = (alertId: string, newStatus: AlertStatus) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === alertId 
        ? { 
            ...alert, 
            status: newStatus, 
            resolvedAt: newStatus === "resolved" ? new Date().toISOString() : alert.resolvedAt 
          } 
        : alert
    );
    
    setAlerts(updatedAlerts);
    
    toast({
      title: "Statut mis à jour",
      description: `L'alerte ${alertId} est maintenant ${
        newStatus === "active" ? "active" : 
        newStatus === "resolved" ? "résolue" : "en cours d'investigation"
      }`
    });
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

  // Afficher l'icône de sévérité
  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  // Afficher le badge de statut
  const getStatusBadge = (status: AlertStatus) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Active
          </Badge>
        );
      case "investigating":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            En cours d'investigation
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Résolue
          </Badge>
        );
    }
  };

  // Afficher le badge de type
  const getTypeBadge = (type: AlertType) => {
    switch (type) {
      case "system":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Système
          </Badge>
        );
      case "security":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Sécurité
          </Badge>
        );
      case "transaction":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Transaction
          </Badge>
        );
      case "user":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Utilisateur
          </Badge>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Centre d'Alertes</h1>
          <div className="flex space-x-2">
            <button 
              className="p-2 rounded-full hover:bg-muted"
              onClick={refreshData}
              aria-label="Rafraîchir les alertes"
            >
              <RefreshCcw size={18} />
            </button>
            <button 
              className="p-2 rounded-full hover:bg-muted"
              aria-label="Paramètres des alertes"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Résumé des alertes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Alertes actives</p>
                <p className="text-2xl font-bold">
                  {alerts.filter(a => a.status === "active").length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">En investigation</p>
                <p className="text-2xl font-bold">
                  {alerts.filter(a => a.status === "investigating").length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Résolues (7j)</p>
                <p className="text-2xl font-bold">
                  {alerts.filter(a => a.status === "resolved").length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets et filtres */}
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <TabsList className="grid grid-cols-4 w-full sm:w-auto">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="active">Actives</TabsTrigger>
              <TabsTrigger value="investigating">En cours</TabsTrigger>
              <TabsTrigger value="resolved">Résolues</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-wrap gap-2">
              <div className="relative inline-block">
                <button 
                  className={`inline-flex items-center px-3 py-2 border rounded-md bg-background hover:bg-muted text-sm ${
                    severityFilter ? "border-primary text-primary" : "border-input"
                  }`}
                  onClick={() => setSeverityFilter(severityFilter ? null : "critical")}
                >
                  <AlertTriangle size={16} className="mr-2" />
                  {severityFilter ? `Sévérité: ${
                    severityFilter === "critical" ? "Critique" : 
                    severityFilter === "warning" ? "Avertissement" : "Info"
                  }` : "Sévérité"}
                  {severityFilter && (
                    <button 
                      className="ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSeverityFilter(null);
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </button>
              </div>
              
              <div className="relative inline-block">
                <button 
                  className={`inline-flex items-center px-3 py-2 border rounded-md bg-background hover:bg-muted text-sm ${
                    typeFilter ? "border-primary text-primary" : "border-input"
                  }`}
                  onClick={() => setTypeFilter(typeFilter ? null : "system")}
                >
                  <Filter size={16} className="mr-2" />
                  {typeFilter ? `Type: ${
                    typeFilter === "system" ? "Système" : 
                    typeFilter === "security" ? "Sécurité" : 
                    typeFilter === "transaction" ? "Transaction" : "Utilisateur"
                  }` : "Type"}
                  {typeFilter && (
                    <button 
                      className="ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTypeFilter(null);
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </button>
              </div>
              
              <button className="inline-flex items-center px-3 py-2 border border-input rounded-md bg-background hover:bg-muted text-sm">
                <Calendar size={16} className="mr-2" />
                Date
                <ChevronDown size={16} className="ml-2" />
              </button>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Rechercher dans les alertes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Liste des alertes */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Aucune alerte trouvée</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Il n'y a pas d'alertes correspondant à vos critères de recherche.
                </p>
                <Button 
                  className="mt-4"
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSeverityFilter(null);
                    setTypeFilter(null);
                    setSelectedTab("all");
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <Card key={alert.id} className={`border-l-4 ${
                  alert.severity === "critical" ? "border-l-red-500" : 
                  alert.severity === "warning" ? "border-l-amber-500" : "border-l-blue-500"
                }`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(alert.severity)}
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold">{alert.title}</h3>
                              <span className="text-xs text-muted-foreground">{alert.id}</span>
                              {getStatusBadge(alert.status)}
                              {getTypeBadge(alert.type)}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                            
                            {alert.affectedComponents && (
                              <div className="mt-2">
                                <p className="text-xs font-medium">Composants affectés:</p>
                                <div className="flex gap-1 mt-1 flex-wrap">
                                  {alert.affectedComponents.map((component, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {component}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                              <span className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                Détectée: {formatDate(alert.timestamp)}
                              </span>
                              
                              {alert.resolvedAt && (
                                <span className="flex items-center">
                                  <CheckCircle size={14} className="mr-1 text-green-500" />
                                  Résolue: {formatDate(alert.resolvedAt)}
                                </span>
                              )}
                              
                              {alert.source && (
                                <span className="flex items-center">
                                  <Info size={14} className="mr-1" />
                                  Source: {alert.source}
                                </span>
                              )}
                              
                              {alert.assigned && (
                                <span className="flex items-center">
                                  <Users size={14} className="mr-1" />
                                  Assignée: {alert.assigned}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 md:self-start">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-8"
                        >
                          <Eye size={14} className="mr-1" />
                          Détails
                        </Button>
                        
                        {alert.status !== "resolved" ? (
                          <Button 
                            size="sm"
                            variant="default"
                            className="h-8"
                            onClick={() => updateAlertStatus(alert.id, "resolved")}
                          >
                            <Check size={14} className="mr-1" />
                            Résoudre
                          </Button>
                        ) : (
                          <Button 
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() => updateAlertStatus(alert.id, "active")}
                          >
                            <AlertTriangle size={14} className="mr-1" />
                            Réactiver
                          </Button>
                        )}
                        
                        {alert.status !== "investigating" && alert.status !== "resolved" && (
                          <Button 
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() => updateAlertStatus(alert.id, "investigating")}
                          >
                            <RefreshCcw size={14} className="mr-1" />
                            Investiguer
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminAlerts;
