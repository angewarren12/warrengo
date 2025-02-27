
import React, { useEffect, useState } from "react";
import { CircleDollarSign, CheckCircle2, Loader2 } from "lucide-react";

const PaymentAnimation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState<"processing" | "validating" | "success">("processing");

  useEffect(() => {
    // Simuler les étapes du traitement du paiement
    const processingTimer = setTimeout(() => {
      setStage("validating");
      
      const validatingTimer = setTimeout(() => {
        setStage("success");
        
        const completeTimer = setTimeout(() => {
          onComplete();
        }, 1500);
        
        return () => clearTimeout(completeTimer);
      }, 2000);
      
      return () => clearTimeout(validatingTimer);
    }, 2000);
    
    return () => clearTimeout(processingTimer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 flex flex-col items-center">
        <div className="mb-8 relative">
          {stage === "processing" && (
            <div className="animate-pulse">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
              <div className="relative z-10 h-24 w-24 rounded-full bg-primary/10 border-4 border-primary/30 flex items-center justify-center">
                <CircleDollarSign size={40} className="text-primary animate-pulse" />
              </div>
            </div>
          )}
          
          {stage === "validating" && (
            <div className="animate-bounce">
              <div className="relative z-10 h-24 w-24 rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center">
                <Loader2 size={40} className="text-amber-500 animate-spin" />
              </div>
            </div>
          )}
          
          {stage === "success" && (
            <div className="animate-fade-in">
              <div className="relative z-10 h-24 w-24 rounded-full bg-green-100 border-4 border-green-300 flex items-center justify-center">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
            </div>
          )}
        </div>
        
        <h2 className="text-xl font-semibold mb-2 text-center">
          {stage === "processing" && "Traitement du paiement..."}
          {stage === "validating" && "Validation de la transaction..."}
          {stage === "success" && "Paiement confirmé !"}
        </h2>
        
        <p className="text-muted-foreground text-center mb-6">
          {stage === "processing" && "Veuillez patienter pendant que nous traitons votre demande..."}
          {stage === "validating" && "Nous sécurisons votre transaction..."}
          {stage === "success" && "Votre transfert a été effectué avec succès !"}
        </p>
        
        {stage !== "success" && (
          <div className="flex justify-center items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-150"></div>
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-300"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentAnimation;
