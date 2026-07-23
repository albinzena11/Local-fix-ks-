'use client';

import { Link } from "@/i18n/routing";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FiSearch,
  FiShield,
  FiUsers,
  FiCheckCircle,
  FiStar,
  FiClock,
  FiTool,
  FiArrowRight,
  FiZap,
  FiArrowUpRight,
  FiLayout,
  FiBriefcase,
  FiPlusCircle
} from "react-icons/fi";
import TrustedBy from "@/components/TrustedBy";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import FeaturedProviders from "@/components/FeaturedProviders";
import HowItWorksVisual from "@/components/HowItWorksVisual";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations();
  const { data: session, status } = useSession();
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/stats')
        .then(res => res.json())
        .then(data => setUserStats(data))
        .catch(err => console.error("Error fetching stats:", err));
    }
  }, [status]);

  const services = [
    { icon: "🏠", name: t('services.home'), description: t('services.homeDescription'), color: "bg-blue-50 border-blue-100", textColor: "text-blue-700" },
    { icon: "🔧", name: t('services.repair'), description: t('services.repairDescription'), color: "bg-emerald-50 border-emerald-100", textColor: "text-emerald-700" },
    { icon: "🚰", name: t('services.plumbing'), description: t('services.plumbingDescription'), color: "bg-indigo-50 border-indigo-100", textColor: "text-indigo-700" },
    { icon: "🔌", name: t('services.electrical'), description: t('services.electricalDescription'), color: "bg-amber-50 border-amber-100", textColor: "text-amber-700" },
    { icon: "💻", name: t('services.it'), description: t('services.itDescription'), color: "bg-violet-50 border-violet-100", textColor: "text-violet-700" },
    { icon: "🧹", name: t('services.cleaning'), description: t('services.cleaningDescription'), color: "bg-rose-50 border-rose-100", textColor: "text-rose-700" },
  ];

  const features = [
    {
      icon: <FiShield />,
      title: t('features.securePayment'),
      description: t('features.securePaymentDescription'),
      color: "bg-blue-600 shadow-blue-500/20"
    },
    {
      icon: <FiUsers />,
      title: t('features.verifiedProviders'),
      description: t('features.verifiedProvidersDescription'),
      color: "bg-emerald-600 shadow-emerald-500/20"
    },
    {
      icon: <FiCheckCircle />,
      title: t('features.satisfactionGuarantee'),
      description: t('features.satisfactionGuaranteeDescription'),
      color: "bg-indigo-600 shadow-indigo-500/20"
    },
    {
      icon: <FiStar />,
      title: t('features.realReviews'),
      description: t('features.realReviewsDescription'),
      color: "bg-amber-500 shadow-amber-500/20"
    },
    {
      icon: <FiClock />,
      title: t('features.support247'),
      description: t('features.support247Description'),
      color: "bg-rose-600 shadow-rose-500/20"
    },
    {
      icon: <FiZap />,
      title: t('features.competitivePrices'),
      description: t('features.competitivePricesDescription'),
      color: "bg-violet-600 shadow-violet-500/20"
    }
  ];

  const stats = [
    { value: "10,000+", label: t('stats.registeredUsers') },
    { value: "5,000+", label: t('stats.completedServices') },
    { value: "4.8/5", label: t('stats.averageRating') },
    { value: "98%", label: t('stats.satisfiedClients') },
  ];

  const isProvider = session?.user?.role === "PROVIDER";

  return (
    <div className="flex flex-col min-h-screen selection:bg-emerald-100 selection:text-emerald-900">
      <main className="flex-grow">
        {/* --- Hero Section --- */}
        <section className="relative pt-24 pb-32 md:pt-36 md:pb-48 overflow-hidden mesh-gradient-bg border-b border-slate-200/60">
          {/* Animated Glowing Orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none overflow-hidden">
            <div className="absolute top-[-5%] right-[-5%] w-[650px] h-[650px] bg-emerald-500/10 rounded-full blur-[160px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[650px] h-[650px] bg-teal-500/10 rounded-full blur-[160px] animate-pulse-slow [animation-delay:2s]"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 max-w-7xl">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-black mb-10 uppercase tracking-widest shadow-sm hover:scale-105 transition-transform cursor-pointer">
                <FiZap className="animate-pulse text-emerald-600 text-sm" />
                {status === 'authenticated' ? `${t('hero.welcomeBack')}, ${session?.user?.name?.split(' ')[0]}` : t('hero.badge')}
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.95] animate-slideInUp max-w-5xl">
                {t('hero.title').split(' ').map((word: string, i: number) => (
                  <span key={i} className={i > 2 ? "text-gradient-accent" : ""}> {word} </span>
                ))}
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto font-semibold leading-relaxed animate-slideInUp [animation-delay:200ms]">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center mb-20 animate-slideInUp [animation-delay:400ms]">
                {status === 'authenticated' ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="group bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                    >
                      <FiLayout className="mr-3 text-2xl group-hover:rotate-12 transition-transform" />
                      <span>{t('header.dashboard')}</span>
                    </Link>
                    <Link
                      href={isProvider ? "/jobs" : "/requests/create"}
                      className="group glass text-slate-800 border border-slate-200 px-10 py-5 rounded-[2rem] font-black text-xl hover:border-emerald-500/50 hover:bg-white hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-sm"
                    >
                      {isProvider ? (
                        <>
                          <FiBriefcase className="mr-3 text-2xl group-hover:-rotate-12 transition-transform" />
                          <span>{t('header.findJobs')}</span>
                        </>
                      ) : (
                        <>
                          <FiPlusCircle className="mr-3 text-2xl group-hover:-rotate-12 transition-transform" />
                          <span>{t('header.searchService')}</span>
                        </>
                      )}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/requests/create"
                      className="group bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                    >
                      <FiSearch className="mr-3 text-2xl group-hover:rotate-12 transition-transform" />
                      <span>{t('header.searchService')}</span>
                    </Link>
                    <Link
                      href="/register?role=provider"
                      className="group glass text-slate-800 border border-slate-200 px-10 py-5 rounded-[2rem] font-black text-xl hover:border-emerald-500/50 hover:bg-white hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-sm"
                    >
                      <FiTool className="mr-3 text-2xl group-hover:-rotate-12 transition-transform" />
                      <span>{t('header.offerService')}</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Stats Bar / User Dashboard Mini-Widget if logged in */}
              {status === 'authenticated' && userStats ? (
                <div className="w-full max-w-5xl glass-card rounded-[3rem] p-8 md:p-12 shadow-xl animate-slideInUp [animation-delay:600ms] grid grid-cols-2 md:grid-cols-4 gap-4">
                    {isProvider ? (
                      <>
                        <div className="flex flex-col items-center border-r border-slate-200/80">
                          <span className="text-3xl md:text-5xl font-black text-slate-900 mb-1">{userStats.activeJobs || 0}</span>
                          <span className="text-[10px] md:text-xs font-black text-emerald-600 uppercase tracking-widest">{t('stats.activeJobs')}</span>
                        </div>
                        <div className="flex flex-col items-center border-r border-slate-200/80">
                          <span className="text-3xl md:text-5xl font-black text-slate-900 mb-1">{userStats.completedJobs || 0}</span>
                          <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">{t('stats.completedJobs')}</span>
                        </div>
                        <div className="flex flex-col items-center border-r border-slate-200/80">
                          <span className="text-3xl md:text-5xl font-black text-emerald-600 mb-1">4.9</span>
                          <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">{t('stats.rating')}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-3xl md:text-5xl font-black text-teal-600 mb-1">85%</span>
                          <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">{t('stats.success')}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col items-center border-r border-slate-200/80">
                          <span className="text-3xl md:text-5xl font-black text-slate-900 mb-1">{userStats.activeRequests || 0}</span>
                          <span className="text-[10px] md:text-xs font-black text-emerald-600 uppercase tracking-widest">{t('stats.activeRequests')}</span>
                        </div>
                        <div className="flex flex-col items-center border-r border-slate-200/80">
                          <span className="text-3xl md:text-5xl font-black text-emerald-600 mb-1">{userStats.offersReceived || 0}</span>
                          <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">{t('stats.offersReceived')}</span>
                        </div>
                        <div className="flex flex-col items-center border-r border-slate-200/80">
                          <span className="text-3xl md:text-5xl font-black text-slate-900 mb-1">{userStats.hiredProfessionals || 0}</span>
                          <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">{t('stats.hired')}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-3xl md:text-5xl font-black text-teal-600 mb-1">2</span>
                          <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">{t('stats.messages')}</span>
                        </div>
                      </>
                    )}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 w-full max-w-6xl glass-card rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-200/80 animate-slideInUp [animation-delay:600ms]">
                  {stats.map((stat, index) => (
                    <div key={index} className={`flex flex-col items-center justify-center px-4 ${index < stats.length - 1 ? 'md:border-r border-slate-200/80' : ''}`}>
                      <div className="text-3xl md:text-5xl font-black text-slate-900 mb-2 tabular-nums tracking-tighter">{stat.value}</div>
                      <div className="text-xs md:text-sm font-black text-emerald-600 uppercase tracking-widest text-center">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* --- Trusted By Section --- */}
        <section className="py-20 border-y border-slate-100 bg-white">
           <TrustedBy />
        </section>

        {/* --- Categories Section --- */}
        <section className="py-32 px-4 bg-slate-50/50 relative overflow-hidden">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="max-w-2xl text-center md:text-left">
                <div className="text-blue-600 font-black uppercase tracking-[0.3em] text-sm mb-4">{t('hero.ourServices')}</div>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                  {t('categories.title')}
                </h2>
                <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
                  {t('categories.subtitle')}
                </p>
              </div>
              <Link href="/services" className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100 flex items-center gap-2">
                 {t('hero.seeAllJobs')}
                 <FiArrowRight />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Link key={index} href={`/services?category=${service.name}`} className="group hover-lift">
                  <div className="glass-card p-10 rounded-[2.5rem] h-full relative overflow-hidden border border-white/80 transition-all duration-300">
                    <div className={`absolute top-0 right-0 w-36 h-36 ${service.color} opacity-30 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
                    <div className="text-6xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform">{service.icon}</div>
                    <h3 className={`text-2xl font-black mb-4 ${service.textColor}`}>{service.name}</h3>
                    <p className="text-slate-600 font-semibold text-sm md:text-base leading-relaxed">{service.description}</p>
                    <div className="mt-8 flex items-center gap-2 font-black text-xs uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">
                        {t('hero.discoverMore')} <FiArrowUpRight />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section className="py-32 px-4 mesh-gradient-bg">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-20">
              <div className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs mb-4 px-4 py-1.5 glass inline-block rounded-full border border-blue-200">{t('hero.whyChooseUs')}</div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                {t('features.title')}
              </h2>
              <p className="text-lg md:text-xl text-slate-600 font-semibold max-w-3xl mx-auto">
                {t('features.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="group glass-card rounded-[2.5rem] p-10 hover-lift border border-white/80 transition-all">
                  <div className={`w-16 h-16 rounded-[1.5rem] ${feature.color} text-white flex items-center justify-center mb-8 text-2xl group-hover:rotate-12 transition-transform shadow-xl`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-black text-xl md:text-2xl text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-slate-600 font-semibold leading-relaxed text-sm md:text-base">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- How It Works Section --- */}
        <HowItWorksVisual />

        {/* --- Featured Craftsmen Section --- */}
        <FeaturedProviders />

        {/* --- Testimonials Section --- */}
        <div className="bg-slate-50/50 py-24">
            <Testimonials />
        </div>

        {/* --- FAQ Section --- */}
        <div className="py-24">
            <FAQ />
        </div>

        {/* --- Final CTA Section --- */}
        <section className="relative py-32 px-4 overflow-hidden">
          <div className="container mx-auto max-w-7xl">
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 rounded-[4rem] p-12 md:p-24 text-white shadow-2xl relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>
                
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tighter">
                        {status === 'authenticated' ? t('home.cta.loggedInTitle') : t('home.cta.title')}
                    </h2>
                    <p className="text-xl md:text-2xl mb-12 text-blue-100/60 font-medium leading-relaxed">
                        {status === 'authenticated' ? t('home.cta.loggedInSubtitle') : t('home.cta.subtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-12">
                        {status === 'authenticated' ? (
                          <Link
                            href="/dashboard"
                            className="group bg-white text-slate-900 px-12 py-5 rounded-[2rem] font-black text-xl shadow-2xl hover:bg-blue-50 hover:scale-105 transition-all active:scale-95"
                          >
                            <span className="flex items-center justify-center gap-2">
                                {t('header.dashboard')}
                                <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </span>
                          </Link>
                        ) : (
                          <>
                            <Link
                            href="/register?role=client"
                            className="group bg-white text-slate-900 px-12 py-5 rounded-[2rem] font-black text-xl shadow-2xl hover:bg-blue-50 hover:scale-105 transition-all active:scale-95"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {t('home.cta.registerClient')}
                                    <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                                </span>
                            </Link>
                            <Link
                            href="/register?role=provider"
                            className="group bg-transparent border-2 border-white/20 px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-white/10 hover:border-white hover:scale-105 transition-all active:scale-95 shadow-xl"
                            >
                                <span>{t('home.cta.registerProvider')}</span>
                            </Link>
                          </>
                        )}
                    </div>

                    {!session && (
                      <>
                        <div className="flex items-center justify-center gap-4 text-sm font-bold text-blue-100/40 uppercase tracking-[0.2em]">
                            <div className="h-[1px] w-12 bg-white/20"></div>
                            <span>{t('hero.or')}</span>
                            <div className="h-[1px] w-12 bg-white/20"></div>
                        </div>
                        
                        <p className="mt-8 text-lg font-bold text-blue-100/80">
                            {t('auth.haveAccount')}{' '}
                            <Link href="/login" className="text-white underline hover:no-underline underline-offset-8 decoration-2 decoration-blue-500 transition-all font-black">
                            {t('home.cta.login')}
                            </Link>
                        </p>
                      </>
                    )}
                </div>
              </div>
          </div>
        </section>
      </main>
    </div>
  );
}
