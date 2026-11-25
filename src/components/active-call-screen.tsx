"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Mic,
  MicOff,
  Phone,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
} from "lucide-react";

import type { CallRecord } from "@/data/call";

type ActiveCallScreenProps = {
  call: CallRecord;
  onEnd: (duration: number) => void;
};

export default function ActiveCallScreen({
  call,
  onEnd,
}: ActiveCallScreenProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const isVideoCall = call.type === "video";

  useEffect(() => {
    const interval = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  function formatDuration(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col items-center justify-between overflow-y-auto bg-background px-6 py-8">
      <header className="flex w-full items-center justify-between">
        <button
          type="button"
          onClick={() => onEnd(elapsedSeconds)}
          aria-label="Return to call history"
          className="flex size-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
        >
          <ArrowLeft size={19} />
        </button>

        <span className="text-sm font-medium text-text-secondary">
          {isVideoCall ? "Video call" : "Voice call"}
        </span>

        <div className="size-10" />
      </header>

      {/* w-full lets the video tile use its max-w-lg instead of shrink-wrapping */}
      <div className="flex w-full flex-col items-center text-center">
        {isVideoCall ? (
          <div className="relative mb-6 flex aspect-video w-full max-w-lg items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface-elevated">
            {isCameraOn ? (
              <div className="flex flex-col items-center gap-3 text-text-secondary">
                <Video size={32} />
                <span className="text-sm">Camera preview</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-text-secondary">
                <VideoOff size={32} />
                <span className="text-sm">Camera off</span>
              </div>
            )}

            <div className="absolute bottom-3 left-3 rounded-lg bg-black/50 px-3 py-1.5 text-sm text-white">
              {call.participantName}
            </div>
          </div>
        ) : (
          <div className="mb-6 flex size-28 items-center justify-center rounded-full bg-surface-elevated text-3xl font-semibold text-foreground">
            {call.participantInitials}
          </div>
        )}

        <h1 className="text-2xl font-semibold text-foreground">
          {call.participantName}
        </h1>

        <p className="mt-3 text-sm text-text-secondary">Connecting…</p>

        <p className="mt-1 font-mono text-sm text-text-secondary">
          {formatDuration(elapsedSeconds)}
        </p>
      </div>

      <div
        className={`flex w-full flex-col gap-8 ${
          isVideoCall ? "max-w-md" : "max-w-sm"
        }`}
      >
        <div
          className={`grid ${
            isVideoCall ? "grid-cols-3" : "grid-cols-2"
          } gap-4`}
        >
          <button
            type="button"
            onClick={() => setIsMuted((muted) => !muted)}
            aria-pressed={isMuted}
            className={`flex flex-col items-center gap-3 rounded-xl border border-border p-5 transition-colors ${
              isMuted
                ? "bg-accent text-white"
                : "bg-surface text-foreground hover:bg-surface-elevated"
            }`}
          >
            {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
            <span className="text-sm">{isMuted ? "Unmute" : "Mute"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSpeakerOn((enabled) => !enabled)}
            aria-pressed={isSpeakerOn}
            className={`flex flex-col items-center gap-3 rounded-xl border border-border p-5 transition-colors ${
              isSpeakerOn
                ? "bg-accent text-white"
                : "bg-surface text-foreground hover:bg-surface-elevated"
            }`}
          >
            {isSpeakerOn ? <Volume2 size={22} /> : <VolumeX size={22} />}
            <span className="text-sm">
              {isSpeakerOn ? "Speaker on" : "Speaker"}
            </span>
          </button>

          {isVideoCall && (
            <button
              type="button"
              onClick={() => setIsCameraOn((enabled) => !enabled)}
              aria-pressed={isCameraOn}
              className={`flex flex-col items-center gap-3 rounded-xl border border-border p-5 transition-colors ${
                !isCameraOn
                  ? "bg-accent text-white"
                  : "bg-surface text-foreground hover:bg-surface-elevated"
              }`}
            >
              {isCameraOn ? <Video size={22} /> : <VideoOff size={22} />}
              <span className="text-sm">
                {isCameraOn ? "Camera on" : "Camera off"}
              </span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => onEnd(elapsedSeconds)}
          className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700"
          aria-label="End call"
        >
          <Phone size={25} className="rotate-[135deg]" />
        </button>
      </div>
    </div>
  );
}