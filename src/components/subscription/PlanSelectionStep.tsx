
import React, { useState } from "react";
import { ORANGE_INTERNET_CATEGORIES } from "@/data/subscriptionData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Plan {
  id: string;
  name: string;
  category?: string;
  data?: string;
  minutes?: string;
  validity: string;
  price: number;
  description: string;
  icon?: React.ReactNode;
  isNew?: boolean;
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
  const [activeCategory, setActiveCategory] = useState<string | null>(
    operator === "Orange" && subscriptionType === "internet" 
      ? ORANGE_INTERNET_CATEGORIES[0].id 
      : null
  );

  // Filtrer les plans par catégorie pour Orange Internet
  const getFilteredPlans = () => {
    if (operator === "Orange" && subscriptionType === "internet" && activeCategory) {
      return plans.filter(plan => plan.category === activeCategory);
    }
    return plans;
  };

  // Formater les prix
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Plans filtrés selon la catégorie active
  const filteredPlans = getFilteredPlans();

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
        <>
          {operator === "Orange" && subscriptionType === "internet" && (
            <div className="mb-4">
              <Tabs 
                defaultValue={ORANGE_INTERNET_CATEGORIES[0].id}
                onValueChange={(value) => setActiveCategory(value)}
                className="w-full"
              >
                <TabsList className="w-full mb-3 grid grid-cols-3 h-auto">
                  {ORANGE_INTERNET_CATEGORIES.map((category) => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="py-2 text-xs font-medium"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {ORANGE_INTERNET_CATEGORIES.map((category) => (
                  <TabsContent key={category.id} value={category.id} className="mt-0">
                    <div className="text-center mb-2 text-sm font-medium text-muted-foreground">
                      {category.name}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className={`border p-4 rounded-lg transition-colors cursor-pointer ${
                  selectedPlan?.id === plan.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{plan.name}</h4>
                    {plan.isNew && (
                      <Badge className="bg-purple-500 text-white text-xs mt-1">Nouveau !</Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-orange-500 text-lg">{formatPrice(plan.price)} F</span>
                    <p className="text-xs text-muted-foreground">{plan.validity}</p>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm mb-1 items-center">
                  <div className="flex items-center gap-2">
                    {plan.icon && <span>{plan.icon}</span>}
                    <span className="font-medium">
                      {subscriptionType === "internet" ? plan.data : plan.minutes}
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">{plan.description}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PlanSelectionStep;
