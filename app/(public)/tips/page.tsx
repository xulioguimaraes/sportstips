"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { Target, Crown, Clock, TrendingUp, Calendar } from "lucide-react";
import TipCardPublic from "@/src/components/TipCardPublic";
import { LoadingGetDataUser } from "@/src/components/LoadingGetDataUser";

// Mock data para tips comprados
const purchasedTips = [
  {
    id: "1",
    category: "premium" as const,
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
    category: "premium" as const,
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
    category: "premium" as const,
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
    category: "premium" as const,
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
    return <LoadingGetDataUser />;
  }

  // Mostrar tela de login apenas após o loading
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Acesse seus Tips Comprados
          </h2>
          <p className="text-gray-600 mb-6">
            Faça login para ver todos os tips premium que você comprou
          </p>
          <button
            onClick={() => {
              // O modal será gerenciado pelo layout
              window.location.href = "/";
            }}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
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
      <div className="bg-black rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center space-x-3">
          <Target className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">Meus Tips Comprados</h1>
            <p className="text-indigo-100">Gerencie seus tips premium</p>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-4 mb-6 px-2">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total de Tips</div>
              <div className="text-2xl font-bold text-indigo-600">
                {stats.total}
              </div>
            </div>
            <Crown className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {stats.winRate.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Taxa de Acerto</div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">
                {stats.losses}
              </div>
              <div className="text-sm text-gray-600">Perdas</div>
            </div>
            <TrendingUp className="w-8 h-8 text-red-500 rotate-180" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">Filtrar Tips</h3>
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
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum tip encontrado
            </h3>
            <p className="text-gray-600">
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
              <div className="bg-gray-50 p-3 rounded-b-xl">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Comprado em:{" "}
                      {new Date(tip.purchasedAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="font-medium text-indigo-600">
                    R$ {tip.price.toFixed(2)}
                  </div>
                </div>

                {tip.result === "loss" && (
                  <div className="mt-2 text-sm text-red-600 font-medium">
                    ❌ Perda: R$ {tip.price.toFixed(2)}
                  </div>
                )}
                {tip.result === "pending" && (
                  <div className="mt-2 text-sm text-yellow-600 font-medium flex items-center space-x-1">
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
