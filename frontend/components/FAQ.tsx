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
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -mr-48 -mt-48"></div>
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <div className="text-blue-600 font-black uppercase tracking-[0.3em] text-sm mb-4">{t('badge')}</div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{t('title')}</h2>
          <p className="mt-6 text-lg text-slate-500 font-medium">{t('subtitle')}</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`group border-2 rounded-[2rem] transition-all duration-300 ${openIndex === index ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 bg-white hover:border-slate-200'}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left"
              >
                <span className={`text-lg md:text-xl font-black transition-colors ${openIndex === index ? 'text-blue-600' : 'text-slate-900'}`}>
                  {faq.q}
                </span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${openIndex === index ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                  {openIndex === index ? <FiMinus /> : <FiPlus />}
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-6 md:p-8 pt-0 text-slate-500 font-bold leading-relaxed text-sm md:text-base border-t border-blue-100/50 mt-2">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-10 bg-slate-900 rounded-[3rem] text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent"></div>
            <h3 className="text-2xl font-black mb-4 relative z-10">{t('stillHaveQuestions')}</h3>
            <p className="text-blue-100/60 font-medium mb-8 relative z-10 max-w-md mx-auto">{t('subtitle')}</p>
            <button className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all relative z-10 shadow-xl">
                {t('contactUs')}
            </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
