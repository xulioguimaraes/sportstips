"use client";

import React from 'react';
import { Tip } from '@/src/types';

interface TipCardModernProps {
  tip: Tip;
  onEdit: (tip: Tip) => void;
  onDelete: (tipId: string) => void;
  onUpdateStatus: (tipId: string, status: 'active' | 'inactive' | 'completed') => void;
  onUpdateResult: (tipId: string, result: 'win' | 'loss' | 'pending') => void;
}

const TipCardModern: React.FC<TipCardModernProps> = ({
  tip,
  onEdit,
  onDelete,
  onUpdateStatus,
  onUpdateResult
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'premium': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'football': return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
      case 'basketball': return 'bg-gradient-to-r from-orange-400 to-red-500 text-white';
      case 'tennis': return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'win': return 'bg-green-100 text-green-800 border-green-200';
      case 'loss': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(tip.category)}`}>
                {tip.category.toUpperCase()}
              </span>
              {tip.isPremium && (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  ⭐ PREMIUM
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{tip.teams}</h3>
            <p className="text-sm text-gray-600 mb-1">{tip.league}</p>
            <p className="text-sm text-gray-500">{tip.matchTime}</p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(tip)}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
              title="Editar"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(tip.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Deletar"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Prediction */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-gray-600 mb-1">Predição</p>
          <p className="text-lg font-bold text-gray-900">{tip.prediction}</p>
          {tip.confidence && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Confiança</span>
                <span>{tip.confidence}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${tip.confidence}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Odds */}
      <div className="p-6">
        <p className="text-sm font-medium text-gray-600 mb-3">Odds</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {tip.odds.map((odd, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                odd.isBest 
                  ? 'bg-green-50 border-green-200 shadow-md' 
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">{odd.house}</p>
                  <p className="text-lg font-bold text-gray-900">{odd.value}</p>
                </div>
                {odd.isBest && (
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    MELHOR
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Status and Result */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select
              value={tip.status || 'active'}
              onChange={(e) => onUpdateStatus(tip.id, e.target.value as any)}
              className={`w-full text-xs font-medium px-3 py-2 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${getStatusColor(tip.status || 'active')}`}
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="completed">Concluído</option>
            </select>
          </div>
          
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-medium text-gray-600 mb-1">Resultado</label>
            <select
              value={tip.result || 'pending'}
              onChange={(e) => onUpdateResult(tip.id, e.target.value as any)}
              className={`w-full text-xs font-medium px-3 py-2 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${getResultColor(tip.result || 'pending')}`}
            >
              <option value="pending">Pendente</option>
              <option value="win">Vitória</option>
              <option value="loss">Derrota</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <span>Criado em: {tip.createdAt?.toLocaleDateString('pt-BR')}</span>
          <span>ID: {tip.id.slice(0, 8)}...</span>
        </div>
      </div>
    </div>
  );
};

export default TipCardModern;
