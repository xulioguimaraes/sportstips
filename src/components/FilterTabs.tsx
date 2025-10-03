"use client";

import { FilterTab } from "@/src/types";

interface FilterTabsProps {
  tabs: FilterTab[];
  onFilterChange: (category: string) => void;
}

export default function FilterTabs({ tabs, onFilterChange }: FilterTabsProps) {
  return (
    <div className=" flex gap-1 p-2 overflow-x-auto  scrollbar-width-none ">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`filter-tab ${tab.isActive ? "active" : ""}`}
          onClick={() => onFilterChange(tab.category)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
