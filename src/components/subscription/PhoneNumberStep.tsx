
import React from "react";
import { Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { OPERATORS } from "@/data/subscriptionData";

interface PhoneNumberStepProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  operator: string;
}

const PhoneNumberStep: React.FC<PhoneNumberStepProps> = ({ 
  phoneNumber, 
  setPhoneNumber, 
  operator 
}) => {
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
};

export default PhoneNumberStep;
