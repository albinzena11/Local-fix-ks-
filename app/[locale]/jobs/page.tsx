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

    const role = (session?.user as { role?: string })?.role;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="mb-8 md:mb-12">
                    <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 font-medium transition-colors group">
                        <FiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-lg">Kthehu në Dashboard</span>
                    </Link>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                                {activeTab === 'available' ? t('availableJobs') :
                                    activeTab === 'my-works' ? t('myWorks') : t('myRequests')}
                            </h1>
                            <p className="text-gray-600 mt-2 text-lg">
                                {activeTab === 'available' ? t('availableJobsDesc') :
                                    activeTab === 'my-works' ? t('myWorksDesc') : t('myRequestsDesc')}
                            </p>
                        </div>

                        <Link 
                            href="/requests/create" 
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        >
                            <FiPlus className="mr-2 text-xl" />
                            {t('postFirstRequest')}
                        </Link>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 mt-10 max-w-fit">
                        <button
                            onClick={() => setActiveTab('available')}
                            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'available' 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                        >
                            {t('availableJobsTab')}
                        </button>
                        
                        {role === 'PROVIDER' && (
                            <button
                                onClick={() => setActiveTab('my-works')}
                                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'my-works' 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                            >
                                {t('myWorksTab')}
                            </button>
                        )}

                        <button
                            onClick={() => setActiveTab('my-requests')}
                            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'my-requests' 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
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
