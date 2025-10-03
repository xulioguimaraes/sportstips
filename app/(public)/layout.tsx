"use client";

import { useState } from "react";
import { AuthProvider, useAuth } from "@/src/contexts/AuthContext";
import { NavItem } from "@/src/types";
import BottomNavigation from "@/src/components/BottomNavigation";
import LogoCss from "@/src/components/LogoCss";
import AuthModal from "@/src/components/AuthModal";
import { useRouter } from "next/navigation";

const initialNavItems: NavItem[] = [
  { id: "home", label: "Início", icon: "Home", isActive: true },
  { id: "tips", label: "Tips", icon: "Target", isActive: false },
  { id: "profile", label: "Perfil", icon: "User", isActive: false },
];

// Componente interno que usa o AuthContext
function PublicLayoutContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [navItems, setNavItems] = useState<NavItem[]>(initialNavItems);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();
  // Navigation functionality
  const handleNavClick = (navId: string) => {
    const updatedNavItems = navItems.map((item) => ({
      ...item,
      isActive: item.id === navId,
    }));
    setNavItems(updatedNavItems);

    const label = navItems.find((item) => item.id === navId)?.label;
    console.log(`Navegando para: ${label}`);

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
      <div className="flex justify-center items-center m-1 mb-1">
        <LogoCss />
      </div>
      {/* Conteúdo das páginas */}
      <main>{children}</main>
      {/* Navegação inferior */}
      <BottomNavigation navItems={navItems} onNavClick={handleNavClick} />
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
