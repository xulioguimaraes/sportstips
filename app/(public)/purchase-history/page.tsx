"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Calendar,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

interface Transaction {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  planPrice: number;
  planType: "package" | "subscription";
  paymentMethod: "pix" | "card";
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  pixKeyId?: string;
  pixKey?: string;
  pixQrCode?: string;
  pixPayload?: string;
  pixExpirationDate?: string;
  createdAt: any; // Firestore timestamp
}

const getStatusInfo = (status: string) => {
  switch (status) {
    case "completed":
      return {
        icon: CheckCircle,
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        label: "Concluído",
      };
    case "pending":
      return {
        icon: Clock,
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        label: "Pendente",
      };
    case "processing":
      return {
        icon: AlertCircle,
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        label: "Processando",
      };
    case "failed":
      return {
        icon: XCircle,
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-900/20",
        label: "Falhou",
      };
    case "cancelled":
      return {
        icon: XCircle,
        color: "text-gray-600 dark:text-gray-400",
        bgColor: "bg-gray-50 dark:bg-gray-900/20",
        label: "Cancelado",
      };
    default:
      return {
        icon: Clock,
        color: "text-gray-600 dark:text-gray-400",
        bgColor: "bg-gray-50 dark:bg-gray-900/20",
        label: "Desconhecido",
      };
  }
};

const formatDate = (timestamp: any) => {
  if (!timestamp) return "Data não disponível";
  
  try {
    // Se for um timestamp do Firestore
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString("pt-BR");
    }
    // Se for uma string de data
    if (typeof timestamp === "string") {
      return new Date(timestamp).toLocaleString("pt-BR");
    }
    // Se for um objeto Date
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString("pt-BR");
    }
    return "Data inválida";
  } catch (error) {
    return "Data inválida";
  }
};

export default function PurchaseHistoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/?modal=login");
      return;
    }

    fetchTransactions();
  }, [user, router]);

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const transactionsRef = collection(db, "transactions");
      const q = query(
        transactionsRef,
       
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const transactionsData: Transaction[] = [];

      querySnapshot.forEach((doc) => {
        transactionsData.push({
          id: doc.id,
          ...doc.data(),
        } as Transaction);
      });

      setTransactions(transactionsData);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      setError("Erro ao carregar histórico de compras");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Redirecionamento em andamento
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Histórico de Compras
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Acompanhe todas as suas transações
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a3bd04] mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Carregando histórico...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <XCircle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
              Erro ao carregar histórico
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchTransactions}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
            <CreditCard className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma compra encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Você ainda não realizou nenhuma compra. Explore nossos planos!
            </p>
            <button
              onClick={() => router.push("/plans")}
              className="bg-[#a3bd04] hover:bg-[#8fa003] text-white px-6 py-3 rounded-lg transition-colors"
            >
              Ver Planos
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => {
              const statusInfo = getStatusInfo(transaction.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={transaction.id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <Package className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {transaction.planName}
                          </h3>
                        </div>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm justify-between">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <span className="text-gray-600 dark:text-gray-400">
                            Valor:
                          </span>
                          <span className="font-medium text-[#a3bd04]">
                            R$ {transaction.planPrice.toFixed(2).replace(".", ",")}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <span className="text-gray-600 dark:text-gray-400">
                            Pagamento:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {transaction.paymentMethod.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <span className="text-gray-600 dark:text-gray-400">
                            Data:
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatDate(transaction.createdAt)}
                          </span>
                        </div>
                      </div>

                      {transaction.planType === "package" && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            📦 Pacote único - Acesso liberado após confirmação do pagamento
                          </p>
                        </div>
                      )}

                      {transaction.planType === "subscription" && (
                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <p className="text-sm text-green-800 dark:text-green-200">
                            📅 Assinatura recorrente - Renovação automática
                          </p>
                        </div>
                      )}

                      {transaction.status === "pending" && transaction.pixExpirationDate && (
                        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <p className="text-sm text-orange-800 dark:text-orange-200">
                            ⏰ PIX válido até: {formatDate(transaction.pixExpirationDate)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Estatísticas */}
        {transactions.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Resumo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#a3bd04]">
                  {transactions.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total de Compras
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {transactions.filter(t => t.status === "completed").length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Concluídas
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  R$ {transactions
                    .filter(t => t.status === "completed")
                    .reduce((sum, t) => sum + t.planPrice, 0)
                    .toFixed(2)
                    .replace(".", ",")}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Gasto
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
