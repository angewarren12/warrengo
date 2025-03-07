
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, ArrowRight, ArrowLeft, Receipt } from "lucide-react";
import { Input } from "@/components/ui/input";
import PaymentAnimation from "@/components/PaymentAnimation";
import { airtimeService } from "@/services/airtimeService";

// Définition des opérateurs en fonction des préfixes
const OPERATORS = {
  "01": "Moov",
  "05": "MTN", 
  "07": "Orange"
};

const COMMISSION_PERCENTAGE = 3;

const AirtimeRecharge = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [operator, setOperator] = useState("");
  const [isEligible, setIsEligible] = useState(false);
  const [amount, setAmount] = useState("");
  const [commission, setCommission] = useState(0);
  const [total, setTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentAnimation, setShowPaymentAnimation] = useState(false);
  const [transactionReference, setTransactionReference] = useState("");
  const [transactionResult, setTransactionResult] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Générer un numéro de référence unique
  useEffect(() => {
    const reference = `AIRTIME-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setTransactionReference(reference);
  }, []);

  // Déterminer l'opérateur en fonction du préfixe du numéro
  useEffect(() => {
    if (phoneNumber.length >= 2) {
      const prefix = phoneNumber.substring(0, 2);
      setOperator(OPERATORS[prefix] || "");
    } else {
      setOperator("");
    }
  }, [phoneNumber]);

  // Calculer la commission et le total
  useEffect(() => {
    if (amount) {
      const amountValue = Number(amount);
      const commissionValue = Math.round(amountValue * COMMISSION_PERCENTAGE / 100);
      setCommission(commissionValue);
      setTotal(amountValue + commissionValue);
    } else {
      setCommission(0);
      setTotal(0);
    }
  }, [amount]);

  // Fonction pour valider le numéro de téléphone
  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^(01|05|07)[0-9]{8}$/;
    return phoneRegex.test(number);
  };

  // Fonction pour valider le montant
  const validateAmount = (value: string) => {
    const numVal = Number(value);
    return !isNaN(numVal) && numVal >= 100 && numVal <= 100000;
  };

  // Vérifier l'éligibilité du numéro
  const checkEligibility = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        variant: "destructive",
        title: "Numéro invalide",
        description: "Veuillez entrer un numéro de téléphone valide (commençant par 01, 05 ou 07)"
      });
      return false;
    }

    try {
      setIsProcessing(true);
      const response = await airtimeService.checkEligibility(phoneNumber);
      
      if (response.status === "success") {
        setIsEligible(true);
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Numéro non éligible",
          description: response.message || "Ce numéro n'est pas éligible pour la recharge"
        });
        setIsEligible(false);
        return false;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification du numéro"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Effectuer la recharge
  const processRecharge = async () => {
    try {
      setIsProcessing(true);
      setShowPaymentAnimation(true);
      
      // Simuler un délai pour l'animation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const response = await airtimeService.rechargeAirtime(
        phoneNumber,
        Number(amount),
        transactionReference
      );
      
      setTransactionResult(response);
      
      if (response.status === "success") {
        toast({
          title: "Recharge réussie",
          description: `${amount} F ont été rechargés sur le numéro ${phoneNumber}`
        });
      } else {
        toast({
          variant: "destructive",
          title: "Échec de la recharge",
          description: response.message || "Une erreur est survenue lors de la recharge"
        });
      }
      
      return response.status === "success";
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la recharge"
      });
      return false;
    } finally {
      setShowPaymentAnimation(false);
      setIsProcessing(false);
    }
  };

  // Fonction pour gérer le passage à l'étape suivante
  const handleNext = async () => {
    if (step === 1) {
      const isValid = await checkEligibility();
      if (isValid) {
        setStep(2);
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
      setStep(3);
    } else if (step === 3) {
      const success = await processRecharge();
      if (success) {
        setStep(4);
      }
    } else if (step === 4) {
      navigate("/dashboard");
    }
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
            <h2 className="text-xl font-semibold mb-4 text-center">Numéro à recharger</h2>
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
              {operator && (
                <div className="mt-2 p-2 bg-muted/30 rounded-md text-sm flex items-center justify-between">
                  <span>Opérateur détecté:</span>
                  <span className="font-medium">{operator}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Veuillez entrer le numéro à recharger (commençant par 01, 05 ou 07)
              </p>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-4 text-center">Montant</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Montant à recharger</label>
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
                  <span className="text-sm text-muted-foreground">Numéro à recharger</span>
                  <span className="font-medium">{phoneNumber} ({operator})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Montant</span>
                  <span className="font-medium">{amount} F</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Commission (3%)</span>
                  <span className="font-medium">{commission} F</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-lg">{total} F</span>
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
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-4">
                <Receipt size={36} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">Recharge réussie!</h2>
              <p className="text-muted-foreground">
                Votre transaction a été traitée avec succès.
              </p>
            </div>
            
            <Card className="border mb-6">
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Numéro rechargé</span>
                  <span className="font-medium">{phoneNumber} ({operator})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Montant</span>
                  <span className="font-medium">{amount} F</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Référence</span>
                  <span className="font-medium text-xs">{transactionReference}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Date & heure</span>
                  <span className="font-medium">{new Date().toLocaleString('fr-FR')}</span>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center">
              <button 
                className="btn-outline w-full mb-3"
                onClick={() => navigate("/history")}
              >
                Voir l'historique
              </button>
              <button 
                className="btn-primary w-full"
                onClick={() => navigate("/dashboard")}
              >
                Retour à l'accueil
              </button>
            </div>
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
        return "Recharge de crédit";
      case 2:
        return "Recharge de crédit";
      case 3:
        return "Confirmer la recharge";
      case 4:
        return "Récapitulatif";
      default:
        return "Recharge de crédit";
    }
  };

  // Rendu du texte du bouton principal
  const getButtonText = () => {
    switch (step) {
      case 1:
        return isProcessing ? "Vérification..." : "Continuer";
      case 2:
        return "Continuer";
      case 3:
        return isProcessing ? "Traitement en cours..." : "Confirmer la recharge";
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
            className={`h-2 w-2 rounded-full ${
              s === step 
                ? "bg-primary w-6" 
                : s < step 
                  ? "bg-primary" 
                  : "bg-muted"
            } transition-all duration-300`}
          />
        ))}
      </div>
    );
  };

  return (
    <Layout>
      {showPaymentAnimation && (
        <PaymentAnimation onComplete={() => setShowPaymentAnimation(false)} />
      )}
      
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

        {step < 4 && (
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
        )}
      </div>
    </Layout>
  );
};

export default AirtimeRecharge;
