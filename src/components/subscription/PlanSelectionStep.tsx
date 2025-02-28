
import React, { useState, useRef, useEffect } from "react";
import { ORANGE_INTERNET_CATEGORIES } from "@/data/subscriptionData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Smartphone, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Fonction pour faire défiler les catégories
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsListRef.current) {
      const scrollAmount = direction === 'left' ? -150 : 150;
      tabsListRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Vérifier si les boutons de défilement sont nécessaires
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  
  useEffect(() => {
    if (tabsListRef.current) {
      const checkOverflow = () => {
        const el = tabsListRef.current;
        if (el) {
          setShowScrollButtons(el.scrollWidth > el.clientWidth);
        }
      };
      
      checkOverflow();
      window.addEventListener('resize', checkOverflow);
      return () => window.removeEventListener('resize', checkOverflow);
    }
  }, [operator, subscriptionType]);

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

  // Défilement fluide lors du changement de catégorie
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeCategory]);

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-4 text-center">Forfaits disponibles</h2>
      
      {plans.length === 0 ? (
        <div className="text-center p-6 border rounded-xl bg-muted/20">
          <p className="text-muted-foreground">
            {operator 
              ? `Aucun forfait ${subscriptionType === "internet" ? "internet" : "appel"} disponible pour ${operator}`
              : "Veuillez d'abord sélectionner un numéro de téléphone valide"}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {operator === "Orange" && subscriptionType === "internet" && (
            <div className="relative">
              {showScrollButtons && (
                <>
                  <button 
                    onClick={() => scrollTabs('left')} 
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 dark:bg-background/50 rounded-full p-1.5 shadow-md border"
                    aria-label="Défiler vers la gauche"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <button 
                    onClick={() => scrollTabs('right')} 
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 dark:bg-background/50 rounded-full p-1.5 shadow-md border"
                    aria-label="Défiler vers la droite"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
              
              <Tabs 
                defaultValue={ORANGE_INTERNET_CATEGORIES[0].id}
                onValueChange={(value) => setActiveCategory(value)}
                className="w-full"
              >
                <div className="mx-7 overflow-hidden">
                  <TabsList 
                    ref={tabsListRef}
                    className="w-max mb-3 flex overflow-x-auto py-1.5 px-0.5 no-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {ORANGE_INTERNET_CATEGORIES.map((category) => (
                      <TabsTrigger 
                        key={category.id} 
                        value={category.id}
                        className="py-2 px-5 text-xs font-medium rounded-full min-w-max mx-1 first:ml-0 last:mr-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
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
            </div>
          )}

          <div 
            ref={scrollContainerRef}
            className="grid grid-cols-1 gap-4 overflow-y-auto pr-1"
            style={{ maxHeight: '60vh' }}
          >
            {filteredPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`border-2 rounded-2xl transition-all duration-200 cursor-pointer ${
                  selectedPlan?.id === plan.id
                    ? "border-primary shadow-lg shadow-primary/20"
                    : "border-border hover:border-primary/60 hover:shadow-md"
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-base">{plan.name}</h4>
                      {plan.isNew && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium">
                          Nouveau !
                        </Badge>
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
                        <div className="bg-primary/10 p-1.5 rounded-full">
                          <Smartphone 
                            className={plan.iconColor === "orange" ? "text-orange-500" : "text-gray-500"} 
                            size={16}
                          />
                        </div>
                      )}
                      <span className="font-medium">
                        {subscriptionType === "internet" ? plan.data : plan.minutes}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-2">{plan.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanSelectionStep;
