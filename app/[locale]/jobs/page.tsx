"use client";

import { useState } from "react";
import Link from "next/link";
import { FiArrowLeft, FiPlus } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import JobList from "@/components/JobList";

export default function JobsPage() {
    const { data: session } = useSession();
    const t = useTranslations('jobList');
    const [activeTab, setActiveTab] = useState<'available' | 'my-works' | 'my-requests'>('available');

    const role = session?.user?.role;

    return (
        <div className="min-h-screen mesh-gradient-bg relative overflow-hidden selection:bg-blue-100 selection:text-blue-900">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none -mt-40 -mr-40 animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none -mb-40 -ml-40 animate-pulse-slow [animation-delay:2s]"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative z-10">
                <div className="mb-10 md:mb-14">
                    <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 font-black transition-all group px-4 py-2 glass rounded-xl border border-blue-200/60 shadow-sm">
                        <FiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-base">Kthehu në Dashboard</span>
                    </Link>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                                {activeTab === 'available' ? t('availableJobs') :
                                    activeTab === 'my-works' ? t('myWorks') : t('myRequests')}
                            </h1>
                            <p className="text-slate-600 mt-3 text-lg font-semibold">
                                {activeTab === 'available' ? t('availableJobsDesc') :
                                    activeTab === 'my-works' ? t('myWorksDesc') : t('myRequestsDesc')}
                            </p>
                        </div>

                        <Link 
                            href="/requests/create" 
                            className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-8 py-4 rounded-2xl font-black flex items-center shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all"
                        >
                            <FiPlus className="mr-2 text-2xl" />
                            {t('postFirstRequest')}
                        </Link>
                    </div>

                    {/* Tabs */}
                    <div className="flex glass-card rounded-[2rem] p-2 shadow-2xl border border-white/80 mt-10 max-w-fit">
                        <button
                            onClick={() => setActiveTab('available')}
                            className={`px-8 py-3.5 rounded-[1.5rem] font-black text-sm transition-all ${activeTab === 'available' 
                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                                : 'text-slate-600 hover:text-blue-600 hover:bg-white/60'}`}
                        >
                            {t('availableJobsTab')}
                        </button>
                        
                        {role === 'PROVIDER' && (
                            <button
                                onClick={() => setActiveTab('my-works')}
                                className={`px-8 py-3.5 rounded-[1.5rem] font-black text-sm transition-all ${activeTab === 'my-works' 
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                                    : 'text-slate-600 hover:text-blue-600 hover:bg-white/60'}`}
                            >
                                {t('myWorksTab')}
                            </button>
                        )}

                        <button
                            onClick={() => setActiveTab('my-requests')}
                            className={`px-8 py-3.5 rounded-[1.5rem] font-black text-sm transition-all ${activeTab === 'my-requests' 
                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                                : 'text-slate-600 hover:text-blue-600 hover:bg-white/60'}`}
                        >
                            {t('myRequestsTab')}
                        </button>
                    </div>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <JobList mode={activeTab} />
                </div>
            </div>
        </div>
    );
}
