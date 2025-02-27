
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Globe, Wallet, QrCode, ArrowDownLeft, ArrowUpRight, Calendar } from "lucide-react";

const Dashboard = () => {
  // Données fictives pour l'historique
  const transactions = [
    { 
      id: 1, 
      type: "recharge", 
      amount: "2000 F", 
      recipient: "07 89 34 56 21", 
      date: "Aujourd'hui, 14:30",
      isIncoming: false,
      status: "Réussi"
    },
    { 
      id: 2, 
      type: "Souscription Internet", 
      amount: "1000 F", 
      recipient: "Pass Internet 1 Go", 
      date: "Hier, 09:15",
      isIncoming: false,
      status: "Réussi"
    },
    { 
      id: 3, 
      type: "recharge", 
      amount: "5000 F", 
      recipient: "De: 05 67 23 45 78", 
      date: "20/04/2023",
      isIncoming: true,
      status: "Réussi"
    }
  ];

  return (
    <Layout>
      <div className="page-container pt-4 pb-20">
        <h1 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#D946EF]">
          Bienvenue sur IvoirePay
        </h1>
        
        {/* QR Code Section */}
        <div className="mb-6">
          <Card className="glass-card border-0 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Mon code QR</h3>
                  <p className="text-sm text-muted-foreground">Pour recevoir des transferts</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-full flex items-center justify-center">
                  <QrCode size={24} className="text-white" />
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 flex justify-center">
                <div className="relative w-48 h-48 p-2 bg-white rounded-lg">
                  <div className="absolute inset-0 m-2 border-2 border-dashed border-primary/30 rounded"></div>
                  <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 rounded flex items-center justify-center">
                    <div className="relative w-32 h-32 bg-white p-2 rounded-lg shadow-sm">
                      {/* SVG representation of QR code */}
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path d="M25,25 L25,45 L45,45 L45,25 L25,25" fill="#8B5CF6" />
                        <rect x="30" y="30" width="10" height="10" fill="white" />
                        
                        <path d="M55,25 L55,45 L75,45 L75,25 L55,25" fill="#8B5CF6" />
                        <rect x="60" y="30" width="10" height="10" fill="white" />
                        
                        <path d="M25,55 L25,75 L45,75 L45,55 L25,55" fill="#8B5CF6" />
                        <rect x="30" y="60" width="10" height="10" fill="white" />
                        
                        <rect x="55" y="55" width="5" height="5" fill="#D946EF" />
                        <rect x="65" y="55" width="5" height="5" fill="#D946EF" />
                        <rect x="75" y="55" width="5" height="5" fill="#D946EF" />
                        <rect x="55" y="65" width="5" height="5" fill="#D946EF" />
                        <rect x="65" y="65" width="5" height="5" fill="#D946EF" />
                        <rect x="75" y="65" width="5" height="5" fill="#D946EF" />
                        <rect x="55" y="75" width="5" height="5" fill="#D946EF" />
                        <rect x="65" y="75" width="5" height="5" fill="#D946EF" />
                        <rect x="75" y="75" width="5" height="5" fill="#D946EF" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-md">
                          <span className="text-lg font-bold text-primary">I</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Services en ligne horizontale */}
        <h2 className="text-lg font-semibold mb-3">Services</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Carte de transfert d'unités avec design amélioré */}
          <Card className="glass-card relative border-0 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"></div>
            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-br-2xl opacity-80"></div>
            
            <CardHeader className="pt-8 pb-2 z-10 relative">
              <div className="absolute top-0 left-0 w-12 h-12 flex items-center justify-center -translate-y-1/4 -translate-x-1/4">
                <div className="w-14 h-14 bg-white rounded-full shadow-lg p-3 flex items-center justify-center">
                  <div className="p-1.5 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] text-white transition-all duration-300 group-hover:scale-110">
                    <Phone size={18} />
                  </div>
                </div>
              </div>
              <CardTitle className="text-base ml-10 flex items-center">
                Transfert d'unités
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <p className="text-xs text-muted-foreground mb-3 pl-10">
                Envoyez des unités vers n'importe quel numéro
              </p>
              <button className="btn-primary w-full justify-center text-sm py-2 transition-all duration-300 hover:shadow-md mt-2 group-hover:bg-gradient-to-r group-hover:from-[#7B4CE6] group-hover:to-[#C936DF]">
                Transférer
              </button>
            </CardContent>
          </Card>
          
          {/* Carte de souscription avec design amélioré */}
          <Card className="glass-card relative border-0 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent"></div>
            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-br-2xl opacity-80"></div>
            
            <CardHeader className="pt-8 pb-2 z-10 relative">
              <div className="absolute top-0 left-0 w-12 h-12 flex items-center justify-center -translate-y-1/4 -translate-x-1/4">
                <div className="w-14 h-14 bg-white rounded-full shadow-lg p-3 flex items-center justify-center">
                  <div className="p-1.5 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] text-white transition-all duration-300 group-hover:scale-110">
                    <Globe size={18} />
                  </div>
                </div>
              </div>
              <CardTitle className="text-base ml-10 flex items-center">
                Souscription
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <p className="text-xs text-muted-foreground mb-3 pl-10">
                Internet ou appels, choisissez votre forfait
              </p>
              <button className="btn-primary w-full justify-center text-sm py-2 transition-all duration-300 hover:shadow-md mt-2 group-hover:bg-gradient-to-r group-hover:from-[#0D95D9] group-hover:to-[#7B4CE6]">
                Souscrire
              </button>
            </CardContent>
          </Card>
        </div>
        
        {/* Historique récent */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Historique récent</h2>
            <button className="text-primary text-sm font-medium">Voir tout</button>
          </div>
          
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="glass-card border-0 overflow-hidden">
                <div className="flex items-center p-3">
                  <div className="mr-3">
                    <div className={`p-2 rounded-full ${
                      transaction.isIncoming 
                        ? "bg-gradient-to-r from-green-500 to-green-400" 
                        : transaction.type.includes("Internet")
                          ? "bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6]"
                          : "bg-gradient-to-r from-[#8B5CF6] to-[#D946EF]"
                    } text-white`}>
                      {transaction.isIncoming ? (
                        <ArrowDownLeft size={16} />
                      ) : transaction.type.includes("Internet") ? (
                        <Globe size={16} />
                      ) : (
                        <ArrowUpRight size={16} />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{transaction.recipient}</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-xs text-muted-foreground flex items-center">
                            <Calendar size={10} className="mr-1" />
                            {transaction.date}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs px-1.5 py-0.5 rounded bg-secondary/10 text-secondary">
                              {transaction.type}
                            </span>
                            <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-600 dark:bg-green-900/30">
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className={`font-semibold ${
                        transaction.isIncoming ? "text-green-600" : "text-foreground"
                      }`}>
                        {transaction.isIncoming ? "+" : "-"}{transaction.amount}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
