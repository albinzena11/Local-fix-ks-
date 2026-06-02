'use client';

import React from 'react';
import { Link } from "@/i18n/routing";
import { FiTool } from "react-icons/fi";
import { useTranslations } from "next-intl";

export default function Logo() {
    const t = useTranslations('footer');
    
    return (
        <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-transform">
                <FiTool className="text-white text-xl md:text-2xl" />
            </div>
            <div className="flex flex-col text-left">
                <span className="font-black text-xl md:text-2xl tracking-tighter leading-none text-slate-900">
                    Local<span className="text-blue-600">FIX</span>
                </span>
                <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 group-hover:text-blue-500 transition-colors">
                    {t('tagline')}
                </span>
            </div>
        </Link>
    );
}
