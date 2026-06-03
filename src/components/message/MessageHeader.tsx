import { MoreVertical, Phone, Video } from "lucide-react";
import { Conversation } from "@/types/message";

type MessageHeaderProps = {
  conversation: Conversation;
};

export default function MessageHeader({ conversation }: MessageHeaderProps) {
  return (
      <header className="flex items-center justify-between border-b border-sky-100 bg-sky-50/60 px-6 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            {conversation.participantAvatar ? (
                <img
                    src={conversation.participantAvatar}
                    alt={conversation.participantName}
                    className="h-10 w-10 rounded-full object-cover"
                />
            ) : (
                <div className="h-10 w-10 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 font-bold text-sm">
                  {conversation.participantName?.charAt(0).toUpperCase() ?? "?"}
                </div>
            )}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-sky-50 bg-emerald-500" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">{conversation.participantName}</h2>
            <p className="text-xs text-sky-600 font-medium truncate max-w-xs">
              {conversation.taskTitle || "Task conversation"}
            </p>
          </div>
        </div>

      </header>
  );
}