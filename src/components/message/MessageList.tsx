import { RefObject } from "react";
import { ChatMessage } from "@/types/message";
import MessageBubble from "@/components/message/MessageBubble";

type MessageListProps = {
  messages: ChatMessage[];
  containerRef?: RefObject<HTMLDivElement | null>;
};

export default function MessageList({ messages, containerRef }: MessageListProps) {
  return (
      <div
          ref={containerRef}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-white px-6 py-5"
      >
        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-400">
          <span className="h-px flex-1 bg-sky-100" />
          Today
          <span className="h-px flex-1 bg-sky-100" />
        </div>

        {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm">
              No messages yet. Say hello!
            </div>
        )}

        {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
        ))}
      </div>
  );
}