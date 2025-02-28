import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { motion } from "framer-motion";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [hasSeenOnboarding] = useLocalStorage("hasSeenOnboarding", false);
  const [user] = useLocalStorage("user", null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.1,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  useEffect(() => {
    console.log("SplashScreen mounted");
    
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 50);
    
    const timer = setTimeout(() => {
      console.log("Navigation timer triggered");
      
      if (hasSeenOnboarding && user?.isAuthenticated) {
        console.log("Navigating to dashboard");
        navigate("/dashboard");
      } 
      else if (hasSeenOnboarding) {
        console.log("Navigating to login");
        navigate("/login");
      } 
      else {
        console.log("Navigating to onboarding");
        navigate("/onboarding");
      }
    }, 2500);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate, hasSeenOnboarding, user]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background to-muted/30 flex items-center justify-center z-50">
      <motion.div
        className="w-full max-w-xs px-6 flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          variants={itemVariants}
          className="relative"
        >
          <motion.div
            className="absolute inset-0 rounded-3xl bg-primary/20"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.4 }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 2,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-3xl bg-secondary/20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.4, opacity: 0.2 }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 2.5,
              ease: "easeInOut",
              delay: 0.2
            }}
          />
          
          <div className="h-28 w-28 rounded-3xl flex items-center justify-center relative overflow-hidden bg-gradient-to-tr from-primary via-secondary to-destructive shadow-xl z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <motion.span 
              className="text-white font-bold text-6xl relative z-10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.3
              }}
            >
              I
            </motion.span>
          </div>
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          className="mt-8 text-center"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            IvoirePay
          </h1>
          <p className="text-muted-foreground mt-2">
            Transferts & Pass mobiles
          </p>
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          className="w-full mt-10"
        >
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: "0%" }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
