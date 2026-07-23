'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiStar, FiCheckCircle, FiMapPin, FiShield, FiArrowRight } from "react-icons/fi";

export default function FeaturedProviders() {
  const topProviders = [
    {
      id: "p1",
      name: "Agim Hoxha",
      category: "Elektricist Pro",
      rating: 4.9,
      reviewsCount: 128,
      location: "Tiranë",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
      badge: "Verifikuar",
      jobsCompleted: 142
    },
    {
      id: "p2",
      name: "Krenar Rama",
      category: "Hidraulik & Instalime",
      rating: 5.0,
      reviewsCount: 96,
      location: "Durrës",
      image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80",
      badge: "Top Rated",
      jobsCompleted: 110
    },
    {
      id: "p3",
      name: "Besa Shehu",
      category: "Pastrime & Sanitim",
      rating: 4.9,
      reviewsCount: 215,
      location: "Vlorë",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
      badge: "Verifikuar",
      jobsCompleted: 230
    }
  ];

  return (
    <section className="py-28 mesh-gradient-bg relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-black uppercase tracking-widest mb-4">
              <FiShield className="text-emerald-600 text-sm" />
              Profesionistë të Verifikuar
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Mjeshtrit Më të Vlerësuar
            </h2>
            <p className="text-slate-600 text-lg font-semibold mt-3 max-w-xl">
              Ekspertë të licencuar dhe të verifikuar gati për t&apos;ju ndihmuar menjëherë.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 font-extrabold shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all self-start md:self-auto"
          >
            Të Gjithë Mjeshtrit
            <FiArrowRight className="text-emerald-600" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topProviders.map((provider) => (
            <div key={provider.id} className="group glass-card rounded-[2.5rem] overflow-hidden border border-slate-200/80 hover-lift relative">
              <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                <Image
                  src={provider.image}
                  alt={provider.name}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                  <FiCheckCircle className="text-sm" />
                  {provider.badge}
                </div>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {provider.name}
                    </h3>
                    <p className="text-emerald-600 font-black text-xs uppercase tracking-wider mt-1">
                      {provider.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-xl text-amber-700 font-black text-sm">
                    <FiStar className="fill-amber-400 text-amber-400" />
                    {provider.rating}
                  </div>
                </div>

                <div className="flex items-center justify-between text-slate-500 font-semibold text-sm pt-6 border-t border-slate-200/80 mt-6">
                  <span className="flex items-center gap-1">
                    <FiMapPin className="text-emerald-600" />
                    {provider.location}
                  </span>
                  <span>{provider.jobsCompleted} Punë të përfunduara</span>
                </div>

                <Link
                  href={`/services`}
                  className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 text-white font-black text-center block shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Kërko Ofertë
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
