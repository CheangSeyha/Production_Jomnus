import { FileText, Phone } from "lucide-react";
import { ChatMessage, MessageType } from "@/types/message";

type Props = { message: ChatMessage };

export default function MessageBubble({ message }: Props) {
    if (message.type === MessageType.CALL_LOG || message.type === ('CALL_LOG' as any)) {
        return (
            <div className={`flex items-center justify-center my-4`}>
                <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600 shadow-sm border border-slate-200">
                    <Phone className="h-4 w-4" />
                    <span>{message.content}</span>
                    <span className="text-xs text-slate-400 ml-2">{message.sentAt}</span>
                </div>
            </div>
        );
    }

    if (message.kind === "file" && message.file) {
        return (
            <div className="max-w-sm">
                <div className="flex items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-3">
                    <div className="rounded-xl bg-sky-100 p-2.5 text-sky-600">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">{message.file.fileName}</p>
                        <p className="text-xs text-slate-400">{message.file.sizeLabel} · {message.file.extension}</p>
                    </div>
                </div>
                <p className="mt-1 text-xs text-slate-400">{message.sentAt}</p>
            </div>
        );
    }

    const hasImage = !!message.imageUrl;
    const hasText = !!message.content?.trim();

    return (
        <div className={`flex items-end gap-2 ${message.isOwn ? "justify-end" : "justify-start"}`}>
            {/* Other user avatar */}
            {!message.isOwn && (
                message.senderAvatar ? (
                    <img
                        src={message.senderAvatar}
                        alt={message.senderName}
                        className="h-7 w-7 rounded-full object-cover shrink-0"
                    />
                ) : (
                    <div className="h-7 w-7 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 text-xs font-bold shrink-0">
                        {message.senderName?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                )
            )}

            <div className={`${message.isOwn ? "max-w-sm" : "max-w-xs"} flex flex-col gap-1`}>
                {/* Image */}
                {hasImage && (
                    <a href={message.imageUrl} target="_blank" rel="noopener noreferrer">
                        <img
                            src={message.imageUrl}
                            alt="sent image"
                            className={`rounded-2xl object-cover max-h-60 w-auto border ${message.isOwn ? "border-sky-300" : "border-sky-200"
                                }`}
                        />
                    </a>
                )}

                {/* Text bubble */}
                {hasText && (
                    <div
                        className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${message.isOwn
                                ? "bg-sky-600 text-white rounded-br-sm"
                                : "bg-sky-50 border border-sky-200 text-slate-800 rounded-bl-sm"
                            }`}
                    >
                        {message.content}
                    </div>
                )}

                <p className={`text-xs text-slate-400 ${message.isOwn ? "text-right" : "text-left"}`}>
                    {message.sentAt}{message.isOwn && message.read ? " · Read" : ""}
                </p>
            </div>
        </div>
    );
}