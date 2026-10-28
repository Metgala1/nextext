import MessageComposer from "./message-composer";

type Message = {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: string;
};

type MessageListProps = {
  messages: Message[];
};

export default function MessageList({
  messages,
}: MessageListProps) {
  return (
    <div
      aria-label="Messages"
      className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6"
    >
      {messages.map((message) => {
        const isMine = message.sender === "me";

        return (
          <div
            key={message.id}
            className={`flex ${
              isMine ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] rounded-default px-4 py-3 ${
                isMine
                  ? "bg-accent text-white"
                  : "bg-surface-elevated text-foreground"
              }`}
            >
              <p className="whitespace-pre-wrap break-words text-sm leading-6">
                {message.text}
              </p>

              <p
                className={`mt-1 text-right text-xs ${
                  isMine ? "text-white/75" : "text-text-secondary"
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}