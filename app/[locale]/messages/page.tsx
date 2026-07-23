"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
}

interface Conversation {
    id: string;
    participants: {
        id: string;
        name: string;
        avatar: string | null;
    }[];
    messages: Message[];
    updatedAt: string;
}

export default function MessagesPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedId = searchParams.get("id");
    const t = useTranslations('messages');

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchConversations = async () => {
        try {
            const res = await fetch("/api/messages");
            const data = await res.json();
            setConversations(data);
        } catch (e) {
            console.error(e);
        }
    };

    const selectConversation = async (conv: Conversation) => {
        setSelectedConversation(conv);
        try {
            const res = await fetch(`/api/messages?conversationId=${conv.id}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            } else {
                setMessages(conv.messages || []);
            }
        } catch (e) {
            console.error(e);
            setMessages(conv.messages || []);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedId && conversations.length > 0) {
            const conv = conversations.find(c => c.id === selectedId);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (conv) selectConversation(conv);
        }
    }, [selectedId, conversations]);

    // Poll for messages in active conversation
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (selectedConversation) {
            interval = setInterval(() => {
                // In a real app, use SWR or websockets
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [selectedConversation]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        const recipient = selectedConversation.participants.find(p => p.id !== session?.user?.id);
        if (!recipient) return;

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    conversationId: selectedConversation.id,
                    content: newMessage,
                    recipientId: recipient.id
                })
            });

            const sentMsg = await res.json();
            setMessages([...messages, sentMsg]);
            setNewMessage("");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-64px)]">
            <div className="flex h-full bg-white rounded-xl shadow-lg overflow-hidden border">
                {/* Sidebar */}
                <div className="w-1/3 border-r bg-gray-50 flex flex-col">
                    <div className="p-4 border-b">
                        <h2 className="font-bold text-xl">{t('title')}</h2>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {conversations.map(conv => {
                            const otherUser = conv.participants.find(p => p.id !== session?.user?.id);
                            return (
                                <div
                                    key={conv.id}
                                    onClick={() => router.push(`/messages?id=${conv.id}`)}
                                    className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${selectedId === conv.id ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3 font-bold">
                                            {otherUser?.name?.charAt(0) || "?"}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{otherUser?.name || t('unknown')}</div>
                                            <div className="text-sm text-gray-500 truncate w-32">
                                                {conv.messages[0]?.content || t('noMessages')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b flex items-center bg-white shadow-sm z-10">
                                {(() => {
                                    const otherUser = selectedConversation.participants.find(p => p.id !== session?.user?.id);
                                    return (
                                        <div className="font-bold text-lg">{otherUser?.name}</div>
                                    )
                                })()}
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                {messages.map((msg) => {
                                    const isMe = msg.senderId === session?.user?.id;
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] rounded-lg px-4 py-2 ${isMe ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                                                <p>{msg.content}</p>
                                                <span className={`text-xs ${isMe ? 'text-blue-100' : 'text-gray-400'} block text-right mt-1`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder={t('typePlaceholder')}
                                        className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
                                        {t('send')}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            {t('select')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
