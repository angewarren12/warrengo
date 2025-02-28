
import React, { useState } from "react";
import { 
  Settings, Save, RotateCcw, Moon, Sun, BellRing, Bell, Phone, Globe, 
  Shield, Database, Key, LockKeyhole, GanttChart, BarChart3, UserCog, LogOut
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [darkMode, setDarkMode] = useState(() => {
    // Vérifier si le thème existe dans le localStorage
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "dark" || document.documentElement.classList.contains("dark");
  });
  
  // États pour les différents paramètres
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [alertNotifications, setAlertNotifications] = useState(true);
  const [criticalAlertsOnly, setCriticalAlertsOnly] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [formDirty, setFormDirty] = useState(false);

  // Changement de thème
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    setFormDirty(true);
    
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  // Enregistrer les paramètres
  const saveSettings = () => {
    toast({
      title: "Paramètres enregistrés",
      description: "Vos préférences ont été mises à jour avec succès",
    });
    setFormDirty(false);
  };

  // Réinitialiser les paramètres
  const resetSettings = () => {
    // Confirmer avant de réinitialiser
    if (confirm("Voulez-vous vraiment réinitialiser tous les paramètres aux valeurs par défaut?")) {
      setEmailNotifications(true);
      setSmsNotifications(true);
      setAlertNotifications(true);
      setCriticalAlertsOnly(false);
      setLanguage("fr");
      setFormDirty(true);
      
      toast({
        title: "Paramètres réinitialisés",
        description: "Tous les paramètres ont été restaurés aux valeurs par défaut",
      });
    }
  };

  // Structure des paramètres du système pour l'onglet Système
  const systemSettings = [
    {
      title: "Base de données",
      description: "Configuration de la base de données",
      icon: <Database className="h-5 w-5 text-primary" />,
      status: "OK",
      lastChecked: "08/07/2023 14:30",
      settings: [
        { name: "Sauvegardes automatiques", enabled: true },
        { name: "Purge des logs (30 jours)", enabled: true },
        { name: "Optimisations périodiques", enabled: true }
      ]
    },
    {
      title: "Sécurité",
      description: "Paramètres de sécurité du système",
      icon: <Shield className="h-5 w-5 text-primary" />,
      status: "OK",
      lastChecked: "08/07/2023 15:15",
      settings: [
        { name: "Authentification à deux facteurs", enabled: true },
        { name: "Délai d'expiration de session (30 min)", enabled: true },
        { name: "Journalisation des activités", enabled: true }
      ]
    },
    {
      title: "API",
      description: "Configuration des API",
      icon: <Key className="h-5 w-5 text-primary" />,
      status: "OK",
      lastChecked: "08/07/2023 13:45",
      settings: [
        { name: "Limitation de débit", enabled: true },
        { name: "Authentification par jetons", enabled: true },
        { name: "Journalisation des requêtes", enabled: true }
      ]
    }
  ];

  // Structure des paramètres de gestion pour l'onglet Administration
  const adminSettings = [
    {
      title: "Transactions",
      description: "Configuration des transactions",
      icon: <GanttChart className="h-5 w-5 text-primary" />,
      settings: [
        { name: "Délai de traitement maximum (24h)", enabled: true },
        { name: "Notifications de retard", enabled: true },
        { name: "Vérification automatique", enabled: true }
      ]
    },
    {
      title: "Rapports",
      description: "Configuration des rapports",
      icon: <BarChart3 className="h-5 w-5 text-primary" />,
      settings: [
        { name: "Rapports quotidiens", enabled: true },
        { name: "Rapports hebdomadaires", enabled: true },
        { name: "Rapports mensuels détaillés", enabled: true }
      ]
    },
    {
      title: "Utilisateurs",
      description: "Gestion des utilisateurs",
      icon: <UserCog className="h-5 w-5 text-primary" />,
      settings: [
        { name: "Vérification d'inscription", enabled: true },
        { name: "Détection d'inactivité (90 jours)", enabled: true },
        { name: "Blocage après 5 tentatives", enabled: true }
      ]
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Paramètres</h1>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={resetSettings}
            disabled={!formDirty}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Réinitialiser
          </Button>
          
          <Button 
            variant="default" 
            size="sm"
            onClick={saveSettings}
            disabled={!formDirty}
          >
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-md mb-8">
          <TabsTrigger value="general" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <BellRing className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center">
            <Database className="mr-2 h-4 w-4" />
            Système
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Admin
          </TabsTrigger>
        </TabsList>

        {/* Onglet Paramètres Généraux */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'interface d'administration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {darkMode ? (
                    <Moon className="h-5 w-5 text-primary" />
                  ) : (
                    <Sun className="h-5 w-5 text-primary" />
                  )}
                  <Label htmlFor="theme-mode">Mode sombre</Label>
                </div>
                <Switch
                  id="theme-mode"
                  checked={darkMode}
                  onCheckedChange={toggleTheme}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="language">Langue</Label>
                  <select 
                    id="language"
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      setFormDirty(true);
                    }}
                    className="rounded-md border border-input px-3 py-1.5 bg-background"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <p className="text-xs text-muted-foreground">Fuseau horaire utilisé pour les rapports et notifications</p>
                  </div>
                  <select 
                    id="timezone"
                    className="rounded-md border border-input px-3 py-1.5 bg-background"
                    onChange={() => setFormDirty(true)}
                  >
                    <option value="Africa/Abidjan">Africa/Abidjan (GMT+0)</option>
                    <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
              <CardDescription>
                Gérez votre profil administrateur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-name">Nom complet</Label>
                  <Input 
                    id="admin-name" 
                    defaultValue="Administrateur Système" 
                    onChange={() => setFormDirty(true)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input 
                    id="admin-email" 
                    type="email" 
                    defaultValue="admin@warrengo.com" 
                    onChange={() => setFormDirty(true)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Button variant="outline" className="w-full">
                  <LockKeyhole className="mr-2 h-4 w-4" />
                  Changer le mot de passe
                </Button>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="flex items-center justify-between w-full">
                <Button variant="destructive" className="text-sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
                <div className="text-xs text-muted-foreground">
                  Dernière connexion: 08/07/2023 10:45
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Onglet Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notifications</CardTitle>
              <CardDescription>
                Configurez quand et comment vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Notifications par email</Label>
                  <p className="text-xs text-muted-foreground">
                    Recevoir des notifications par email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={(checked) => {
                    setEmailNotifications(checked);
                    setFormDirty(true);
                  }}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <Label htmlFor="sms-notifications">Notifications par SMS</Label>
                    <Badge className="ml-2" variant="secondary">Premium</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recevoir des notifications par SMS pour les alertes critiques
                  </p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={smsNotifications}
                  onCheckedChange={(checked) => {
                    setSmsNotifications(checked);
                    setFormDirty(true);
                  }}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="alerts-notifications">Alertes système</Label>
                  <p className="text-xs text-muted-foreground">
                    Notifications pour les événements système
                  </p>
                </div>
                <Switch
                  id="alerts-notifications"
                  checked={alertNotifications}
                  onCheckedChange={(checked) => {
                    setAlertNotifications(checked);
                    setFormDirty(true);
                  }}
                />
              </div>
              
              {alertNotifications && (
                <div className="pl-6 mt-2 pt-2 border-l-2 border-muted">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="critical-only" className="text-sm">Alertes critiques uniquement</Label>
                      <p className="text-xs text-muted-foreground">
                        Ne recevoir que les alertes de niveau critique
                      </p>
                    </div>
                    <Switch
                      id="critical-only"
                      checked={criticalAlertsOnly}
                      onCheckedChange={(checked) => {
                        setCriticalAlertsOnly(checked);
                        setFormDirty(true);
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t px-6 py-4">
              <Button variant="outline" onClick={resetSettings}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
              <Button onClick={saveSettings} disabled={!formDirty}>Enregistrer</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Canaux de communication</CardTitle>
              <CardDescription>
                Gérez vos coordonnées pour les notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notification-email" className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  Email pour les notifications
                </Label>
                <Input 
                  id="notification-email" 
                  type="email" 
                  defaultValue="notifications@warrengo.com" 
                  onChange={() => setFormDirty(true)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notification-phone" className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  Téléphone pour les SMS
                </Label>
                <Input 
                  id="notification-phone" 
                  type="tel" 
                  defaultValue="+225 07XXXXXXXX" 
                  onChange={() => setFormDirty(true)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Système */}
        <TabsContent value="system" className="space-y-4">
          {systemSettings.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {section.icon}
                    <CardTitle>{section.title}</CardTitle>
                  </div>
                  <Badge variant={section.status === "OK" ? "outline" : "destructive"} className="bg-green-50 text-green-700 border-green-200">
                    {section.status}
                  </Badge>
                </div>
                <CardDescription>
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.settings.map((setting, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <Label htmlFor={`${section.title}-${idx}`}>{setting.name}</Label>
                    <Switch
                      id={`${section.title}-${idx}`}
                      checked={setting.enabled}
                      onCheckedChange={() => setFormDirty(true)}
                    />
                  </div>
                ))}
                <Separator />
                <div className="text-xs text-muted-foreground">
                  Dernière vérification: {section.lastChecked}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t px-6 py-4">
                <Button variant="outline" size="sm">
                  Configurer
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        {/* Onglet Administration */}
        <TabsContent value="admin" className="space-y-4">
          {adminSettings.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  {section.icon}
                  <CardTitle>{section.title}</CardTitle>
                </div>
                <CardDescription>
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.settings.map((setting, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <Label htmlFor={`${section.title}-${idx}`}>{setting.name}</Label>
                    <Switch
                      id={`${section.title}-${idx}`}
                      checked={setting.enabled}
                      onCheckedChange={() => setFormDirty(true)}
                    />
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-end border-t px-6 py-4">
                <Button variant="outline" size="sm">
                  Paramètres avancés
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
