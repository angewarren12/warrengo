
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft } from "lucide-react";
import PaymentAnimation from "@/components/PaymentAnimation";
import SubscriptionSuccess from "@/components/SubscriptionSuccess";

// Composants
import PhoneNumberStep from "@/components/subscription/PhoneNumberStep";
import SubscriptionTypeStep from "@/components/subscription/SubscriptionTypeStep";
import PlanSelectionStep from "@/components/subscription/PlanSelectionStep";
import PaymentMethodStep from "@/components/subscription/PaymentMethodStep";
import ConfirmationStep from "@/components/subscription/ConfirmationStep";
import StepIndicator from "@/components/subscription/StepIndicator";

// Données et utilitaires
import { OPERATORS, COMMISSION_PERCENTAGE } from "@/data/subscriptionData";
import { 
  validatePhoneNumber, 
  validatePaymentNumber, 
  getAvailablePlans, 
  getPaymentMethodName,
  calculateCommissionAndTotal
} from "@/utils/subscriptionUtils";

const SubscriptionService = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [operator, setOperator] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("internet");
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
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
      setOperator(OPERATORS[prefix] || "");
      
      // Réinitialiser le forfait sélectionné si l'opérateur change
      setSelectedPlan(null);
    } else {
      setOperator("");
      setSelectedPlan(null);
    }
  }, [phoneNumber]);

  // Calculer la commission et le total
  useEffect(() => {
    if (selectedPlan) {
      const { commission: commissionValue, total: totalValue } = calculateCommissionAndTotal(
        selectedPlan.price, 
        COMMISSION_PERCENTAGE
      );
      setCommission(commissionValue);
      setTotal(totalValue);
      
      // Passage automatique à l'étape suivante lorsqu'un plan est sélectionné
      if (step === 3) {
        setTimeout(() => {
          setStep(4);
        }, 300);
      }
    } else {
      setCommission(0);
      setTotal(0);
    }
  }, [selectedPlan, step]);

  // Gestion du changement de méthode de paiement pour réinitialiser le numéro si nécessaire
  useEffect(() => {
    // Réinitialiser le numéro de paiement lors du changement de méthode
    setPaymentNumber("");
  }, [paymentMethod]);

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
      
      if (!operator) {
        toast({
          variant: "destructive",
          title: "Opérateur non reconnu",
          description: "Le numéro saisi ne correspond à aucun opérateur pris en charge"
        });
        return;
      }
    } else if (step === 2) {
      // Vérifier uniquement que l'utilisateur a sélectionné un type de forfait
      if (!subscriptionType) {
        toast({
          variant: "destructive",
          title: "Aucun type de forfait sélectionné",
          description: "Veuillez sélectionner un type de forfait pour continuer"
        });
        return;
      }
    } else if (step === 3) {
      if (!selectedPlan) {
        toast({
          variant: "destructive",
          title: "Aucun forfait sélectionné",
          description: "Veuillez sélectionner un forfait pour continuer"
        });
        return;
      }
    } else if (step === 4) {
      if (paymentMethod !== "pay-later" && !validatePaymentNumber(paymentNumber, paymentMethod)) {
        let errorMessage = "Veuillez entrer un numéro valide pour le paiement";
        
        if (paymentMethod === "orange-money") {
          errorMessage = "Pour Orange Money, le numéro doit commencer par 07 et avoir 10 chiffres";
        } else if (paymentMethod === "moov-money") {
          errorMessage = "Pour Moov Money, le numéro doit commencer par 01 et avoir 10 chiffres";
        } else if (paymentMethod === "mtn-money") {
          errorMessage = "Pour MTN Money, le numéro doit commencer par 05 et avoir 10 chiffres";
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
    } else if (step === 5) {
      // Lancer l'animation de paiement
      setIsProcessing(true);
      setShowPaymentAnimation(true);
      return;
    } else if (step === 6) {
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
    setStep(6);
    
    toast({
      title: "Souscription réussie",
      description: `Le forfait ${selectedPlan.name} a été activé pour le numéro ${phoneNumber}`
    });
  };

  // Rendu des différentes étapes
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PhoneNumberStep 
            phoneNumber={phoneNumber} 
            setPhoneNumber={setPhoneNumber}
            operator={operator}
          />
        );
      
      case 2:
        return (
          <SubscriptionTypeStep 
            subscriptionType={subscriptionType}
            setSubscriptionType={setSubscriptionType}
            onAutoAdvance={() => setStep(3)}
          />
        );
      
      case 3:
        return (
          <PlanSelectionStep 
            plans={getAvailablePlans(operator, subscriptionType)}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            subscriptionType={subscriptionType}
            operator={operator}
          />
        );
      
      case 4:
        return (
          <PaymentMethodStep 
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            paymentNumber={paymentNumber}
            setPaymentNumber={setPaymentNumber}
          />
        );
      
      case 5:
        return (
          <ConfirmationStep 
            phoneNumber={phoneNumber}
            operator={operator}
            selectedPlan={selectedPlan}
            subscriptionType={subscriptionType}
            commission={commission}
            total={total}
            paymentMethod={paymentMethod}
            getPaymentMethodName={() => getPaymentMethodName(paymentMethod)}
            paymentNumber={paymentNumber}
            isProcessing={isProcessing}
          />
        );
      
      case 6:
        return (
          <SubscriptionSuccess 
            phoneNumber={phoneNumber}
            operator={operator}
            plan={selectedPlan}
            subscriptionType={subscriptionType}
            total={total}
            paymentMethod={getPaymentMethodName(paymentMethod)}
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
      case 1: return "Souscription forfait";
      case 2: return "Choix du type";
      case 3: return "Choix du forfait";
      case 4: return "Moyen de paiement";
      case 5: return "Confirmer la souscription";
      case 6: return "Récapitulatif";
      default: return "Souscription forfait";
    }
  };

  // Rendu du texte du bouton principal
  const getButtonText = () => {
    switch (step) {
      case 1:
        return "Continuer";
      case 2:
      case 3:
        // Masquer le texte du bouton pour ces étapes
        return "";
      case 4:
        return "Continuer";
      case 5:
        return isProcessing ? "Traitement en cours..." : "Confirmer la souscription";
      case 6:
        return "Retour à l'accueil";
      default:
        return "Continuer";
    }
  };

  // Déterminer si le bouton "Continuer" doit être affiché
  const shouldShowContinueButton = () => {
    // Ne pas afficher le bouton pour les étapes 2 et 3 (passage automatique)
    if (step === 2) return false;
    if (step === 3 && !selectedPlan) return false;
    return true;
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

        {step < 6 && <StepIndicator currentStep={step} totalSteps={5} />}

        <div className="mb-6 mx-auto" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
          {renderStep()}
        </div>

        {shouldShowContinueButton() && (
          <div className="fixed bottom-16 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t">
            <button
              className={`btn-primary w-full ${isProcessing ? "opacity-80" : ""}`}
              onClick={handleNext}
              disabled={isProcessing}
            >
              {getButtonText()}
              {!isProcessing && step < 6 && step !== 2 && step !== 3 && <ArrowRight size={16} className="ml-2" />}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SubscriptionService;
