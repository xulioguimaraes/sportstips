"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Tip, PaymentPlan } from "@/src/types";
import { useRouter } from "next/navigation";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  tip?: Tip;
  onPurchase: (planId: string) => void;
}

const quickPlans: PaymentPlan[] = [
  {
    id: "single",
    name: "Palpite Único",
    type: "package",
    price: 9.9,
    currency: "BRL",
    tipsIncluded: 1,
    features: ["Acesso ao palpite completo desta partida com análise detalhada"],
  },
  {
    id: "pack",
    name: "Pacote 5 Palpites",
    type: "package",
    price: 39.9,
    currency: "BRL",
    tipsIncluded: 5,
    features: ["5 palpites premium com análises completas. Economize 50%!"],
    isPopular: true,
  },
  {
    id: "weekly",
    name: "Assinatura Semanal",
    type: "subscription",
    price: 79.9,
    currency: "BRL",
    duration: 7,
    features: ["Palpites ilimitados por 7 dias. Acesso total à plataforma"],
  },
];

export default function PurchaseModal({
  isOpen,
  onClose,
  tip,
  onPurchase,
}: PurchaseModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>("pack");
  const router = useRouter();
  
  if (!isOpen) return null;

  const handlePurchase = () => {
    onPurchase(selectedPlan);
    onClose();
  };

  const handleViewAllPlans = () => {
    onClose();
    router.push("/plans");
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  return (
    <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-lg flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-brand-dark rounded-3xl p-10 max-w-md w-[90%] max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10 animate-slide-up relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-text-secondary hover:text-white text-2xl p-2 rounded-full hover:bg-white/10 transition-all duration-200"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Unlock Icon */}
        <div className="w-15 h-15 mx-auto mb-5 bg-gradient-to-br from-brand-green to-brand-green-light rounded-full flex items-center justify-center animate-pulse-custom">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" fill="white"/>
            <circle cx="12" cy="15" r="2" fill="white"/>
          </svg>
        </div>
        
        {/* Title and Subtitle */}
        <h1 className="text-brand-green text-3xl font-bold text-center mb-2 tracking-tight">Desbloqueie!</h1>
        <p className="text-text-secondary text-lg text-center mb-8 font-normal">
          {tip ? `${tip.teams} - ${tip.league}` : "Palmeiras vs Flamengo - Final Copa do Brasil"}
        </p>
        
        {/* Plans Container */}
        <div className="flex flex-col gap-4 mb-8">
          {quickPlans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => handlePlanSelect(plan.id)}
              className={`plan-card border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-brand-green hover:bg-brand-green/10 hover:-translate-y-0.5 relative overflow-hidden ${
                plan.isPopular && selectedPlan !== plan.id
                  ? "bg-gradient-to-br from-brand-yellow/15 to-brand-yellow/5 border-brand-yellow"
                  : selectedPlan === plan.id
                  ? "!border-brand-green !bg-brand-green/15"
                  : "bg-white/5 border-white/10"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-px right-5 bg-gradient-to-r from-brand-yellow to-brand-yellow-dark text-brand-dark px-4 py-1.5 rounded-b-xl text-xs font-bold uppercase tracking-wider">
                  Mais Popular
                </div>
              )}
              
              <h3 className="text-white text-lg font-semibold mb-2">{plan.name}</h3>
              <div className="text-brand-green text-3xl font-bold mb-3">
                R$ {plan.price.toFixed(2).replace('.', ',')}
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                {plan.features[0]}
              </p>
            </div>
          ))}
        </div>
        
        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handlePurchase}
            className="bg-gradient-to-r from-brand-green to-brand-green-light text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-green/40"
          >
            Comprar Agora
          </button>
          <button
            onClick={handleViewAllPlans}
            className="bg-transparent text-text-secondary border-2 border-white/20 font-medium py-3.5 px-8 rounded-xl transition-all duration-300 hover:border-brand-green hover:text-brand-green hover:bg-brand-green/10"
          >
            Ver Todos os Planos
          </button>
        </div>
      </div>
    </div>
  );
}
