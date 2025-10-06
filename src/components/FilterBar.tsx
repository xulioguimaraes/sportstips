"use client";

import React, { useState } from 'react';
import { Search, Plus, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 mb-6">
      {/* Top Row - Search, Filters Button, Create Button */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Buscar palpites..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Filters Toggle Button */}
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center text-sm border border-gray-300 dark:border-gray-600"
        >
          Filtros
          {isFiltersOpen ? (
            <ChevronUp className="w-4 h-4 ml-2" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-2" />
          )}
        </button>

        {/* Create Button */}
        <button
          onClick={onCreateNew}
          className="px-4 py-2 bg-[#a3bd04] text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Palpite
        </button>
      </div>

      {/* Expandable Filters Section */}
      {isFiltersOpen && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="flex space-x-4 text-xs">
                  <label className="flex items-center text-gray-700 dark:text-gray-300">
                    <input
                      type="radio"
                      name="dateFilterType"
                      value="match"
                      checked={dateFilterType === 'match'}
                      onChange={(e) => onDateFilterTypeChange(e.target.value as 'match' | 'created')}
                      className="mr-2 text-indigo-600 focus:ring-indigo-500"
                    />
                    Jogo
                  </label>
                  <label className="flex items-center text-gray-700 dark:text-gray-300">
                    <input
                      type="radio"
                      name="dateFilterType"
                      value="created"
                      checked={dateFilterType === 'created'}
                      onChange={(e) => onDateFilterTypeChange(e.target.value as 'match' | 'created')}
                      className="mr-2 text-indigo-600 focus:ring-indigo-500"
                    />
                    Cadastro
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
