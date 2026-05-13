import { FileText } from "lucide-react";
import { ChatMessage } from "@/types/message";

type MessageBubbleProps = {
  message: ChatMessage;
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  if (message.kind === "file" && message.file) {
    return (
      <div className="max-w-xl">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <FileText className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-semibold text-slate-800">{message.file.fileName}</p>
            <p className="text-sm text-slate-400">
              {message.file.sizeLabel} · {message.file.extension}
            </p>
          </div>
        </div>
        <p className="mt-1 text-sm text-slate-400">{message.sentAt}</p>
      </div>
    );
  }

  return (
    <div className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
      {!message.isOwn && (
        <img
          src={message.senderAvatar}
          alt={message.senderName}
          className="mr-3 h-10 w-10 self-end rounded-full object-cover"
        />
      )}

      <div className={`${message.isOwn ? "max-w-2xl" : "max-w-xl"}`}>
        <div
          className={`rounded-3xl px-6 py-4 text-xl leading-relaxed ${
            message.isOwn
              ? "bg-linear-to-r from-[#0b63ce] to-[#0a6fe8] text-white"
              : "bg-slate-100 text-slate-800"
          }`}
        >
          {message.content}
        </div>
        <p className={`mt-2 text-sm text-slate-400 ${message.isOwn ? "text-right" : "text-left"}`}>
          {message.sentAt} {message.isOwn && message.read ? "· Read" : ""}
        </p>
      </div>
    </div>
  );
}
