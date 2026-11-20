"use client";

import { useEffect, useRef, useState } from "react";
import type { UserStatusGroup, StatusUpdate } from "@/data/status";
import { X, MoreHorizontal, Eye, Send } from "lucide-react";
import StatusViewersPanel from "@/components/status-viewers-panel";
import { CURRENT_USER_ID } from "@/data/users";

const STATUS_DURATION = 5000;
const STATUS_REACTIONS = ["❤️", "😂", "😮", "😢", "🙏", "🔥"];

type StatusViewerProps = {
  group: UserStatusGroup;
  onClose: () => void;
  onViewStatus: (statusId: string) => void;
  onReply: (status: StatusUpdate, message: string) => void;
  onReact: (statusId: string, emoji: string) => void;
};

export default function StatusViewer({
  group,
  onClose,
  onViewStatus,
  onReply,
  onReact,
}: StatusViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isViewersOpen, setIsViewersOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState("");

  // Keeps track of how much of the current status has played,
  // so the timer can pause and resume without restarting.
  const elapsedRef = useRef(0);

  const currentUpdate = group.updates[currentIndex];

  // Pause while the user is typing a reply or viewing the viewers panel
  const isPaused = replyText.length > 0 || isViewersOpen;

  function handleNext() {
    if (currentIndex < group.updates.length - 1) {
      setCurrentIndex((previous) => previous + 1);
    } else {
      onClose();
    }
  }

  function handlePrevious() {
    if (currentIndex > 0) {
      setCurrentIndex((previous) => previous - 1);
    }
  }

  function handleReplySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = replyText.trim();

    if (!message || !currentUpdate) return;

    onReply(currentUpdate, message);
    setReplyText("");
  }

  // Reset progress (and any half-typed reply) whenever the status changes.
  // Declared before the timer effect so it runs first.
  useEffect(() => {
    elapsedRef.current = 0;
    setProgress(0);
    setReplyText("");
  }, [currentIndex]);

  // Timer: advances the status, pauses while isPaused is true
  useEffect(() => {
    setProgress(0);

    // Let videos control their own playback and progress.
    if (currentUpdate.type === "video" && currentUpdate.mediaUrl) {
    return;
    }

    if (isPaused) return;

    const startTime = Date.now() - elapsedRef.current;

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      elapsedRef.current = elapsed;

      setProgress(Math.min(elapsed / STATUS_DURATION, 1));

      if (elapsed >= STATUS_DURATION) {
        window.clearInterval(interval);

        if (currentIndex < group.updates.length - 1) {
          setCurrentIndex((previous) => previous + 1);
        } else {
          onClose();
        }
      }
    }, 50);

    return () => {
      window.clearInterval(interval);
    };
  }, [currentIndex, group.updates.length, onClose, isPaused]);

  // Mark status as viewed
  useEffect(() => {
    if (currentUpdate && !group.isCurrentUser) {
      onViewStatus(currentUpdate.id);
    }
  }, [currentUpdate?.id, group.isCurrentUser, onViewStatus]);

  // Keyboard controls
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      // Don't change status while the user is typing in the reply input
      if (event.target instanceof HTMLInputElement) return;

      if (event.key === "ArrowRight") {
        handleNext();
      }

      if (event.key === "ArrowLeft") {
        handlePrevious();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, group.updates.length, onClose]);

  // Early return only AFTER all hooks
  if (!currentUpdate) return null;

  // Reaction counts, e.g. { "❤️": 3, "🔥": 1 }
  const reactionCounts = (currentUpdate.reactions ?? []).reduce<
    Record<string, number>
  >((counts, reaction) => {
    counts[reaction.emoji] = (counts[reaction.emoji] ?? 0) + 1;
    return counts;
  }, {});

  const myReaction = currentUpdate.reactions?.find(
    (reaction) => reaction.userId === CURRENT_USER_ID
  )?.emoji;

  const hasReactions = Object.keys(reactionCounts).length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
      <div className="relative flex h-full w-full max-w-3xl flex-col overflow-hidden bg-[#111315] md:h-[92vh] md:rounded-2xl">
        {/* Progress indicators */}
        <div className="absolute top-0 right-0 left-0 z-20 flex gap-1 px-3 pt-3">
          {group.updates.map((update, index) => (
            <div
              key={update.id}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
            >
              <div
                className="h-full rounded-full bg-white"
                style={{
                  width:
                    index < currentIndex
                      ? "100%"
                      : index === currentIndex
                      ? `${progress * 100}%`
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <header className="relative z-20 flex items-center justify-between px-4 pt-7 pb-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white">
              {group.authorInitials}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {group.authorName}
              </p>
              <p className="text-xs text-white/60">
                {new Date(currentUpdate.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="More status options"
              className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10"
            >
              <MoreHorizontal size={21} />
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close status viewer"
              className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10"
            >
              <X size={21} />
            </button>
          </div>
        </header>

        {/* Status content */}
        <main
          className="relative flex min-h-0 flex-1 items-center justify-center px-8 py-10"
          style={{
            backgroundColor: currentUpdate.background?.background ?? "#111315",
            color: currentUpdate.background?.foreground ?? "#FFFFFF",
          }}
        >
          {currentUpdate.type === "text" ? (
            <div
                className="flex h-full w-full items-center justify-center p-8"
                style={{
                backgroundColor:
                    currentUpdate.background?.background ?? "#173F5F",
                color:
                    currentUpdate.background?.foreground ?? "#FFFFFF",
                }}
            >
                <p className="max-w-xl text-center text-2xl font-semibold leading-relaxed">
                {currentUpdate.content}
                </p>
            </div>
            ) : currentUpdate.type === "image" ? (
            <div className="relative flex h-full w-full items-center justify-center bg-black">
                {currentUpdate.mediaUrl && (
                    <img
                    src={currentUpdate.mediaUrl}
                    alt={currentUpdate.content || "Status image"}
                    className="max-h-full max-w-full object-contain"
                    />
                )}

                {currentUpdate.content && (
                    <div className="absolute inset-x-0 bottom-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-6 pb-5 pt-12">
                    <p className="mx-auto max-w-xl text-center text-base font-medium text-white">
                        {currentUpdate.content}
                    </p>
                    </div>
                )}
                </div>
            ) : (
           <div className="relative flex h-full w-full items-center justify-center bg-black">
            {currentUpdate.mediaUrl && (
                <video
                    src={currentUpdate.mediaUrl}
                    autoPlay
                    playsInline
                    controls
                    onTimeUpdate={(event) => {
                        const video = event.currentTarget;

                        if (Number.isFinite(video.duration) && video.duration > 0) {
                        setProgress(video.currentTime / video.duration);
                        }
                    }}
                    onEnded={handleNext}
                    className="max-h-full max-w-full object-contain"
                    />
            )}

            {currentUpdate.content && (
                <div className="pointer-events-none absolute inset-x-0 bottom-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-6 pb-5 pt-12">
                <p className="mx-auto max-w-xl text-center text-base font-medium text-white">
                    {currentUpdate.content}
                </p>
                </div>
            )}
            </div>
            )}
        </main>

        {/*
          Footer: lives in the normal flex flow (so the status content shrinks
          to make room) and sits above the navigation zones with z-30.
        */}
        <footer className="relative z-30 flex flex-col gap-3 bg-[#111315] px-5 pt-3 pb-5">
          {/* Reaction counts (visible to everyone) */}
          {hasReactions && (
            <div className="flex flex-wrap justify-center gap-2">
              {Object.entries(reactionCounts).map(([emoji, count]) => (
                <span
                  key={emoji}
                  className={`rounded-full px-3 py-1 text-sm text-white ${
                    emoji === myReaction
                      ? "bg-[#4BA6C6]/25 ring-1 ring-[#4BA6C6]"
                      : "bg-white/10"
                  }`}
                >
                  {emoji} {count}
                </span>
              ))}
            </div>
          )}

          {group.isCurrentUser ? (
            // Your own status: show the views button
            <button
              type="button"
              onClick={() => setIsViewersOpen(true)}
              className="mx-auto flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20"
            >
              <Eye size={16} />
              {currentUpdate.viewedBy.length} views
            </button>
          ) : (
            // Someone else's status: react and reply
            <>
              <div className="flex items-center justify-center gap-3">
                {STATUS_REACTIONS.map((emoji) => {
                  const isSelected = emoji === myReaction;

                  return (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => onReact(currentUpdate.id, emoji)}
                      aria-label={`React with ${emoji}`}
                      aria-pressed={isSelected}
                      className={`flex size-10 items-center justify-center rounded-full text-xl transition ${
                        isSelected
                          ? "scale-110 bg-[#4BA6C6]/25 ring-2 ring-[#4BA6C6]"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      {emoji}
                    </button>
                  );
                })}
              </div>

              <form
                onSubmit={handleReplySubmit}
                className="flex items-center gap-3"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(event) => setReplyText(event.target.value)}
                  placeholder="Reply to status..."
                  maxLength={1000}
                  className="h-12 min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/60 focus:border-white/50"
                />

                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  aria-label="Send reply"
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#4BA6C6] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </footer>

        {/* Navigation zones (z-10, below header and footer) */}
        <div className="absolute inset-0 z-10 flex">
          <button
            type="button"
            aria-label="Previous status"
            onClick={handlePrevious}
            className="h-full w-1/3"
          />

          <div className="h-full flex-1" />

          <button
            type="button"
            aria-label="Next status"
            onClick={handleNext}
            className="h-full w-1/3"
          />
        </div>

        {/* Viewers panel */}
        {isViewersOpen && (
          <div className="absolute inset-0 z-40 bg-background">
            <StatusViewersPanel
              status={currentUpdate}
              onBack={() => setIsViewersOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}