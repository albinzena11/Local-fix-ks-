'use client';

import React from "react";
import { useTranslations } from "next-intl";
import { FiPlus, FiMinus } from "react-icons/fi";
import { useState } from "react";

const FAQ: React.FC = () => {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') },
  ];

  return (
    <section className="py-28 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px] -mr-48 -mt-48 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px] -ml-48 -mb-48 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <div className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs mb-4 px-4 py-1.5 glass inline-block rounded-full border border-blue-200">{t('badge')}</div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{t('title')}</h2>
          <p className="mt-6 text-lg text-slate-600 font-semibold">{t('subtitle')}</p>
        </div>

        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`group glass-card rounded-[2.5rem] transition-all duration-300 overflow-hidden border ${openIndex === index ? 'border-blue-500/60 shadow-xl shadow-blue-500/10 bg-gradient-to-r from-blue-50/50 to-indigo-50/50' : 'border-white/80 hover:border-slate-300'}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left"
              >
                <span className={`text-lg md:text-xl font-black transition-colors ${openIndex === index ? 'text-blue-600' : 'text-slate-900'}`}>
                  {faq.q}
                </span>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${openIndex === index ? 'bg-blue-600 text-white rotate-180 shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                  {openIndex === index ? <FiMinus className="text-xl" /> : <FiPlus className="text-xl" />}
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-6 md:p-8 pt-0 text-slate-600 font-semibold leading-relaxed text-sm md:text-base border-t border-blue-100/60 mt-2">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-[3.5rem] text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent"></div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <h3 className="text-3xl font-black mb-4 relative z-10">{t('stillHaveQuestions')}</h3>
            <p className="text-blue-100/70 font-semibold mb-8 relative z-10 max-w-md mx-auto text-base">{t('subtitle')}</p>
            <button className="bg-white text-slate-900 px-12 py-4.5 rounded-2xl font-black hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all relative z-10 shadow-2xl">
                {t('contactUs')}
            </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
