'use client';

import { useState, useEffect, useCallback } from "react";
import { Link } from "@/frontend/i18n/routing";
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
    const ct = useTranslations('jobForm.services'); // Corrected path
    const searchParams = useSearchParams();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "");

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

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Hero / Header Section */}
            <div className="bg-white border-b border-slate-100 pt-12 pb-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#3b82f615,transparent)]"></div>
                <div className="container mx-auto px-4 relative z-10 max-w-7xl">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight text-center md:text-left">
                        {t('title')}
                    </h1>
                    
                    {/* Professional Search Bar */}
                    <div className="max-w-4xl glass shadow-2xl rounded-[2rem] p-2 flex flex-col md:flex-row gap-2 border border-white/50 animate-fadeIn">
                        <form onSubmit={handleSearch} className="flex-1 flex items-center bg-white/50 rounded-2xl px-4 py-1 group focus-within:bg-white transition-all">
                            <FiSearch className="text-xl text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                className="w-full p-4 bg-transparent outline-none font-bold text-slate-900 placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>
                        
                        <div className="flex items-center bg-white/50 rounded-2xl px-4 py-1 group focus-within:bg-white transition-all">
                            <FiFilter className="text-xl text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <select
                                className="bg-transparent p-4 outline-none font-bold text-slate-900 appearance-none min-w-[150px]"
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
                            className="bg-slate-900 hover:bg-blue-600 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 group"
                        >
                            {t('searchButton')}
                            <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-4 -mt-12 relative z-20 max-w-7xl">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-[2.5rem] p-8 h-80 shadow-sm border border-slate-100 animate-shimmer"></div>
                        ))}
                    </div>
                ) : services.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-20 text-center shadow-xl border border-slate-100 animate-fadeIn">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <FiActivity className="text-5xl text-slate-300" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-4">{t('noServices')}</h3>
                        <p className="text-slate-500 text-lg max-w-md mx-auto">{t('noServicesSub')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <Link 
                                href={`/services/${service.id}`} 
                                key={service.id} 
                                className="group hover-lift animate-slideInUp"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 h-full flex flex-col">
                                    <div className="h-60 bg-slate-100 relative overflow-hidden">
                                        {service.images?.length > 0 ? (
                                            <Image 
                                                src={service.images[0]} 
                                                alt={service.title} 
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <FiActivity className="text-6xl opacity-20" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-lg">
                                                {ct(service.category)}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl">
                                            <span className="text-white font-black text-xl flex items-center">
                                                <span className="text-xs mr-0.5 text-blue-400">€</span>
                                                {service.price}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1 leading-tight">
                                            {service.title}
                                        </h3>
                                        <p className="text-slate-500 font-medium text-sm line-clamp-2 mb-6 leading-relaxed">
                                            {service.description}
                                        </p>

                                        <div className="pt-6 border-t border-slate-50 mt-auto flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center relative overflow-hidden shadow-inner border border-slate-200">
                                                    {service.provider.avatar ? (
                                                        <Image src={service.provider.avatar} alt={service.provider.name} fill sizes="48px" className="object-cover" />
                                                    ) : (
                                                        <span className="font-black text-slate-400">{service.provider.name?.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-900 leading-none mb-1">{service.provider.name}</span>
                                                    <div className="flex items-center text-xs">
                                                        <FiStar className="text-amber-400 fill-amber-400 mr-1" />
                                                        <span className="font-black text-slate-600">{service.provider.rating ? service.provider.rating.toFixed(1) : t('new')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all group-hover:rotate-12">
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
                <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[3.5rem] p-12 md:p-16 text-white text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-4xl font-black mb-6 tracking-tight">Keni një aftësi për të ofruar?</h2>
                        <p className="text-blue-100 text-lg mb-10 font-medium">Bëhuni pjesë e platformës tonë dhe filloni të fitoni sot duke ofruar shërbimet tuaja profesioniste.</p>
                        <Link 
                            href="/register?role=PROVIDER" 
                            className="inline-flex items-center px-12 py-5 bg-white text-blue-900 rounded-2xl font-black shadow-xl hover:scale-105 transition-all active:scale-95"
                        >
                            Fillo Tani
                            <FiArrowRight className="ml-3 text-xl" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
