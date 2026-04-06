"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { FiMapPin, FiStar, FiCalendar, FiMessageSquare, FiArrowLeft } from "react-icons/fi";

interface Profile {
    id: string;
    name: string;
    avatar: string | null;
    bio: string | null;
    location: string | null;
    rating: number | null;
    role: string;
    createdAt: string;
    services: {
        id: string;
        title: string;
        price: number;
        category: string;
        description: string;
    }[];
    reviewsReceived: {
        id: string;
        rating: number;
        comment: string;
        createdAt: string;
        reviewer: {
            name: string;
            avatar: string | null;
        }
    }[];
}

export default function PublicProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetch(`/api/profile/${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error) throw new Error(data.error);
                    setProfile(data);
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

        if (session.user.id === id) {
            alert("You cannot message yourself.");
            return;
        }

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recipientId: id, content: "Hi! I saw your profile and I'm interested in your services." })
            });
            const data = await res.json();
            if (data.conversationId) {
                router.push(`/messages?id=${data.conversationId}`);
            } else if (data.id) {
                router.push(`/messages?id=${data.conversationId || data.id}`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading profile...</div>;
    if (!profile) return <div className="p-10 text-center">Profile not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-4xl mx-auto px-4">
                <Link href="/services" className="inline-flex items-center text-blue-600 hover:underline mb-8">
                    <FiArrowLeft className="mr-2" /> Back to Services
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            {profile.avatar ? (
                                <Image src={profile.avatar} alt={profile.name} width={128} height={128} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                                    {profile.name.charAt(0)}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                                    <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-gray-500">
                                        <div className="flex items-center">
                                            <FiMapPin className="mr-1" /> {profile.location || "Location not set"}
                                        </div>
                                        <div className="flex items-center text-yellow-500 font-bold">
                                            <FiStar className="mr-1 fill-current" /> {profile.rating ? profile.rating.toFixed(1) : "New"}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleContact}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center"
                                >
                                    <FiMessageSquare className="mr-2" /> Contact
                                </button>
                            </div>

                            <p className="mt-6 text-gray-700 leading-relaxed max-w-2xl">
                                {profile.bio || "No bio information provided."}
                            </p>

                            <div className="mt-6 flex items-center text-sm text-gray-400">
                                <FiCalendar className="mr-2" /> Joined {new Date(profile.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        {/* Services */}
                        <div>
                            <h2 className="text-xl font-bold mb-4">Services Offered</h2>
                            <div className="space-y-4">
                                {profile.services.length === 0 ? (
                                    <p className="text-gray-500 italic">No active services.</p>
                                ) : (
                                    profile.services.map(service => (
                                        <Link key={service.id} href={`/services/${service.id}`} className="block bg-white p-6 rounded-xl border hover:border-blue-300 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{service.category}</span>
                                                    <h3 className="font-bold text-lg mt-1">{service.title}</h3>
                                                </div>
                                                <div className="text-lg font-bold text-gray-900">{service.price} €</div>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{service.description}</p>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div>
                            <h2 className="text-xl font-bold mb-4">Recent Reviews</h2>
                            <div className="bg-white rounded-xl border divide-y">
                                {profile.reviewsReceived.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 italic">No reviews yet.</div>
                                ) : (
                                    profile.reviewsReceived.map(review => (
                                        <div key={review.id} className="p-6">
                                            <div className="flex justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                                        {review.reviewer.avatar ? (
                                                            <Image src={review.reviewer.avatar} alt={review.reviewer.name} width={32} height={32} />
                                                        ) : (
                                                            <span className="text-xs font-bold">{review.reviewer.name.charAt(0)}</span>
                                                        )}
                                                    </div>
                                                    <span className="font-bold text-sm">{review.reviewer.name}</span>
                                                </div>
                                                <div className="flex text-yellow-400 text-sm">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FiStar key={i} className={i < review.rating ? "fill-current" : "text-gray-200"} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm">{review.comment}</p>
                                            <span className="text-[10px] text-gray-400 block mt-2 uppercase tracking-wide">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 rounded-2xl shadow-lg sticky top-8">
                            <h3 className="text-xl font-bold mb-4 text-center">Interested?</h3>
                            <p className="text-blue-100 text-sm mb-6 text-center leading-relaxed">
                                Get in touch with {profile.name.split(" ")[0]} to discuss your project and get a quote.
                            </p>
                            <button
                                onClick={handleContact}
                                className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-50 transition shadow-md"
                            >
                                Send Message
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
