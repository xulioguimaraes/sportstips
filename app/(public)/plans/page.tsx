"use client";

import { useState } from "react";
import { 
  Star, 
  Crown, 
  Target, 
  Check, 
  ArrowRight, 
  Zap, 
  Shield, 
  Users, 
  TrendingUp,
  Clock,
  Award,
  MessageCircle
} from "lucide-react";
import { PaymentPlan } from "@/src/types";

const allPlans: PaymentPlan[] = [
  {
    id: "single_tip",
    name: "Palpite Individual",
    type: "package",
    price: 9.90,
    currency: "BRL",
    tipsIncluded: 1,
    features: [
      "1 palpite premium exclusivo",
      "Análise detalhada completa",
      "Suporte por 24 horas",
      "Acesso imediato"
    ],
  },
  {
    id: "package_5",
    name: "Pacote 5 Tips",
    type: "package",
    price: 39.90,
    currency: "BRL",
    tipsIncluded: 5,
    features: [
      "5 palpites premium",
      "Economia de 20%",
      "Análises detalhadas",
      "Suporte prioritário",
      "Validade de 30 dias"
    ],
    isPopular: true,
  },
  {
    id: "package_10",
    name: "Pacote 10 Tips",
    type: "package",
    price: 69.90,
    currency: "BRL",
    tipsIncluded: 10,
    features: [
      "10 palpites premium",
      "Economia de 30%",
      "Análises exclusivas",
      "Suporte VIP",
      "Validade de 60 dias",
      "Tips bônus"
    ],
  },
  {
    id: "weekly",
    name: "Assinatura Semanal",
    type: "subscription",
    price: 29.90,
    currency: "BRL",
    duration: 7,
    features: [
      "Tips ilimitados por 7 dias",
      "Análises exclusivas",
      "Suporte VIP",
      "Cancelamento livre",
      "Acesso a grupo VIP"
    ],
  },
  {
    id: "monthly",
    name: "Assinatura Mensal",
    type: "subscription",
    price: 99.90,
    currency: "BRL",
    duration: 30,
    features: [
      "Tips ilimitados por 30 dias",
      "Análises premium exclusivas",
      "Suporte 24/7",
      "Cancelamento livre",
      "Acesso a grupo VIP",
      "Tips bônus mensais"
    ],
  },
];

const testimonials = [
  {
    name: "Carlos Silva",
    role: "Apostador",
    content: "ROI de 35% no primeiro mês! Os tips são incríveis.",
    rating: 5,
  },
  {
    name: "Ana Santos",
    role: "Investidora",
    content: "Taxa de acerto impressionante. Vale cada centavo!",
    rating: 5,
  },
  {
    name: "Roberto Lima",
    role: "Traders",
    content: "Suporte excepcional e análises muito detalhadas.",
    rating: 5,
  },
];

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("package_5");

  const handlePurchase = (planId: string) => {
    // Implementar lógica de compra
    console.log("Comprando plano:", planId);
    alert(`Redirecionando para pagamento do plano: ${planId}`);
  };

  const getSavings = (plan: PaymentPlan) => {
    if (plan.type === "package" && plan.tipsIncluded && plan.tipsIncluded > 1) {
      const individualPrice = 9.90;
      const totalIndividual = individualPrice * plan.tipsIncluded;
      const savings = totalIndividual - plan.price;
      const percentage = Math.round((savings / totalIndividual) * 100);
      return { savings, percentage };
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Star className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Escolha seu Plano Premium
          </h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Acesse palpites profissionais com taxa de acerto superior a 85% e ROI médio de 25%
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold">85%</div>
              <div className="text-sm text-indigo-200">Taxa de Acerto</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">25%</div>
              <div className="text-sm text-indigo-200">ROI Médio</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">2.5k+</div>
              <div className="text-sm text-indigo-200">Clientes Ativos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Planos Disponíveis
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Escolha o plano que melhor se adapta ao seu perfil de apostas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {allPlans.map((plan) => {
            const savings = getSavings(plan);
            return (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                  plan.isPopular
                    ? "border-indigo-500 scale-105"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-2">
                      <Crown className="w-4 h-4" />
                      <span>MAIS POPULAR</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center space-x-2">
                      <span className="text-4xl font-bold text-[#a3bd04]">
                        R$ {plan.price.toFixed(2)}
                      </span>
                      {plan.type === "package" && plan.tipsIncluded && plan.tipsIncluded > 1 && (
                        <span className="text-gray-500 dark:text-gray-400">
                          / {plan.tipsIncluded} tips
                        </span>
                      )}
                      {plan.type === "subscription" && (
                        <span className="text-gray-500 dark:text-gray-400">
                          / {plan.duration === 7 ? "semana" : "mês"}
                        </span>
                      )}
                    </div>
                    
                    {savings && (
                      <div className="mt-2">
                        <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                          Economia de {savings.percentage}% (R$ {savings.savings.toFixed(2)})
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePurchase(plan.id)}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-[1.02] ${
                    plan.isPopular
                      ? "bg-[#a3bd04] text-white hover:bg-[#8fa003] shadow-lg"
                      : "bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600"
                  }`}
                >
                  Escolher Plano
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Mais de 2.500 apostadores já confiam em nossos palpites
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">&ldquo;{testimonial.content}&rdquo;</p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Por que escolher nossos palpites?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Alta Performance</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Taxa de acerto superior a 85% com ROI médio de 25%
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Garantia Total</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                7 dias de garantia ou seu dinheiro de volta
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Suporte VIP</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Atendimento prioritário e grupo exclusivo
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Análises Exclusivas</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Insights profissionais e dados exclusivos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Como funciona a garantia de 7 dias?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Se você não ficar satisfeito com nossos palpites nos primeiros 7 dias, 
                devolvemos 100% do seu dinheiro, sem perguntas.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Os palpites são realmente exclusivos?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sim! Nossos palpites são desenvolvidos por nossa equipe de especialistas 
                e não são compartilhados em outros canais.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                Posso cancelar minha assinatura a qualquer momento?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sim, você pode cancelar sua assinatura a qualquer momento. 
                Não há taxas de cancelamento ou multas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para começar a lucrar?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Junte-se a mais de 2.500 apostadores que já confiam em nossos palpites
          </p>
          <button
            onClick={() => setSelectedPlan("package_5")}
            className="bg-white text-[#a3bd04] py-4 px-8 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            Escolher Plano Agora
          </button>
        </div>
      </div>
    </div>
  );
}
