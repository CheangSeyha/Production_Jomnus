import { ChatMessage, Conversation } from "@/types/message";

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    participantName: "Marcus Chen",
    participantAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
    participantStatus: "online",
    lastMessage: "Yes, the draft looks perfect! Let's move forward with this version.",
    lastMessageAt: "12:45 PM",
    unreadCount: 0,
  },
  {
    id: "conv-2",
    participantName: "Sarah Jenkins",
    participantAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
    participantStatus: "offline",
    lastMessage: "I'll send over the brand assets by morning.",
    lastMessageAt: "Yesterday",
    unreadCount: 2,
  },
  {
    id: "conv-3",
    participantName: "David Miller",
    participantAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
    participantStatus: "online",
    lastMessage: "The contract has been signed. Great working with you.",
    lastMessageAt: "Tue",
    unreadCount: 0,
  },
];

export const mockMessagesByConversation: Record<string, ChatMessage[]> = {
  "conv-1": [
    {
      id: "msg-1",
      conversationId: "conv-1",
      senderId: "user-marcus",
      senderName: "Marcus Chen",
      senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
      kind: "text",
      content:
        "Hey! I've just finished the initial copywriting for the Task Marketplace campaign. I've focused on the 'Premium Curator' angle we discussed.",
      sentAt: "11:20 AM",
      isOwn: false,
    },
    {
      id: "msg-2",
      conversationId: "conv-1",
      senderId: "current-user",
      senderName: "You",
      senderAvatar: "",
      kind: "text",
      content:
        "That sounds great, Marcus. Did you manage to include the social proof section?",
      sentAt: "11:25 AM",
      isOwn: true,
      read: true,
    },
    {
      id: "msg-3",
      conversationId: "conv-1",
      senderId: "user-marcus",
      senderName: "Marcus Chen",
      senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
      kind: "text",
      content:
        "Absolutely. I've attached a preview of the landing page draft below. Let me know what you think!",
      sentAt: "11:32 AM",
      isOwn: false,
    },
    {
      id: "msg-4",
      conversationId: "conv-1",
      senderId: "user-marcus",
      senderName: "Marcus Chen",
      senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
      kind: "file",
      content: "",
      sentAt: "11:32 AM",
      isOwn: false,
      file: {
        id: "file-1",
        fileName: "Draft_v2_Editorial.pdf",
        sizeLabel: "4.2 MB",
        extension: "PDF",
      },
    },
    {
      id: "msg-5",
      conversationId: "conv-1",
      senderId: "current-user",
      senderName: "You",
      senderAvatar: "",
      kind: "text",
      content: "Yes, the draft looks perfect! Let's move forward with this version.",
      sentAt: "12:45 PM",
      isOwn: true,
      read: true,
    },
  ],
  "conv-2": [],
  "conv-3": [],
};
