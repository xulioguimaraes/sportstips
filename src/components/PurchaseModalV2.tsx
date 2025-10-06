"use client";

import { useState, useEffect } from "react";
import { Tip } from "@/src/types";
import { useRouter } from "next/navigation";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  tip?: Tip;
  onPurchase: (planId: string) => void;
}

const mockPlans = [
  {
    id: "single",
    name: "Palpite Único",
    type: "package",
    price: 9.9,
    currency: "BRL",
    tipsIncluded: 1,
    description:
      "Acesso ao palpite completo desta partida com análise detalhada",
    isPopular: false,
  },
  {
    id: "pack",
    name: "Pacote 5 Palpites",
    type: "package",
    price: 39.9,
    currency: "BRL",
    tipsIncluded: 5,
    description: "5 palpites premium com análises completas. Economize 50%!",
    isPopular: true,
  },
  {
    id: "weekly",
    name: "Assinatura Semanal",
    type: "subscription",
    price: 79.9,
    currency: "BRL",
    duration: 7,
    description: "Palpites ilimitados por 7 dias. Acesso total à plataforma",
    isPopular: false,
  },
];

export default function PurchaseModalV2({
  isOpen,
  onClose,
  tip,
  onPurchase,
}: PurchaseModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>("pack"); // Plano mais popular selecionado por padrão
  const router = useRouter();

  // Set popular plan as selected by default on mount
  useEffect(() => {
    setSelectedPlan("pack");
  }, []);

  if (!isOpen) return null;

  const selectPlan = (planType: string) => {
    setSelectedPlan(planType);
    console.log("Plano selecionado:", planType);
  };

  const buyNow = () => {
    console.log("Comprando plano:", selectedPlan);
    const selectedPlanData = mockPlans.find((plan) => plan.id === selectedPlan);
    onClose();
    // Redirecionar para checkout com dados do plano
    router.push(
      `/checkout?plan=${selectedPlan}&price=${
        selectedPlanData?.price
      }&name=${encodeURIComponent(selectedPlanData?.name || "")}`
    );
  };

  const viewAllPlans = () => {
    console.log("Visualizando todos os planos");
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
          {mockPlans.map((plan) => (
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
                  <div className="plan-price ">
                    R$ {plan.price.toFixed(2).replace(".", ",")}
                  </div>
                  <p className="plan-description">{plan.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="buttons-container">
          <button
            className="btn-primary bg-[#a3bd04] text-white"
            onClick={buyNow}
          >
            Comprar Agora
          </button>
          <button className="btn-secondary" onClick={viewAllPlans}>
            Ver Todos os Planos
          </button>
        </div>
      </div>
    </div>
  );
}
