import api from "@/lib/axios";
import { mockConversations, mockMessagesByConversation } from "@/data/mockMessages";
import { ChatMessage, Conversation, SendMessagePayload } from "@/types/message";

const USE_MOCK = true;

export const messageService = {
  async getConversations(): Promise<Conversation[]> {
    if (USE_MOCK) {
      return Promise.resolve(mockConversations);
    }

    const response = await api.get<Conversation[]>("/conversations");
    return response.data;
  },

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    if (USE_MOCK) {
      return Promise.resolve(mockMessagesByConversation[conversationId] || []);
    }

    const response = await api.get<ChatMessage[]>(
      `/messages/conversation/${conversationId}`,
    );
    return response.data;
  },

  async sendMessage(payload: SendMessagePayload): Promise<ChatMessage> {
    if (USE_MOCK) {
      return Promise.resolve({
        id: `msg-local-${Date.now()}`,
        conversationId: payload.conversationId,
        senderId: "current-user",
        senderName: "You",
        senderAvatar: "",
        kind: "text",
        content: payload.content,
        sentAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: true,
        read: true,
      });
    }

    const response = await api.post<ChatMessage>("/messages", payload);
    return response.data;
  },
};
