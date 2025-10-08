"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { Target, Crown, Clock, TrendingUp, Calendar } from "lucide-react";
import TipCardPublic from "@/src/components/TipCardPublic";
import { LoadingGetDataUser } from "@/src/components/LoadingGetDataUser";
import { useRouter } from "next/navigation";
// Mock data para tips comprados
const purchasedTips = [
  {
    id: "1",
    category: "football" as const,
    league: "Premier League",
    teams: "Liverpool vs Chelsea",
    matchTime: "2024-01-15T16:30",
    prediction: "Mais de 2.5 Gols",
    isPremium: true,
    purchasedAt: "2024-01-15T10:00",
    price: 29.9,
    result: "win" as const,
    status: "completed" as const,
    odds: [
      { house: "Bet365", value: 1.83 },
      { house: "Betano", value: 1.87 },
      { house: "Melhor", value: 1.92, isBest: true },
    ],
  },
  {
    id: "2",
    category: "football" as const,
    league: "La Liga",
    teams: "Barcelona vs Real Madrid",
    matchTime: "2024-01-14T21:00",
    prediction: "Ambas Marcam",
    isPremium: true,
    purchasedAt: "2024-01-14T09:30",
    price: 29.9,
    result: "loss" as const,
    status: "completed" as const,
    odds: [
      { house: "Bet365", value: 1.7 },
      { house: "Betano", value: 1.73 },
      { house: "Melhor", value: 1.78, isBest: true },
    ],
  },
  {
    id: "3",
    category: "basketball" as const,
    league: "NBA",
    teams: "Lakers vs Warriors",
    matchTime: "2024-01-16T02:30",
    prediction: "Mais de 220.5 Pontos",
    isPremium: true,
    purchasedAt: "2024-01-15T20:00",
    price: 29.9,
    result: "pending" as const,
    status: "active" as const,
    odds: [
      { house: "Bet365", value: 1.91 },
      { house: "Betano", value: 1.95, isBest: true },
      { house: "Outros", value: 1.88 },
    ],
  },
  {
    id: "4",
    category: "tennis" as const,
    league: "ATP Masters",
    teams: "Djokovic vs Nadal",
    matchTime: "2024-01-17T14:00",
    prediction: "Djokovic Vence",
    isPremium: true,
    purchasedAt: "2024-01-16T08:15",
    price: 29.9,
    result: "pending" as const,
    status: "active" as const,
    odds: [
      { house: "Bet365", value: 2.1 },
      { house: "Betano", value: 2.05 },
      { house: "Melhor", value: 2.15, isBest: true },
    ],
  },
];

export default function TipsPage() {
  const { user, loading: authLoading } = useAuth();
  const [tips, setTips] = useState(purchasedTips);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  // Simular loading de 2 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Calcular estatísticas
  const stats = {
    total: tips.length,
    wins: tips.filter((tip) => tip.result === "win").length,
    losses: tips.filter((tip) => tip.result === "loss").length,
    pending: tips.filter((tip) => tip.result === "pending").length,
    winRate:
      (tips.filter((tip) => tip.result === "win").length /
        Math.max(tips.filter((tip) => tip.result !== "pending").length, 1)) *
      100,
    totalSpent: tips.reduce((sum, tip) => sum + tip.price, 0),
    profit:
      tips
        .filter((tip) => tip.result === "win")
        .reduce((sum, tip) => sum + tip.price * 1.5, 0) -
      tips.reduce((sum, tip) => sum + tip.price, 0),
  };

  // Filtrar tips
  const filteredTips = tips.filter((tip) => {
    if (filter === "all") return true;
    if (filter === "active") return tip.status === "active";
    if (filter === "completed") return tip.status === "completed";
    if (filter === "win") return tip.result === "win";
    if (filter === "loss") return tip.result === "loss";
    if (filter === "pending") return tip.result === "pending";
    return true;
  });

  const handleTipClick = (tip: any) => {
    alert(
      `📋 Análise detalhada: ${
        tip.teams
      }\n\n✅ Estatísticas completas\n📈 Histórico de confrontos\n🎯 Justificativa do palpite\n💰 Preço pago: R$ ${tip.price.toFixed(
        2
      )}`
    );
  };

  // Mostrar loading enquanto carrega
  if (isLoading || authLoading) {
    return <LoadingGetDataUser message="Carregando seus Tips Comprados" />;
  }

  // Mostrar tela de login apenas após o loading
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg px-4 py-6 w-full max-w-md text-center">
          <Target className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Acesse seus Tips <br /> Comprados
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Faça login para ver todos os tips premium que você comprou
          </p>
          <button
            onClick={() => {
              // O modal será gerenciado pelo layout
              router.push("/?modal=login");
            }}
            className="w-full bg-[#a3bd04] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#8fa003] transition-colors"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="bg-gray-800 rounded-b-2xl p-3 mb-4 text-white ">
        <div className="flex items-center space-x-3">
          <Target className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">Meus Tips Comprados</h1>
            <p className="text-indigo-100">Gerencie seus tips premium</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 mb-4 shadow-sm mx-2">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Filtrar Tips
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "Todos", count: stats.total },
            { id: "active", label: "Ativos", count: stats.pending },
            {
              id: "completed",
              label: "Finalizados",
              count: stats.wins + stats.losses,
            },
            { id: "win", label: "Ganhos", count: stats.wins },
            { id: "loss", label: "Perdas", count: stats.losses },
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption.id
                  ? "bg-[#a3bd04] text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {filterOption.label} ({filterOption.count})
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Tips */}
      <div className="space-y-4 px-2 pb-24">
        {filteredTips.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum tip encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === "all"
                ? "Você ainda não comprou nenhum tip premium."
                : `Não há tips com status "${filter}".`}
            </p>
          </div>
        ) : (
          filteredTips.map((tip) => (
            <div key={tip.id} className="relative">
              <TipCardPublic tip={tip} onClick={handleTipClick} />
              {/* Badge de comprado */}
              <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                <Crown className="w-3 h-3" />
                <span>Comprado</span>
              </div>
              {/* Informações de compra */}
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-b-xl">
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Comprado em:{" "}
                      {new Date(tip.purchasedAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="font-medium text-[#a3bd04]">
                    R$ {tip.price.toFixed(2)}
                  </div>
                </div>

                {tip.result === "loss" && (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">
                    ❌ Perda: R$ {tip.price.toFixed(2)}
                  </div>
                )}
                {tip.result === "pending" && (
                  <div className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 font-medium flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Aguardando resultado</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
