"use client";

import { Link } from "@/frontend/i18n/routing";
import { FiArrowLeft } from "react-icons/fi";
import JobForm from "@/components/JobForm";
import { useTranslations } from "next-intl";

export default function CreateRequestPage() {
  const t = useTranslations('jobForm');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-slate-500 hover:text-blue-600 font-bold transition-colors uppercase tracking-widest text-xs">
            <FiArrowLeft className="mr-2" /> {t('backToDashboard')}
          </Link>
        </div>
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            {t('description')}
          </p>
        </div>

        <JobForm />
      </div>
    </div>
  );
}