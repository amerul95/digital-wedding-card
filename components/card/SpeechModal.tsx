"use client";

import React, { useState } from "react";

interface SpeechModalProps {
    placeholderName?: string;
    placeholderMessage?: string;
    submitButtonText?: string;
    submitButtonStyle?: React.CSSProperties;
}

export function SpeechModal({
    placeholderName = "Your Name",
    placeholderMessage = "Write your wishes...",
    submitButtonText = "Send Wishes",
    submitButtonStyle
}: SpeechModalProps) {
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!author.trim() || !content.trim()) return;

        // Logic to save would go here (e.g. API call)
        console.log("Submitted:", { author, content });
        alert("Wishes sent!"); // Temporary feedback

        setAuthor("");
        setContent("");
    };

    return (
        <div className="flex flex-col">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder={placeholderName}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none bg-white/80"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />
                <textarea
                    placeholder={placeholderMessage}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none resize-none bg-white/80"
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full rounded-lg py-2.5 text-sm font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-95 active:scale-[0.98]"
                    style={{
                        backgroundColor: '#e11d48', // Default rose-600
                        color: 'white',
                        ...submitButtonStyle
                    }}
                    disabled={!author.trim() || !content.trim()}
                >
                    {submitButtonText}
                </button>
            </form>
        </div>
    );
}
