
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, ArrowRight, ArrowLeft, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import PaymentAnimation from "@/components/PaymentAnimation";
import TransferSuccess from "@/components/TransferSuccess";

// Définition des opérateurs en fonction des préfixes
const OPERATORS = {
  "01": "Moov",
  "05": "MTN", 
  "07": "Orange"
};

// Définition des moyens de paiement avec leurs préfixes requis
const PAYMENT_METHODS = [
  {
    id: "orange-money",
    name: "Orange Money",
    logo: "https://seeklogo.com/images/O/orange-money-logo-8F2AED308D-seeklogo.com.png", 
    prefix: "07",
    description: "Paiement via Orange Money"
  },
  {
    id: "moov-money",
    name: "Moov Money",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Moov_Money_Flooz.png", 
    prefix: "01",
    description: "Paiement via Moov Money"
  },
  {
    id: "mtn-money",
    name: "MTN Money",
    logo: "https://paytou.org/wp-content/uploads/2020/10/5-2.png", 
    prefix: "05",
    description: "Paiement via MTN Money"
  },
  {
    id: "wave",
    name: "Wave",
    logo: "https://yop.l-frii.com/wp-content/uploads/2025/02/WAVE-recrute-pour-ce-poste-22-fevrier-2025.png", 
    prefix: "",
    description: "Paiement via Wave"
  }
];

const COMMISSION_PERCENTAGE = 3;

const TransferService = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [operator, setOperator] = useState("");
  const [commission, setCommission] = useState(0);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("orange-money");
  const [paymentNumber, setPaymentNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentAnimation, setShowPaymentAnimation] = useState(false);
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

  // Fonction pour valider le numéro de paiement en fonction du moyen de paiement sélectionné
  const validatePaymentNumber = (number: string) => {
    if (paymentMethod === "pay-later") {
      return true; // Pas de validation pour "Payer plus tard"
    }
    
    // Pour Wave, seule la longueur de 10 chiffres est requise
    if (paymentMethod === "wave") {
      return /^[0-9]{10}$/.test(number);
    }
    
    // Pour les autres moyens de paiement, vérifier le préfixe spécifique
    const selectedMethod = PAYMENT_METHODS.find(method => method.id === paymentMethod);
    if (selectedMethod && selectedMethod.prefix) {
      const regex = new RegExp(`^${selectedMethod.prefix}[0-9]{8}$`);
      return regex.test(number);
    }
    
    return false;
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
      if (paymentMethod !== "pay-later" && !validatePaymentNumber(paymentNumber)) {
        const selectedMethod = PAYMENT_METHODS.find(method => method.id === paymentMethod);
        let errorMessage = "Veuillez entrer un numéro valide pour le paiement";
        
        if (selectedMethod && selectedMethod.prefix) {
          errorMessage = `Pour ${selectedMethod.name}, le numéro doit commencer par ${selectedMethod.prefix} et avoir 10 chiffres`;
        } else if (paymentMethod === "wave") {
          errorMessage = "Le numéro Wave doit avoir 10 chiffres";
        }
        
        toast({
          variant: "destructive",
          title: "Numéro de paiement invalide",
          description: errorMessage
        });
        return;
      }
    } else if (step === 4) {
      // Lancer l'animation de paiement
      setIsProcessing(true);
      setShowPaymentAnimation(true);
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

  // Fonction appelée quand l'animation de paiement est terminée
  const handlePaymentAnimationComplete = () => {
    setShowPaymentAnimation(false);
    setIsProcessing(false);
    setStep(5);
    
    toast({
      title: "Transfert réussi",
      description: `${amount} F ont été transférés au numéro ${phoneNumber}`
    });
  };

  // Obtenir le préfixe du moyen de paiement actuellement sélectionné
  const getSelectedPaymentMethodPrefix = () => {
    const selectedMethod = PAYMENT_METHODS.find(method => method.id === paymentMethod);
    return selectedMethod?.prefix || "";
  };

  // Obtenir le nom du moyen de paiement pour l'affichage
  const getPaymentMethodName = () => {
    if (paymentMethod === "pay-later") {
      return "Payer plus tard";
    }
    return PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name || paymentMethod;
  };

  // Gestion du changement de méthode de paiement pour réinitialiser le numéro si nécessaire
  useEffect(() => {
    // Réinitialiser le numéro de paiement lors du changement de méthode
    setPaymentNumber("");
  }, [paymentMethod]);

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
                {/* Options de paiement mobile */}
                {PAYMENT_METHODS.map((method) => (
                  <div key={method.id} className="flex items-center space-x-2 border p-3 rounded-lg">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex-1 flex items-center cursor-pointer">
                      <div className="w-10 h-10 mr-3 flex items-center justify-center overflow-hidden">
                        <img 
                          src={method.logo} 
                          alt={method.name} 
                          className="w-8 h-8 object-contain rounded-md"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-xs text-muted-foreground">{method.description}</p>
                      </div>
                    </Label>
                  </div>
                ))}
                
                {/* Option "Payer plus tard" */}
                <div className="flex items-center space-x-2 border p-3 rounded-lg mt-6">
                  <RadioGroupItem value="pay-later" id="pay-later" />
                  <Label htmlFor="pay-later" className="flex-1 flex items-center cursor-pointer">
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
            
            {paymentMethod !== "pay-later" && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Numéro {paymentMethod !== "wave" ? PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name : "Wave"}
                </label>
                <div className="relative">
                  <Input
                    className="pl-10 py-3"
                    placeholder={
                      paymentMethod !== "wave" 
                        ? `${getSelectedPaymentMethodPrefix()} XX XX XX XX` 
                        : "Numéro à 10 chiffres"
                    }
                    value={paymentNumber}
                    onChange={(e) => setPaymentNumber(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Phone size={18} className="text-primary/60" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {paymentMethod !== "wave"
                    ? `Le numéro doit commencer par ${getSelectedPaymentMethodPrefix()} et avoir 10 chiffres`
                    : "Entrez votre numéro Wave (10 chiffres)"}
                </p>
              </div>
            )}
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
                  <span className="font-medium">
                    {getPaymentMethodName()}
                  </span>
                </div>
                {paymentMethod !== "pay-later" && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Numéro</span>
                    <span className="font-medium">{paymentNumber}</span>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <p className="text-sm text-center text-muted-foreground mb-4">
              Veuillez vérifier les détails de votre transaction avant de confirmer
            </p>
          </div>
        );
      
      case 5:
        return (
          <TransferSuccess 
            phoneNumber={phoneNumber}
            operator={operator}
            amount={amount}
            total={total}
            paymentMethod={getPaymentMethodName()}
            paymentNumber={paymentMethod !== "pay-later" ? paymentNumber : undefined}
          />
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
      {showPaymentAnimation && (
        <PaymentAnimation onComplete={handlePaymentAnimationComplete} />
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
