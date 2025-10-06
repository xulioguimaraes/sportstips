"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { tipsService } from "@/src/services/tipsService";
import { Tip, TipFormData } from "@/src/types";
import TipForm from "@/src/components/TipForm";
import LoginForm from "@/src/components/LoginForm";
import Sidebar from "@/src/components/Sidebar";
import StatsCards from "@/src/components/StatsCards";
import TipCardModern from "@/src/components/TipCardModern";
import FilterBar from "@/src/components/FilterBar";
import TipCard from "@/src/components/TipCard";
import { Target } from "lucide-react";

const Dashboard: React.FC = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const [tips, setTips] = useState<Tip[]>([]);
  const [filteredTips, setFilteredTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTip, setEditingTip] = useState<Tip | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("tips");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD format
  });
  const [dateFilterType, setDateFilterType] = useState<"match" | "created">(
    "match"
  );

  const loadTips = useCallback(async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];

      const tipsData =
        dateFilterType === "match"
          ? await tipsService.getTipsByDate(selectedDate)
          : await tipsService.getTipsByCreatedDate(selectedDate);

      setTips(tipsData);
    } catch (error) {
      console.error("Erro ao carregar palpites:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, dateFilterType]);

  useEffect(() => {
    if (user) {
      loadTips();
    }
  }, [user, loadTips, dateFilterType]);

  useEffect(() => {
    const filterTips = () => {
      let filtered = tips;

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(
          (tip) =>
            tip.teams.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tip.league.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tip.prediction.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by category
      if (selectedCategory !== "all") {
        filtered = filtered.filter((tip) => tip.category === selectedCategory);
      }

      // Filter by status
      if (selectedStatus !== "all") {
        filtered = filtered.filter((tip) => tip.status === selectedStatus);
      }

      // Note: Date filtering is now handled in the service layer
      setFilteredTips(filtered);
    };

    filterTips();
  }, [tips, searchTerm, selectedCategory, selectedStatus]);

  const handleSubmitTip = async (tipData: TipFormData) => {
    try {
      setFormLoading(true);

      if (editingTip) {
        await tipsService.updateTip(editingTip.id, tipData);
      } else {
        await tipsService.createTip(tipData, user!.uid);
      }

      await loadTips();
      setShowForm(false);
      setEditingTip(null);
    } catch (error) {
      console.error("Erro ao salvar palpite:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditTip = (tip: Tip) => {
    setEditingTip(tip);
    setShowForm(true);
  };

  const handleDeleteTip = async (tipId: string) => {
    if (confirm("Tem certeza que deseja deletar este palpite?")) {
      try {
        await tipsService.deleteTip(tipId);
        await loadTips();
      } catch (error) {
        console.error("Erro ao deletar palpite:", error);
      }
    }
  };

  const handleUpdateStatus = async (
    tipId: string,
    status: "active" | "inactive" | "completed"
  ) => {
    try {
      await tipsService.updateTipStatus(tipId, status);
      await loadTips();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleUpdateResult = async (
    tipId: string,
    result: "win" | "loss" | "pending"
  ) => {
    try {
      await tipsService.updateTipResult(tipId, result);
      await loadTips();
    } catch (error) {
      console.error("Erro ao atualizar resultado:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="lg:ml-64 p-4 lg:p-8 pt-8 lg:pt-8">
          <div className="mb-6">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingTip(null);
              }}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <span className="mr-2">←</span>
              Voltar ao Dashboard
            </button>
          </div>

          <TipForm
            onSubmit={handleSubmitTip}
            onCancel={() => {
              setShowForm(false);
              setEditingTip(null);
            }}
            initialData={editingTip || undefined}
            loading={formLoading}
            editingTip={editingTip}
          />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600">Visão geral dos seus palpites</p>
            </div>

            <StatsCards tips={tips} />

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Palpites Recentes
              </h2>
              <div className="grid gap-4">
                {tips.slice(0, 3).map((tip) => (
                  <div
                    key={tip.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{tip.teams}</p>
                      <p className="text-sm text-gray-600">{tip.prediction}</p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        tip.status === "active"
                          ? "bg-green-100 text-green-800"
                          : tip.status === "inactive"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {tip.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "tips":
        return (
          <div>
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Palpites
              </h1>
              <p className="text-gray-600">Gerencie todos os seus palpites</p>
            </div>

            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              dateFilterType={dateFilterType}
              onDateFilterTypeChange={setDateFilterType}
              onCreateNew={() => setShowForm(true)}
            />

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-lg text-gray-600">
                  Carregando palpites...
                </span>
              </div>
            ) : filteredTips.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {tips.length === 0
                    ? "Nenhum palpite encontrado"
                    : "Nenhum palpite corresponde aos filtros"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {tips.length === 0
                    ? "Comece criando seu primeiro palpite"
                    : "Tente ajustar os filtros de busca"}
                </p>
                {tips.length === 0 && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 bg-[#a3bd04] text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    ➕ Criar Primeiro Palpite
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-1">
                {filteredTips.map((tip) => (
                  <TipCard
                    key={tip.id}
                    tip={tip}
                    onClick={handleEditTip}
                    onDelete={handleDeleteTip}
                    onUpdateStatus={handleUpdateStatus}
                    onUpdateResult={handleUpdateResult}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case "analytics":
        return (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Analytics
              </h1>
              <p className="text-gray-600">
                Análise de performance dos seus palpites
              </p>
            </div>

            <div className="text-center py-12">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Em Desenvolvimento
              </h3>
              <p className="text-gray-600">
                Esta seção estará disponível em breve
              </p>
            </div>
          </div>
        );

      case "settings":
        return (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Configurações
              </h1>
              <p className="text-gray-600">
                Gerencie as configurações da sua conta
              </p>
            </div>

            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚙️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Em Desenvolvimento
              </h3>
              <p className="text-gray-600">
                Esta seção estará disponível em breve
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="lg:ml-64 p-4 lg:p-8 pt-8 lg:pt-8">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
