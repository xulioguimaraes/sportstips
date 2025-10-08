"use client";

import { Tip } from "@/src/types";
import { Clock, Star, Target, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";

interface TipCardPublicProps {
  tip: Tip;
  onClick: (tip: Tip) => void;
  onPremiumClick?: (tip: Tip) => void;
}

export default function TipCardPublic({
  tip,
  onClick,
  onPremiumClick,
}: TipCardPublicProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (tip.isPremium) {
      // Se for premium, direcionar para checkout
      if (onPremiumClick) {
        onPremiumClick(tip);
      }
    } else {
      // Se não for premium, mostrar detalhes
      onClick(tip);
    }
  };

  // Função para formatar data e horário
  const formatDateTime = (dateTimeString: string) => {
    try {
      // Se for uma string de datetime-local (ISO format)
      if (dateTimeString.includes("T")) {
        const date = new Date(dateTimeString);
        const now = new Date();
        const diffInHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);

        // Se for hoje
        if (date.toDateString() === now.toDateString()) {
          return `Hoje às ${date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}`;
        }

        // Se for amanhã
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (date.toDateString() === tomorrow.toDateString()) {
          return `Amanhã às ${date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}`;
        }

        // Se for em até 7 dias
        if (diffInHours > 0 && diffInHours <= 168) {
          return date.toLocaleDateString("pt-BR", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });
        }

        // Data completa
        return date.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      // Se for uma string simples, retorna como está
      return dateTimeString;
    } catch (error) {
      return dateTimeString;
    }
  };

  return (
    <div
      className={`bg-[#1e293b] rounded-lg shadow-md border border-gray-600 p-4 mb-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-brand-500 ${
        tip.isPremium
          ? "border-[#FFD700] bg-gradient-to-br from-[#FFD700]/10 via-[#00A651]/5 to-[#FFD700]/8 shadow-[#FFD700]/20 shadow-lg"
          : ""
      }`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header compacto */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center text-xs text-gray-400 mb-1">
            <Target className="w-3 h-3 mr-1 text-accent-500" />
            <span className="truncate">{tip.league}</span>
          </div>
          <div className="font-semibold text-white text-sm truncate">
            {tip.teams}
          </div>
          <div className="flex items-center text-xs text-gray-400 mt-1">
            <Clock className="w-3 h-3 mr-1 text-accent-500" />
            <span>{formatDateTime(tip.matchTime)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {tip.isPremium ? (
            <div className="flex items-center bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/10 text-[#FFD700] px-3 py-1.5 rounded-full text-xs font-bold border border-[#FFD700]/40 shadow-sm">
              <Star className="w-3 h-3 mr-1" />
              Premium
            </div>
          ) : (
            tip.confidence && (
              <div className="bg-brand-500/20 text-brand-500 px-2 py-1 rounded-full text-xs font-medium border border-brand-500/30">
                {tip.confidence}%
              </div>
            )
          )}

          {/* Indicador de ação */}
          {tip.isPremium && (
            <div
              className={`flex items-center text-xs font-medium transition-all duration-200 ${
                isHovered ? "text-[#FFD700]" : "text-gray-400"
              }`}
            >
              <Lock className="w-3 h-3 mr-1" />
              <span>Assinar</span>
              <ArrowRight
                className={`w-3 h-3 ml-1 transition-transform duration-200 ${
                  isHovered ? "translate-x-1" : ""
                }`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Predição compacta */}
      <div className="mb-3">
        <div className="text-xs text-gray-400 mb-1">Palpite</div>
        <div className="font-medium text-white text-sm">
          {tip.isPremium ? (
            <div className="flex items-center">
              <Lock className="w-3 h-3 mr-2 text-[#FFD700]" />
              <span className="text-[#FFD700] font-medium">
                Conteúdo Premium
              </span>
            </div>
          ) : (
            tip.prediction
          )}
        </div>
      </div>

      {/* Odds compactas */}
      <div className="flex flex-wrap gap-2">
        {tip.isPremium ? (
          <div className="flex items-center px-3 py-1.5 rounded text-xs bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/40 shadow-sm">
            <Lock className="w-3 h-3 mr-1" />
            <span className="font-semibold">Odds Premium</span>
          </div>
        ) : (
          tip.odds.slice(0, 3).map((odd, index) => (
            <div
              key={index}
              className={`flex items-center justify-between px-2 py-1 rounded text-xs ${
                odd.isBest
                  ? "bg-brand-500/20 text-brand-500 border border-brand-500/30"
                  : "bg-gray-600/50 text-gray-300 border border-gray-500/30"
              }`}
            >
              <span className="font-medium truncate max-w-[60px]">
                {odd.house}
              </span>
              <span className="ml-1 font-bold">{odd.value.toFixed(2)}</span>
            </div>
          ))
        )}
        {!tip.isPremium && tip.odds.length > 3 && (
          <div className="flex items-center px-2 py-1 rounded text-xs bg-gray-600/50 text-gray-400 border border-gray-500/30">
            +{tip.odds.length - 3}
          </div>
        )}
      </div>

      {/* Call to action para premium */}
      {tip.isPremium && (
        <div className="mt-3 pt-3 border-t border-[#FFD700]/40">
          <div className="flex items-center justify-between">
            <div className="text-xs text-[#FFD700] font-medium">
              🔒 Acesso exclusivo para assinantes
            </div>
            <div className="text-xs font-bold text-[#FFD700]">Ver planos →</div>
          </div>
        </div>
      )}
    </div>
  );
}
