
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SUBSCRIPTION_TYPES } from "@/data/subscriptionData";

interface SubscriptionTypeStepProps {
  subscriptionType: string;
  setSubscriptionType: (value: string) => void;
}

const SubscriptionTypeStep: React.FC<SubscriptionTypeStepProps> = ({ 
  subscriptionType, 
  setSubscriptionType 
}) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-4 text-center">Type de forfait</h2>
      
      <div className="mb-6">
        <RadioGroup
          value={subscriptionType}
          onValueChange={setSubscriptionType}
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
                className="flex flex-col items-center justify-center h-32 rounded-xl border-2 border-muted p-4 hover:border-primary/50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 cursor-pointer shadow-sm hover:shadow-md transition-all"
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  {type.icon}
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
