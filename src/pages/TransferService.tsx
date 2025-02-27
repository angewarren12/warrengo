
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, ArrowRight, ArrowLeft, CheckCircle2, Wallet, CreditCard, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Définition des opérateurs en fonction des préfixes
const OPERATORS = {
  "01": "Moov",
  "05": "MTN", 
  "07": "Orange"
};

const COMMISSION_PERCENTAGE = 3;

const TransferService = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [operator, setOperator] = useState("");
  const [commission, setCommission] = useState(0);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("mobile-money");
  const [paymentNumber, setPaymentNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Déterminer l'opérateur en fonction du préfixe du numéro
  useEffect(() => {
    if (phoneNumber.length >= 2) {
      const prefix = phoneNumber.substring(0, 2);
      setOperator(OPERATORS[prefix] || "Inconnu");
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
    // Vérification du format: doit commencer par 01, 05 ou 07 et avoir 10 chiffres au total
    const phoneRegex = /^(01|05|07)[0-9]{8}$/;
    return phoneRegex.test(number);
  };

  // Fonction pour valider le montant
  const validateAmount = (value: string) => {
    const numVal = Number(value);
    return !isNaN(numVal) && numVal >= 100 && numVal <= 100000;
  };

  // Fonction pour valider le numéro de paiement
  const validatePaymentNumber = (number: string) => {
    if (paymentMethod === "mobile-money") {
      // Même validation que pour le numéro de destinataire
      return validatePhoneNumber(number);
    }
    return number.length > 0;
  };

  // Fonction pour gérer le passage à l'étape suivante
  const handleNext = () => {
    if (step === 1) {
      if (!validatePhoneNumber(phoneNumber)) {
        toast({
          variant: "destructive",
          title: "Numéro invalide",
          description: "Veuillez entrer un numéro de téléphone valide (commençant par 01, 05 ou 07)"
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
      if (!validatePaymentNumber(paymentNumber)) {
        toast({
          variant: "destructive",
          title: "Numéro de paiement invalide",
          description: "Veuillez entrer un numéro valide pour le paiement"
        });
        return;
      }
    } else if (step === 4) {
      // Traitement du transfert
      setIsProcessing(true);
      
      // Simulation d'un traitement avec délai
      setTimeout(() => {
        setIsProcessing(false);
        setIsConfirmed(true);
        setStep(5);
        
        toast({
          title: "Transfert réussi",
          description: `${amount} F ont été transférés au numéro ${phoneNumber}`
        });
      }, 2000);
      
      return;
    } else if (step === 5) {
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
              {operator && (
                <div className="mt-2 p-2 bg-muted/30 rounded-md text-sm flex items-center justify-between">
                  <span>Opérateur détecté:</span>
                  <span className="font-medium">{operator}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Veuillez entrer le numéro du destinataire (commençant par 01, 05 ou 07)
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
            <h2 className="text-xl font-semibold mb-4 text-center">Moyen de paiement</h2>
            
            <div className="mb-6">
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 border p-3 rounded-lg">
                  <RadioGroupItem value="mobile-money" id="mobile-money" />
                  <Label htmlFor="mobile-money" className="flex-1 flex items-center cursor-pointer">
                    <div className="p-2 bg-primary/10 rounded-full mr-3">
                      <Phone size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Mobile Money</p>
                      <p className="text-xs text-muted-foreground">Paiement via votre compte mobile</p>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 border p-3 rounded-lg">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-1 flex items-center cursor-pointer">
                    <div className="p-2 bg-primary/10 rounded-full mr-3">
                      <CreditCard size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Carte bancaire</p>
                      <p className="text-xs text-muted-foreground">Paiement par carte VISA ou Mastercard</p>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 border p-3 rounded-lg">
                  <RadioGroupItem value="later" id="later" />
                  <Label htmlFor="later" className="flex-1 flex items-center cursor-pointer">
                    <div className="p-2 bg-primary/10 rounded-full mr-3">
                      <Clock size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Payer plus tard</p>
                      <p className="text-xs text-muted-foreground">Enregistrer et payer ultérieurement</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                {paymentMethod === "mobile-money" 
                  ? "Numéro Mobile Money" 
                  : paymentMethod === "card" 
                    ? "Numéro de carte" 
                    : "Numéro de référence"}
              </label>
              <div className="relative">
                <Input
                  className="pl-10 py-3"
                  placeholder={paymentMethod === "mobile-money" 
                    ? "07 XX XX XX XX" 
                    : paymentMethod === "card" 
                      ? "4XXX XXXX XXXX XXXX"
                      : "REF-XXXXX"}
                  value={paymentNumber}
                  onChange={(e) => setPaymentNumber(
                    paymentMethod === "mobile-money" 
                      ? e.target.value.replace(/\D/g, '') 
                      : e.target.value
                  )}
                  maxLength={paymentMethod === "mobile-money" ? 10 : 20}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {paymentMethod === "mobile-money" ? (
                    <Phone size={18} className="text-primary/60" />
                  ) : paymentMethod === "card" ? (
                    <CreditCard size={18} className="text-primary/60" />
                  ) : (
                    <Clock size={18} className="text-primary/60" />
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {paymentMethod === "mobile-money" 
                  ? "Entrez votre numéro Mobile Money" 
                  : paymentMethod === "card" 
                    ? "Entrez votre numéro de carte sans espaces" 
                    : "Un code de référence sera généré"}
              </p>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-4 text-center">Confirmation</h2>
            
            <Card className="border mb-6">
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Destinataire</span>
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
            
            <Card className="border mb-6">
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Moyen de paiement</span>
                  <span className="font-medium capitalize">
                    {paymentMethod === "mobile-money" 
                      ? "Mobile Money" 
                      : paymentMethod === "card" 
                        ? "Carte bancaire" 
                        : "Paiement différé"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {paymentMethod === "mobile-money" 
                      ? "Numéro" 
                      : paymentMethod === "card" 
                        ? "Carte" 
                        : "Référence"}
                  </span>
                  <span className="font-medium">
                    {paymentMethod === "card" 
                      ? `xxxx-xxxx-xxxx-${paymentNumber.slice(-4)}` 
                      : paymentNumber}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <p className="text-sm text-center text-muted-foreground mb-4">
              Veuillez vérifier les détails de votre transaction avant de confirmer
            </p>
          </div>
        );
      
      case 5:
        return (
          <div className="animate-fade-in text-center py-6">
            <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
            
            <h2 className="text-xl font-semibold mb-2">Transfert réussi!</h2>
            <p className="text-muted-foreground mb-6">
              Votre transfert de <strong>{amount} F</strong> vers le numéro <strong>{phoneNumber}</strong> ({operator}) a été effectué avec succès.
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
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Montant total</span>
                  <span className="font-medium">{total} F</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Moyen de paiement</span>
                  <span className="font-medium capitalize">
                    {paymentMethod === "mobile-money" 
                      ? "Mobile Money" 
                      : paymentMethod === "card" 
                        ? "Carte bancaire" 
                        : "Paiement différé"}
                  </span>
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
        return "Moyen de paiement";
      case 4:
        return "Confirmer le transfert";
      case 5:
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
        return "Continuer";
      case 4:
        return isProcessing ? "Traitement en cours..." : "Confirmer le transfert";
      case 5:
        return "Retour à l'accueil";
      default:
        return "Continuer";
    }
  };

  // Rendu de l'indicateur d'étape
  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center space-x-2 mb-6">
        {[1, 2, 3, 4].map((s) => (
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

        {step < 5 && renderStepIndicator()}

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
            {!isProcessing && step < 5 && <ArrowRight size={16} className="ml-2" />}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default TransferService;
