'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FiArrowLeft, FiPlus, FiImage, FiPackage, FiTag, FiDollarSign, FiInfo, FiShoppingBag } from "react-icons/fi";
import { Link } from "@/frontend/i18n/routing";

const categories = ["tools", "materials", "equipment", "safety", "other"];

export default function AddProductPage() {
    const t = useTranslations('marketplace');
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [sellerStatus, setSellerStatus] = useState<string>("NONE");
    const [images, setImages] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState("");

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetch("/api/applications/seller")
            .then(res => res.json())
            .then(data => {
                setSellerStatus(data.status);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleApply = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/applications/seller", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: "Dëshira për të shitur vegla" })
            });
            if (res.ok) {
                setSellerStatus("PENDING");
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            description: formData.get("description"),
            price: parseFloat(formData.get("price") as string),
            category: formData.get("category"),
            images: images
        };

        try {
            const res = await fetch("/api/marketplace/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                alert(t('success'));
                router.push("/marketplace");
            } else {
                const err = await res.json();
                alert(err.error || t('error'));
            }
        } catch (error) {
            alert(t('error'));
        } finally {
            setLoading(false);
        }
    };

    const addImage = () => {
        if (imageUrl && !images.includes(imageUrl)) {
            setImages([...images, imageUrl]);
            setImageUrl("");
        }
    };

    const removeImage = (url: string) => {
        setImages(images.filter(img => img !== url));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (sellerStatus !== "APPROVED") {
        return (
            <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center space-y-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <FiShoppingBag className="text-4xl text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 mb-2">{t('sellerApproval.title')}</h1>
                        <p className="text-slate-500 font-medium">
                            {sellerStatus === "PENDING" 
                                ? t('sellerApproval.pending') 
                                : t('sellerApproval.apply')}
                        </p>
                    </div>
                    {sellerStatus === "NONE" && (
                        <button
                            onClick={handleApply}
                            disabled={isSaving}
                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                        >
                            {isSaving ? t('sending') : t('sellerApproval.applyBtn')}
                        </button>
                    )}
                    <Link href="/marketplace" className="block text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors">
                        {t('sellerApproval.goBack')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 pt-16">
            <div className="container mx-auto px-4 max-w-3xl">
                <Link 
                    href="/marketplace" 
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-8 transition-colors group"
                >
                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    Kthehu te Markata
                </Link>

                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                    <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        <h1 className="text-3xl font-black mb-2 relative z-10">{t('addProduct')}</h1>
                        <p className="text-slate-400 font-medium relative z-10">Plotësoni detajet e produktit tuaj për ta listuar në markatë.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-8">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                        <FiPackage className="text-blue-600" />
                                        {t('productName')}
                                    </label>
                                    <input
                                        required
                                        name="name"
                                        type="text"
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold"
                                        placeholder="p.sh. Trapan Bosch Professional"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                        <FiDollarSign className="text-blue-600" />
                                        {t('productPrice')}
                                    </label>
                                    <input
                                        required
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                    <FiTag className="text-blue-600" />
                                    {t('productCategory')}
                                </label>
                                <select
                                    required
                                    name="category"
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold appearance-none cursor-pointer"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                    <FiInfo className="text-blue-600" />
                                    {t('productDescription')}
                                </label>
                                <textarea
                                    required
                                    name="description"
                                    rows={4}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold resize-none"
                                    placeholder="Jepni një përshkrim të detajuar për produktin..."
                                ></textarea>
                            </div>
                        </div>

                        {/* Images Section */}
                        <div className="space-y-4">
                            <label className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                <FiImage className="text-blue-600" />
                                {t('productImages')}
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold"
                                    placeholder="URL e imazhit (p.sh. https://...)"
                                />
                                <button
                                    type="button"
                                    onClick={addImage}
                                    className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                                >
                                    <FiPlus className="text-2xl" />
                                </button>
                            </div>

                            {images.length > 0 && (
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    {images.map((url, i) => (
                                        <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 group">
                                            <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(url)}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Info Note */}
                        <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex gap-4">
                            <FiInfo className="text-blue-600 text-2xl flex-shrink-0 mt-1" />
                            <p className="text-sm text-blue-800 font-medium">
                                {t('commissionNote')} Fondet do të kreditohen në llogarinë tuaj pasi blerësi të konfirmojë marrjen e produktit.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 rounded-[2rem] font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-3 ${
                                loading 
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                                : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02] active:scale-95 shadow-blue-200"
                            }`}
                        >
                            {loading ? t('saving') : t('addProduct')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
