'use client';

import { useState, useEffect, useCallback } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FiSearch, FiStar, FiFilter, FiActivity, FiArrowRight } from "react-icons/fi";

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
    };
}

export default function ServicesPage() {
    const t = useTranslations('servicesPage');
    const ct = useTranslations('jobForm.services');
    const searchParams = useSearchParams();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "");

    const sampleServices: Service[] = [
        {
            id: "s1",
            title: "Instalime Elektrike & Riparime të Menjëhershme",
            description: "Shërbim profesional elektrik për shtëpi dhe zyra. Kontroll i rrjetit, ndërrim panelesh dhe ndriçim LED.",
            price: 35,
            category: "electrical",
            location: "Tiranë",
            images: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"],
            provider: { id: "p1", name: "Agim Hoxha", avatar: "https://i.pravatar.cc/150?u=agim", rating: 4.9 }
        },
        {
            id: "s2",
            title: "Pastrim Profesional me Avull & Sanitim",
            description: "Pastrim i thellë me pajisje moderne për shtëpi, zyra dhe ambiente komerciale. Sanitim 100% i garantuar.",
            price: 50,
            category: "cleaning",
            location: "Durrës",
            images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"],
            provider: { id: "p2", name: "Besa Shehu", avatar: "https://i.pravatar.cc/150?u=besa", rating: 5.0 }
        },
        {
            id: "s3",
            title: "Shërbime Hidraulike & Zhbllokim Tubacionesh",
            description: "Riparim i rrjedhjeve të ujit, instalim patendash, bojlerësh dhe mirëmbajtje komplekse hidraulike.",
            price: 40,
            category: "plumbing",
            location: "Vlorë",
            images: ["https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80"],
            provider: { id: "p3", name: "Krenar Rama", avatar: "https://i.pravatar.cc/150?u=krenar", rating: 4.8 }
        },
        {
            id: "s4",
            title: "Lyerje Eksteriore & Interiore me Bojë Premium",
            description: "Rregullim muresh, lyerje dekorative dhe hidroizolim profesional me bojëra ekologjike me tharje të shpejtë.",
            price: 80,
            category: "painting",
            location: "Shkodër",
            images: ["https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80"],
            provider: { id: "p4", name: "Genci Krasniqi", avatar: "https://i.pravatar.cc/150?u=genci", rating: 4.9 }
        },
        {
            id: "s5",
            title: "Montim Mobiljesh & Punë Druri",
            description: "Montim i mobiljeve të çfarëdolloj marke (IKEA, etj.), modifikime dhe rregullime të sakta profesionale.",
            price: 45,
            category: "assembly",
            location: "Fier",
            images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"],
            provider: { id: "p5", name: "Arben Meta", avatar: "https://i.pravatar.cc/150?u=arben", rating: 4.7 }
        },
        {
            id: "s6",
            title: "Riparime Kompjuterash & Rrjeta IT",
            description: "Diagnozë hardware/software, optimizim shpejtësie, konfigurim routera dhe kamerash sigurie.",
            price: 30,
            category: "it",
            location: "Tiranë",
            images: ["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80"],
            provider: { id: "p6", name: "Erion Berisha", avatar: "https://i.pravatar.cc/150?u=erion", rating: 5.0 }
        }
    ];

    const fetchServices = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append("search", searchTerm);
            if (category) params.append("category", category);

            const res = await fetch(`/api/services?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setServices(data);
            }
        } catch (error) {
            console.error("Failed to fetch services", error);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, category]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchServices();
    };

    const categories = [
        'electrical', 'plumbing', 'cleaning', 'assembly', 'it', 'painting', 'construction', 'transport', 'photography', 'care', 'other'
    ];

    const displayServices = services.length > 0 ? services : sampleServices;

    return (
        <div className="min-h-screen mesh-gradient-bg pb-20">
            {/* Hero / Header Section */}
            <div className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 pt-16 pb-28 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10 max-w-7xl">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight text-center md:text-left">
                        {t('title')}
                    </h1>
                    <p className="text-slate-600 text-lg md:text-xl font-semibold mb-8 text-center md:text-left max-w-2xl">
                        Zgjidhni shërbimin që ju nevojitet nga mjeshtra të verifikuar me vlerësime reale.
                    </p>
                    
                    {/* Professional Search Bar */}
                    <div className="max-w-4xl glass shadow-2xl rounded-[2.5rem] p-3 flex flex-col md:flex-row gap-3 border border-slate-200/80">
                        <form onSubmit={handleSearch} className="flex-1 flex items-center bg-white rounded-2xl px-4 py-1 group focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all border border-slate-200/60">
                            <FiSearch className="text-xl text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                className="w-full p-4 bg-transparent outline-none font-bold text-slate-900 placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>
                        
                        <div className="flex items-center bg-white rounded-2xl px-4 py-1 group focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all border border-slate-200/60">
                            <FiFilter className="text-xl text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                            <select
                                className="bg-transparent p-4 outline-none font-bold text-slate-900 appearance-none min-w-[150px] cursor-pointer"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">{t('allCategories')}</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{ct(cat)}</option>
                                ))}
                            </select>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 text-white px-10 py-4.5 rounded-2xl font-black transition-all shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
                        >
                            {t('searchButton')}
                            <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Quick Category Pills */}
                    <div className="flex flex-wrap items-center gap-2.5 mt-8">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">Filtrime:</span>
                        <button
                            onClick={() => setCategory('')}
                            className={`px-4 py-2 rounded-full text-xs font-black transition-all border ${!category ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'}`}
                        >
                            Gjithçka
                        </button>
                        {categories.slice(0, 6).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-black transition-all border ${category === cat ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'}`}
                            >
                                {ct(cat)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-4 -mt-12 relative z-20 max-w-7xl">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="glass-card rounded-[2.5rem] p-8 h-80 border border-slate-200/80 animate-shimmer"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayServices.map((service, index) => (
                            <Link 
                                href={`/services/${service.id}`} 
                                key={service.id} 
                                className="group hover-lift animate-slideInUp"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="glass-card rounded-[2.5rem] overflow-hidden border border-slate-200/80 h-full flex flex-col">
                                    <div className="h-60 bg-slate-100 relative overflow-hidden">
                                        {service.images?.length > 0 ? (
                                            <Image 
                                                src={service.images[0]} 
                                                alt={service.title} 
                                                fill
                                                unoptimized
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <FiActivity className="text-6xl opacity-20" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-4 py-1.5 glass rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-700 shadow-md border border-emerald-200/60">
                                                {ct(service.category)}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl">
                                            <span className="text-white font-black text-xl flex items-center">
                                                <span className="text-xs mr-0.5 text-emerald-400">€</span>
                                                {service.price}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-1 leading-tight">
                                            {service.title}
                                        </h3>
                                        <p className="text-slate-600 font-semibold text-sm line-clamp-2 mb-6 leading-relaxed">
                                            {service.description}
                                        </p>

                                        <div className="pt-6 border-t border-slate-200/80 mt-auto flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center relative overflow-hidden shadow-inner border border-slate-200">
                                                    {service.provider.avatar ? (
                                                        <Image src={service.provider.avatar} alt={service.provider.name} fill unoptimized sizes="48px" className="object-cover" />
                                                    ) : (
                                                        <span className="font-black text-slate-400">{service.provider.name?.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-900 leading-none mb-1">{service.provider.name}</span>
                                                    <div className="flex items-center text-xs">
                                                        <FiStar className="text-amber-400 fill-amber-400 mr-1" />
                                                        <span className="font-black text-slate-700">{service.provider.rating ? service.provider.rating.toFixed(1) : '4.9'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all group-hover:rotate-12">
                                                <FiArrowRight className="text-xl" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Call to Action for Providers */}
            <div className="container mx-auto px-4 mt-24 max-w-7xl animate-fadeIn">
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-[3.5rem] p-12 md:p-16 text-white text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-4xl font-black mb-6 tracking-tight">{t('becomeProviderTitle')}</h2>
                        <p className="text-emerald-100/80 text-lg mb-10 font-semibold">{t('becomeProviderDesc')}</p>
                        <Link 
                            href="/register?role=PROVIDER" 
                            className="inline-flex items-center px-12 py-5 bg-white text-slate-900 rounded-2xl font-black shadow-xl hover:bg-emerald-50 hover:scale-105 transition-all active:scale-95"
                        >
                            {t('startNow')}
                            <FiArrowRight className="ml-3 text-xl text-emerald-600" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
