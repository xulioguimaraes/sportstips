"use client";

import { useState, useEffect, useCallback } from "react";
import FilterTabs from "@/src/components/FilterTabs";
import FloatingActionButton from "@/src/components/FloatingActionButton";
import { Tip, FilterTab } from "@/src/types";
import { tipsService } from "@/src/services/tipsService";
import TipCardPublic from "@/src/components/TipCardPublic";
import DatePicker from "@/src/components/DatePicker";
import PurchaseModalV2 from "@/src/components/PurchaseModalV2";
import PromoCarousel from "@/src/components/PromoCarousel";
import SocialProfilesCarousel from "@/src/components/SocialProfilesCarousel";
import { Target } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [filteredTips, setFilteredTips] = useState<Tip[]>([]);
  const [filterTabs, setFilterTabs] = useState<FilterTab[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    // Inicializar com a data de hoje
    return new Date().toISOString().split("T")[0];
  });
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);

  // Load tips from Firebase
  const loadTips = useCallback(
    async (date?: string) => {
      try {
        setLoading(true);
        setError(null);
        const targetDate = date || selectedDate;

        // Buscar palpites por data
        const tipsData = await tipsService.getTipsByDate(targetDate);
        setTips(tipsData);
        setFilteredTips(tipsData);

        // Update stats based on real data
      } catch (err) {
        console.error("Erro ao carregar palpites:", err);
        setError("Erro ao carregar palpites. Tente novamente.");
        // Fallback to mock data
        setTips([]);
        setFilteredTips([]);
      } finally {
        setLoading(false);
      }
    },
    [selectedDate]
  );

  // Load tips on component mount and when date changes
  useEffect(() => {
    loadTips(selectedDate);
  }, [selectedDate, loadTips]);

  // Handle date change
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  // Filter functionality
  const handleFilterChange = (category: string) => {
    const updatedTabs = filterTabs.map((tab) => ({
      ...tab,
      isActive: tab.category === category,
    }));
    setFilterTabs(updatedTabs);

    if (category === "all") {
      setFilteredTips(tips);
    } else {
      const filtered = tips.filter(
        (tip) =>
          tip.category === category || (category === "premium" && tip.isPremium)
      );
      setFilteredTips(filtered);
    }
  };

  // Card interactions
  const handleTipClick = (tip: Tip) => {
    router.push(`/tip/${tip.id}`);
  };

  // Premium tips
  const handlePremiumClick = (tip: Tip | null) => {
    setSelectedTip(tip);
    setShowPurchaseModal(true);
  };

  const handlePurchase = (planId: string) => {
    // Implementar lógica de compra
    alert(`Redirecionando para pagamento do plano: ${planId}`);
  };

  // Simulate real-time odds updates (only for display, not saved to Firebase)
  const updateOdds = () => {
    setTips((prevTips) =>
      prevTips.map((tip) => ({
        ...tip,
        odds: tip.odds.map((odd) => ({
          ...odd,
          value: Math.max(1.1, odd.value + (Math.random() - 0.5) * 0.05),
        })),
      }))
    );

    // Also update filtered tips
    setFilteredTips((prevFilteredTips) =>
      prevFilteredTips.map((tip) => ({
        ...tip,
        odds: tip.odds.map((odd) => ({
          ...odd,
          value: Math.max(1.1, odd.value + (Math.random() - 0.5) * 0.05),
        })),
      }))
    );
  };

  // Update odds every 45 seconds (only if we have tips)
  useEffect(() => {
    if (tips.length > 0) {
      const interval = setInterval(updateOdds, 45000);
      return () => clearInterval(interval);
    }
  }, [tips.length]);

  return (
    <>
      <PromoCarousel autoPlayInterval={5000} />

      <FilterTabs tabs={filterTabs} onFilterChange={handleFilterChange} />

      <div className="px-2 pb-4">
        <div className="flex justify-between items-center m-1 mb-1">
          <div className="text-lg font-bold whitespace-nowrap pr-6">
            Palpites de
          </div>
          <DatePicker
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <span className="text-red-700 text-sm">{error}</span>
              <button
                onClick={() => loadTips()}
                className="ml-auto text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Carregando palpites...</span>
          </div>
        ) : filteredTips.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Nenhum palpite encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Não há palpites ativos no momento.
            </p>
          </div>
        ) : (
          filteredTips.map((tip) => (
            <TipCardPublic
              key={tip.id}
              tip={tip}
              onClick={handleTipClick}
              onPremiumClick={handlePremiumClick}
            />
          ))
        )}
      </div>

      {/* Perfis Oficiais */}
      <SocialProfilesCarousel />

      <FloatingActionButton onClick={() => handlePremiumClick(null)} />

      {/* Modal de Compra */}
      <PurchaseModalV2
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        tip={selectedTip || undefined}
        onPurchase={handlePurchase}
      />
    </>
  );
}
