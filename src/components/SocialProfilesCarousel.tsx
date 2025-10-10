"use client";

import { useRef } from "react";
import { Instagram, Youtube, Send, ExternalLink } from "lucide-react";

interface SocialProfile {
  id: number;
  platform: string;
  title: string;
  description: string;
  link: string;
  icon: "telegram" | "instagram" | "youtube" | "other";
  gradient: string;
}

const SocialProfilesCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const profiles: SocialProfile[] = [
    {
      id: 1,
      platform: "Telegram",
      title: "Grupo VIP",
      description: "Entre no nosso grupo exclusivo e receba tips em primeira mão",
      link: "https://t.me/futescore",
      icon: "telegram",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      id: 2,
      platform: "Instagram",
      title: "@futescore",
      description: "Siga nosso perfil oficial e fique por dentro das novidades",
      link: "https://instagram.com/futescore",
      icon: "instagram",
      gradient: "from-pink-500 via-purple-500 to-orange-500",
    },
    {
      id: 3,
      platform: "YouTube",
      title: "Canal FuteScore",
      description: "Inscreva-se para análises completas e estatísticas",
      link: "https://youtube.com/@futescore",
      icon: "youtube",
      gradient: "from-red-500 to-red-600",
    },
    {
      id: 4,
      platform: "Telegram",
      title: "Canal de Notícias",
      description: "Receba atualizações e resultados em tempo real",
      link: "https://t.me/futescorenews",
      icon: "telegram",
      gradient: "from-cyan-500 to-blue-500",
    },
  ];

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "telegram":
        return <Send className="w-8 h-8" />;
      case "instagram":
        return <Instagram className="w-8 h-8" />;
      case "youtube":
        return <Youtube className="w-8 h-8" />;
      default:
        return <ExternalLink className="w-8 h-8" />;
    }
  };

  const handleCardClick = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full pb-24">
      <h2 className="text-xl font-bold text-white mb-4 px-4">
        Perfis Oficiais
      </h2>
      
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-scroll scrollbar-hide pb-4 px-4 scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          scrollSnapType: "x proximity",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {profiles.map((profile) => (
          <div
            key={profile.id}
            onClick={() => handleCardClick(profile.link)}
            className="flex-shrink-0 cursor-pointer group active:scale-95 transition-transform"
            style={{
              width: "calc((100% - 4rem) / 1.7)",
              minWidth: "200px",
              scrollSnapAlign: "start",
            }}
          >
            <div
              className={`relative h-48 rounded-xl overflow-hidden bg-gradient-to-br ${profile.gradient} p-6 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-[1.02]`}
            >
              {/* Icon */}
              <div className="absolute top-4 right-4 text-white/80">
                {getIcon(profile.icon)}
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between">
                <div>
                  <div className="text-white/80 text-sm font-medium mb-1">
                    {profile.platform}
                  </div>
                  <h3 className="text-white text-2xl font-bold mb-2">
                    {profile.title}
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {profile.description}
                  </p>
                </div>

                {/* Call to Action */}
                <div className="flex items-center text-white font-semibold text-sm group-hover:gap-2 transition-all">
                  <span>Acessar</span>
                  <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default SocialProfilesCarousel;

