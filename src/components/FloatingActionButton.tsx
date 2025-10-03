"use client";

import { Crown } from "lucide-react";

interface FloatingActionButtonProps {
  onClick: () => void;
}

export default function FloatingActionButton({
  onClick,
}: FloatingActionButtonProps) {
  return (
    <button
      className="bg-[#FFD700] fixed right-5 bottom-[calc(80px+env(safe-area-inset-bottom))] h-14 w-14 rounded-full flex items-center justify-center z-10 cursor-pointer"
      onClick={onClick}
    >
      <Crown size={24} className="text-white" />
    </button>
  );
}
