
"use client";

import { Phone, PhoneOff, Video } from "lucide-react";
import type { CallRecord } from "@/data/call";

type IncomingCallScreenProps = {
  call: CallRecord;
  onAccept: () => void;
  onDecline: () => void;
};

export default function IncomingCallScreen({
  call,
  onAccept,
  onDecline,
}: IncomingCallScreenProps) {
  const isVideo = call.type === "video";

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-between bg-background px-6 py-12">
      <div className="flex flex-col items-center pt-16 text-center">
        <p className="text-sm font-medium text-text-secondary">
          Incoming {isVideo ? "video" : "voice"} call
        </p>

        <div className="mt-10 flex size-28 items-center justify-center rounded-full bg-surface-elevated text-3xl font-semibold text-foreground">
          {call.participantInitials}
        </div>

        <h1 className="mt-6 text-2xl font-semibold text-foreground">
          {call.participantName}
        </h1>

        <p className="mt-2 text-sm text-text-secondary">
          {isVideo ? "Video call" : "Voice call"}
        </p>
      </div>

      <div className="flex w-full max-w-xs items-center justify-between gap-10">
        <button
          type="button"
          onClick={onDecline}
          aria-label="Decline call"
          className="flex flex-1 flex-col items-center gap-3 text-sm text-text-secondary"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700">
            <PhoneOff size={24} />
          </span>
          Decline
        </button>

        <button
          type="button"
          onClick={onAccept}
          aria-label="Accept call"
          className="flex flex-1 flex-col items-center gap-3 text-sm text-text-secondary"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-emerald-600 text-white transition-colors hover:bg-emerald-700">
            {isVideo ? <Video size={24} /> : <Phone size={24} />}
          </span>
          Accept
        </button>
      </div>
    </div>
  );
}
