
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Globe, Wallet } from "lucide-react";

const Dashboard = () => {
  return (
    <Layout>
      <div className="page-container pt-4">
        <h1 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#D946EF]">
          Bienvenue sur IvoirePay
        </h1>
        
        <div className="grid gap-4">
          <Card className="glass-card border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <div className="mr-2 p-2 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white">
                  <Phone size={18} />
                </div>
                Transfert d'unités
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Envoyez facilement des unités vers n'importe quel numéro en Côte d'Ivoire
              </p>
              <button className="btn-primary w-full justify-center">
                Transférer
              </button>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <div className="mr-2 p-2 rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] text-white">
                  <Globe size={18} />
                </div>
                Pass Internet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Activez des pass internet pour rester connecté
              </p>
              <button className="btn-primary w-full justify-center">
                Acheter un pass
              </button>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <div className="mr-2 p-2 rounded-full bg-gradient-to-r from-[#F97316] to-[#D946EF] text-white">
                  <Wallet size={18} />
                </div>
                Moyens de paiement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Gérez vos méthodes de paiement mobile
              </p>
              <button className="btn-primary w-full justify-center">
                Gérer
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
