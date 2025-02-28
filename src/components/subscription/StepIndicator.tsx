
import React from "react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-center space-x-2 mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index + 1}
          className={`h-2 w-2 rounded-full ${
            index + 1 === currentStep 
              ? "bg-primary w-6" 
              : index + 1 < currentStep 
                ? "bg-primary" 
                : "bg-muted"
          } transition-all duration-300`}
        />
      ))}
    </div>
  );
};

export default StepIndicator;
