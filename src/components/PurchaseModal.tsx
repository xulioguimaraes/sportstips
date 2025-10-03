"use client";

import { useState } from "react";
import { X, Star, Crown, Target, Check, ArrowRight, Zap } from "lucide-react";
import { Tip, PaymentPlan } from "@/src/types";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  tip?: Tip;
  onPurchase: (planId: string) => void;
}

const quickPlans: PaymentPlan[] = [
  {
    id: "single_tip",
    name: "Palpite Individual",
    type: "package",
    price: 9.9,
    currency: "BRL",
    tipsIncluded: 1,
    features: ["1 palpite premium", "Análise detalhada", "Suporte por 24h"],
  },
  {
    id: "package_5",
    name: "Pacote 5 Tips",
    type: "package",
    price: 39.9,
    currency: "BRL",
    tipsIncluded: 5,
    features: [
      "5 palpites premium",
      "Economia de 20%",
      "Análises detalhadas",
      "Suporte prioritário",
    ],
    isPopular: true,
  },
  {
    id: "weekly",
    name: "Semanal",
    type: "subscription",
    price: 29.9,
    currency: "BRL",
    duration: 7,
    features: [
      "Tips ilimitados",
      "Análises exclusivas",
      "Suporte VIP",
      "Cancelamento livre",
    ],
  },
];

export default function PurchaseModal({
  isOpen,
  onClose,
  tip,
  onPurchase,
}: PurchaseModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>("package_5");

  if (!isOpen) return null;

  const handlePurchase = () => {
    onPurchase(selectedPlan);
    onClose();
  };

  const handleViewAllPlans = () => {
    onClose();
    // Navegar para página de planos
    window.location.href = "/plans";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-dark-900 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-brand-500 to-brand-600 p-6 rounded-t-3xl text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-full p-1"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-accent-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Desbloqueie este Palpite</h2>
              <p className="text-indigo-100 text-sm">
                {tip ? `${tip.teams} - ${tip.league}` : "Acesso Premium"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Urgência */}
          <div className="bg-accent-500/10 border border-accent-500/30 rounded-xl p-3 mb-5">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-accent-500" />
              <p className="text-accent-500 font-semibold text-sm">
                ⏰ Oferta Limitada - Aproveite agora!
              </p>
            </div>
          </div>

          {/* Planos */}
          <div className="space-y-3 mb-6">
            {quickPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  selectedPlan === plan.id
                    ? "border-brand-500 bg-brand-500/10 shadow-md"
                    : "border-gray-600 hover:border-brand-500 bg-dark-800"
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-2 left-4 bg-accent-500 text-dark-900 px-3 py-1 rounded-full text-xs font-bold">
                    MAIS POPULAR
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-white">{plan.name}</h3>
                      {plan.isPopular && (
                        <Crown className="w-4 h-4 text-accent-500" />
                      )}
                    </div>

                    <div className="flex items-baseline space-x-2 mb-2">
                      <span className="text-2xl font-bold text-brand-500">
                        R$ {plan.price.toFixed(2)}
                      </span>
                      {plan.type === "package" &&
                        plan.tipsIncluded &&
                        plan.tipsIncluded > 1 && (
                          <span className="text-sm text-gray-400">
                            / {plan.tipsIncluded} tips
                          </span>
                        )}
                      {plan.type === "subscription" && (
                        <span className="text-sm text-gray-400">/ semana</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      {plan.features.slice(0, 2).map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Check className="w-3 h-3 text-brand-500 flex-shrink-0" />
                          <span className="text-sm text-gray-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === plan.id
                        ? "border-brand-500 bg-brand-500"
                        : "border-gray-500"
                    }`}
                  >
                    {selectedPlan === plan.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Principal */}
          <button
            onClick={handlePurchase}
            className="w-full bg-brand-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-brand-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Comprar Agora
          </button>

          {/* CTA Secundário */}
          <button
            onClick={handleViewAllPlans}
            className="w-full mt-3 text-brand-500 py-3 px-6 rounded-xl font-medium hover:bg-brand-500/10 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Ver todos os planos</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Garantia */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              🔒 Pagamento 100% seguro • 💰 Garantia de 7 dias
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
