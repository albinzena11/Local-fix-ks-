'use client';

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { FiSend, FiUser, FiPhone, FiTag, FiMapPin, FiInfo, FiDollarSign, FiLock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useRouter, Link } from "@/i18n/routing";

export default function JobForm() {
    const t = useTranslations('jobForm');
    const tServices = useTranslations('jobForm.services');
    const { data: session, status } = useSession();
    const router = useRouter();

    const serviceKeys = [
        "electrical", "plumbing", "cleaning", "assembly", "it", 
        "painting", "construction", "transport", "photography", "care", "other"
    ];
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!session) {
            setErrorMessage("Ju lutemi kyçuni në llogari (Login) për të publikuar kërkesë punë.");
            router.push("/login?callbackUrl=/requests/create");
            return;
        }

        setIsSaving(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (!data.phone || String(data.phone).trim().length < 6) {
            setErrorMessage("Kërkohet një numër telefoni i vlefshëm për të verifikuar kërkesën tuaj.");
            setIsSaving(false);
            return;
        }

        try {
            const res = await fetch("/api/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (res.ok) {
                router.push(`/jobs/${result.id}`);
            } else {
                setErrorMessage(result.error || "Nuk u arrit të publikohet kërkesa. Ju lutemi provoni përsëri.");
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Pati një gabim gjatë lidhjes me serverin.");
        } finally {
            setIsSaving(false);
        }
    };

    // If not logged in, render an attractive Login Required Card
    if (status === 'unauthenticated' || !session) {
        return (
            <div className="glass-card rounded-[3.5rem] p-12 md:p-16 text-center border border-slate-200/80 shadow-2xl max-w-3xl mx-auto">
                <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <FiLock className="text-4xl text-emerald-600" />
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black uppercase tracking-widest mb-4">
                    <FiAlertCircle /> Kyçja Kërkohet
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                    Postimi i Kërkesave Kërkon Llogari
                </h2>
                <p className="text-slate-600 text-lg font-semibold mb-10 leading-relaxed max-w-xl mx-auto">
                    Për të mbrojtur përdoruesit tanë, vetëm anëtarët e identifikuar me email ose telefon të verifikuar mund të publikojnë kërkesa.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/login?callbackUrl=/requests/create"
                        className="px-10 py-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 text-white font-black text-lg shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all"
                    >
                        Hyr në Llogari (Login)
                    </Link>
                    <Link
                        href="/register?callbackUrl=/requests/create"
                        className="px-10 py-5 rounded-2xl bg-white border border-slate-200 text-slate-900 font-black text-lg hover:border-emerald-500/50 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        Krijo Llogari të Re
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-200/80">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-10 md:p-14 text-white relative">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest mb-3 relative z-10">
                    <FiCheckCircle /> Përdorues i Identifikuar: {session.user?.name || session.user?.email}
                </div>
                <h1 className="text-3xl md:text-5xl font-black mb-4 relative z-10 tracking-tight">{t('title')}</h1>
                <p className="text-emerald-100/80 font-semibold text-lg relative z-10">{t('description')}</p>
            </div>

            {errorMessage && (
                <div className="mx-10 mt-8 p-6 bg-red-50 border border-red-200 text-red-700 font-black rounded-2xl flex items-center gap-3">
                    <FiAlertCircle className="text-2xl shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="p-10 md:p-14 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                             <FiUser className="text-emerald-600" /> {t('fullName')}
                        </label>
                        <input name="name" required defaultValue={session.user?.name || ''} placeholder={t('namePlaceholder')} className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-200/80 rounded-[2rem] focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300" />
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                             <FiPhone className="text-emerald-600" /> {t('phone')} (Verifikimi kërkohet)
                        </label>
                        <input name="phone" required placeholder={t('phonePlaceholder')} className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-200/80 rounded-[2rem] focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                             <FiTag className="text-emerald-600" /> {t('jobTitle')}
                        </label>
                        <input name="title" required placeholder={t('jobTitlePlaceholder')} className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-200/80 rounded-[2rem] focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300" />
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                             <FiInfo className="text-emerald-600" /> {t('category')}
                        </label>
                        <select name="category" required className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-200/80 rounded-[2rem] focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer">
                            <option value="">{t('selectCategory')}</option>
                            {serviceKeys.map((key) => (
                                <option key={key} value={key}>{tServices(key)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                         <FiInfo className="text-emerald-600" /> {t('detailedDescription')}
                    </label>
                    <textarea name="description" required rows={5} placeholder={t('descriptionPlaceholder')} className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-200/80 rounded-[2.5rem] focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 resize-none"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                             <FiMapPin className="text-emerald-600" /> {t('location')}
                        </label>
                        <input name="location" required placeholder={t('locationPlaceholder')} className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-200/80 rounded-[2rem] focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300" />
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                             <FiDollarSign className="text-emerald-600" /> {t('estimatedBudget')}
                        </label>
                        <div className="relative">
                            <input type="number" name="budget" placeholder="0" className="w-full pl-14 pr-8 py-5 bg-slate-50 border-2 border-slate-200/80 rounded-[2rem] focus:bg-white focus:border-emerald-600 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300" />
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black">{t('budgetCurrency')}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <button 
                        type="submit" 
                        disabled={isSaving}
                        className="w-full py-6 bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                        {isSaving ? t('submitting') : (
                            <>
                                {t('submit')} <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </>
                        )}
                    </button>
                    <p className="text-center mt-6 text-slate-400 font-bold text-sm tracking-tight">{t('contactNote')}</p>
                </div>
            </form>
        </div>
    );
}
