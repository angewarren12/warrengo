
import React, { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Send, 
  ArrowDown, 
  ArrowUp, 
  Smartphone, 
  CircleDollarSign,
  PanelRightOpen,
  QrCode,
  Wallet
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  type: "send" | "receive" | "subscription";
  amount: number;
  name: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [balance, setBalance] = useState(15750);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([
    {
      id: "tx1",
      type: "send",
      amount: 5000,
      name: "Mamadou Kone",
      date: "2023-06-15",
      status: "completed"
    },
    {
      id: "tx2",
      type: "receive",
      amount: 7500,
      name: "Entreprise ABC",
      date: "2023-06-14",
      status: "completed"
    },
    {
      id: "tx3",
      type: "subscription",
      amount: 2000,
      name: "Pass Internet - Orange",
      date: "2023-06-13",
      status: "completed"
    },
    {
      id: "tx4",
      type: "send",
      amount: 1000,
      name: "Fatou Diallo",
      date: "2023-06-12",
      status: "pending"
    }
  ]);

  const formatCurrency = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " F";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "send":
        return <ArrowUp size={16} className="text-red-500" />;
      case "receive":
        return <ArrowDown size={16} className="text-green-500" />;
      case "subscription":
        return <Smartphone size={16} className="text-blue-500" />;
      default:
        return <CircleDollarSign size={16} />;
    }
  };

  const getServiceIcon = (id: string) => {
    switch (id) {
      case "transfer":
        return <Send size={28} />;
      case "subscription":
        return <Smartphone size={28} />;
      default:
        return <CircleDollarSign size={28} />;
    }
  };

  const services = [
    {
      id: "transfer",
      name: "Transfert d'unité",
      description: "Envoyer de l'argent",
      route: "/transfer"
    },
    {
      id: "subscription",
      name: "Souscription",
      description: "Forfaits & Pass",
      route: "/subscription"
    }
  ];

  const handleServiceClick = (service: any) => {
    if (service.route) {
      navigate(service.route);
    } else {
      toast({
        title: "Service indisponible",
        description: "Ce service sera disponible prochainement",
      });
    }
  };

  const formatAmount = (type: string, amount: number) => {
    if (type === "send") {
      return `- ${formatCurrency(amount)}`;
    } else {
      return `+ ${formatCurrency(amount)}`;
    }
  };

  return (
    <Layout>
      <div className="page-container pb-24">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary">AK</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Bonjour, Amadou</p>
              <p className="text-xs text-muted-foreground">Bienvenue sur IvoirePay</p>
            </div>
          </div>
          <button 
            className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"
            onClick={() => navigate('/notifications')}
          >
            <PanelRightOpen size={18} />
          </button>
        </div>

        <Card className="glass-card overflow-hidden mb-6">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/5 p-5 flex flex-col items-center">
              <div className="flex items-center justify-center mb-2">
                <QrCode size={24} className="text-primary mr-2" />
                <p className="text-sm font-medium">Scannez pour payer</p>
              </div>
              
              <div className="bg-white p-3 rounded-xl shadow-md mb-3">
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-2 rounded-lg">
                  <img 
                    src="data:image/png;base64,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" 
                    alt="QR Code" 
                    className="h-44 w-44"
                  />
                </div>
              </div>
              
              <div className="flex items-center mb-1">
                <Wallet size={18} className="text-primary mr-2" />
                <p className="text-sm font-medium">Solde disponible</p>
              </div>
              <p className="text-lg font-bold text-primary">{formatCurrency(balance)}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {services.map((service) => (
            <div 
              key={service.id} 
              onClick={() => handleServiceClick(service)}
              className="relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary/80 opacity-90 z-0"></div>
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 text-white">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mb-3 shadow-lg">
                  {getServiceIcon(service.id)}
                </div>
                <h3 className="font-bold text-center mb-1">{service.name}</h3>
                <p className="text-xs text-center text-white/80">{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-2">
          <h3 className="text-base font-medium mb-4">Transactions récentes</h3>
          {recentTransactions.length === 0 ? (
            <div className="text-center p-6 border rounded-lg">
              <p className="text-muted-foreground">Aucune transaction récente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between p-3 bg-card rounded-lg border"
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{transaction.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${transaction.type === 'send' ? 'text-red-600' : 'text-green-600'}`}>
                      {formatAmount(transaction.type, transaction.amount)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status === "completed" ? "Terminé" : 
                       transaction.status === "pending" ? "En cours" : "Échoué"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {recentTransactions.length > 0 && (
            <button 
              className="w-full mt-3 p-2 text-center text-sm text-primary hover:bg-primary/5 rounded-md transition-colors"
              onClick={() => navigate('/transactions')}
            >
              Voir toutes les transactions
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
