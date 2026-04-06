'use client';

import { useState } from "react";
import { useRouter } from "@/frontend/i18n/routing";
import { useTranslations } from "next-intl";
import { FiArrowLeft, FiCheckCircle, FiTool, FiBriefcase, FiSend } from "react-icons/fi";
import { Link } from "@/frontend/i18n/routing";

export default function ProviderApplyPage() {
    const t = useTranslations('provider');
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            category: formData.get('category'),
            bio: formData.get('bio'),
            experience: formData.get('experience'),
        };

        try {
            const res = await fetch("/api/applications/provider", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                setSubmitted(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <FiCheckCircle className="text-4xl text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 mb-2">{t('success')}</h1>
                        <p className="text-slate-500 font-medium">
                            {t('successDesc')}
                        </p>
                    </div>
                    <Link href="/dashboard" className="block w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                        Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 pt-16">
            <div className="max-w-3xl mx-auto px-4">
                <Link href="/dashboard" className="inline-flex items-center text-slate-400 hover:text-blue-600 font-bold mb-8 transition-colors group">
                    <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
                    {t('category')}
                </Link>

                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
                    <div className="bg-blue-600 p-8 text-white">
                        <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                            <FiTool /> {t('apply')}
                        </h1>
                        <p className="text-blue-100 font-medium opacity-90">{t('applyDesc')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
                        <div>
                            <label className="block text-sm font-black text-slate-700 mb-3 ml-1 uppercase tracking-wider">{t('category')}</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FiBriefcase className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <select 
                                    name="category"
                                    required
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-blue-600 outline-none transition-all font-bold text-slate-700 appearance-none"
                                >
                                    <option value="">{t('category')}</option>
                                    <option value="elektricist">Elektricist</option>
                                    <option value="hidraulik">Hidraulik</option>
                                    <option value="mekanik">Mekanik</option>
                                    <option value="ndertim">Ndërtim</option>
                                    <option value="tjeter">Tjetër</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-black text-slate-700 mb-3 ml-1 uppercase tracking-wider">{t('experience')}</label>
                            <textarea 
                                name="experience"
                                required
                                rows={3}
                                placeholder="..."
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-blue-600 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-400"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-black text-slate-700 mb-3 ml-1 uppercase tracking-wider">{t('bio')}</label>
                            <textarea 
                                name="bio"
                                required
                                rows={5}
                                placeholder="..."
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-blue-600 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-400"
                            ></textarea>
                        </div>

                        <button 
                            type="submit"
                            disabled={isSaving}
                            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 group disabled:opacity-50"
                        >
                            {isSaving ? t('sending') : (
                                <>
                                    {t('submit')} <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
