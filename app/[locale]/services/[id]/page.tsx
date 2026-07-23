"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Link, useRouter } from "@/i18n/routing";
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

const sampleServicesMap: Record<string, Service> = {
    s1: {
        id: "s1",
        title: "Instalime Elektrike & Riparime të Menjëhershme",
        description: "Shërbim profesional elektrik për shtëpi dhe zyra. Kontroll i plotë i rrjetit elektrik, ndërrim panelesh, instalime ndriçimi LED dhe zgjidhje e defekteve emergjente me garanci.",
        price: 35,
        category: "electrical",
        location: "Tiranë",
        images: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80"],
        provider: { id: "p1", name: "Agim Hoxha", avatar: "https://i.pravatar.cc/150?u=agim", rating: 4.9, bio: "Elektricist me mbi 10 vite përvojë pune.", createdAt: "2024-01-01" }
    },
    s2: {
        id: "s2",
        title: "Pastrim Profesional me Avull & Sanitim",
        description: "Pastrim i thellë me pajisje moderne për shtëpi, zyra dhe ambiente komerciale. Sanitim 100% i garantuar kundër baktereve dhe njollave të vështira.",
        price: 50,
        category: "cleaning",
        location: "Durrës",
        images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80"],
        provider: { id: "p2", name: "Besa Shehu", avatar: "https://i.pravatar.cc/150?u=besa", rating: 5.0, bio: "Kompani pastrimi me staf të kualifikuar.", createdAt: "2024-02-01" }
    },
    s3: {
        id: "s3",
        title: "Shërbime Hidraulike & Zhbllokim Tubacionesh",
        description: "Riparim i rrjedhjeve të ujit, instalim patendash, bojlerësh dhe mirëmbajtje komplekse hidraulike me garanci të plotë.",
        price: 40,
        category: "plumbing",
        location: "Vlorë",
        images: ["https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1200&q=80"],
        provider: { id: "p3", name: "Krenar Rama", avatar: "https://i.pravatar.cc/150?u=krenar", rating: 4.8, bio: "Hidraulik me përvojë në instalime komplekse.", createdAt: "2024-01-15" }
    },
    s4: {
        id: "s4",
        title: "Lyerje Eksteriore & Interiore me Bojë Premium",
        description: "Rregullim muresh, lyerje dekorative dhe hidroizolim profesional me bojëra ekologjike me tharje të shpejtë dhe pa erë.",
        price: 80,
        category: "painting",
        location: "Shkodër",
        images: ["https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1200&q=80"],
        provider: { id: "p4", name: "Genci Krasniqi", avatar: "https://i.pravatar.cc/150?u=genci", rating: 4.9, bio: "Mjeshtër boje me vlerësime maksimale.", createdAt: "2024-03-01" }
    },
    s5: {
        id: "s5",
        title: "Montim Mobiljesh & Punë Druri",
        description: "Montim i mobiljeve të çfarëdolloj marke (IKEA, etj.), modifikime dhe rregullime të sakta profesionale për shtëpinë tuaj.",
        price: 45,
        category: "assembly",
        location: "Fier",
        images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80"],
        provider: { id: "p5", name: "Arben Meta", avatar: "https://i.pravatar.cc/150?u=arben", rating: 4.7, bio: "Marrësi më i besueshëm i punëve të drurit.", createdAt: "2024-02-15" }
    },
    s6: {
        id: "s6",
        title: "Riparime Kompjuterash & Rrjeta IT",
        description: "Diagnozë hardware/software, optimizim shpejtësie, konfigurim routera dhe kamerash sigurie për shtëpi e zyra.",
        price: 30,
        category: "it",
        location: "Tiranë",
        images: ["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80"],
        provider: { id: "p6", name: "Erion Berisha", avatar: "https://i.pravatar.cc/150?u=erion", rating: 5.0, bio: "Inxhinier IT & Siguri Kibernetike.", createdAt: "2024-01-10" }
    }
};

