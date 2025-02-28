
import React from "react";

interface Plan {
  id: string;
  name: string;
  data?: string;
  minutes?: string;
  validity: string;
  price: number;
  description: string;
}

interface PlanSelectionStepProps {
  plans: Plan[];
  selectedPlan: Plan | null;
  setSelectedPlan: (plan: Plan) => void;
  subscriptionType: string;
  operator: string;
}

const PlanSelectionStep: React.FC<PlanSelectionStepProps> = ({ 
  plans, 
  selectedPlan, 
  setSelectedPlan,
  subscriptionType,
  operator
}) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-4 text-center">Forfaits disponibles</h2>
      
      {plans.length === 0 ? (
        <div className="text-center p-6 border rounded-lg">
          <p className="text-muted-foreground">
            {operator 
              ? `Aucun forfait ${subscriptionType === "internet" ? "internet" : "appel"} disponible pour ${operator}`
              : "Veuillez d'abord sélectionner un numéro de téléphone valide"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border p-4 rounded-lg transition-colors cursor-pointer ${
                selectedPlan?.id === plan.id
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/50"
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">{plan.name}</h4>
                <span className="font-bold text-primary">{plan.price} F</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">
                  {subscriptionType === "internet" ? "Volume" : "Minutes"}:
                </span>
                <span className="font-medium">
                  {subscriptionType === "internet" ? plan.data : plan.minutes}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Validité:</span>
                <span className="font-medium">{plan.validity}</span>
              </div>
              <p className="text-xs text-muted-foreground">{plan.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlanSelectionStep;
