"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // ← add useSearchParams
import MessageComposer from "@/components/message/MessageComposer";
import MessageHeader from "@/components/message/MessageHeader";
import CallOverlay from "@/components/message/CallOverlay";
import MessageList from "@/components/message/MessageList";
import MessageSidebar from "@/components/message/MessageSidebar";
import { messageService, mapApiMessage } from "@/services/messageService";
import { ChatMessage, Conversation } from "@/types/message";
import { useCallStore } from "@/store/callStore";
import { getSocket } from "@/lib/websocket";
import type { Socket } from "socket.io-client";
import { ArrowLeft, Phone, Video } from "lucide-react";

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
  const searchParams = useSearchParams();

  // ───────────────── STATE ─────────────────
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
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const { initiateCall } = useCallStore();

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


        const urlConversationId = searchParams.get("conversationId");
        if (urlConversationId) {
          setSelectedConversationId(urlConversationId);
          setMobileView("chat");
        } else if (conversationList.length > 0) {
          setSelectedConversationId(String(conversationList[0].id));
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [router, searchParams]); // ← add searchParams

  // ── socket lifecycle ───────────────────────────────────────────────────────
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const currentUserId = getCurrentUserId();

    socket.on("message:new", (rawMsg: any) => {
      const currentUserId = getCurrentUserId();
      const mapped = mapApiMessage(rawMsg, currentUserId);

      setMessages((prev) => {
        if (prev.some((m) => String(m.id) === String(mapped.id))) return prev;
        return [...prev, mapped];
      });

      setConversations((prev) =>
          prev.map((c) =>
              c.id === String(rawMsg.conversation_id)
                  ? {
                    ...c,
                    lastMessage: rawMsg.message || "📷 Image",
                    lastMessageAt: "Just now",
                  }
                  : c,
          ),
      );
    });


    socket.on("chat:error", (err: { message: string }) => {
      console.error("Chat error:", err.message);
    });

    socket.on("call:incoming", (data: any) => {
      useCallStore.getState().receiveIncomingCall(data.conversationId, data.callerId, data.isVideo);
    });

    socket.on("call:signal", (data: any) => {
      useCallStore.getState().handleSignal(data.signalData);
    });

    socket.on("call:ended", (data: any) => {
      useCallStore.getState().endCall(true);
    });

    socket.on("connect", () => {
      joinedRoomRef.current = "";
      const currentId = joinedRoomRef.current;
      if (currentId) {
        socket.emit("conversation:join", { conversationId: Number(currentId) });
        joinedRoomRef.current = currentId;
      }
    });

    return () => {
      socket.off("message:new");
      socket.off("chat:error");
      socket.off("call:incoming");
      socket.off("call:signal");
      socket.off("call:ended");
      socket.off("connect");
    };
  }, []);

  // ── join room + load messages when conversation changes ────────────────────
  useEffect(() => {
    if (!selectedConversationId) return;

    const socket = socketRef.current ?? getSocket();
    const numericId = Number(selectedConversationId);

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
      { conversationId: Number(selectedConversationId), message: text },
      (ack: any) => {
        setIsSending(false);
        if (ack?.event === "chat:error") {
          console.error("Send failed:", ack.data?.message);
          setDraftMessage(text);
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
      <CallOverlay />
      <div className="mx-auto flex h-full max-w-[1800px] flex-col gap-5 overflow-hidden px-4 py-4 md:px-8">
        <div className="flex-1 min-h-0 rounded-2xl border border-sky-200 overflow-hidden shadow-[0_14px_40px_rgba(14,165,233,0.10)]">

          <div className="relative h-full min-h-0">

            {/* ───────── MOBILE LIST ───────── */}
            <div
                className={`absolute inset-0 bg-white z-10 transition-transform duration-300 ease-out lg:hidden
                ${mobileView === "list" 
                    ? "translate-x-0"
                    : "-translate-x-full"}
                `}
            >
              <MessageSidebar
                  conversations={filteredConversations}
                  selectedConversationId={selectedConversationId}
                  search={search}
                  onSearchChange={setSearch}
                  onSelectConversation={(id) => {
                    setSelectedConversationId(id);
                    setMobileView("chat");
                  }}
              />

            </div>

            {/* ───────── MOBILE CHAT ───────── */}
            <div
                className={`absolute inset-0 bg-white z-20 transition-transform duration-300 ease-out lg:hidden
                 ${mobileView === "chat"
                    ? "translate-x-0"
                    : "translate-x-full"}
                `}
            >

              {selectedConversation && (
                  <section className="flex h-full flex-col">

                    {/* Header */}
                    <header className="shrink-0 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <div className="flex items-center justify-between">

                        {/* LEFT SIDE */}
                        <div className="flex items-center gap-3 min-w-0">

                          <button
                              onClick={() => setMobileView("list")}
                              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-200"
                          >
                            <ArrowLeft size={20} />
                          </button>

                          {/* avatar */}
                          <div className="relative shrink-0">
                            {selectedConversation.participantAvatar ? (
                                <img
                                    src={selectedConversation.participantAvatar}
                                    className="h-11 w-11 rounded-full object-cover"
                                />
                            ) : (
                                <div className="h-11 w-11 rounded-full bg-sky-100 flex items-center justify-center font-bold text-sky-700">
                                  {selectedConversation.participantName.charAt(0)}
                                </div>
                            )}

                            {/* online dot */}
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                          </div>

                          {/* name */}
                          <div className="min-w-0">
                            <h2 className="truncate text-sm font-semibold text-slate-900">
                              {selectedConversation.participantName}
                            </h2>

                            <p className="text-xs text-emerald-600">
                              Active now
                            </p>
                          </div>

                        </div>

                        {/* RIGHT SIDE - CALL BUTTONS */}
                        <div className="flex items-center gap-1">

                          <button
                              onClick={() =>
                                  selectedConversation.participantId &&
                                  initiateCall(
                                      Number(selectedConversation.id),
                                      Number(selectedConversation.participantId),
                                      false
                                  )
                              }
                              className="flex h-10 w-10 items-center justify-center rounded-full text-sky-600 hover:bg-sky-50"
                          >
                            <Phone size={18} />
                          </button>

                          <button
                              onClick={() =>
                                  selectedConversation.participantId &&
                                  initiateCall(
                                      Number(selectedConversation.id),
                                      Number(selectedConversation.participantId),
                                      true
                                  )
                              }
                              className="flex h-10 w-10 items-center justify-center rounded-full text-sky-600 hover:bg-sky-50"
                          >
                            <Video size={18} />
                          </button>

                        </div>

                      </div>

                    </header>

                    <MessageList
                        messages={messages}
                        containerRef={messageListRef}
                    />

                    <MessageComposer
                        draftMessage={draftMessage}
                        onChange={setDraftMessage}
                        conversationId={Number(selectedConversationId)}
                    />

                  </section>
              )}

            </div>

            {/* DESKTOP */}
            <div className="hidden lg:grid h-full min-h-0 lg:grid-cols-[320px_1fr]">

              <MessageSidebar
                  conversations={filteredConversations}
                  selectedConversationId={selectedConversationId}
                  search={search}
                  onSearchChange={setSearch}
                  onSelectConversation={setSelectedConversationId}
              />

              <section className="relative flex h-full min-h-0 flex-col overflow-hidden">
                {selectedConversation ? (
                    <>
                      <MessageHeader
                          conversation={selectedConversation}
                      />

                      <MessageList
                          messages={messages}
                          containerRef={messageListRef}
                      />

                      <MessageComposer
                          draftMessage={draftMessage}
                          onChange={setDraftMessage}
                          conversationId={Number(selectedConversationId)}
                      />
                    </>
                ) : (
                    <div className="grid h-full place-items-center text-slate-400">
                      Select a conversation
                    </div>
                )}
              </section>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}