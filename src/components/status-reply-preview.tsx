
"use client";

import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, Video, Type } from "lucide-react";
import type { StatusReplyPreview as StatusReplyPreviewData } from "@/data/messages";

type StatusReplyPreviewProps = {
  preview: StatusReplyPreviewData;
};

export default function StatusReplyPreview({
  preview,
}: StatusReplyPreviewProps) {
  const isText = preview.type === "text";
  const [imageFailed, setImageFailed] = useState(false);

  const showImage =
    preview.type === "image" && preview.mediaUrl && !imageFailed;

  return (
    <div className="mb-2 flex items-stretch gap-3 overflow-hidden rounded-lg border border-white/10 bg-black/10 p-2">
      <div
        className="relative flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md"
        style={{
          background: preview.background?.background ?? "#343A40",
        }}
      >
        {showImage ? (
          <Image
            src={preview.mediaUrl!}
            alt="Status image"
            fill
            sizes="48px"
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : isText ? (
          <Type size={18} className="text-white" />
        ) : preview.type === "image" ? (
          <ImageIcon size={18} className="text-white" />
        ) : (
          <Video size={18} className="text-white" />
        )}
      </div>

      <div className="min-w-0 flex-1 self-center">
        <p className="text-xs font-semibold text-current opacity-80">
          {preview.authorName}'s status
        </p>

        <p className="mt-1 line-clamp-2 text-xs text-current opacity-65">
          {isText ? preview.content : preview.content || "Media status"}
        </p>
      </div>
    </div>
  );
}
