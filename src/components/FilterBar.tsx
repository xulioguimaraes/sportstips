"use client";

import React from 'react';
import { Search, Plus } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  dateFilterType: 'match' | 'created';
  onDateFilterTypeChange: (type: 'match' | 'created') => void;
  onCreateNew: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  selectedDate,
  onDateChange,
  dateFilterType,
  onDateFilterTypeChange,
  onCreateNew
}) => {
  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'football', label: 'Futebol' },
    { value: 'basketball', label: 'Basquete' },
    { value: 'tennis', label: 'Tênis' },
    { value: 'premium', label: 'Premium' },
  ];

  const statuses = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'active', label: 'Ativos' },
    { value: 'inactive', label: 'Inativos' },
    { value: 'completed', label: 'Concluídos' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar palpites..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="sm:w-40">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="sm:w-40">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="sm:w-40">
          <div className="space-y-1">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white"
            />
            <div className="flex space-x-2 text-xs">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="dateFilterType"
                  value="match"
                  checked={dateFilterType === 'match'}
                  onChange={(e) => onDateFilterTypeChange(e.target.value as 'match' | 'created')}
                  className="mr-1"
                />
                Jogo
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="dateFilterType"
                  value="created"
                  checked={dateFilterType === 'created'}
                  onChange={(e) => onDateFilterTypeChange(e.target.value as 'match' | 'created')}
                  className="mr-1"
                />
                Cadastro
              </label>
            </div>
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={onCreateNew}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Palpite
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
