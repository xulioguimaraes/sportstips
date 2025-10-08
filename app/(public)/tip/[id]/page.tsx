"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Target,
  Clock,
  TrendingUp,
  Star,
  Lock,
  CheckCircle,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { Tip } from "@/src/types";

export default function TipDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const tipId = params.id as string;

  const [tip, setTip] = useState<Tip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/?modal=login");
      return;
    }

    if (user && tipId) {
      fetchTipDetails();
    }
  }, [user, authLoading, tipId]);

  const fetchTipDetails = async () => {
    if (!user?.email || !tipId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/tips/${tipId}?email=${encodeURIComponent(user.email)}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Erro ao carregar tip");
      }

      setTip(result.tip);
      setHasAccess(result.hasAccess);
    } catch (err: any) {
      console.error("Erro ao buscar tip:", err);
      setError(err.message || "Erro ao carregar tip");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateTimeString;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a3bd04] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando tip...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Acesso Negado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push("/plans")}
            className="bg-[#a3bd04] hover:bg-[#8fa003] text-white px-6 py-3 rounded-lg transition-colors"
          >
            Ver Planos
          </button>
        </div>
      </div>
    );
  }

  if (!tip || !hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <Lock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Conteúdo Bloqueado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Você não tem acesso a este tip premium
          </p>
          <button
            onClick={() => router.push("/plans")}
            className="bg-[#a3bd04] hover:bg-[#8fa003] text-white px-6 py-3 rounded-lg transition-colors"
          >
            Comprar Acesso
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Target className="w-5 h-5 text-[#a3bd04]" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {tip.league}
                </span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {tip.teams}
              </h1>
            </div>
            {tip.isPremium && (
              <div className="flex items-center bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/10 text-[#FFD700] px-3 py-1.5 rounded-full text-sm font-bold border border-[#FFD700]/40">
                <Star className="w-4 h-4 mr-1" />
                Premium
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Data e Horário
                </div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatDateTime(tip.matchTime)}
                </div>
              </div>
            </div>

            {tip.confidence && (
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Confiança
                  </div>
                  <div className="font-medium text-[#a3bd04]">
                    {tip.confidence}%
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Prediction */}
          <div className="bg-gradient-to-r from-[#a3bd04]/10 to-[#a3bd04]/5 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Palpite
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {tip.prediction}
            </div>
          </div>

          {/* Odds */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-[#a3bd04]" />
              Odds Disponíveis
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {tip.odds.map((odd, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    odd.isBest
                      ? "bg-[#a3bd04]/10 border-[#a3bd04] shadow-lg"
                      : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {odd.house}
                    </span>
                    {odd.isBest && (
                      <CheckCircle className="w-4 h-4 text-[#a3bd04]" />
                    )}
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      odd.isBest
                        ? "text-[#a3bd04]"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {odd.value.toFixed(2)}
                  </div>
                  {odd.isBest && (
                    <div className="text-xs text-[#a3bd04] font-medium mt-1">
                      Melhor Odd
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Você tem acesso completo a este tip premium!
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Aproveite todas as informações e análises detalhadas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
