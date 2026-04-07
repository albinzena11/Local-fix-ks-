'use client';

import { useState, useEffect, useCallback } from "react";
import { Link } from "@/frontend/i18n/routing";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FiSearch, FiShoppingBag, FiFilter, FiPackage, FiArrowRight, FiPlus } from "react-icons/fi";
import { useSession } from "next-auth/react";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    status: string;
    seller: {
        id: string;
        name: string;
        avatar: string | null;
    };
}

export default function MarketplacePage() {
    const t = useTranslations('marketplace');
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "");

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append("search", searchTerm);
            if (category) params.append("category", category);

            const res = await fetch(`/api/marketplace/products?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, category]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleBuy = async (productId: string) => {
        if (!session) {
            alert("Ju lutem hyni në llogari për të blerë.");
            return;
        }

        try {
            const res = await fetch('/api/marketplace/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId })
            });

            if (res.ok) {
                alert("Blerja u krye me sukses!");
                fetchProducts();
            } else {
                const data = await res.json();
                alert(data.error || "Pati një problem gjatë blerjes.");
            }
        } catch (error) {
            alert("Gabim gjatë transaksionit.");
        }
    };

    const categories = ['tools', 'electronics', 'furniture', 'materials', 'other'];

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Hero Section */}
            <div className="bg-white border-b border-slate-100 pt-16 pb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_70%_20%,#3b82f610,transparent)]"></div>
                <div className="container mx-auto px-4 relative z-10 max-w-7xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
                                {t('title')}
                            </h1>
                            <p className="text-lg text-slate-500 font-medium max-w-lg">
                                {t('subtitle')}
                            </p>
                        </div>
                        <Link 
                            href="/marketplace/add" 
                            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl hover:scale-105 transition-all active:scale-95 gap-2 self-start md:self-center"
                        >
                            <FiPlus className="text-xl" />
                            {t('addProduct')}
                        </Link>
                    </div>
                    
                    {/* Search and Filter */}
                    <div className="max-w-4xl glass shadow-2xl rounded-[2.5rem] p-3 flex flex-col md:flex-row gap-3 border border-white/50 bg-white/80 backdrop-blur-xl">
                        <div className="flex-1 flex items-center bg-slate-50 rounded-2xl px-5 py-2 group focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                            <FiSearch className="text-xl text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                className="w-full p-4 bg-transparent outline-none font-bold text-slate-900 placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex items-center bg-slate-50 rounded-2xl px-5 py-2 group focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                            <FiFilter className="text-xl text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <select
                                className="bg-transparent p-4 outline-none font-bold text-slate-900 appearance-none min-w-[180px]"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">{t('allCategories')}</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4 -mt-10 relative z-20 max-w-7xl">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="bg-white rounded-[2rem] p-6 h-96 shadow-sm border border-slate-100 animate-shimmer"></div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-20 text-center shadow-xl border border-slate-100 animate-fadeIn">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <FiPackage className="text-5xl text-slate-300" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-4">{t('noProducts')}</h3>
                        <p className="text-slate-500 text-lg max-w-md mx-auto">{t('noProductsSub')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product, index) => (
                            <div 
                                key={product.id} 
                                className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 transition-all duration-500 group animate-slideInUp h-full flex flex-col"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="h-64 bg-slate-100 relative overflow-hidden">
                                    {product.images?.length > 0 ? (
                                        <Image 
                                            src={product.images[0]} 
                                            alt={product.name} 
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <FiPackage className="text-6xl opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-lg border border-white/50">
                                            {t(`categories.${product.category}`)}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl">
                                        <span className="text-white font-black text-xl flex items-center">
                                            <span className="text-xs mr-0.5 text-blue-400">€</span>
                                            {product.price}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden relative">
                                            {product.seller.avatar ? (
                                                <Image src={product.seller.avatar} alt={product.seller.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-[10px] font-black text-blue-600">
                                                    {product.seller.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs font-bold text-slate-500">{product.seller.name}</span>
                                    </div>
                                    
                                    <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-slate-500 font-medium text-xs line-clamp-2 mb-6 flex-1">
                                        {product.description}
                                    </p>

                                    <button 
                                        onClick={() => handleBuy(product.id)}
                                        className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-black transition-all shadow-lg flex items-center justify-center gap-2 group/btn"
                                    >
                                        <FiShoppingBag className="text-lg group-hover/btn:scale-110 transition-transform" />
                                        {t('buyNow')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="container mx-auto px-4 mt-20 max-w-7xl">
                <div className="bg-slate-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <FiPackage className="text-5xl text-blue-400 mx-auto mb-6" />
                        <h2 className="text-3xl font-black mb-4">{t('commissionNote')}</h2>
                        <p className="text-slate-400 font-medium">
                            Platforma jonë siguron çdo transaksion. Fondet mbahen të sigurta derisa blerësi të marrë produktin.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
