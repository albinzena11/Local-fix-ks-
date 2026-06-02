'use client';

import React from "react";
import { useTranslations } from "next-intl";
import { FiStar } from "react-icons/fi";
import { FaQuoteRight } from "react-icons/fa";
import Image from "next/image";

const Testimonials: React.FC = () => {
  const t = useTranslations('testimonials');

  const testimonials = [
    {
      name: "Arben Gashi",
      role: "Home Owner",
      content: "Found a great electrician within minutes. The secure payment system gave me peace of mind throughout the renovation.",
      rating: 5,
      image: "https://i.pravatar.cc/150?u=arben"
    },
    {
      name: "Elena Hoxha",
      role: "Startup Founder",
      content: "As a business owner, LocalFIX helps me find reliable maintenance professionals without wasting hours on phone calls.",
      rating: 5,
      image: "https://i.pravatar.cc/150?u=elena"
    },
    {
      name: "Besnik Krasniqi",
      role: "Real Estate Agent",
      content: "The quality of service is consistently high. I recommend this platform to all my clients moving into new homes.",
      rating: 5,
      image: "https://i.pravatar.cc/150?u=besnik"
    }
  ];

  return (
    <section className="py-24 bg-slate-50/50 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <div className="text-blue-600 font-black uppercase tracking-[0.3em] text-sm mb-4">{t('badge')}</div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">{t('title')}</h2>
          <p className="mt-6 text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div key={index} className="group bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 relative hover:-translate-y-2">
              <div className="absolute top-10 right-10 text-slate-100 group-hover:text-blue-50 transition-colors">
                <FaQuoteRight size={64} />
              </div>
              
              <div className="flex gap-1 mb-8">
                {[...Array(item.rating)].map((_, i) => (
                  <FiStar key={i} className="text-amber-400 fill-amber-400" />
                ))}
              </div>

              <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed mb-10 text-lg relative z-10 italic">
                &quot;{item.content}&quot;
              </p>

              <div className="flex items-center gap-4 relative z-10 pt-8 border-t border-slate-50">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shadow-inner flex-shrink-0">
                  <Image src={item.image} alt={item.name} width={56} height={56} className="object-cover" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg">{item.name}</h4>
                  <p className="text-blue-600 font-black text-xs uppercase tracking-widest">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
