'use client';

import { Tip } from '@/src/types';
import { Calendar, Clock, Star, Target, Trash2, MoreVertical, CheckCircle, XCircle, Pause, Play, Trophy, AlertCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface TipCardProps {
  tip: Tip;
  onClick: (tip: Tip) => void;
  onDelete?: (tipId: string) => void;
  onUpdateStatus?: (tipId: string, status: 'active' | 'inactive' | 'completed') => void;
  onUpdateResult?: (tipId: string, result: 'win' | 'loss' | 'pending') => void;
}

export default function TipCard({ tip, onClick, onDelete, onUpdateStatus, onUpdateResult }: TipCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    onClick(tip);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Previne o clique no card
    if (onDelete) {
      onDelete(tip.id);
    }
    setShowMenu(false);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Previne o clique no card
    setShowMenu(!showMenu);
  };

  const handleStatusChange = (e: React.MouseEvent, status: 'active' | 'inactive' | 'completed') => {
    e.stopPropagation();
    if (onUpdateStatus) {
      onUpdateStatus(tip.id, status);
    }
    setShowMenu(false);
  };

  const handleResultChange = (e: React.MouseEvent, result: 'win' | 'loss' | 'pending') => {
    e.stopPropagation();
    if (onUpdateResult) {
      onUpdateResult(tip.id, result);
    }
    setShowMenu(false);
  };

  // Fechar menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // Função para formatar data e horário
  const formatDateTime = (dateTimeString: string) => {
    try {
      // Se for uma string de datetime-local (ISO format)
      if (dateTimeString.includes('T')) {
        const date = new Date(dateTimeString);
        const now = new Date();
        const diffInHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        // Se for hoje
        if (date.toDateString() === now.toDateString()) {
          return `Hoje às ${date.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}`;
        }
        
        // Se for amanhã
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (date.toDateString() === tomorrow.toDateString()) {
          return `Amanhã às ${date.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}`;
        }
        
        // Se for em até 7 dias
        if (diffInHours > 0 && diffInHours <= 168) {
          return date.toLocaleDateString('pt-BR', { 
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
        
        // Data completa
        return date.toLocaleDateString('pt-BR', { 
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
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
      className={`bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-1 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
        tip.isPremium ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50' : ''
      }`}
      onClick={handleClick}
    >
      {/* Header compacto */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center text-xs text-gray-500 mb-1">
            <Target className="w-3 h-3 mr-1" />
            <span className="truncate">{tip.league}</span>
          </div>
          <div className="font-semibold text-gray-900 text-sm truncate">{tip.teams}</div>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <Clock className="w-3 h-3 mr-1" />
            <span>{formatDateTime(tip.matchTime)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {tip.isPremium ? (
            <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
              <Star className="w-3 h-3 mr-1" />
              Premium
            </div>
          ) : (
            tip.confidence && (
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                {tip.confidence}%
              </div>
            )
          )}
          
          {/* Menu de ações */}
          {(onDelete || onUpdateStatus || onUpdateResult) && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={handleMenuToggle}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[160px]">
                  {/* Status Options */}
                  {onUpdateStatus && (
                    <>
                      <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Status
                      </div>
                      <button
                        onClick={(e) => handleStatusChange(e, 'active')}
                        className={`w-full px-3 py-2 text-left text-sm flex items-center ${
                          tip.status === 'active' 
                            ? 'bg-green-50 text-green-700' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Ativo
                      </button>
                      <button
                        onClick={(e) => handleStatusChange(e, 'inactive')}
                        className={`w-full px-3 py-2 text-left text-sm flex items-center ${
                          tip.status === 'inactive' 
                            ? 'bg-yellow-50 text-yellow-700' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Inativo
                      </button>
                      <button
                        onClick={(e) => handleStatusChange(e, 'completed')}
                        className={`w-full px-3 py-2 text-left text-sm flex items-center ${
                          tip.status === 'completed' 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Concluído
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                    </>
                  )}

                  {/* Result Options */}
                  {onUpdateResult && tip.status === 'completed' && (
                    <>
                      <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Resultado
                      </div>
                      <button
                        onClick={(e) => handleResultChange(e, 'win')}
                        className={`w-full px-3 py-2 text-left text-sm flex items-center ${
                          tip.result === 'win' 
                            ? 'bg-green-50 text-green-700' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Trophy className="w-4 h-4 mr-2" />
                        Vitória
                      </button>
                      <button
                        onClick={(e) => handleResultChange(e, 'loss')}
                        className={`w-full px-3 py-2 text-left text-sm flex items-center ${
                          tip.result === 'loss' 
                            ? 'bg-red-50 text-red-700' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Derrota
                      </button>
                      <button
                        onClick={(e) => handleResultChange(e, 'pending')}
                        className={`w-full px-3 py-2 text-left text-sm flex items-center ${
                          tip.result === 'pending' 
                            ? 'bg-yellow-50 text-yellow-700' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Pendente
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                    </>
                  )}

                  {/* Delete Option */}
                  {onDelete && (
                    <button
                      onClick={handleDelete}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Deletar
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Predição compacta */}
      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-1">Palpite</div>
        <div className="font-medium text-gray-900 text-sm">{tip.prediction}</div>
      </div>

      {/* Odds compactas */}
      <div className="flex flex-wrap gap-2">
        {tip.odds.slice(0, 3).map((odd, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between px-2 py-1 rounded text-xs ${
              odd.isBest 
                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <span className="font-medium truncate max-w-[60px]">{odd.house}</span>
            <span className="ml-1 font-bold">{odd.value.toFixed(2)}</span>
          </div>
        ))}
        {tip.odds.length > 3 && (
          <div className="flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-500">
            +{tip.odds.length - 3}
          </div>
        )}
      </div>
    </div>
  );
}
