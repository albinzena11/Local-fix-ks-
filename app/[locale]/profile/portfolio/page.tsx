"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { FiArrowLeft, FiPlus, FiTrash2, FiImage, FiFolder } from "react-icons/fi";
import { useSession } from "next-auth/react";

interface PortfolioItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
}

export default function PortfolioPage() {
    const { data: session } = useSession();
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Form state
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async () => {
        try {
            const res = await fetch("/api/profile/portfolio");
            if (res.ok) {
                setItems(await res.json());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch("/api/profile/portfolio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, imageUrl })
            });

            if (res.ok) {
                setTitle("");
                setDescription("");
                setImageUrl("");
                setIsAdding(false);
                fetchPortfolio();
            } else {
                alert("Ndodhi një gabim gjatë shtimit.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Jeni i sigurt që doni të fshini këtë punim?")) return;
        try {
            const res = await fetch(`/api/profile/portfolio?id=${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setItems(items.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (session?.user?.role !== "PROVIDER") {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
                <FiFolder className="text-6xl text-slate-300 mb-4" />
                <h1 className="text-2xl font-black text-slate-900 mb-2">Vetëm për Profesionistë</h1>
                <p className="text-slate-500 max-w-md">Kjo faqe është vetëm për profesionistët e aprovuar për të shfaqur punimet e tyre të mëparshme.</p>
                <Link href="/profile" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold">Kthehu te Profili</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link href="/profile" className="inline-flex items-center text-slate-500 hover:text-blue-600 font-bold uppercase tracking-widest text-xs transition-colors mb-6">
                        <FiArrowLeft className="mr-2" /> Kthehu te Profili
                    </Link>
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">Portofoli Im</h1>
                            <p className="text-slate-500 font-medium">Shtoni punimet tuaja të mëparshme për t'u treguar klientëve çfarë dini të bëni.</p>
                        </div>
                        {!isAdding && (
                            <button 
                                onClick={() => setIsAdding(true)}
                                className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all"
                            >
                                <FiPlus /> Shto Punim
                            </button>
                        )}
                    </div>
                </div>

                {isAdding && (
                    <form onSubmit={handleSave} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 mb-10 border border-slate-100 animate-in slide-in-from-top-4 duration-300">
                        <h2 className="text-xl font-black text-slate-900 mb-6">Punim i Ri</h2>
                        
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Titulli (p.sh. Rregullim Tualeti)</label>
                                <input
                                    required
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Përshkrimi (Opcionale)</label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <FiImage className="text-blue-500" /> Foto e Punimit (URL)
                                </label>
                                <input
                                    required
                                    type="url"
                                    value={imageUrl}
                                    onChange={e => setImageUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900"
                                />
                                {imageUrl && (
                                    <div className="mt-4 w-32 h-32 rounded-xl overflow-hidden border-2 border-slate-100 relative">
                                        <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
                            <button 
                                type="button" 
                                onClick={() => setIsAdding(false)}
                                className="px-6 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                            >
                                Anulo
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSaving}
                                className="flex-1 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-black transition-all shadow-lg shadow-slate-300 disabled:opacity-50"
                            >
                                {isSaving ? "Duke ruajtur..." : "Ruaj Punimin"}
                            </button>
                        </div>
                    </form>
                )}

                {loading ? (
                    <div className="text-center py-20 text-slate-500 font-bold">Duke u ngarkuar...</div>
                ) : items.length === 0 ? (
                    <div className="bg-white rounded-[2rem] p-16 text-center shadow-sm border border-slate-100">
                        <FiImage className="text-6xl text-slate-200 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-slate-900 mb-2">Asnjë punim në portofol</h3>
                        <p className="text-slate-500 mb-6">Nuk keni shtuar asnjë foto të punëve tuaja të mëparshme. Klikoni butonin më poshtë për të shtuar.</p>
                        <button 
                            onClick={() => setIsAdding(true)}
                            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200"
                        >
                            Shto të parën
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map(item => (
                            <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 group hover:shadow-xl transition-all">
                                <div className="h-48 relative bg-slate-100">
                                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <button 
                                        onClick={() => handleDelete(item.id)}
                                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-black text-lg text-slate-900 mb-2">{item.title}</h3>
                                    {item.description && (
                                        <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
