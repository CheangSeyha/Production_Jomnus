"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { CirclePlus, Send, Smile, X, Image as ImageIcon } from "lucide-react";
// @ts-ignore
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import api from "@/lib/axios";

type Props = {
    draftMessage: string;
    onChange: (v: string) => void;
    conversationId: number;
    onMessageSent?: () => void; // ← to refetch messages after HTTP send
};

export default function MessageComposer({
                                            draftMessage,
                                            onChange,
                                            conversationId,
                                            onMessageSent,
                                        }: Props) {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    // Generate preview URL when image selected
    useEffect(() => {
        if (!image) { setPreview(null); return; }
        const url = URL.createObjectURL(image);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [image]);

    // Close emoji picker on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setShowPicker(false);
            }
        }
        if (showPicker) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showPicker]);

    function handleEmojiSelect(emoji: { native: string }) {
        onChange(draftMessage + emoji.native);
        setShowPicker(false);
    }

    function removeImage() {
        setImage(null);
        setPreview(null);
        if (fileRef.current) fileRef.current.value = "";
    }

    async function handleSend(e: FormEvent) {
        e.preventDefault();
        if (!draftMessage.trim() && !image) return;

        try {
            setLoading(true);
            const fd = new FormData();
            fd.append("conversationId", String(conversationId));
            fd.append("message", draftMessage.trim());
            if (image) fd.append("image", image);

            await api.post("/messages", fd);

            onChange("");
            setImage(null);
            setPreview(null);
            if (fileRef.current) fileRef.current.value = "";
            onMessageSent?.(); // trigger refetch in parent
        } catch (err) {
            console.error("Send failed:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <footer className="shrink-0 border-t border-sky-100 bg-white px-4 py-3">

            {/* ── Emoji picker ── */}
            {showPicker && (
                <div ref={pickerRef} className="absolute bottom-20 right-6 z-50">
                    <Picker
                        data={data}
                        onEmojiSelect={handleEmojiSelect}
                        theme="light"
                        previewPosition="none"
                        skinTonePosition="none"
                    />
                </div>
            )}

            {/* ── Image preview ── */}
            {preview && (
                <div className="mb-2 relative inline-block">
                    <img
                        src={preview}
                        alt="preview"
                        className="h-20 w-20 rounded-xl object-cover border border-sky-200"
                    />
                    <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-1.5 -right-1.5 rounded-full bg-rose-500 p-0.5 text-white hover:bg-rose-600 transition"
                    >
                        <X size={12} />
                    </button>
                </div>
            )}

            {/* ── Composer row ── */}
            <form
                onSubmit={handleSend}
                className="flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50/70 px-3 py-2.5 shadow-inner shadow-sky-100/60 focus-within:border-sky-400 focus-within:bg-white transition"
            >
                {/* Image upload trigger */}
                <label className="cursor-pointer text-sky-400 hover:text-sky-600 transition shrink-0">
                    <ImageIcon className="h-5 w-5" />
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                    />
                </label>

                {/* Text input */}
                <input
                    value={draftMessage}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Type your message…"
                    className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-sky-300 focus:outline-none"
                />

                {/* Emoji */}
                <button
                    type="button"
                    onClick={() => setShowPicker((p) => !p)}
                    className={`transition shrink-0 ${showPicker ? "text-sky-600" : "text-sky-400 hover:text-sky-600"}`}
                >
                    <Smile className="h-5 w-5" />
                </button>

                {/* Send */}
                <button
                    type="submit"
                    disabled={loading || (!draftMessage.trim() && !image)}
                    className="rounded-xl bg-sky-600 px-3 py-1.5 text-white transition hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                    {loading ? (
                        <span className="h-4 w-4 block rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </button>
            </form>
        </footer>
    );
}