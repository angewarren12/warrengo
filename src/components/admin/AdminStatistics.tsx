
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { Download, ChevronDown, ArrowDown, ArrowUp, Calendar, RefreshCcw, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, ArrowUpRight, Users, CreditCard, Wallet, Percent, Save, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { COMMISSION_PERCENTAGE } from "@/data/subscriptionData";

// Types et interfaces
interface ChartData {
  name: string;
  [key: string]: string | number;
}

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const AdminStatistics = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(false);
  const [commissionPercentage, setCommissionPercentage] = useState(COMMISSION_PERCENTAGE);
  const [isEditingCommission, setIsEditingCommission] = useState(false);
  const { toast } = useToast();

  // Fonction pour rafraîchir les données
  const refreshData = () => {
    setIsLoading(true);
    // Simuler le chargement
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Données actualisées",
        description: "Les statistiques ont été mises à jour"
      });
    }, 1000);
  };

  // Fonction pour exporter les données
  const exportData = () => {
    toast({
      title: "Exportation en cours",
      description: "Les données statistiques seront téléchargées sous peu"
    });
    
    // Simuler un téléchargement
    setTimeout(() => {
      toast({
        title: "Exportation terminée",
        description: "Fichier téléchargé avec succès"
      });
    }, 1500);
  };

  // Fonction pour mettre à jour le pourcentage de commission
  const saveCommissionPercentage = () => {
    // Dans une application réelle, nous enverrions une requête API pour mettre à jour
    // la configuration dans la base de données
    toast({
      title: "Commission mise à jour",
      description: `Le taux de commission est maintenant de ${commissionPercentage}%`
    });
    setIsEditingCommission(false);
  };

  // Données des statistiques générales
  const statCards: StatCard[] = [
    {
      title: "Revenus totaux",
      value: "8,246,000 F",
      change: 12.5,
      icon: <Wallet className="h-5 w-5" />,
      color: "bg-green-500"
    },
    {
      title: "Commissions",
      value: `${Math.round(8246000 * (commissionPercentage / 100)).toLocaleString()} F`,
      change: 14.2,
      icon: <Percent className="h-5 w-5" />,
      color: "bg-purple-500"
    },
    {
      title: "Nouveaux utilisateurs",
      value: "1,453",
      change: 8.2,
      icon: <Users className="h-5 w-5" />,
      color: "bg-blue-500"
    },
    {
      title: "Transactions",
      value: "12,872",
      change: -3.1,
      icon: <CreditCard className="h-5 w-5" />,
      color: "bg-amber-500"
    }
  ];

  // Calculer les données pour le graphique des commissions
  const calculateCommissionsData = (revenueData: ChartData[]) => {
    return revenueData.map(item => ({
      ...item,
      // Ajout des commissions pour chaque mois (forfaits et transferts combinés)
      commission: Math.round((item.forfaits as number + item.transferts as number) * commissionPercentage / 100)
    }));
  };

  // Données pour le graphique des revenus mensuels
  const revenueData: ChartData[] = [
    { name: "Jan", forfaits: 2400000, transferts: 1398000, total: 3798000 },
    { name: "Fév", forfaits: 1980000, transferts: 1680000, total: 3660000 },
    { name: "Mar", forfaits: 2780000, transferts: 1908000, total: 4688000 },
    { name: "Avr", forfaits: 3080000, transferts: 2300000, total: 5380000 },
    { name: "Mai", forfaits: 2890000, transferts: 2120000, total: 5010000 },
    { name: "Juin", forfaits: 3390000, transferts: 2570000, total: 5960000 },
    { name: "Juil", forfaits: 3490000, transferts: 2700000, total: 6190000 },
    { name: "Août", forfaits: 3870000, transferts: 2920000, total: 6790000 },
    { name: "Sep", forfaits: 4000000, transferts: 3200000, total: 7200000 },
    { name: "Oct", forfaits: 4200000, transferts: 3500000, total: 7700000 },
    { name: "Nov", forfaits: 4390000, transferts: 3700000, total: 8090000 },
    { name: "Déc", forfaits: 4590000, transferts: 3900000, total: 8490000 }
  ];

  // Données de commissions
  const commissionsData = calculateCommissionsData(revenueData);

  // Calcule le total des commissions pour l'année
  const totalCommissions = commissionsData.reduce((sum, item) => sum + (item.commission as number), 0);

  // Données pour le graphique des nouveaux utilisateurs
  const userGrowthData: ChartData[] = [
    { name: "Sem 1", nouveaux: 125, actifs: 98 },
    { name: "Sem 2", nouveaux: 143, actifs: 112 },
    { name: "Sem 3", nouveaux: 132, actifs: 107 },
    { name: "Sem 4", nouveaux: 154, actifs: 123 },
    { name: "Sem 5", nouveaux: 168, actifs: 132 },
    { name: "Sem 6", nouveaux: 187, actifs: 145 },
    { name: "Sem 7", nouveaux: 195, actifs: 153 },
    { name: "Sem 8", nouveaux: 214, actifs: 168 }
  ];

  // Données pour le graphique des transactions par opérateur
  const operatorData: ChartData[] = [
    { name: "Orange", value: 45 },
    { name: "MTN", value: 30 },
    { name: "Moov", value: 15 },
    { name: "Autres", value: 10 }
  ];

  // Données pour la répartition des commissions par service
  const commissionByServiceData: ChartData[] = [
    { name: "Forfaits Internet", value: 58 },
    { name: "Transferts", value: 25 },
    { name: "Forfaits Appels", value: 12 },
    { name: "Autres services", value: 5 }
  ];

  // Couleurs pour les graphiques à secteurs
  const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE'];
  const COMMISSION_COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d'];

  // Fonction pour formater les valeurs des tooltips en milliers
  const formatNumber = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Statistiques et Analyses</h1>
          <div className="flex space-x-2">
            <button 
              className="p-2 rounded-full hover:bg-muted"
              onClick={refreshData}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCcw className="h-5 w-5 animate-spin" />
              ) : (
                <RefreshCcw className="h-5 w-5" />
              )}
            </button>
            <button 
              className="p-2 rounded-full hover:bg-muted"
              onClick={exportData}
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Configuration de la commission */}
        <Card className="border-purple-200">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <Percent className="h-5 w-5 mr-2 text-purple-500" />
                Configuration de la Commission
              </CardTitle>
              {!isEditingCommission ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditingCommission(true)}
                >
                  Modifier
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={saveCommissionPercentage}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </Button>
              )}
            </div>
            <CardDescription>
              Taux de commission appliqué sur toutes les transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Taux actuel:</span>
                <span className="text-2xl font-bold text-purple-600">{commissionPercentage}%</span>
              </div>
              
              {isEditingCommission && (
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="commission-percent">Ajuster le taux de commission (%)</Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        id="commission-percent"
                        value={[commissionPercentage]}
                        min={0.5}
                        max={10}
                        step={0.5}
                        onValueChange={(value) => setCommissionPercentage(value[0])}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={commissionPercentage}
                        onChange={(e) => setCommissionPercentage(parseFloat(e.target.value) || 0)}
                        className="w-20 text-right"
                        min={0.5}
                        max={10}
                        step={0.5}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Estimation annuelle des revenus de commission basée sur les chiffres actuels: <strong>{totalCommissions.toLocaleString()} F</strong></p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sélecteur de période */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button 
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                dateRange === "7d" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
              onClick={() => setDateRange("7d")}
            >
              7 jours
            </button>
            <button 
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                dateRange === "30d" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
              onClick={() => setDateRange("30d")}
            >
              30 jours
            </button>
            <button 
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                dateRange === "90d" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
              onClick={() => setDateRange("90d")}
            >
              90 jours
            </button>
            <button 
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                dateRange === "12m" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
              onClick={() => setDateRange("12m")}
            >
              12 mois
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-1 px-3 py-1.5 border border-input rounded-md text-sm hover:bg-muted">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Personnaliser</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <div className={`p-2 rounded-full ${stat.color} text-white`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {stat.change > 0 ? (
                    <div className="flex items-center text-sm text-green-600">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      {stat.change}%
                    </div>
                  ) : (
                    <div className="flex items-center text-sm text-red-600">
                      <ArrowDown className="h-4 w-4 mr-1" />
                      {Math.abs(stat.change)}%
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground ml-2">vs période précédente</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Onglets pour différentes catégories de statistiques */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="commissions" className="flex items-center">
              <Percent className="h-4 w-4 mr-2" />
              Commissions
            </TabsTrigger>
          </TabsList>

          {/* Contenu de l'onglet Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique des revenus */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <LineChartIcon className="h-5 w-5 mr-2 text-primary" />
                    Évolution des revenus
                  </CardTitle>
                  <CardDescription>Revenus mensuels par type de service</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={revenueData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
                        <XAxis dataKey="name" stroke="#888" fontSize={12} />
                        <YAxis 
                          stroke="#888" 
                          fontSize={12}
                          tickFormatter={(value) => formatNumber(value)}
                        />
                        <Tooltip 
                          formatter={(value: number) => [`${value.toLocaleString()} F`, undefined]}
                          labelFormatter={(label) => `Mois: ${label}`}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="forfaits" 
                          name="Forfaits" 
                          stroke="#0088FE" 
                          strokeWidth={2}
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="transferts" 
                          name="Transferts" 
                          stroke="#00C49F" 
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="total" 
                          name="Total" 
                          stroke="#FF8042" 
                          strokeWidth={3}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Graphique des transactions par opérateur */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
                    Répartition par opérateur
                  </CardTitle>
                  <CardDescription>Pourcentage de transactions par opérateur</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={operatorData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {operatorData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contenu de l'onglet Utilisateurs */}
          <TabsContent value="users" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Croissance des utilisateurs
                </CardTitle>
                <CardDescription>Nouveaux utilisateurs et rétention par semaine</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={userGrowthData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
                      <XAxis dataKey="name" stroke="#888" fontSize={12} />
                      <YAxis stroke="#888" fontSize={12} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="nouveaux" name="Nouveaux utilisateurs" fill="#8884d8" />
                      <Bar dataKey="actifs" name="Utilisateurs actifs" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contenu de l'onglet Transactions */}
          <TabsContent value="transactions" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                  Transactions mensuelles
                </CardTitle>
                <CardDescription>Volume et nombre de transactions par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={revenueData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
                      <XAxis dataKey="name" stroke="#888" fontSize={12} />
                      <YAxis 
                        stroke="#888" 
                        fontSize={12}
                        tickFormatter={(value) => formatNumber(value)}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`${value.toLocaleString()} F`, undefined]}
                        labelFormatter={(label) => `Mois: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="total" name="Volume total" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nouvel onglet de Commissions */}
          <TabsContent value="commissions" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique des commissions par mois */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <LineChartIcon className="h-5 w-5 mr-2 text-purple-500" />
                    Évolution des commissions
                  </CardTitle>
                  <CardDescription>Revenus de commission mensuels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={commissionsData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
                        <XAxis dataKey="name" stroke="#888" fontSize={12} />
                        <YAxis 
                          stroke="#888" 
                          fontSize={12}
                          tickFormatter={(value) => formatNumber(value)}
                        />
                        <Tooltip 
                          formatter={(value: number) => [`${value.toLocaleString()} F`, undefined]}
                          labelFormatter={(label) => `Mois: ${label}`}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="commission" 
                          name="Commission" 
                          stroke="#8884d8" 
                          strokeWidth={3}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Graphique des commissions par service */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <PieChartIcon className="h-5 w-5 mr-2 text-purple-500" />
                    Répartition des commissions
                  </CardTitle>
                  <CardDescription>Répartition des commissions par service</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={commissionByServiceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {commissionByServiceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COMMISSION_COLORS[index % COMMISSION_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tableau des commissions par service */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <DollarSign className="h-5 w-5 mr-2 text-purple-500" />
                  Détail des revenus de commission
                </CardTitle>
                <CardDescription>Répartition détaillée des commissions par service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Service</th>
                        <th className="text-left py-3 px-4 font-medium">Volume total</th>
                        <th className="text-left py-3 px-4 font-medium">Taux de commission</th>
                        <th className="text-left py-3 px-4 font-medium">Revenus de commission</th>
                        <th className="text-left py-3 px-4 font-medium">% du total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/30">
                        <td className="py-3 px-4">Forfaits Internet</td>
                        <td className="py-3 px-4">42,650,000 F</td>
                        <td className="py-3 px-4">{commissionPercentage}%</td>
                        <td className="py-3 px-4 font-medium">{Math.round(42650000 * commissionPercentage / 100).toLocaleString()} F</td>
                        <td className="py-3 px-4">58%</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/30">
                        <td className="py-3 px-4">Transferts</td>
                        <td className="py-3 px-4">18,500,000 F</td>
                        <td className="py-3 px-4">{commissionPercentage}%</td>
                        <td className="py-3 px-4 font-medium">{Math.round(18500000 * commissionPercentage / 100).toLocaleString()} F</td>
                        <td className="py-3 px-4">25%</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/30">
                        <td className="py-3 px-4">Forfaits Appels</td>
                        <td className="py-3 px-4">8,850,000 F</td>
                        <td className="py-3 px-4">{commissionPercentage}%</td>
                        <td className="py-3 px-4 font-medium">{Math.round(8850000 * commissionPercentage / 100).toLocaleString()} F</td>
                        <td className="py-3 px-4">12%</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/30">
                        <td className="py-3 px-4">Autres services</td>
                        <td className="py-3 px-4">3,690,000 F</td>
                        <td className="py-3 px-4">{commissionPercentage}%</td>
                        <td className="py-3 px-4 font-medium">{Math.round(3690000 * commissionPercentage / 100).toLocaleString()} F</td>
                        <td className="py-3 px-4">5%</td>
                      </tr>
                      <tr className="bg-muted/20 font-medium">
                        <td className="py-3 px-4">Total</td>
                        <td className="py-3 px-4">73,690,000 F</td>
                        <td className="py-3 px-4">{commissionPercentage}%</td>
                        <td className="py-3 px-4 font-medium">{Math.round(73690000 * commissionPercentage / 100).toLocaleString()} F</td>
                        <td className="py-3 px-4">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminStatistics;