export default function ServiceDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const ct = useTranslations('jobForm.services');
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const serviceIdStr = Array.isArray(id) ? id[0] : id;
            fetch(`/api/services/${serviceIdStr}`)
                .then(res => {
                    if (!res.ok) throw new Error("Service not found in DB");
                    return res.json();
                })
                .then(data => {
                    if (data.error) throw new Error(data.error);
                    setService(data);
                })
                .catch(() => {
                    if (sampleServicesMap[serviceIdStr]) {
                        setService(sampleServicesMap[serviceIdStr]);
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleContact = async () => {
        if (!session) {
            router.push("/login?callbackUrl=" + window.location.pathname);
            return;
        }

        if (session?.user?.id === service?.provider.id) {
            alert("Nuk mund t'i dërgoni mesazh vetvetes.");
            return;
        }

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipientId: service?.provider.id,
                    content: `Përshëndetje! Jam i interesuar për shërbimin tuaj: ${service?.title}`
                })
            });
            const data = await res.json();

            if (data.conversationId) {
                router.push(`/messages?id=${data.conversationId}`);
            } else {
                router.push(`/messages`);
            }
        } catch (e) {
            console.error("Failed to start chat", e);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen mesh-gradient-bg flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen mesh-gradient-bg flex flex-col items-center justify-center p-8 text-center">
                <h2 className="text-3xl font-black text-slate-900 mb-4">Shërbimi nuk u gjet</h2>
                <Link href="/services" className="px-8 py-3 bg-emerald-600 text-white font-black rounded-2xl shadow-lg">
                    Kthehu te Shërbimet
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen mesh-gradient-bg py-12">
            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="glass-card rounded-[3.5rem] overflow-hidden border border-slate-200/80 shadow-2xl">
                    {/* Images Header */}
                    <div className="h-72 md:h-[420px] bg-slate-100 relative overflow-hidden">
                        {service.images.length > 0 ? (
                            <Image 
                                src={service.images[0]} 
                                alt={service.title} 
                                fill 
                                unoptimized 
                                sizes="(max-width: 1280px) 100vw, 1280px" 
                                className="object-cover" 
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xl font-bold">
                                Nuk ka foto
                            </div>
                        )}
                        <div className="absolute top-6 left-6">
                            <span className="px-5 py-2 glass rounded-full text-xs font-black uppercase tracking-widest text-emerald-700 shadow-lg border border-emerald-200/80">
                                {ct(service.category as "electrical") || service.category}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 p-8 md:p-14">
                        <div className="md:col-span-2 space-y-8">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">{service.title}</h1>
                                <div className="flex items-center text-slate-500 font-extrabold text-sm md:text-base">
                                    <span>📍 {service.location || "Tiranë"}</span>
                                </div>
                            </div>

                            <div className="prose max-w-none">
                                <h3 className="text-2xl font-black text-slate-900 mb-4">Rreth këtij shërbimi</h3>
                                <p className="whitespace-pre-line text-slate-600 font-semibold leading-relaxed text-base md:text-lg">{service.description}</p>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="md:col-span-1">
                            <div className="glass rounded-[2.5rem] border border-slate-200/80 p-8 shadow-xl sticky top-28 space-y-6">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Çmimi</span>
                                    <div className="text-4xl font-black text-slate-900">€{service.price}</div>
                                </div>

                                <button
                                    className="w-full py-4.5 bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                                    onClick={() => router.push(`/requests/create?serviceId=${service.id}`)}
                                >
                                    Rezervo Menjëherë
                                </button>

                                <button
                                    className="w-full bg-white border-2 border-slate-200 text-slate-800 py-4.5 rounded-2xl font-black text-lg hover:border-emerald-500/50 hover:bg-slate-50 transition-all shadow-sm"
                                    onClick={handleContact}
                                >
                                    Dërgo Mesazh
                                </button>

                                <div className="pt-6 border-t border-slate-200/80">
                                    <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">Mjeshtri i Shërbimit</h4>
                                    <div className="flex items-center gap-4">
                                        {service.provider.avatar ? (
                                            <Image src={service.provider.avatar} alt={service.provider.name} width={52} height={52} unoptimized className="rounded-2xl object-cover shadow-sm" />
                                        ) : (
                                            <div className="w-13 h-13 rounded-2xl bg-slate-200 flex items-center justify-center font-black text-slate-500">
                                                {service.provider.name?.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <Link href={`/profile/${service.provider.id}`} className="font-black text-slate-900 hover:text-emerald-600 transition-colors text-lg">
                                                {service.provider.name}
                                            </Link>
                                            <div className="text-xs font-black text-amber-500 flex items-center gap-1 mt-0.5">
                                                ★ {service.provider.rating ? service.provider.rating.toFixed(1) : "4.9"}
                                            </div>
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

