
"use client";

import {
  Search,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";

type MessageSearchProps = {
  query: string;
  onQueryChange: (value: string) => void;
  resultCount: number;
  currentResult: number;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
};

export default function MessageSearch({
  query,
  onQueryChange,
  resultCount,
  currentResult,
  onPrevious,
  onNext,
  onClose,
}: MessageSearchProps) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-border p-3">
      <label className="flex min-w-0 flex-1 items-center gap-2 rounded-default border border-border bg-surface px-3">
        <Search
          size={17}
          className="shrink-0 text-text-secondary"
          aria-hidden="true"
        />

        <span className="sr-only">Search messages</span>

        <input
          autoFocus
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search messages..."
          className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-text-secondary"
        />
      </label>

      <span
        className="shrink-0 text-xs text-text-secondary"
        aria-live="polite"
      >
        {resultCount > 0
          ? `${currentResult} of ${resultCount}`
          : "No results"}
      </span>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onPrevious}
          disabled={resultCount === 0}
          aria-label="Previous search result"
          className="flex size-8 items-center justify-center rounded-default text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground disabled:opacity-40"
        >
          <ChevronUp size={18} />
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={resultCount === 0}
          aria-label="Next search result"
          className="flex size-8 items-center justify-center rounded-default text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground disabled:opacity-40"
        >
          <ChevronDown size={18} />
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close message search"
          className="flex size-8 items-center justify-center rounded-default text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
