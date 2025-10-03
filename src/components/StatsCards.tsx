"use client";

import React from 'react';
import { Tip } from '@/src/types';

interface StatsCardsProps {
  tips: Tip[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ tips }) => {
  const totalTips = tips.length;
  const activeTips = tips.filter(tip => tip.status === 'active').length;
  const completedTips = tips.filter(tip => tip.status === 'completed').length;
  const winRate = completedTips > 0 
    ? Math.round((tips.filter(tip => tip.result === 'win').length / completedTips) * 100)
    : 0;

  const stats = [
    {
      title: 'Total de Palpites',
      value: totalTips,
      icon: '🎯',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Palpites Ativos',
      value: activeTips,
      icon: '⚡',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      title: 'Taxa de Acerto',
      value: `${winRate}%`,
      icon: '📈',
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Concluídos',
      value: completedTips,
      icon: '✅',
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </p>
              <p className={`text-3xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
