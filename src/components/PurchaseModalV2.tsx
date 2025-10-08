"use client";

import { useState, useEffect } from "react";
import { Tip, PaymentPlan } from "@/src/types";
import { useRouter } from "next/navigation";
import { usePlans } from "@/src/contexts/PlansContext";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  tip?: Tip;
  onPurchase: (planId: string) => void;
}

export default function PurchaseModalV2({
  isOpen,
  onClose,
  tip,
  onPurchase,
}: PurchaseModalProps) {
  const { plans, loading } = usePlans();
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const router = useRouter();

  // Selecionar plano popular por padrão quando os planos carregarem
  useEffect(() => {
    if (plans.length > 0 && !selectedPlan) {
      const popularPlan = plans.find((p) => p.isPopular);
      setSelectedPlan(popularPlan?.id || plans[0]?.id || "");
    }
  }, [plans, selectedPlan]);

  if (!isOpen) return null;

  const selectPlan = (planType: string) => {
    setSelectedPlan(planType);
  };

  const buyNow = () => {
    const selectedPlanData = plans.find((plan) => plan.id === selectedPlan);
    console.log(selectedPlanData);
    onClose();
    // Redirecionar para checkout apenas com ID do plano
    if (selectedPlanData) {
      router.push(`/checkout?plan=${selectedPlan}`);
    }
  };

  const viewAllPlans = () => {
    onClose();
    router.push("/plans");
  };

  const closeModal = () => {
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div
      className="modal-overlay"
      id="modalOverlay"
      onClick={handleOverlayClick}
    >
      <div className="modal px-4 py-4">
        <button className="close-btn" onClick={closeModal}>
          &times;
        </button>
        <div className="flex justify-center items-center ">
          <h1 className="modal-title">Desbloqueei!</h1>
        </div>

        {tip && (
          <p className="modal-subtitle mb-2">
            {tip
              ? `${tip.teams} - ${tip.league}`
              : "Palmeiras vs Flamengo - Final Copa do Brasil"}
          </p>
        )}

        <div className="flex flex-col gap-2 mb-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a3bd04] mx-auto mb-2"></div>
              <p className="text-sm text-gray-400">Carregando planos...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Nenhum plano disponível no momento</p>
            </div>
          ) : (
            plans.map((plan) => {
              // Construir descrição baseada no tipo de plano
              const description =
                plan.type === "package"
                  ? `${plan.tipsIncluded} ${plan.tipsIncluded === 1 ? "palpite" : "palpites"} premium com análises completas`
                  : `Tips ilimitados por ${plan.duration} dias. Acesso total à plataforma`;

              return (
                <div
                  key={plan.id}
                  className={`plan-card p-2 ${plan.isPopular ? "popular" : ""} ${
                    selectedPlan === plan.id ? "selected" : ""
                  }`}
                  onClick={() => selectPlan(plan.id)}
                >
                  {plan.isPopular && (
                    <div className="popular-badge">Mais Popular</div>
                  )}

                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="plan"
                      value={plan.id}
                      checked={selectedPlan === plan.id}
                      onChange={() => selectPlan(plan.id)}
                      className="plan-radio"
                    />

                    <div className="flex-1">
                      <h3 className="plan-name">{plan.name}</h3>
                      <div className="plan-price">
                        R$ {(plan.price / 100).toFixed(2).replace(".", ",")}
                      </div>
                      <p className="plan-description">{description}</p>
                      
                      {/* Mostrar features se houver */}
                      {plan.features && plan.features.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {plan.features.slice(0, 2).map((feature, idx) => (
                            <p key={idx} className="text-xs text-gray-400">
                              ✓ {feature}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="buttons-container">
          <button
            className="btn-primary bg-[#a3bd04] text-white"
            onClick={buyNow}
            disabled={loading || plans.length === 0 || !selectedPlan}
          >
            {loading ? "Carregando..." : "Comprar Agora"}
          </button>
          <button className="btn-secondary" onClick={viewAllPlans}>
            Ver Todos os Planos
          </button>
        </div>
      </div>
    </div>
  );
}
