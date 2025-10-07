"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  DollarSign,
  Calendar,
  Target,
  Crown,
  Save,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { PaymentPlan } from "@/src/types";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";

// Toast notification types
type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

export default function PlansManagementPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PaymentPlan | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [priceDisplay, setPriceDisplay] = useState("0,00");
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Form state
  const [formData, setFormData] = useState<Partial<PaymentPlan>>({
    name: "",
    type: "package",
    price: 0,
    currency: "BRL",

    tipsIncluded: undefined,
    features: [""],
    isPopular: false,
  });

  // Função para formatar valor em centavos para exibição (R$ 0,00)
  const formatCentsToDisplay = (cents: number): string => {
    const reais = cents / 100;
    return reais.toFixed(2).replace(".", ",");
  };

  // Função para converter valor de exibição para centavos
  const parseToCents = (value: string): number => {
    const cleaned = value.replace(/\D/g, "");
    return parseInt(cleaned || "0");
  };

  // Função para formatar input de dinheiro
  const formatMoneyInput = (value: string): string => {
    const cents = parseToCents(value);
    return formatCentsToDisplay(cents);
  };

  // Toast notification functions
  const showToast = (type: ToastType, message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/dashboard");
      return;
    }
    if (user) {
      loadPlans();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const plansRef = collection(db, "plans");
      const querySnapshot = await getDocs(plansRef);
      const plansData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PaymentPlan[];
      setPlans(plansData);
    } catch (error) {
      console.error("Erro ao carregar planos:", error);
      showToast("error", "Erro ao carregar planos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    if (!formData.name || !formData.price) {
      showToast("error", "Preencha todos os campos obrigatórios");
      return;
    }

    if (formData.type === "package" && !formData.tipsIncluded) {
      showToast("error", "Defina a quantidade de tips incluídos");
      return;
    }

    try {
      setFormLoading(true);
      const planData = {
        ...formData,
        features: formData.features?.filter((f) => f.trim() !== "") || [],
        updatedAt: new Date(),
      };

      if (editingPlan) {
        // Atualizar plano existente
        const planRef = doc(db, "plans", editingPlan.id);
        await updateDoc(planRef, planData);
        showToast("success", "Plano atualizado com sucesso!");
      } else {
        // Criar novo plano
        await addDoc(collection(db, "plans"), {
          ...planData,
          createdAt: new Date(),
        });
        showToast("success", "Plano criado com sucesso!");
      }

      resetForm();
      loadPlans();
    } catch (error) {
      console.error("Erro ao salvar plano:", error);
      showToast("error", "Erro ao salvar plano. Tente novamente.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (plan: PaymentPlan) => {
    setEditingPlan(plan);
    setFormData(plan);
    setPriceDisplay(formatCentsToDisplay(plan.price));
    setShowForm(true);
  };

  const handleDelete = async (planId: string) => {
    if (!confirm("Tem certeza que deseja excluir este plano?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "plans", planId));
      showToast("success", "Plano excluído com sucesso!");
      loadPlans();
    } catch (error) {
      console.error("Erro ao excluir plano:", error);
      showToast("error", "Erro ao excluir plano. Tente novamente.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "package",
      price: 0,
      currency: "BRL",

      tipsIncluded: undefined,
      features: [""],
      isPopular: false,
    });
    setPriceDisplay("0,00");
    setEditingPlan(null);
    setShowForm(false);
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...(formData.features || []), ""],
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, features: newFeatures });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedValue = formatMoneyInput(inputValue);
    const cents = parseToCents(inputValue);

    setPriceDisplay(formattedValue);
    setFormData({ ...formData, price: cents });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a3bd04] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
              <Package className="w-8 h-8 text-[#a3bd04]" />
              <span>Gerenciar Planos</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Cadastre e gerencie os planos de pagamento
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 bg-[#a3bd04] hover:bg-[#8fa003] text-white px-6 py-3 rounded-lg transition-colors"
          >
            {showForm ? (
              <>
                <X className="w-5 h-5" />
                <span>Cancelar</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Novo Plano</span>
              </>
            )}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {editingPlan ? "Editar Plano" : "Novo Plano"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome do Plano *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#a3bd04] focus:border-transparent"
                    required
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as "package" | "subscription",
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#a3bd04] focus:border-transparent"
                  >
                    <option value="package">Pacote</option>
                    <option value="subscription">Assinatura</option>
                  </select>
                </div>

                {/* Preço */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preço (R$) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      R$
                    </span>
                    <input
                      type="text"
                      value={priceDisplay}
                      onChange={handlePriceChange}
                      placeholder="0,00"
                      className="w-full pl-12 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#a3bd04] focus:border-transparent"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Valor será salvo em centavos: {formData.price} centavos
                  </p>
                </div>

                {/* Tips Incluídos (para pacotes) */}
                {formData.type === "package" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tips Incluídos *
                    </label>
                    <input
                      type="number"
                      value={formData.tipsIncluded || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tipsIncluded: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#a3bd04] focus:border-transparent"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Popular */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPopular"
                  checked={formData.isPopular || false}
                  onChange={(e) =>
                    setFormData({ ...formData, isPopular: e.target.checked })
                  }
                  className="w-4 h-4 text-[#a3bd04] bg-gray-100 border-gray-300 rounded focus:ring-[#a3bd04] dark:focus:ring-[#a3bd04] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="isPopular"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Marcar como popular
                </label>
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Funcionalidades
                  </label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-[#a3bd04] hover:text-[#8fa003] text-sm flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.features?.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="Descrição da funcionalidade"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#a3bd04] focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center space-x-2 bg-[#a3bd04] hover:bg-[#8fa003] text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>{formLoading ? "Salvando..." : "Salvar Plano"}</span>
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Plans List */}
        <div className="grid grid-cols-1  gap-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow relative"
            >
              {plan.isPopular && (
                <div className="absolute -top-3 right-4">
                  <div className="bg-[#a3bd04] text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <Crown className="w-3 h-3" />
                    <span>Popular</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {plan.type === "package" ? (
                    <Package className="w-6 h-6 text-[#a3bd04]" />
                  ) : (
                    <Calendar className="w-6 h-6 text-[#a3bd04]" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-[#a3bd04]">
                    R$ {(plan.price / 100).toFixed(2).replace(".", ",")}
                  </span>
                  {plan.type === "package" && plan.tipsIncluded && (
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      / {plan.tipsIncluded} tips
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      plan.type === "package"
                        ? "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
                        : "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                    }`}
                  >
                    {plan.type === "package" ? "Pacote" : "Assinatura"}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleEdit(plan)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-red-400 hover:text-red-300 rounded-lg transition-colors border border-gray-700"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Excluir</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {plans.length === 0 && !showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum plano cadastrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Comece criando seu primeiro plano de pagamento
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center space-x-2 bg-[#a3bd04] hover:bg-[#8fa003] text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Criar Primeiro Plano</span>
            </button>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => {
          const Icon =
            toast.type === "success"
              ? CheckCircle
              : toast.type === "error"
              ? XCircle
              : AlertCircle;

          const bgColor =
            toast.type === "success"
              ? "bg-green-500"
              : toast.type === "error"
              ? "bg-red-500"
              : "bg-blue-500";

          return (
            <div
              key={toast.id}
              className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px] max-w-md animate-slide-in`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <p className="flex-1 font-medium">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
