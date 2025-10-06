"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  User,
  Settings,
  CreditCard,
  Crown,
  LogOut,
  ChevronRight,
  Target,
} from "lucide-react";
import { LoadingGetDataUser } from "@/src/components/LoadingGetDataUser";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  // Simular loading de 2 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Mostrar loading enquanto carrega
  if (isLoading || authLoading) {
    return <LoadingGetDataUser />;
  }

  // Mostrar tela de login apenas após o loading
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg px-4 py-6 w-full max-w-md text-center">
          <User className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Faça login para <br /> acessar seu perfil
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Entre com sua conta para ver suas informações e configurações
          </p>
          <button
            onClick={() => {
              // O modal será gerenciado pelo layout
              router.push("/?modal=login");
            }}
            className="w-full bg-[#a3bd04] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#8fa003] transition-colors"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header do Perfil */}
      <div className="bg-black rounded-xl p-3 mb-4 text-white mx-2">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {user.displayName || "Usuário"}
            </h1>
            <p className="text-indigo-100">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Estatísticas do Usuário */}
      <div className="grid grid-cols-2 gap-2 mb-4 px-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-[#a3bd04]">12</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Tips Comprados
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            85%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Taxa de Acerto
          </div>
        </div>
      </div>

      {/* Menu de Opções */}
      <div className="space-y-4 px-2">
        {/* Configurações */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <h3 className="px-6 py-4 text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700">
            Configurações
          </h3>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <span className="text-gray-900 dark:text-white">
                  Configurações da Conta
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>
            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <span className="text-gray-900 dark:text-white">
                  Editar Perfil
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>
          </div>
        </div>

        {/* Compras e Assinaturas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <h3 className="px-6 py-4 text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700">
            Compras e Assinaturas
          </h3>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center space-x-3">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-900 dark:text-white">
                  Plano Premium
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Ativo
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
            </button>
            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <span className="text-gray-900 dark:text-white">
                  Histórico de Compras
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>
            <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <Link href="/tips">
                  <span className="text-gray-900 dark:text-white">
                    Meus Tips Comprados
                  </span>
                </Link>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>
          </div>
        </div>

        {/* Sessão */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <h3 className="px-6 py-4 text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700">
            Sessão
          </h3>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            <button
              onClick={logout}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5 text-red-500" />
                <span className="text-red-600 dark:text-red-400">
                  Sair da Conta
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Informações da Conta */}
      <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-xl p-3 mb-24 px-2">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
          Informações da Conta
        </h4>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div>
            Membro desde:{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("pt-BR")
              : "N/A"}
          </div>
          <div>
            ID do usuário: {user.uid ? user.uid.substring(0, 8) + "..." : "N/A"}
          </div>
        </div>
      </div>
    </>
  );
}
