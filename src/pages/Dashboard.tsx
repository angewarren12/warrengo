
import React, { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Send, 
  CreditCard, 
  ArrowDown, 
  ArrowUp, 
  Smartphone, 
  Receipt, 
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
      case "bills":
        return <Receipt size={24} className="text-primary" />;
      case "bank":
        return <CreditCard size={24} className="text-primary" />;
      default:
        return <CircleDollarSign size={24} className="text-primary" />;
    }
  };

  const services = [
    {
      id: "transfer",
      name: "Transferer",
      description: "Envoyer de l'argent",
      route: "/transfer"
    },
    {
      id: "subscription",
      name: "Souscrire",
      description: "Forfaits & Pass",
      route: "/subscription"
    },
    {
      id: "bills",
      name: "Factures",
      description: "Payer vos factures",
      route: "/bills"
    },
    {
      id: "bank",
      name: "Banque",
      description: "Services bancaires",
      route: "/bank"
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

        <Card className="bg-gradient-to-r from-primary to-primary-600 text-white mb-6">
          <CardContent className="p-6">
            <div className="mb-2">
              <p className="text-sm text-white/80">Solde disponible</p>
              <h2 className="text-2xl font-bold">{formatCurrency(balance)}</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button 
                className="btn-card-action"
                onClick={() => navigate('/transfer')}
              >
                <ArrowUp size={16} className="mr-2" />
                Envoyer
              </button>
              <button 
                className="btn-card-action"
                onClick={() => navigate('/scan')}
              >
                <ArrowDown size={16} className="mr-2" />
                Recevoir
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="flex flex-col items-center p-3 bg-card rounded-xl border cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => handleServiceClick(service)}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                {getServiceIcon(service.id)}
              </div>
              <p className="text-xs font-medium text-center">{service.name}</p>
              <p className="text-[10px] text-muted-foreground text-center">{service.description}</p>
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
