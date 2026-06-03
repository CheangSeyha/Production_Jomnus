// ── UI types (used by components) ─────────────────────────────────────────────

export type PresenceStatus = "online" | "offline";

export type MessageKind = "text" | "file";

export interface MessageFile {
  id: string;
  fileName: string;
  sizeLabel: string;
  extension: string;
}

export type ChatMessage = {
  id: string | number;
  content: string;
  imageUrl?: string;       // ← add this
  isOwn: boolean;
  senderName?: string;
  senderAvatar?: string | null;
  sentAt: string;
  read?: boolean;
  kind?: "text" | "file";
  file?: {
    fileName: string;
    sizeLabel: string;
    extension: string;
  };
};

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantStatus: PresenceStatus;
  taskTitle: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface MessageListResponse {
  conversation: Conversation;
  messages: ChatMessage[];
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
}

// ── Backend API response types ─────────────────────────────────────────────────

export interface ApiConversation {
  id: number;
  task_id: number;
  task_title: string;
  created_at: string;
  participantId: number | null;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ApiMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  message: string;
  image_url?: string; // ← add this
  created_at: string;
  sender: {
    id: number;
    fullName: string;
    profileImage?: string;
  };
}