
import React, { useState, useRef } from "react";
import { ORANGE_INTERNET_CATEGORIES } from "@/data/subscriptionData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Smartphone } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  category?: string;
  data?: string;
  minutes?: string;
  validity: string;
  price: number;
  description: string;
  iconColor?: string;
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
  
  const tabsListRef = useRef<HTMLDivElement>(null);
  
  // Fonction pour faire défiler les catégories
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsListRef.current) {
      const scrollAmount = direction === 'left' ? -120 : 120;
      tabsListRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
            <div className="mb-4 relative">
              {/* Boutons de défilement */}
              <button 
                onClick={() => scrollTabs('left')} 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 shadow-md"
                aria-label="Défiler vers la gauche"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              
              <Tabs 
                defaultValue={ORANGE_INTERNET_CATEGORIES[0].id}
                onValueChange={(value) => setActiveCategory(value)}
                className="w-full"
              >
                <div className="overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <TabsList 
                    ref={tabsListRef}
                    className="w-full mb-3 inline-flex h-auto overflow-x-auto whitespace-nowrap px-1 py-1.5"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {ORANGE_INTERNET_CATEGORIES.map((category) => (
                      <TabsTrigger 
                        key={category.id} 
                        value={category.id}
                        className="py-2 px-4 text-xs font-medium flex-shrink-0"
                      >
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {ORANGE_INTERNET_CATEGORIES.map((category) => (
                  <TabsContent key={category.id} value={category.id} className="mt-0">
                    <div className="text-center mb-2 text-sm font-medium text-muted-foreground">
                      {category.name}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
              
              <button 
                onClick={() => scrollTabs('right')} 
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 rounded-full p-1 shadow-md"
                aria-label="Défiler vers la droite"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className={`border p-5 rounded-2xl transition-colors cursor-pointer h-auto min-h-[140px] ${
                  selectedPlan?.id === plan.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                } shadow-sm hover:shadow-md`}
                onClick={() => setSelectedPlan(plan)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-base">{plan.name}</h4>
                    {plan.isNew && (
                      <Badge className="bg-purple-500 text-white text-xs mt-1">Nouveau !</Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-orange-500 text-lg">{formatPrice(plan.price)} F</span>
                    <p className="text-xs text-muted-foreground">{plan.validity}</p>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm mb-2 items-center">
                  <div className="flex items-center gap-2">
                    {plan.iconColor && (
                      <Smartphone className={plan.iconColor === "orange" ? "text-orange-500" : "text-gray-500"} size={18} />
                    )}
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
