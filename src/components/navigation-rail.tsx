
"use client";

import { useState } from "react";
import {
  MessageSquare,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

type NavigationItem = {
  label: string;
  icon: LucideIcon;
};

const navigationItems: NavigationItem[] = [
  { label: "Messages", icon: MessageSquare },
  { label: "Contacts", icon: Users },
  { label: "Settings", icon: Settings },
];

export default function NavigationRail() {
  const [activeItem, setActiveItem] = useState("Messages");

  return (
    <aside className="flex h-full min-h-screen w-60 shrink-0 flex-col border-r border-border bg-surface p-4">
      <div className="mb-8 flex h-10 items-center gap-3 px-2">
        <div className="flex size-9 items-center justify-center rounded-default bg-accent text-sm font-bold text-white">
          N
        </div>

        <span className="text-lg font-semibold tracking-tight">
          NexText
        </span>
      </div>

      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
        Workspace
      </p>

      <nav aria-label="Main navigation" className="flex flex-col gap-1">
        {navigationItems.map(({ label, icon: Icon }) => {
          const isActive = activeItem === label;

          return (
            <button
              key={label}
              type="button"
              onClick={() => setActiveItem(label)}
              aria-current={isActive ? "page" : undefined}
              className={`flex h-11 items-center gap-3 rounded-default px-3 text-sm transition-colors ${
                isActive
                  ? "bg-accent/15 font-medium text-accent"
                  : "text-text-secondary hover:bg-surface-elevated hover:text-foreground"
              }`}
            >
              <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border pt-4">
        <div className="rounded-default bg-surface-elevated p-3">
          <p className="text-sm font-medium">Your workspace</p>
          <p className="mt-1 text-xs text-text-secondary">
            Stay connected.
          </p>
        </div>
      </div>
    </aside>
  );
}

