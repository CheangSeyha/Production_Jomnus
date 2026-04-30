import { Search } from "lucide-react";
import { Conversation } from "@/types/message";

type MessageSidebarProps = {
  conversations: Conversation[];
  selectedConversationId: string;
  search: string;
  onSearchChange: (value: string) => void;
  onSelectConversation: (conversationId: string) => void;
};

export default function MessageSidebar({
  conversations,
  selectedConversationId,
  search,
  onSearchChange,
  onSelectConversation,
}: MessageSidebarProps) {
  return (
    <aside className="flex min-h-0 flex-col border-r border-slate-200 bg-[#f8fafc]">
      <div className="p-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Messages</h1>
        <div className="mt-6 flex items-center rounded-2xl bg-slate-100 px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations..."
            className="ml-3 w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-6">
        {conversations.map((conversation) => {
          const isActive = conversation.id === selectedConversationId;
          return (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                isActive ? "bg-white shadow-sm" : "hover:bg-white/70"
              }`}
            >
              <div className="relative">
                <img
                  src={conversation.participantAvatar}
                  alt={conversation.participantName}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <span
                  className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
                    conversation.participantStatus === "online"
                      ? "bg-emerald-500"
                      : "bg-slate-300"
                  }`}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xl font-semibold text-slate-900">
                    {conversation.participantName}
                  </p>
                  <p className="text-sm text-slate-400">{conversation.lastMessageAt}</p>
                </div>
                <p className="truncate text-base text-slate-500">{conversation.lastMessage}</p>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
