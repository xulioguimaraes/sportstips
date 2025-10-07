"use client";

import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "@/src/contexts/AuthContext";
import { NavItem } from "@/src/types";
import BottomNavigation from "@/src/components/BottomNavigation";
import LogoCss from "@/src/components/LogoCss";
import AuthModal from "@/src/components/AuthModal";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const initialNavItems: NavItem[] = [
  { id: "home", label: "Início", icon: "Home", isActive: false },
  { id: "tips", label: "Tips", icon: "Target", isActive: false },
  { id: "profile", label: "Perfil", icon: "User", isActive: false },
];

// Componente interno que usa o AuthContext
function PublicLayoutContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Verificar se deve abrir o modal de login baseado na URL
  useEffect(() => {
    const modalParam = searchParams.get('modal');
    if (modalParam === 'login') {
      setShowAuthModal(true);
      // Remover o parâmetro da URL após abrir o modal
      const url = new URL(window.location.href);
      url.searchParams.delete('modal');
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [searchParams, router]);

  // Função para determinar se um item está ativo baseado no pathname
  const getActiveNavItems = () => {
    return initialNavItems.map((item) => {
      let isActive = false;

      switch (item.id) {
        case "home":
          isActive = pathname === "/";
          break;
        case "tips":
          isActive = pathname === "/tips";
          break;
        case "profile":
          isActive = pathname === "/profile";
          break;
        default:
          isActive = false;
      }

      return {
        ...item,
        isActive,
      };
    });
  };

  // Navigation functionality
  const handleNavClick = (navId: string) => {
    const label = initialNavItems.find((item) => item.id === navId)?.label;

    // Navegar para as páginas correspondentes
    if (navId === "home") {
      router.push("/");
    } else if (navId === "tips") {
      router.push("/tips");
    } else if (navId === "profile") {
      if (!user) {
        setShowAuthModal(true);
      } else {
        router.push("/profile");
      }
    }
  };

  return (
    <div className="container">
      {/* Logo */}
      <div className="flex justify-center bg-gray-800 items-center  ">
        <LogoCss />
      </div>
      {/* Conteúdo das páginas */}
      <main>{children}</main>
      {/* Navegação inferior */}
      <BottomNavigation
        navItems={getActiveNavItems()}
        onNavClick={handleNavClick}
      />
      {/* Modal de Autenticação */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <PublicLayoutContent>{children}</PublicLayoutContent>
    </AuthProvider>
  );
}
