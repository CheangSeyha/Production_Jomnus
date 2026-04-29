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
      className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain bg-[#fcfcfd] px-8 py-6"
    >
      <div className="my-2 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        Today
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
}
