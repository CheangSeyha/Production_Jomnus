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
      <aside className="flex min-h-0 flex-col border-r border-sky-200 bg-sky-50">
        <div className="p-5">
          {/*<p className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-1">Inbox</p>*/}
          <h1 className="text-2xl font-black text-slate-950 tracking-tight mb-4">Messages</h1>
          <div className="flex items-center gap-2 rounded-xl border border-sky-200 bg-blue-50/70 px-3 py-2.5 shadow-inner shadow-sky-100/60">
            <Search className="h-4 w-4 text-sky-400 shrink-0" />
            <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search conversations…"
                className="w-full bg-transparent text-sm text-slate-700 placeholder:text-sky-300 focus:outline-none"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-6">
          {conversations.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm">
                No conversations yet
              </div>
          )}
          {conversations.map((conversation) => {
            const isActive = conversation.id === selectedConversationId;
            return (
                <button
                    key={conversation.id}
                    onClick={() => onSelectConversation(conversation.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                        isActive
                            ? "bg-white border border-sky-200 shadow-sm shadow-sky-100"
                            : "hover:bg-sky-100/60"
                    }`}
                >
                  <div className="relative shrink-0">
                    {conversation.participantAvatar ? (
                        <img
                            src={conversation.participantAvatar}
                            alt={conversation.participantName}
                            className="h-11 w-11 rounded-full object-cover"
                        />
                    ) : (
                        <div className="h-11 w-11 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 text-base font-bold">
                          {conversation.participantName?.charAt(0).toUpperCase() ?? "?"}
                        </div>
                    )}
                    <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-sky-50 ${
                            conversation.participantStatus === "online"
                                ? "bg-emerald-500"
                                : "bg-slate-300"
                        }`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {conversation.participantName}
                      </p>
                      <p className="text-xs text-slate-400 shrink-0">{conversation.lastMessageAt}</p>
                    </div>
                    <p className="truncate text-xs text-slate-500 mt-0.5">{conversation.lastMessage}</p>
                  </div>
                </button>
            );
          })}
        </div>
      </aside>
  );
}