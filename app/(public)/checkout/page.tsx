"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  CheckCircle,
  Copy,
  QrCode,
  X,
} from "lucide-react";
import { createPixEVPKey } from "@/src/services/asaasService";
import { useAuth } from "@/src/contexts/AuthContext";
import AuthModal from "@/src/components/AuthModal";
import { usePlans } from "@/src/contexts/PlansContext";

interface PlanData {
  id: string;
  name: string;
  price: number;
  description: string;
  type: "package" | "subscription";
}

interface PixModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixCode: string;
  amount: number;
  qrCodeImage?: string;
  expirationDate?: string;
  onPaymentComplete: () => void;
}

// Componente do Modal PIX
const PixModal: React.FC<PixModalProps> = ({
  isOpen,
  onClose,
  pixCode,
  amount,
  qrCodeImage,
  expirationDate,
  onPaymentComplete,
}) => {
  const [copied, setCopied] = useState(false);

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Pagamento via PIX
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center mb-4">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Valor:{" "}
            <span className="font-bold text-[#a3bd04]">
              R$ {amount.toFixed(2).replace(".", ",")}
            </span>
          </p>
          {expirationDate && (
            <p className="text-sm text-orange-600 dark:text-orange-400">
              ⏰ Válido até: {new Date(expirationDate).toLocaleString("pt-BR")}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {/* QR Code */}
          <div className="text-center">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 inline-block">
              {qrCodeImage ? (
                <Image
                  src={`data:image/png;base64,${qrCodeImage}`}
                  alt="QR Code PIX"
                  width={128}
                  height={128}
                  className="mx-auto"
                />
              ) : (
                <QrCode className="w-32 h-32 text-gray-400 mx-auto" />
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                QR Code PIX
              </p>
            </div>
          </div>

          {/* Código PIX */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Código PIX (Copie e cole no seu app)
            </label>
            <div className="flex">
              <input
                type="text"
                value={pixCode}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <button
                onClick={copyPixCode}
                className={`px-4 py-2 rounded-r-lg transition-colors duration-200 ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                }`}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && (
              <p className="text-green-600 dark:text-green-400 text-xs mt-1">
                Código copiado!
              </p>
            )}
          </div>

          {/* Instruções */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start">
              <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Como pagar com PIX:
                </h4>
                <ol className="text-sm text-blue-800 dark:text-blue-200 mt-1 space-y-1">
                  <li>1. Abra o app do seu banco</li>
                  <li>2. Escaneie o QR Code ou cole o código PIX</li>
                  <li>3. Confirme o pagamento</li>
                  <li>4. Clique em &quot;Confirmar Pagamento&quot; abaixo</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              onClick={onPaymentComplete}
              className="flex-1 bg-[#a3bd04] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#8fa003] transition-colors duration-200"
            >
              Confirmar Pagamento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { plans, loading: plansLoading } = usePlans();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "pix" | "card"
  >("pix");
  const [pixCode, setPixCode] = useState("");
  const [qrCodeImage, setQrCodeImage] = useState<string>("");
  const [pixExpirationDate, setPixExpirationDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "processing" | "completed"
  >("pending");
  const [showPixModal, setShowPixModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [transactionId, setTransactionId] = useState<string>("");
  const [pendingPayment, setPendingPayment] = useState(false);

  // Buscar plano da lista de planos usando o ID da URL
  const planId = searchParams.get("plan") || "";
  const planData: PlanData | null = useMemo(() => {
    if (!planId || plansLoading || plans.length === 0) return null;

    const plan = plans.find((p) => p.id === planId);
    if (!plan) return null;

    return {
      id: plan.id,
      name: plan.name,
      price: plan.price / 100, // Converter centavos para reais
      description: "",
      type: plan.type,
    };
  }, [planId, plans, plansLoading]);

  // Determinar métodos de pagamento disponíveis baseado no tipo de plano
  const availablePaymentMethods =
    planData?.type === "subscription"
      ? ["card"] // Apenas cartão para assinaturas
      : ["pix"]; // Apenas PIX para pacotes

  // Definir método padrão baseado no tipo de plano
  useEffect(() => {
    if (planData?.type === "subscription") {
      setSelectedPaymentMethod("card");
    } else {
      setSelectedPaymentMethod("pix");
    }
  }, [planData?.type]);

  // Remover geração mock do PIX - agora usamos API real

  const handlePayment = async () => {
    if (!user) {
      setPendingPayment(true);
      setShowAuthModal(true);
      return;
    }

    await processPayment();
  };

  const processPayment = useCallback(async () => {
    if (!planData || !user) return;

    if (selectedPaymentMethod === "pix") {
      // Para PIX, a API agora cuida de buscar o plano e salvar a transação
      setIsLoading(true);

      try {
        // Criar chave PIX EVP via API do Asaas (passa planId e userId)
        const pixData = await createPixEVPKey(planData.id, user.email);

        setTransactionId(pixData.transactionId);
        setPixCode(pixData.payload);
        setQrCodeImage(pixData.encodedImage);
        setPixExpirationDate(pixData.expirationDate);
        setShowPixModal(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao gerar PIX:", error);
        alert("Erro ao gerar código PIX. Tente novamente.");
        setIsLoading(false);
      }
    } else if (selectedPaymentMethod === "card") {
      // Para cartão, processar pagamento via Asaas
      setIsLoading(true);
      setPaymentStatus("processing");

      try {
        // Aqui você integraria com a API do Asaas para cartão
        await processCardPayment();
      } catch (error) {
        console.error("Erro no pagamento:", error);
        setIsLoading(false);
        setPaymentStatus("pending");
      }
    }
  }, [selectedPaymentMethod, planData, user]);

  // Função separada para pagamento após login
  const handlePaymentAfterLogin = useCallback(async () => {
    if (!user || !planData) {
      return;
    }

    if (selectedPaymentMethod === "pix") {
      // Para PIX, a API agora cuida de buscar o plano e salvar a transação
      setIsLoading(true);

      try {
        // Criar chave PIX EVP via API do Asaas (passa planId e userId)
        const pixData = await createPixEVPKey(planData.id, user.email);

        setTransactionId(pixData.transactionId);
        setPixCode(pixData.payload);
        setQrCodeImage(pixData.encodedImage);
        setPixExpirationDate(pixData.expirationDate);
        setShowPixModal(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao gerar PIX:", error);
        alert("Erro ao gerar código PIX. Tente novamente.");
        setIsLoading(false);
      }
    } else if (selectedPaymentMethod === "card") {
      // Para cartão, processar pagamento via Asaas
      setIsLoading(true);
      setPaymentStatus("processing");

      try {
        // Aqui você integraria com a API do Asaas para cartão
        await processCardPayment();
      } catch (error) {
        console.error("Erro no pagamento:", error);
        setIsLoading(false);
        setPaymentStatus("pending");
      }
    }
  }, [user, selectedPaymentMethod, planData]);

  // Executar pagamento pendente quando usuário fizer login
  useEffect(() => {
    if (user && pendingPayment) {
      setPendingPayment(false);
      // Usar setTimeout para garantir que o estado foi atualizado
      setTimeout(() => {
        handlePaymentAfterLogin();
      }, 100);
    }
  }, [user, pendingPayment, handlePaymentAfterLogin]);

  // Monitorar quando o modal é fechado e usuário está logado
  useEffect(() => {
    if (user && !showAuthModal && pendingPayment) {
      setPendingPayment(false);
      setTimeout(() => {
        handlePaymentAfterLogin();
      }, 100);
    }
  }, [user, showAuthModal, pendingPayment, handlePaymentAfterLogin]);

  const processCardPayment = async () => {
    // Simular processamento do pagamento via Asaas
    setTimeout(() => {
      setPaymentStatus("completed");
      setIsLoading(false);
    }, 3000);
  };

  const handlePixPaymentComplete = async () => {
    setShowPixModal(false);
    setIsLoading(true);
    setPaymentStatus("processing");

    try {
      // Aqui você atualizaria o status da transação no Firestore
      // await updateTransactionStatus(transactionId, 'processing');

      // Simular confirmação do pagamento PIX
      setTimeout(() => {
        setPaymentStatus("completed");
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao confirmar pagamento:", error);
      setIsLoading(false);
      setPaymentStatus("pending");
    }
  };

  const goBack = () => {
    router.back();
  };

  // Loading state
  if (plansLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a3bd04] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Carregando plano...
          </p>
        </div>
      </div>
    );
  }

  // Plano não encontrado
  if (!planData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Plano não encontrado
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            O plano selecionado não foi encontrado. Por favor, selecione um
            plano válido.
          </p>
          <button
            onClick={() => router.push("/plans")}
            className="w-full bg-[#a3bd04] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#8fa003] transition-colors duration-200"
          >
            Ver Planos
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus === "completed") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Pagamento Aprovado!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Seu plano <strong>{planData.name}</strong> foi ativado com sucesso.
          </p>
          <button
            onClick={() => router.push("/tips")}
            className="w-full bg-[#a3bd04] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#8fa003] transition-colors duration-200"
          >
            Ver Palpites
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={goBack}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-24">
          {/* Resumo do Pedido */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Resumo do Pedido
            </h2>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {planData.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Acesso premium aos palpites esportivos
              </p>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Valor:</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  R$ {planData.price.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="text-[#a3bd04]">
                  R$ {planData.price.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>
          </div>

          {/* Métodos de Pagamento */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Método de Pagamento
            </h2>

            {/* Seleção de Método */}
            <div className="space-y-3 mb-2">
              {availablePaymentMethods.includes("pix") && (
                <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="pix"
                    checked={selectedPaymentMethod === "pix"}
                    onChange={(e) =>
                      setSelectedPaymentMethod(e.target.value as "pix" | "card")
                    }
                    className="w-4 h-4 text-[#a3bd04] focus:ring-[#a3bd04] border-gray-300 dark:border-gray-600"
                  />
                  <div className="ml-3 flex items-center">
                    <QrCode className="w-5 h-5 text-[#a3bd04] mr-2" />
                    <span className="text-gray-900 dark:text-white font-medium">
                      PIX
                    </span>
                  </div>
                </label>
              )}

              {availablePaymentMethods.includes("card") && (
                <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={selectedPaymentMethod === "card"}
                    onChange={(e) =>
                      setSelectedPaymentMethod(e.target.value as "pix" | "card")
                    }
                    className="w-4 h-4 text-[#a3bd04] focus:ring-[#a3bd04] border-gray-300 dark:border-gray-600"
                  />
                  <div className="ml-3 flex items-center">
                    <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                    <span className="text-gray-900 dark:text-white font-medium">
                      Cartão de Crédito
                    </span>
                  </div>
                </label>
              )}
            </div>

            {/* Informação sobre o tipo de plano */}
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {planData.type === "subscription"
                  ? "📅 Este é um plano recorrente. Pagamento será cobrado automaticamente."
                  : "📦 Este é um pacote único. Pagamento único via PIX."}
              </p>
            </div>

            {/* Botão de Pagamento */}
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full mt-6 bg-[#a3bd04] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#8fa003] focus:outline-none focus:ring-2 focus:ring-[#a3bd04] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Processando...
                </div>
              ) : selectedPaymentMethod === "pix" ? (
                `Gerar PIX R$ ${planData.price.toFixed(2).replace(".", ",")}`
              ) : (
                `Pagar R$ ${planData.price.toFixed(2).replace(".", ",")}`
              )}
            </button>
          </div>
        </div>

        {/* Modal PIX */}
        <PixModal
          isOpen={showPixModal}
          onClose={() => setShowPixModal(false)}
          pixCode={pixCode}
          amount={planData.price}
          qrCodeImage={qrCodeImage}
          expirationDate={pixExpirationDate}
          onPaymentComplete={handlePixPaymentComplete}
        />

        {/* Modal de Autenticação */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => {
            setShowAuthModal(false);
            // Não limpar pendingPayment aqui, deixar o useEffect gerenciar
          }}
        />
      </div>
    </div>
  );
}
