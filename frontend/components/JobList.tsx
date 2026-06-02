'use client';

import React from "react";
import { useTranslations } from "next-intl";
import { FiClock, FiMapPin, FiArrowRight, FiCheckCircle, FiShield, FiTrendingUp, FiStar } from "react-icons/fi";
import { Link } from "@/i18n/routing";

interface JobListProps {
    mode?: 'my-requests' | 'my-works' | 'available';
}

const JobList: React.FC<JobListProps> = ({ mode = 'available' }) => {
  const t = useTranslations('jobList');
  console.log('Rendering JobList in mode:', mode);

  const mockJobs = [
    {
      id: "1",
      title: "Apartment Cleaning",
      category: "Cleaning",
      location: "Tirana, Center",
      date: "Today",
      budget: "40€",
      status: "OPEN"
    },
    {
      id: "2",
      title: "Broken AC Unit Repair",
      category: "Electrical",
      location: "Durrës",
      date: "2 hours ago",
      budget: "60€",
      status: "OPEN"
    },
    {
      id: "3",
      title: "Garden Maintenance",
      category: "Care",
      location: "Vlorë",
      date: "Yesterday",
      budget: "30€+",
      status: "OPEN"
    }
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-xl">
           <div className="text-blue-600 font-black uppercase tracking-[0.3em] text-sm mb-4">{t('latestOpportunities')}</div>
           <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{t('activeRequests')}</h2>
        </div>
        <Link href="/services" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg hover:bg-black transition-all flex items-center gap-2 group">
            {t('viewDetails')} <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {mockJobs.map((job) => (
          <div key={job.id} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-3xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                    {job.category === 'Cleaning' ? '🧹' : job.category === 'Electrical' ? '⚡' : '🌳'}
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{job.title}</h3>
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-slate-400 font-bold text-sm">
                        <span className="flex items-center gap-1.5"><FiMapPin className="text-blue-500" /> {job.location}</span>
                        <span className="flex items-center gap-1.5"><FiClock className="text-blue-500" /> {job.date}</span>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-3">
                    <div className="text-2xl font-black text-slate-900">{job.budget}</div>
                    <Link href={`/services?id=${job.id}`} className="px-6 py-2.5 bg-blue-50 text-blue-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                        {t('viewDetails')}
                    </Link>
                </div>
          </div>
        ))}
      </div>

      {/* Provider Promo Section */}
      <div className="mt-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -ml-64 -mb-64"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8 border border-white/20">
                         <FiTrendingUp /> {t('areYouProvider')}
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tighter">
                        {t('providerPromo')}
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                        <div className="flex items-center gap-3 text-lg font-bold">
                            <FiCheckCircle className="text-blue-300 flex-shrink-0" /> {t('guaranteedClients')}
                        </div>
                        <div className="flex items-center gap-3 text-lg font-bold">
                            <FiShield className="text-blue-300 flex-shrink-0" /> {t('securePayment')}
                        </div>
                        <div className="flex items-center gap-3 text-lg font-bold">
                            <FiMapPin className="text-blue-300 flex-shrink-0" /> {t('localJobs')}
                        </div>
                        <div className="flex items-center gap-3 text-lg font-bold">
                            <FiStar className="text-blue-300 flex-shrink-0" /> {t('onlineReputation')}
                        </div>
                    </div>

                    <Link href="/register?role=provider" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-xl hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all shadow-2xl group">
                         {t('registerAsProvider')} <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                <div className="hidden lg:grid grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 h-64 flex flex-col justify-end">
                            <div className="text-4xl mb-4">🏠</div>
                            <div className="font-black text-xl mb-2">{t('homeServices')}</div>
                            <div className="text-white/40 text-sm font-bold">{t('paintingCleaningRepair')}</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 h-48 flex flex-col justify-end">
                            <div className="text-4xl mb-4">💻</div>
                            <div className="font-black text-xl mb-2">{t('itExpert')}</div>
                        </div>
                    </div>
                    <div className="space-y-6 pt-12">
                        <div className="bg-white/10 backdrop-blur-lg rounded-[2.5rem] p-8 border border-white/20 h-56 flex flex-col justify-end transform hover:scale-105 transition-transform">
                            <div className="text-4xl mb-4">🎨</div>
                            <div className="font-black text-xl mb-2">{t('designers')}</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 h-64 flex flex-col justify-end">
                             <div className="text-4xl mb-4">🚛</div>
                            <div className="font-black text-xl mb-2">{t('delivery')}</div>
                        </div>
                    </div>
                </div>
            </div>
      </div>
    </div>
  );
};

export default JobList;
