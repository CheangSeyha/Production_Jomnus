"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import MessageComposer from "@/components/message/MessageComposer";
import MessageHeader from "@/components/message/MessageHeader";
import MessageList from "@/components/message/MessageList";
import MessageSidebar from "@/components/message/MessageSidebar";
import { messageService, mapApiMessage } from "@/services/messageService";
import { ChatMessage, Conversation } from "@/types/message";
import { getSocket } from "@/lib/websoket";
import type { Socket } from "socket.io-client";


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

export default function MessagePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draftMessage, setDraftMessage] = useState("");
  const [search, setSearch] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const joinedRoomRef = useRef<string>("");
  const socket = getSocket();

  // socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
  // socket.on("disconnect", (reason) => console.log("❌ Socket disconnected:", reason));
  // socket.on("connect_error", (err) => console.log("❌ Connect error:", err.message));
  // socket.onAny((event, ...args) => console.log("📨 Socket event:", event, args));

  // ── auth guard + load conversations ───────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/auth/signin");
      return;
    }

    const load = async () => {
      try {
        const conversationList = await messageService.getConversations();
        setConversations(conversationList);
        if (conversationList.length > 0) {
          setSelectedConversationId(String(conversationList[0].id));
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [router]);

  // ── socket lifecycle ───────────────────────────────────────────────────────
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const currentUserId = getCurrentUserId();

    // ── handle incoming messages ──
    socket.on("message:new", (rawMsg: any) => {
      const mapped = mapApiMessage(rawMsg, currentUserId);
      setMessages((prev) => {
        if (prev.some((m) => m.id === mapped.id)) return prev;
        return [...prev, mapped];
      });

      setConversations((prev) =>
          prev.map((c) =>
              c.id === String(rawMsg.conversation_id)
                  ? { ...c, lastMessage: rawMsg.message, lastMessageAt: "Just now" }
                  : c,
          ),
      );
    });

    socket.on("chat:error", (err: { message: string }) => {
      console.error("Chat error:", err.message);
    });

    // ── rejoin room on reconnect ──
    socket.on("connect", () => {
      joinedRoomRef.current = ""; // reset so join fires again
      const currentId = joinedRoomRef.current;
      if (currentId) {
        socket.emit("conversation:join", {
          conversationId: Number(currentId),
        });
        joinedRoomRef.current = currentId;
      }
    });

    // ── cleanup: only remove listeners, never disconnect ──
    return () => {
      socket.off("message:new");
      socket.off("chat:error");
      socket.off("connect");
    };
  }, []); // runs once on mount

  // ── join room + load messages when conversation changes ────────────────────
  useEffect(() => {
    if (!selectedConversationId) return;

    const socket = socketRef.current ?? getSocket();
    const numericId = Number(selectedConversationId);

    // Always join when conversation changes
    if (joinedRoomRef.current !== selectedConversationId) {
      socket.emit("conversation:join", { conversationId: numericId });
      joinedRoomRef.current = selectedConversationId;
    }

    const loadMessages = async () => {
      try {
        const list = await messageService.getMessages(selectedConversationId);
        setMessages(list);
      } catch (err) {
        console.error("Failed to load messages:", err);
        setMessages([]);
      }
    };

    loadMessages();
  }, [selectedConversationId]);

  // ── scroll to bottom ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!messageListRef.current) return;
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [messages, selectedConversationId]);

  // ── derived state ──────────────────────────────────────────────────────────
  const selectedConversation = useMemo(
      () => conversations.find((item) => item.id === selectedConversationId),
      [conversations, selectedConversationId],
  );

  const filteredConversations = useMemo(() => {
    if (!search.trim()) return conversations;
    return conversations.filter((item) =>
        item.participantName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [conversations, search]);

  // ── send message ───────────────────────────────────────────────────────────
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedConversationId || !draftMessage.trim() || isSending) return;

    const socket = socketRef.current ?? getSocket();
    const text = draftMessage.trim();

    setIsSending(true);
    setDraftMessage("");

    socket.emit(
        "message:send",
        {
          conversationId: Number(selectedConversationId),
          message: text,
        },
        (ack: any) => {
          setIsSending(false);
          if (ack?.event === "chat:error") {
            console.error("Send failed:", ack.data?.message);
            setDraftMessage(text); // restore draft on error
          }
        },
    );
  };

  // ── render ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
        <div className="flex h-[64vh] items-center justify-center text-slate-400">
          Loading messages…
        </div>
    );
  }

  return (
      <div className="h-full min-h-0 overflow-hidden">
        <div className="mx-auto flex h-full max-w-[1800px] flex-col gap-5 overflow-hidden px-4 py-4 md:px-8">

          {/* Chat panel */}
          <div className="flex-1 min-h-0 rounded-2xl border border-sky-200 overflow-hidden shadow-[0_14px_40px_rgba(14,165,233,0.10)]">
            <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[300px_1fr]">

              <MessageSidebar
                  conversations={filteredConversations}
                  selectedConversationId={selectedConversationId}
                  search={search}
                  onSearchChange={setSearch}
                  onSelectConversation={setSelectedConversationId}
              />

          <section className="flex h-full min-h-0 flex-col overflow-hidden">
            {selectedConversation ? (
                <>
                  <MessageHeader conversation={selectedConversation} />
                  <MessageList messages={messages} containerRef={messageListRef} />
                  <MessageComposer
                      draftMessage={draftMessage}
                      onChange={setDraftMessage}
                      conversationId={Number(selectedConversationId)}
                      onMessageSent={async () => {
                        // Refetch messages after HTTP image send
                        const list = await messageService.getMessages(selectedConversationId);
                        setMessages(list);
                      }}
                  />
                </>
            ) : (
                <div className="grid h-full place-items-center text-slate-400">
                  {conversations.length === 0
                      ? "No conversations yet. Start one from a task page."
                      : "Select a conversation"}
                </div>
            )}
          </section>
            </div>
          </div>

        </div>
      </div>
  );
}