
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
  PanelRightOpen 
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
        return <Send size={24} className="text-primary" />;
      case "subscription":
        return <Smartphone size={24} className="text-primary" />;
      default:
        return <CircleDollarSign size={24} className="text-primary" />;
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

        <Card className="bg-white mb-6">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="text-center mb-2">
              <p className="text-sm text-muted-foreground">Scannez pour payer</p>
            </div>
            <div className="border border-muted p-2 rounded-lg bg-white mb-2">
              <img 
                src="data:image/png;base64,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" 
                alt="QR Code" 
                className="h-44 w-44"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Solde disponible: <span className="font-semibold">{formatCurrency(balance)}</span>
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="flex flex-col items-center p-4 bg-card rounded-xl border cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => handleServiceClick(service)}
            >
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                {getServiceIcon(service.id)}
              </div>
              <p className="text-sm font-medium text-center">{service.name}</p>
              <p className="text-xs text-muted-foreground text-center">{service.description}</p>
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
