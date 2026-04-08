"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Link, useRouter } from "@/frontend/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface Service {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    location: string | null;
    images: string[];
    provider: {
        id: string;
        name: string;
        avatar: string | null;
        rating: number | null;
        bio: string | null;
        createdAt: string;
    };
}

export default function ServiceDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const ct = useTranslations('jobForm.services');
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetch(`/api/services/${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error) throw new Error(data.error);
                    setService(data);
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleContact = async () => {
        if (!session) {
            router.push("/login?callbackUrl=" + window.location.pathname);
            return;
        }

        if (session.user.id === service?.provider.id) {
            alert("You cannot message yourself.");
            return;
        }

        // Start conversation
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipientId: service?.provider.id,
                    content: `Hi, I'm interested in your service: ${service?.title}`
                })
            });
            const data = await res.json();

            if (data.conversationId) {
                router.push(`/messages?id=${data.conversationId}`);
            } else if (data.id) {
                // Message created, just redirect to messages page
                // We need conversationID but it sends message object back which has conversationId
                router.push(`/messages?id=${data.conversationId}`);
            }
        } catch (e) {
            console.error("Failed to start chat", e);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!service) return <div className="p-8 text-center">Service not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Images Header */}
                <div className="h-64 md:h-96 bg-gray-200 relative">
                    {service.images.length > 0 ? (
                        <Image src={service.images[0]} alt={service.title} fill sizes="(max-width: 1280px) 100vw, 1280px" className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
                            No Image Available
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-2">
                                {ct(service.category as "electrical") || service.category}
                            </span>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
                            <div className="flex items-center text-gray-500">
                                <span>📍 {service.location || "Remote/Online"}</span>
                            </div>
                        </div>

                        <div className="prose max-w-none">
                            <h3 className="text-xl font-semibold mb-2">About this Service</h3>
                            <p className="whitespace-pre-line text-gray-700">{service.description}</p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="md:col-span-1">
                        <div className="bg-gray-50 border rounded-xl p-6 shadow-sm sticky top-4">
                            <div className="text-3xl font-bold text-gray-900 mb-6">${service.price}</div>

                            <button
                                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors mb-4"
                                onClick={() => router.push(`/requests/create?serviceId=${service.id}`)} // Assuming Create Request can take serviceId
                            >
                                Book Now
                            </button>

                            <button
                                className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:border-gray-300 transition-colors"
                                onClick={handleContact}
                            >
                                Contact Provider
                            </button>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h4 className="font-semibold mb-4">Service Provider</h4>
                                <div className="flex items-center">
                                    {service.provider.avatar ? (
                                        <Image src={service.provider.avatar} alt={service.provider.name} width={48} height={48} className="rounded-full mr-4" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex items-center justify-center font-bold">
                                            {service.provider.name?.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <Link href={`/profile/${service.provider.id}`} className="font-medium hover:underline">
                                            {service.provider.name}
                                        </Link>
                                        <div className="text-sm text-gray-500">
                                            ★ {service.provider.rating ? service.provider.rating.toFixed(1) : "New"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
