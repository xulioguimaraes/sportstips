"use client";

import React, { useState } from "react";
import { TipFormData, Odds } from "@/src/types";
import { Save, X, Plus, Trash2 } from "lucide-react";

interface TipFormProps {
  onSubmit: (tipData: TipFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<TipFormData>;
  loading?: boolean;
  editingTip?: any;
}

const TipForm: React.FC<TipFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  loading = false,
  editingTip,
}) => {
  const [formData, setFormData] = useState<TipFormData>({
    category: initialData?.category || "football",
    league: initialData?.league || "",
    teams: initialData?.teams || "",
    matchTime: initialData?.matchTime || "",
    prediction: initialData?.prediction || "",
    description: initialData?.description || "",
    confidence: initialData?.confidence || 0,
    isPremium: initialData?.isPremium || false,
    odds: initialData?.odds || [{ house: "", value: 0, isBest: false }],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.league.trim()) newErrors.league = "Liga é obrigatória";
    if (!formData.teams.trim()) newErrors.teams = "Times são obrigatórios";
    if (!formData.matchTime.trim())
      newErrors.matchTime = "Horário é obrigatório";
    if (!formData.prediction.trim())
      newErrors.prediction = "Predição é obrigatória";
    if (
      formData.confidence &&
      (formData.confidence < 0 || formData.confidence > 100)
    ) {
      newErrors.confidence = "Confiança deve estar entre 0 e 100";
    }

    // Validar odds
    formData.odds.forEach((odd, index) => {
      if (!odd.house.trim())
        newErrors[`odds_${index}_house`] = "Casa é obrigatória";
      if (odd.value <= 0)
        newErrors[`odds_${index}_value`] = "Valor deve ser maior que 0";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  const addOdd = () => {
    setFormData({
      ...formData,
      odds: [...formData.odds, { house: "", value: 0, isBest: false }],
    });
  };

  const removeOdd = (index: number) => {
    if (formData.odds.length > 1) {
      setFormData({
        ...formData,
        odds: formData.odds.filter((_, i) => i !== index),
      });
    }
  };

  const updateOdd = (index: number, field: keyof Odds, value: any) => {
    const newOdds = [...formData.odds];
    newOdds[index] = { ...newOdds[index], [field]: value };

    // Se marcou como melhor, desmarcar os outros
    if (field === "isBest" && value) {
      newOdds.forEach((odd, i) => {
        if (i !== index) odd.isBest = false;
      });
    }

    setFormData({ ...formData, odds: newOdds });
  };

  return (
    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
            {editingTip ? "Editar Palpite" : "Novo Palpite"}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {editingTip
              ? "Atualize as informações do palpite"
              : "Preencha os dados para criar um novo palpite"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* Categoria */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as any })
                }
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
              >
                <option value="football">Futebol</option>
                <option value="basketball">Basquete</option>
                <option value="tennis">Tênis</option>
              </select>
            </div>

            {/* Liga */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Liga *
              </label>
              <input
                type="text"
                list="leagues"
                value={formData.league}
                onChange={(e) =>
                  setFormData({ ...formData, league: e.target.value })
                }
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  errors.league
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Digite ou selecione uma liga..."
                autoComplete="off"
              />
              <datalist id="leagues">
                <option value="Premier League" />
                <option value="La Liga" />
                <option value="Serie A" />
                <option value="Bundesliga" />
                <option value="Ligue 1" />
                <option value="Champions League" />
                <option value="Europa League" />
                <option value="Copa Libertadores" />
                <option value="Copa do Brasil" />
                <option value="Brasileirão Série A" />
                <option value="Brasileirão Série B" />
                <option value="Copa América" />
                <option value="Copa do Mundo" />
                <option value="Eurocopa" />
                <option value="Liga MX" />
                <option value="MLS" />
                <option value="Championship" />
                <option value="Serie B" />
                <option value="2. Bundesliga" />
                <option value="Ligue 2" />
                <option value="Eredivisie" />
                <option value="Primeira Liga" />
                <option value="Superliga Argentina" />
                <option value="Primera División Chile" />
                <option value="Liga Profesional Colombia" />
                <option value="Liga MX Femenil" />
                <option value="NWSL" />
                <option value="FA Cup" />
                <option value="Copa del Rey" />
                <option value="Coppa Italia" />
                <option value="DFB-Pokal" />
                <option value="Coupe de France" />
                <option value="Copa Argentina" />
                <option value="Copa Chile" />
                <option value="Copa Colombia" />
                <option value="Copa México" />
                <option value="Copa Libertadores Femenina" />
                <option value="Copa América Femenina" />
                <option value="Copa do Mundo Feminina" />
                <option value="Liga dos Campeões Feminina" />
                <option value="Liga Europa Feminina" />
                <option value="Copa do Brasil Feminina" />
                <option value="Brasileirão Feminino" />
                <option value="Copa Paulista" />
                <option value="Copa Rio" />
                <option value="Copa São Paulo" />
                <option value="Campeonato Carioca" />
                <option value="Campeonato Paulista" />
                <option value="Campeonato Mineiro" />
                <option value="Campeonato Gaúcho" />
                <option value="Campeonato Paranaense" />
                <option value="Campeonato Baiano" />
                <option value="Campeonato Pernambucano" />
                <option value="Campeonato Cearense" />
                <option value="Campeonato Goiano" />
                <option value="Campeonato Catarinense" />
                <option value="Campeonato Paranaense" />
                <option value="Campeonato Sergipano" />
                <option value="Campeonato Alagoano" />
                <option value="Campeonato Paraibano" />
                <option value="Campeonato Potiguar" />
                <option value="Campeonato Maranhense" />
                <option value="Campeonato Piauiense" />
                <option value="Campeonato Acreano" />
                <option value="Campeonato Amazonense" />
                <option value="Campeonato Rondoniense" />
                <option value="Campeonato Roraimense" />
                <option value="Campeonato Amapaense" />
                <option value="Campeonato Tocantinense" />
                <option value="Campeonato Mato-Grossense" />
                <option value="Campeonato Sul-Mato-Grossense" />
                <option value="Campeonato Distrital" />
                <option value="Campeonato Capixaba" />
                <option value="Campeonato Espírito-Santense" />
                <option value="Campeonato Fluminense" />
                <option value="Campeonato Carioca Feminino" />
                <option value="Campeonato Paulista Feminino" />
                <option value="Campeonato Mineiro Feminino" />
                <option value="Campeonato Gaúcho Feminino" />
                <option value="Campeonato Paranaense Feminino" />
                <option value="Campeonato Baiano Feminino" />
                <option value="Campeonato Pernambucano Feminino" />
                <option value="Campeonato Cearense Feminino" />
                <option value="Campeonato Goiano Feminino" />
                <option value="Campeonato Catarinense Feminino" />
                <option value="Campeonato Sergipano Feminino" />
                <option value="Campeonato Alagoano Feminino" />
                <option value="Campeonato Paraibano Feminino" />
                <option value="Campeonato Potiguar Feminino" />
                <option value="Campeonato Maranhense Feminino" />
                <option value="Campeonato Piauiense Feminino" />
                <option value="Campeonato Acreano Feminino" />
                <option value="Campeonato Amazonense Feminino" />
                <option value="Campeonato Rondoniense Feminino" />
                <option value="Campeonato Roraimense Feminino" />
                <option value="Campeonato Amapaense Feminino" />
                <option value="Campeonato Tocantinense Feminino" />
                <option value="Campeonato Mato-Grossense Feminino" />
                <option value="Campeonato Sul-Mato-Grossense Feminino" />
                <option value="Campeonato Distrital Feminino" />
                <option value="Campeonato Capixaba Feminino" />
                <option value="Campeonato Espírito-Santense Feminino" />
                <option value="Campeonato Fluminense Feminino" />
              </datalist>
              {errors.league && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                  <X className="w-4 h-4 mr-1" />
                  {errors.league}
                </p>
              )}
            </div>

            {/* Times */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Times *
              </label>
              <input
                type="text"
                value={formData.teams}
                onChange={(e) =>
                  setFormData({ ...formData, teams: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  errors.teams
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Ex: Liverpool vs Chelsea"
              />
              {errors.teams && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.teams}
                </p>
              )}
            </div>

            {/* Horário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data e Horário *
              </label>
              <input
                type="datetime-local"
                value={formData.matchTime}
                onChange={(e) =>
                  setFormData({ ...formData, matchTime: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.matchTime
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.matchTime && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.matchTime}
                </p>
              )}
            </div>

            {/* Predição */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Predição *
              </label>
              <input
                type="text"
                value={formData.prediction}
                onChange={(e) =>
                  setFormData({ ...formData, prediction: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  errors.prediction
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Ex: Mais de 2.5 Gols"
              />
              {errors.prediction && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.prediction}
                </p>
              )}
            </div>

            {/* Descrição */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-vertical"
                placeholder="Adicione detalhes sobre a análise do palpite (opcional)..."
              />
            </div>

            {/* Confiança */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confiança (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.confidence || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confidence: parseInt(e.target.value) || 0,
                  })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  errors.confidence
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Ex: 85"
              />
              {errors.confidence && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.confidence}
                </p>
              )}
            </div>

            {/* Premium */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPremium"
                checked={formData.isPremium}
                onChange={(e) =>
                  setFormData({ ...formData, isPremium: e.target.checked })
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              />
              <label
                htmlFor="isPremium"
                className="ml-2 block text-xs sm:text-sm text-gray-900 dark:text-white"
              >
                Palpite Premium
              </label>
            </div>
          </div>

          {/* Odds */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Odds
              </label>
              <button
                type="button"
                onClick={addOdd}
                className="text-indigo-600 hover:text-indigo-500 text-xs sm:text-sm font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar Odd
              </button>
            </div>

            {formData.odds.map((odd, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3 p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
              >
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    Casa
                  </label>
                  <input
                    type="text"
                    value={odd.house}
                    onChange={(e) => updateOdd(index, "house", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                      errors[`odds_${index}_house`]
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Ex: Bet365"
                  />
                  {errors[`odds_${index}_house`] && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors[`odds_${index}_house`]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    Valor
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={odd.value}
                    onChange={(e) =>
                      updateOdd(index, "value", parseFloat(e.target.value) || 0)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                      errors[`odds_${index}_value`]
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Ex: 1.85"
                  />
                  {errors[`odds_${index}_value`] && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors[`odds_${index}_value`]}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={odd.isBest}
                      onChange={(e) =>
                        updateOdd(index, "isBest", e.target.checked)
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    />
                    <label className="ml-2 block text-xs sm:text-sm text-gray-900 dark:text-white">
                      Melhor
                    </label>
                  </div>

                  {formData.odds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOdd(index)}
                      className="text-red-600 hover:text-red-500 text-xs sm:text-sm font-medium flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remover
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200 text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-[#a3bd04] text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent mr-2 sm:mr-3"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Salvar Palpite
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TipForm;
