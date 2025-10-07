"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import LogoCss from "./LogoCss";
import Image from "next/image";
import {
  LayoutDashboard,
  Target,
  TrendingUp,
  Settings,
  LogOut,
  Package,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "tips", label: "Palpites", icon: Target },
    { id: "plans", label: "Planos", icon: Package },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar when clicking on menu item (mobile)
  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Close sidebar when clicking outside (mobile)
  const handleOverlayClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 right-4 z-50 p-2 bg-[#1B2838] rounded-lg shadow-lg border border-gray-700 lg:hidden"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center space-y-1">
            <span
              className={`block h-0.5 w-6 bg-gray-300 transition-all duration-300 ${
                isOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-gray-300 transition-all duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-gray-300 transition-all duration-300 ${
                isOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </div>
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 shadow-xl border-r border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${
          isMobile
            ? isOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        }
      `}
      >
        {/* Logo */}
        <div className="relative flex items-center justify-center h-16 px-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center justify-center">
            {/* Logo Sportstips com Tailwind */}
            <Image
              src="/images/logo2.png"
              alt="Logo"
              className="h-[40px] w-full object-contain scale-[6]" 
              width={100}
              height={50}
            />
          </div>
          {isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#a3bd04] rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.displayName || "Admin"}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-[#a3bd04] text-white shadow-lg"
                      : "text-gray-400 hover:bg-[#1B2838] hover:text-white"
                  }`}
                >
                  <IconComponent className="mr-3 w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-800">
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-red-900/20 hover:text-red-400 rounded-lg transition-colors duration-200"
          >
            <LogOut className="mr-3 w-5 h-5" />
            Sair
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
