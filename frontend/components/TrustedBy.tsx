'use client';

import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function TrustedBy() {
  const t = useTranslations('trustedBy');

  // These would ideally be real partner logos
  const partners = [
    { name: "Albgaz", logo: "https://via.placeholder.com/150x50/F8FAFC/64748B?text=ALBGAZ" },
    { name: "Vodafone Albania", logo: "https://via.placeholder.com/150x50/F8FAFC/64748B?text=VODAFONE" },
    { name: "Balfin Group", logo: "https://via.placeholder.com/150x50/F8FAFC/64748B?text=BALFIN+GROUP" },
    { name: "Tirana Bank", logo: "https://via.placeholder.com/150x50/F8FAFC/64748B?text=TIRANA+BANK" },
    { name: "BKT", logo: "https://via.placeholder.com/150x50/F8FAFC/64748B?text=BKT" },
    { name: "Albtelecom", logo: "https://via.placeholder.com/150x50/F8FAFC/64748B?text=ALBTELECOM" }
  ];

  return (
    <div className="py-20 border-y border-slate-100 bg-white shadow-sm relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <h3 className="text-center text-slate-400 font-black uppercase tracking-[0.4em] text-xs mb-12">
            {t('title')}
        </h3>
        
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
          {partners.map((partner, index) => (
            <div key={index} className="h-10 md:h-12 w-32 md:w-40 relative group">
                <Image 
                    src={partner.logo} 
                    alt={partner.name} 
                    fill
                    className="object-contain filter group-hover:drop-shadow-lg transition-transform hover:scale-110" 
                />
            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative side fades for carousel-like look */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-20 hidden md:block"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-20 hidden md:block"></div>
    </div>
  );
};

