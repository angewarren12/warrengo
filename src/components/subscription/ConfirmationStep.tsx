
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Plan {
  id: string;
  name: string;
  data?: string;
  minutes?: string;
  validity: string;
  price: number;
  description: string;
}

interface ConfirmationStepProps {
  phoneNumber: string;
  operator: string;
  selectedPlan: Plan;
  subscriptionType: string;
  commission: number;
  total: number;
  paymentMethod: string;
  getPaymentMethodName: () => string;
  paymentNumber: string;
  isProcessing: boolean;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  phoneNumber,
  operator,
  selectedPlan,
  subscriptionType,
  commission,
  total,
  paymentMethod,
  getPaymentMethodName,
  paymentNumber,
  isProcessing
}) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-4 text-center">Confirmation</h2>
      
      <Card className="border mb-6">
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Destinataire</span>
            <span className="font-medium">{phoneNumber} ({operator})</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Forfait</span>
            <span className="font-medium">{selectedPlan?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Type</span>
            <span className="font-medium">
              {subscriptionType === "internet" ? "Pass Internet" : "Pass Appel"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {subscriptionType === "internet" ? "Volume" : "Minutes"}
            </span>
            <span className="font-medium">
              {subscriptionType === "internet" ? selectedPlan?.data : selectedPlan?.minutes}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Validité</span>
            <span className="font-medium">{selectedPlan?.validity}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Montant</span>
            <span className="font-medium">{selectedPlan?.price} F</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Commission (2%)</span>
            <span className="font-medium">{commission} F</span>
          </div>
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="font-medium">Total</span>
            <span className="font-bold text-lg">{total} F</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border mb-6">
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Moyen de paiement</span>
            <span className="font-medium">
              {getPaymentMethodName()}
            </span>
          </div>
          {paymentMethod !== "pay-later" && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Numéro</span>
              <span className="font-medium">{paymentNumber}</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <p className="text-sm text-center text-muted-foreground mb-4">
        Veuillez vérifier les détails de votre transaction avant de confirmer
      </p>
    </div>
  );
};

export default ConfirmationStep;
