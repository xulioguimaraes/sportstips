"use client";

import { NavItem } from "@/src/types";
import { Home, Target, User } from "lucide-react";

interface BottomNavigationProps {
  navItems: NavItem[];
  onNavClick: (navId: string) => void;
}

const iconMap = {
  Home,
  Target,
  User,
};

export default function BottomNavigation({
  navItems,
  onNavClick,
}: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] bg-[#1e293b] border-t border-gray-600 px-0 py-2 pb-[calc(12px+env(safe-area-inset-bottom))] flex justify-around">
      {navItems.map((item) => {
        const IconComponent = iconMap[item.icon as keyof typeof iconMap];

        return (
          <a
            key={item.id}
            href="#"
            className={`flex flex-col items-center text-gray-400 transition-colors duration-200 px-4 ${
              item.isActive ? "text-white" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              onNavClick(item.id);
            }}
          >
            <div className="text-xl mb-1">
              {IconComponent && (
                <IconComponent
                  size={32}
                  className={item.isActive ? "text-[#a3bd04]" : "text-gray-400"}
                />
              )}
            </div>
            <div className="text-xs font-medium">{item.label}</div>
          </a>
        );
      })}
    </div>
  );
}
