"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Category {
  id: number;
  name: string;
  category: string;
  is_default: boolean;
  is_pub: boolean;
}

interface CategoriesResponse {
  categories: Category[];
  error?: string;
}

interface CategoryFilterProps {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export function CategoryFilter({ selectedIds, onChange }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data: CategoriesResponse = await res.json();
        if (!data.error && data.categories) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleToggle = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  if (loading) {
    return (
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-20 rounded-full bg-muted animate-pulse"
          />
        ))}
      </div>
    );
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
