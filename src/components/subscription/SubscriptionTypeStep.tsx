
import React, { useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SUBSCRIPTION_TYPES } from "@/data/subscriptionData";
import { Wifi, PhoneCall } from "lucide-react";

interface SubscriptionTypeStepProps {
  subscriptionType: string;
  setSubscriptionType: (value: string) => void;
  onAutoAdvance?: () => void;
}

const SubscriptionTypeStep: React.FC<SubscriptionTypeStepProps> = ({ 
  subscriptionType, 
  setSubscriptionType,
  onAutoAdvance
}) => {
  // Fonction pour obtenir l'icône en fonction du nom
  const getIconByName = (iconName: string) => {
    switch (iconName) {
      case "Wifi":
        return <Wifi size={28} />;
      case "PhoneCall":
        return <PhoneCall size={28} />;
      default:
        return null;
    }
  };
  
  // Passage automatique à l'étape suivante lors de la sélection
  const handleTypeChange = (value: string) => {
    setSubscriptionType(value);
    // Attendre 400ms avant de passer à l'étape suivante (pour l'animation)
    if (onAutoAdvance) {
      setTimeout(() => {
        onAutoAdvance();
      }, 400);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-4 text-center">Type de forfait</h2>
      
      <div className="mb-6 px-2">
        <RadioGroup
          value={subscriptionType}
          onValueChange={handleTypeChange}
          className="grid grid-cols-2 gap-6"
        >
          {SUBSCRIPTION_TYPES.map((type) => (
            <div key={type.id} className="relative">
              <RadioGroupItem 
                value={type.id} 
                id={type.id} 
                className="peer sr-only" 
              />
              <Label
                htmlFor={type.id}
                className="flex flex-col items-center justify-center h-40 rounded-2xl border-2 border-muted p-5 hover:border-primary/50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 cursor-pointer shadow-sm hover:shadow-md transition-all"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {getIconByName(type.iconName)}
                </div>
                <div className="text-center">
                  <div className="text-base font-semibold">{type.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {type.description}
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default SubscriptionTypeStep;
