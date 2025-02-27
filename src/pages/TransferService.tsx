
import React, { useState } from "react";
import { Layout } from "@/components/layout";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const TransferService = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fonction pour valider le numéro de téléphone
  const validatePhoneNumber = (number: string) => {
    // Vérification du format: doit commencer par 01-09 et avoir 10 chiffres au total
    const phoneRegex = /^0[1-9][0-9]{8}$/;
    return phoneRegex.test(number);
  };

  // Fonction pour valider le montant
  const validateAmount = (value: string) => {
    const numVal = Number(value);
    return !isNaN(numVal) && numVal >= 100 && numVal <= 100000;
  };

  // Fonction pour gérer le passage à l'étape suivante
  const handleNext = () => {
    if (step === 1) {
      if (!validatePhoneNumber(phoneNumber)) {
        toast({
          variant: "destructive",
          title: "Numéro invalide",
          description: "Veuillez entrer un numéro de téléphone valide (10 chiffres)"
        });
        return;
      }
    } else if (step === 2) {
      if (!validateAmount(amount)) {
        toast({
          variant: "destructive",
          title: "Montant invalide",
          description: "Le montant doit être entre 100 F et 100 000 F"
        });
        return;
      }
    } else if (step === 3) {
      // Traitement du transfert
      setIsProcessing(true);
      
      // Simulation d'un traitement avec délai
      setTimeout(() => {
        setIsProcessing(false);
        setIsConfirmed(true);
        setStep(4);
        
        toast({
          title: "Transfert réussi",
          description: `${amount} F ont été transférés au numéro ${phoneNumber}`
        });
      }, 2000);
      
      return;
    } else if (step === 4) {
      // Retour au tableau de bord
      navigate("/dashboard");
      return;
    }
    
    // Passer à l'étape suivante
    setStep(step + 1);
  };

  // Fonction pour revenir à l'étape précédente
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/dashboard");
    }
  };

  // Rendu des différentes étapes
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-4 text-center">Destinataire</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Numéro de téléphone</label>
              <div className="relative">
                <Input
                  className="pl-10 py-3"
                  placeholder="07 XX XX XX XX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Phone size={18} className="text-primary/60" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Veuillez entrer le numéro du destinataire
              </p>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-4 text-center">Montant</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Montant à transférer</label>
              <div className="relative">
                <Input
                  className="py-3 text-center text-lg font-semibold"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 font-medium">
                  F
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Minimum: 100 F • Maximum: 100 000 F
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[500, 1000, 2000].map((val) => (
                <button
                  key={val}
                  className="border rounded-lg py-2 hover:bg-primary/10 transition-colors"
                  onClick={() => setAmount(val.toString())}
                >
                  {val} F
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[5000, 10000, 20000].map((val) => (
                <button
                  key={val}
                  className="border rounded-lg py-2 hover:bg-primary/10 transition-colors"
                  onClick={() => setAmount(val.toString())}
                >
                  {val} F
                </button>
              ))}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-4 text-center">Confirmation</h2>
            
            <Card className="border mb-6">
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Destinataire</span>
                  <span className="font-medium">{phoneNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Montant</span>
                  <span className="font-medium">{amount} F</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Frais</span>
                  <span className="font-medium">0 F</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-lg">{amount} F</span>
                </div>
              </CardContent>
            </Card>
            
            <p className="text-sm text-center text-muted-foreground mb-4">
              Veuillez vérifier les détails de votre transaction avant de confirmer
            </p>
          </div>
        );
      
      case 4:
        return (
          <div className="animate-fade-in text-center py-6">
            <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
            
            <h2 className="text-xl font-semibold mb-2">Transfert réussi!</h2>
            <p className="text-muted-foreground mb-6">
              Votre transfert de <strong>{amount} F</strong> vers le numéro <strong>{phoneNumber}</strong> a été effectué avec succès.
            </p>
            
            <Card className="border mb-6">
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">ID Transaction</span>
                  <span className="font-medium">TRX{Math.floor(Math.random() * 1000000)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Date & Heure</span>
                  <span className="font-medium">{new Date().toLocaleString('fr-FR')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Rendu du titre de l'étape actuelle
  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Transfert d'unités";
      case 2:
        return "Transfert d'unités";
      case 3:
        return "Confirmer le transfert";
      case 4:
        return "Récapitulatif";
      default:
        return "Transfert d'unités";
    }
  };

  // Rendu du texte du bouton principal
  const getButtonText = () => {
    switch (step) {
      case 1:
        return "Continuer";
      case 2:
        return "Continuer";
      case 3:
        return isProcessing ? "Traitement en cours..." : "Confirmer le transfert";
      case 4:
        return "Retour à l'accueil";
      default:
        return "Continuer";
    }
  };

  // Rendu de l'indicateur d'étape
  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center space-x-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`onboarding-indicator ${s <= step ? "active" : ""}`}
          />
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="page-container pt-4 pb-24">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="mr-4 h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-xl font-bold">{getStepTitle()}</h1>
        </div>

        {step < 4 && renderStepIndicator()}

        <div className="mb-6">
          {renderStep()}
        </div>

        <div className="fixed bottom-16 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t">
          <button
            className={`btn-primary w-full ${isProcessing ? "opacity-80" : ""}`}
            onClick={handleNext}
            disabled={isProcessing}
          >
            {getButtonText()}
            {!isProcessing && step < 4 && <ArrowRight size={16} className="ml-2" />}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default TransferService;
