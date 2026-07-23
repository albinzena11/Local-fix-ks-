'use client';

import React from "react";
import Image from "next/image";
import { FiEdit3, FiCheckSquare, FiShield } from "react-icons/fi";

export default function HowItWorksVisual() {
  const steps = [
    {
      number: "01",
      icon: <FiEdit3 className="text-2xl text-emerald-600" />,
      title: "Publikoni Kërkesën Tuaj",
      description: "Përshkruani punën që ju nevojitet në më pak se 60 sekonda. Vendosni buxhetin dhe afatin.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
    },
    {
      number: "02",
      icon: <FiCheckSquare className="text-2xl text-emerald-600" />,
      title: "Pranoni Oferta & Krahasoni",
      description: "Merrni oferta të menjëhershme nga mjeshtra të verifikuar me vlerësime dhe çmime transparente.",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80"
    },
    {
      number: "03",
      icon: <FiShield className="text-2xl text-emerald-600" />,
      title: "Puna Kryhet me Garanci",
      description: "Pagesa juaj mbahet e sigurt dhe lirohet te mjeshtri vetëm mbasi të jeni 100% të kënaqur.",
      image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <section className="py-28 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-black uppercase tracking-widest mb-4">
            Proces i Thjeshtë
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Si Funksionon LocalFix?
          </h2>
          <p className="mt-4 text-slate-600 text-lg font-semibold leading-relaxed">
            Nga kërkesa e parë deri te përfundimi i punës, ne sigurohemi që procesi të jetë i shpejtë dhe i mbrojtur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="group glass-card rounded-[2.5rem] p-8 border border-slate-200/80 hover-lift relative flex flex-col justify-between">
              <div>
                <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-8 shadow-inner">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-slate-900/90 text-white font-black text-xs px-3 py-1.5 rounded-xl backdrop-blur-md">
                    Hapi {step.number}
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    {step.title}
                  </h3>
                </div>

                <p className="text-slate-600 font-medium text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
