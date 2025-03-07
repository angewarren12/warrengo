
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Copy, Share2, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactConfetti from "react-confetti";
import { useNavigate } from "react-router-dom";

interface SubscriptionSuccessProps {
  phoneNumber: string;
  operator: string;
  plan: any;
  subscriptionType: string;
  total: number;
  paymentMethod: string;
  paymentNumber?: string;
  hideHomeButton?: boolean;
}

const SubscriptionSuccess: React.FC<SubscriptionSuccessProps> = ({
  phoneNumber,
  operator,
  plan,
  subscriptionType,
  total,
  paymentMethod,
  paymentNumber,
  hideHomeButton = false
}) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [showConfetti, setShowConfetti] = useState(true);
  const [transactionId] = useState(`TRX${Math.floor(Math.random() * 1000000)}`);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", handleResize);
    
    // Arrêter les confettis après 6 secondes
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 6000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  const handleCopyTransactionId = () => {
    navigator.clipboard.writeText(transactionId).then(() => {
      toast({
        title: "ID de transaction copié !",
        description: "L'identifiant a été copié dans le presse-papier."
      });
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Forfait souscrit avec succès",
        text: `J'ai souscrit au forfait ${plan.name} pour le numéro ${phoneNumber} via IvoirePay. ID de transaction: ${transactionId}`
      }).catch(() => {
        toast({
          title: "Partage annulé",
          description: "Le partage a été annulé ou n'est pas pris en charge."
        });
      });
    } else {
      toast({
        title: "Partage non supporté",
        description: "Votre navigateur ne prend pas en charge cette fonctionnalité."
      });
    }
  };

  const handleGoHome = () => {
    navigate("/dashboard");
  };

  return (
    <div className="animate-fade-in text-center py-6 relative">
      {/* Position des confettis au premier plan avec un z-index élevé */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {showConfetti && (
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={true}
            numberOfPieces={200}
            gravity={0.15}
          />
        )}
      </div>
      
      <div className="relative z-10">
        <div className="inline-flex items-center justify-center h-28 w-28 rounded-full bg-gradient-to-r from-green-100 to-green-50 mb-6 shadow-md">
          <div className="h-20 w-20 rounded-full bg-gradient-to-r from-green-500 to-green-400 flex items-center justify-center">
            <CheckCircle2 size={48} className="text-white" />
          </div>
        </div>
        
        <h2 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-400">
          Souscription réussie !
        </h2>
        
        <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
          Votre forfait <strong>{plan.name}</strong> a été activé pour <strong>{phoneNumber}</strong> ({operator}).
        </p>
        
        <Card className="border shadow-md mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-3 border-b">
            <h3 className="font-semibold text-center">Détails de la transaction</h3>
          </div>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">ID Transaction</span>
              <div className="flex items-center">
                <span className="font-medium mr-2">{transactionId}</span>
                <button 
                  onClick={handleCopyTransactionId}
                  className="h-6 w-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                >
                  <Copy size={12} />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Date & Heure</span>
              <span className="font-medium">{new Date().toLocaleString('fr-FR')}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Numéro</span>
              <span className="font-medium">{phoneNumber}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Opérateur</span>
              <span className="font-medium">{operator}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Forfait</span>
              <span className="font-medium">{plan.name}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Type</span>
              <span className="font-medium">
                {subscriptionType === "internet" ? "Pass Internet" : "Pass Appel"}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {subscriptionType === "internet" ? "Volume" : "Minutes"}
              </span>
              <span className="font-medium">
                {subscriptionType === "internet" ? plan.data : plan.minutes}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Validité</span>
              <span className="font-medium">{plan.validity}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total payé</span>
              <span className="font-medium">{total} F</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Moyen de paiement</span>
              <span className="font-medium">{paymentMethod}</span>
            </div>
            
            {paymentNumber && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Numéro de paiement</span>
                <span className="font-medium">{paymentNumber.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Statut</span>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                Réussi
              </span>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-center gap-3 mb-4">
          <button 
            onClick={handleGoHome}
            className="btn-sm-primary px-4 py-2"
          >
            <Home size={16} className="mr-2" />
            Accueil
          </button>
          
          <button 
            onClick={handleShare}
            className="btn-sm-primary px-4 py-2"
          >
            <Share2 size={16} className="mr-2" />
            Partager
          </button>
        </div>
        
        <div className="bg-primary/5 rounded-lg p-4 max-w-xs mx-auto">
          <p className="text-xs text-muted-foreground">
            Un SMS de confirmation a été envoyé au numéro {phoneNumber}. Merci d'avoir utilisé notre service !
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
