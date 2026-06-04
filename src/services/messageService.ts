import api from "@/lib/axios";
import {
  ApiConversation,
  ApiMessage,
  ChatMessage,
  Conversation,
} from "@/types/message";

// ── helpers ───────────────────────────────────────────────────────────────────

function getCurrentUserId(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user_data");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Number(parsed.id) || null;
  } catch {
    return null;
  }
}

function formatTime(dateStr: string | Date): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7)
      return d.toLocaleDateString([], { weekday: "short" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export function mapApiConversation(api: ApiConversation): Conversation {
  return {
    id: String(api.id),
    participantId: String(api.participantId ?? ""),
    participantName: api.participantName,
    participantAvatar: api.participantAvatar || "",
    participantStatus: "offline", // real-time presence can be added later
    taskTitle: api.task_title,
    lastMessage: api.lastMessage || "",
    lastMessageAt: formatTime(api.lastMessageAt || api.created_at),
    unreadCount: api.unreadCount ?? 0,
  };
}

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/api$/, "");

export function mapApiMessage(raw: any, currentUserId: number | null): ChatMessage {
  const imageUrl = raw.image_url
    ? raw.image_url.startsWith("http")
      ? raw.image_url
      : `${BASE_URL}${raw.image_url}`  // ← uses BASE_URL without /api
    : undefined;

  return {
    id: raw.id,
    content: raw.message ?? "",
    imageUrl,
    isOwn: Number(raw.sender_id) === currentUserId,
    senderName: raw.sender?.fullName ?? "",
    senderAvatar: raw.sender?.profileImage ?? null,
    sentAt: new Date(raw.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    kind: "text",
  };
}

// ── service ───────────────────────────────────────────────────────────────────

export const messageService = {
  async getConversations(): Promise<Conversation[]> {
    const response = await api.get<ApiConversation[]>("/conversations");
    return response.data.map(mapApiConversation);
  },

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const currentUserId = getCurrentUserId();
    const response = await api.get<ApiMessage[]>(
      `/messages/${conversationId}`,
    );
    return response.data.map((m) => mapApiMessage(m, currentUserId));
  },
};
