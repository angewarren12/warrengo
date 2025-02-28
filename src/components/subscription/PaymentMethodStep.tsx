
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Phone, ArrowRight } from "lucide-react";
import { PAYMENT_METHODS } from "@/data/subscriptionData";

interface PaymentMethodStepProps {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  paymentNumber: string;
  setPaymentNumber: (value: string) => void;
}

const PaymentMethodStep: React.FC<PaymentMethodStepProps> = ({ 
  paymentMethod, 
  setPaymentMethod, 
  paymentNumber, 
  setPaymentNumber 
}) => {
  // Obtenir le préfixe du moyen de paiement actuellement sélectionné
  const getSelectedPaymentMethodPrefix = () => {
    const selectedMethod = PAYMENT_METHODS.find(method => method.id === paymentMethod);
    return selectedMethod?.prefix || "";
  };

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
                <ArrowRight size={18} className="text-primary" />
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
};

export default PaymentMethodStep;
