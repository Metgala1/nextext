
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="rounded-default border border-border bg-surface px-4 py-2 text-foreground transition-colors"
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
}
