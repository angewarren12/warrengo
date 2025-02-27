
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, Phone, Globe, Wallet } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const OnboardingPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const [, setHasSeenOnboarding] = useLocalStorage("hasSeenOnboarding", false);

  const pages = [
    {
      title: "Transfert d'unités mobile simplifié",
      description: "Envoyez des unités sur n'importe quel réseau en quelques clics, sans tracas.",
      icon: <Phone size={48} className="text-primary" />,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300"
    },
    {
      title: "Souscrivez à des pass en un instant",
      description: "Internet ou appels, choisissez le pass qui vous convient et activez-le immédiatement.",
      icon: <Globe size={48} className="text-primary" />,
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=300"
    },
    {
      title: "Paiement facile et sécurisé",
      description: "Utilisez Orange Money, Wave, MTN Money ou Moov Money pour vos transactions.",
      icon: <Wallet size={48} className="text-primary" />,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=300"
    },
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      setHasSeenOnboarding(true);
      navigate("/login");
    }
  };

  const handleSkip = () => {
    setHasSeenOnboarding(true);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between pt-12 pb-8 px-4">
      {/* Page indicators */}
      <div className="flex space-x-2 mb-12">
        {pages.map((_, index) => (
          <div 
            key={index} 
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentPage === index ? "w-8 bg-primary" : "w-2.5 bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 w-full flex flex-col items-center justify-center">
        <div className={`transform transition-all duration-500 w-full text-center ${
          currentPage === 0 ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 absolute"
        }`}>
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white">
              {pages[0].icon}
            </div>
          </div>
          <h1 className="text-2xl font-bold mt-6 mb-3">{pages[0].title}</h1>
          <p className="text-muted-foreground mb-6">{pages[0].description}</p>
          <div className="relative w-full h-52 mb-4 rounded-xl overflow-hidden">
            <img 
              src={pages[0].image} 
              alt="Transfert d'unités" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#8B5CF6]/50 to-transparent"></div>
          </div>
        </div>

        <div className={`transform transition-all duration-500 w-full text-center ${
          currentPage === 1 ? "translate-x-0 opacity-100" : currentPage < 1 ? "translate-x-full opacity-0 absolute" : "-translate-x-full opacity-0 absolute"
        }`}>
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] text-white">
              {pages[1].icon}
            </div>
          </div>
          <h1 className="text-2xl font-bold mt-6 mb-3">{pages[1].title}</h1>
          <p className="text-muted-foreground mb-6">{pages[1].description}</p>
          <div className="relative w-full h-52 mb-4 rounded-xl overflow-hidden">
            <img 
              src={pages[1].image} 
              alt="Souscription de pass" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0EA5E9]/50 to-transparent"></div>
          </div>
        </div>

        <div className={`transform transition-all duration-500 w-full text-center ${
          currentPage === 2 ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 absolute"
        }`}>
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-gradient-to-r from-[#F97316] to-[#D946EF] text-white">
              {pages[2].icon}
            </div>
          </div>
          <h1 className="text-2xl font-bold mt-6 mb-3">{pages[2].title}</h1>
          <p className="text-muted-foreground mb-6">{pages[2].description}</p>
          <div className="relative w-full h-52 mb-4 rounded-xl overflow-hidden">
            <img 
              src={pages[2].image} 
              alt="Paiement mobile" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F97316]/50 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="w-full mt-8 flex justify-between items-center">
        <button 
          onClick={handleSkip} 
          className="text-muted-foreground hover:text-foreground transition-colors px-4 py-2 text-sm"
        >
          Passer
        </button>
        
        <button 
          onClick={handleNext} 
          className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white px-6 py-2.5 rounded-full flex items-center font-medium hover:shadow-lg transition-all"
        >
          {currentPage === pages.length - 1 ? (
            <>
              Commencer <Check size={16} className="ml-2" />
            </>
          ) : (
            <>
              Suivant <ArrowRight size={16} className="ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage;
