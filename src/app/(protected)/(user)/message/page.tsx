"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import MessageComposer from "@/components/message/MessageComposer";
import MessageHeader from "@/components/message/MessageHeader";
import MessageList from "@/components/message/MessageList";
import MessageSidebar from "@/components/message/MessageSidebar";
import { messageService } from "@/services/messageService";
import { ChatMessage, Conversation } from "@/types/message";

export default function MessagePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] =
    useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draftMessage, setDraftMessage] = useState("");
  const [search, setSearch] = useState("");
  const messageListRef = useRef<HTMLDivElement | null>(null);

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
          setSelectedConversationId(conversationList[0].id);
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [router]);

  useEffect(() => {
    if (!selectedConversationId) return;

    const loadMessages = async () => {
      const list = await messageService.getMessages(selectedConversationId);
      setMessages(list);
    };

    loadMessages();
  }, [selectedConversationId]);

  useEffect(() => {
    if (!messageListRef.current) return;
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [messages, selectedConversationId]);

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

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedConversationId || !draftMessage.trim()) return;

    const sent = await messageService.sendMessage({
      conversationId: selectedConversationId,
      content: draftMessage.trim(),
    });

    setMessages((prev) => [...prev, sent]);
    setDraftMessage("");
  };

  if (isLoading) {
    return <div className="p-6 text-slate-500">Loading messages...</div>;
  }

  return (
    <div className="h-[64vh] min-h-[460px] w-full overflow-hidden border-slate-200 bg-white sm:h-[66vh] md:h-[68vh] md:min-h-[520px] lg:h-[70vh] xl:h-[72vh]">
      <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[360px_1fr]">
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
                onSend={handleSendMessage}
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
  );
}
