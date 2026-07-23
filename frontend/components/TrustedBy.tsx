'use client';

import React from "react";
import { useTranslations } from "next-intl";

export default function TrustedBy() {
  const t = useTranslations('trustedBy');

  const partners = [
    "Albgaz",
    "Vodafone",
    "Balfin Group",
    "Tirana Bank",
    "BKT",
    "Albtelecom"
  ];

  return (
    <div className="py-20 border-y border-slate-100 bg-white shadow-sm relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <h3 className="text-center text-slate-400 font-black uppercase tracking-[0.4em] text-xs mb-12">
          {t('title')}
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-50 hover:opacity-80 transition-all duration-700">
          {partners.map((name, index) => (
            <div key={index} className="h-10 md:h-12 w-32 md:w-40 flex items-center justify-center group">
              <span className="text-slate-500 font-black text-sm tracking-wider uppercase group-hover:text-blue-600 transition-colors">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-20 hidden md:block"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-20 hidden md:block"></div>
    </div>
  );
}
