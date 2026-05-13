export type PresenceStatus = "online" | "offline";

export type MessageKind = "text" | "file";

export interface MessageFile {
  id: string;
  fileName: string;
  sizeLabel: string;
  extension: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  kind: MessageKind;
  content: string;
  sentAt: string;
  isOwn: boolean;
  read?: boolean;
  file?: MessageFile;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantAvatar: string;
  participantStatus: PresenceStatus;
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
