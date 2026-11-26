
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export default function SettingsScreen() {
  const { theme, setTheme } = useTheme();

  return (
    <main className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-background p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Settings
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Customize how NexText looks on this device.
        </p>
      </header>

      <section className="max-w-2xl">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Appearance
        </h2>

        <div className="rounded-default border border-border bg-surface">
          <div className="border-b border-border p-4">
            <h3 className="text-sm font-medium">Theme</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Choose a light or dark appearance.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4">
            <button
              type="button"
              aria-pressed={theme === "light"}
              onClick={() => setTheme("light")}
              className={`flex items-center gap-3 rounded-default border p-3 text-sm transition-colors ${
                theme === "light"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-foreground hover:bg-surface-elevated"
              }`}
            >
              <Sun size={18} aria-hidden="true" />
              <span>Light</span>
            </button>

            <button
              type="button"
              aria-pressed={theme === "dark"}
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-3 rounded-default border p-3 text-sm transition-colors ${
                theme === "dark"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-foreground hover:bg-surface-elevated"
              }`}
            >
              <Moon size={18} aria-hidden="true" />
              <span>Dark</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
