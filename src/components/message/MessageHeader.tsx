import { MoreVertical, Phone, Video } from "lucide-react";
import { Conversation } from "@/types/message";

type MessageHeaderProps = {
  conversation: Conversation;
};

export default function MessageHeader({ conversation }: MessageHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 px-8 py-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={conversation.participantAvatar}
            alt={conversation.participantName}
            className="h-14 w-14 rounded-full object-cover"
          />
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            {conversation.participantName}
          </h2>
          <p className="text-lg text-emerald-500">Online now</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-slate-500">
        <button className="rounded-full p-2 hover:bg-slate-100" type="button">
          <Video className="h-6 w-6" />
        </button>
        <button className="rounded-full p-2 hover:bg-slate-100" type="button">
          <Phone className="h-6 w-6" />
        </button>
        <button className="rounded-full p-2 hover:bg-slate-100" type="button">
          <MoreVertical className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
