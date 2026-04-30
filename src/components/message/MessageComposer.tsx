import { FormEvent } from "react";
import { CirclePlus, Image as ImageIcon, Send, Smile } from "lucide-react";

type MessageComposerProps = {
  draftMessage: string;
  onChange: (value: string) => void;
  onSend: (e: FormEvent) => void;
};

export default function MessageComposer({
  draftMessage,
  onChange,
  onSend,
}: MessageComposerProps) {
  return (
    <footer className="border-t border-slate-200 bg-white p-5">
      <form
        onSubmit={onSend}
        className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3"
      >
        <button type="button" className="text-slate-500 hover:text-slate-700">
          <CirclePlus className="h-6 w-6" />
        </button>
        <button type="button" className="text-slate-500 hover:text-slate-700">
          <ImageIcon className="h-6 w-6" />
        </button>

        <input
          value={draftMessage}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-transparent text-lg text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />

        <button type="button" className="text-slate-500 hover:text-slate-700">
          <Smile className="h-6 w-6" />
        </button>
        <button
          type="submit"
          className="rounded-xl bg-[#0b63ce] p-3 text-white transition hover:bg-[#0a56b1]"
        >
          <Send className="h-6 w-6" />
        </button>
      </form>
    </footer>
  );
}
