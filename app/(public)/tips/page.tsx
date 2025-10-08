"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { Target, Crown, Clock, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import TipCardPublic from "@/src/components/TipCardPublic";
import { LoadingGetDataUser } from "@/src/components/LoadingGetDataUser";
import { useRouter } from "next/navigation";
import { Tip } from "@/src/types";

export default function TipsPage() {
  const { user, loading: authLoading } = useAuth();
  const [tips, setTips] = useState<Tip[]>([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/?modal=login");
      return;
    }

    if (user?.email) {
      fetchPurchasedTips();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const fetchPurchasedTips = async () => {
    if (!user?.email) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/tips/purchased?email=${encodeURIComponent(user.email)}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao carregar tips");
      }

      setTips(result.tips || []);
    } catch (err: any) {
      console.error("Erro ao buscar tips comprados:", err);
      setError(err.message || "Erro ao carregar tips comprados");
    } finally {
      setIsLoading(false);
    }
  };

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
    totalSpent: tips.reduce((sum, tip) => sum + (tip.price || 0), 0),
    profit:
      tips
        .filter((tip) => tip.result === "win")
        .reduce((sum, tip) => sum + (tip.price || 0) * 1.5, 0) -
      tips.reduce((sum, tip) => sum + (tip.price || 0), 0),
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

  // Mostrar erro se houver
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Erro ao Carregar
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchPurchasedTips}
            className="bg-[#a3bd04] hover:bg-[#8fa003] text-white px-6 py-3 rounded-lg transition-colors"
          >
            Tentar Novamente
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
            <TipCardPublic key={tip.id} tip={tip} onClick={handleTipClick} />
          ))
        )}
      </div>
    </>
  );
}
