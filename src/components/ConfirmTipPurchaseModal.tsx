"use client";

import { X, AlertTriangle, Package, Check } from "lucide-react";
import { Tip } from "@/src/types";

interface ConfirmTipPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tip: Tip | null;
  tipsRemaining: number;
  loading?: boolean;
}

export default function ConfirmTipPurchaseModal({
  isOpen,
  onClose,
  onConfirm,
  tip,
  tipsRemaining,
  loading = false,
}: ConfirmTipPurchaseModalProps) {
  if (!isOpen || !tip) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[] bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Confirmar Compra
            </h2>
          </div>
          {!loading && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Tip Info */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Palpite
          </div>
          <div className="font-semibold text-gray-900 dark:text-white mb-2">
            {tip.teams}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {tip.league}
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                Ação Irreversível
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                Ao confirmar, 1 tip será descontado do seu pacote. Esta ação não
                pode ser desfeita.
              </p>
            </div>
          </div>
        </div>

        {/* Package Info */}
        <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-6">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
              Tips Restantes
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {tipsRemaining}
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400">→</span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {tipsRemaining - 1}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-[#a3bd04] hover:bg-[#8fa003] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Processando...</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>Confirmar Compra</span>
              </>
            )}
          </button>
        </div>

        {/* Info Footer */}
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
          Você terá acesso completo ao palpite após a confirmação
        </p>
      </div>
    </div>
  );
}
