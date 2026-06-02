'use client';

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FiSend, FiUser, FiPhone, FiTag, FiMapPin, FiInfo, FiDollarSign } from "react-icons/fi";

export default function JobForm() {
    const t = useTranslations('jobForm');
    const tServices = useTranslations('jobForm.services');
    const serviceKeys = Object.keys(tServices.raw('') || {});
    const [isSaving, setIsSaving] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch("/api/jobs", {
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
            <div className="p-12 text-center bg-white rounded-[3rem] shadow-2xl border border-green-100">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiSend size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">{t('success')}</h2>
                <button onClick={() => setSubmitted(false)} className="text-blue-600 font-black hover:underline">
                    {t('postAnother')}
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">
            <div className="bg-slate-900 p-10 md:p-14 text-white relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <h1 className="text-3xl md:text-4xl font-black mb-4 relative z-10">{t('title')}</h1>
                <p className="text-slate-400 font-medium text-lg relative z-10">{t('description')}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-10 md:p-14 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                             <FiUser className="text-blue-600" /> {t('fullName')}
                        </label>
                        <input name="name" required placeholder={t('namePlaceholder')} className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-[2rem] focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300" />
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                             <FiPhone className="text-blue-600" /> {t('phone')}
                        </label>
                        <input name="phone" required placeholder={t('phonePlaceholder')} className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-[2rem] focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                             <FiTag className="text-blue-600" /> {t('jobTitle')}
                        </label>
                        <input name="title" required placeholder={t('jobTitlePlaceholder')} className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-[2rem] focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300" />
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                             <FiInfo className="text-blue-600" /> {t('category')}
                        </label>
                        <select name="category" required className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-[2rem] focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer">
                            <option value="">{t('selectCategory')}</option>
                            {serviceKeys.map((key) => (
                                <option key={key} value={key}>{tServices(key)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                         <FiInfo className="text-blue-600" /> {t('detailedDescription')}
                    </label>
                    <textarea name="description" required rows={5} placeholder={t('descriptionPlaceholder')} className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-50 rounded-[2.5rem] focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 resize-none"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                             <FiMapPin className="text-blue-600" /> {t('location')}
                        </label>
                        <input name="location" required placeholder={t('locationPlaceholder')} className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-[2rem] focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300" />
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                             <FiDollarSign className="text-blue-600" /> {t('estimatedBudget')}
                        </label>
                        <div className="relative">
                            <input type="number" name="budget" placeholder="0" className="w-full pl-14 pr-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-[2rem] focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300" />
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black">{t('budgetCurrency')}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <button 
                        type="submit" 
                        disabled={isSaving}
                        className="w-full py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
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
