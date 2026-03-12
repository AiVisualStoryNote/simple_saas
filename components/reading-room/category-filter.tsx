"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Category {
  id: number;
  name: string;
  category: string;
  is_default: boolean;
  is_pub: boolean;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export function CategoryFilter({ categories, selectedIds, onChange }: CategoryFilterProps) {
  const handleToggle = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleToggle(category.id)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
            "border hover:shadow-md",
            selectedIds.includes(category.id)
              ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:shadow-primary/25"
              : "bg-background text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
