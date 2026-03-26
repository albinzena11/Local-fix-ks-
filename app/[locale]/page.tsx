'use client';

import { Link } from "@/frontend/i18n/routing";
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
  FiArrowUpRight
} from "react-icons/fi";
import TrustedBy from "@/components/TrustedBy";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations();

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

  return (
    <div className="flex flex-col min-h-screen selection:bg-blue-100 selection:text-blue-900">
      <Header />
      
      <main className="flex-grow">
        {/* --- Hero Section --- */}
        <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
          {/* Animated Background Orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-400/10 rounded-full blur-[100px] animate-pulse [animation-delay:1s]"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 max-w-7xl">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-black mb-10 animate-fadeIn uppercase tracking-widest shadow-sm">
                <FiZap className="animate-bounce" />
                {t('hero.badge')}
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9] animate-slideInUp">
                {t('hero.title').split(' ').map((word, i) => (
                  <span key={i} className={i > 2 ? "text-blue-600" : ""}> {word} </span>
                ))}
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-3xl mx-auto font-medium leading-relaxed animate-slideInUp [animation-delay:200ms]">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-24 animate-slideInUp [animation-delay:400ms]">
                <Link
                  href="/requests/create"
                  className="group bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-xl shadow-2xl hover:shadow-blue-500/20 hover:scale-105 transition-all active:scale-95 flex items-center justify-center"
                >
                  <FiSearch className="mr-3 text-2xl group-hover:rotate-12 transition-transform" />
                  <span>{t('header.searchService')}</span>
                </Link>
                <Link
                  href="/register?role=provider"
                  className="group bg-white text-slate-900 border-2 border-slate-100 px-10 py-5 rounded-[2rem] font-black text-xl shadow-xl hover:shadow-slate-200/50 hover:bg-slate-50 hover:scale-105 transition-all active:scale-95 flex items-center justify-center"
                >
                  <FiTool className="mr-3 text-2xl group-hover:-rotate-12 transition-transform" />
                  <span>{t('header.offerService')}</span>
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 w-full max-w-6xl glass rounded-[3rem] p-8 md:p-12 shadow-2xl border border-white/50 animate-slideInUp [animation-delay:600ms]">
                {stats.map((stat, index) => (
                  <div key={index} className={`flex flex-col items-center justify-center px-4 ${index < stats.length - 1 ? 'md:border-r border-slate-200' : ''}`}>
                    <div className="text-3xl md:text-5xl font-black text-slate-900 mb-2 tabular-nums tracking-tighter">{stat.value}</div>
                    <div className="text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest text-center">{stat.label}</div>
                  </div>
                ))}
              </div>
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
                  <div className={`${service.color} p-10 rounded-[3rem] border shadow-sm h-full relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="text-6xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform">{service.icon}</div>
                    <h3 className={`text-2xl font-black mb-4 ${service.textColor}`}>{service.name}</h3>
                    <p className="text-slate-500 font-bold text-sm md:text-base leading-relaxed">{service.description}</p>
                    <div className="mt-8 flex items-center gap-2 font-black text-xs uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                        {t('hero.discoverMore')} <FiArrowUpRight />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section className="py-32 px-4 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-20">
              <div className="text-blue-600 font-black uppercase tracking-[0.3em] text-sm mb-4">{t('hero.whyChooseUs')}</div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                {t('features.title')}
              </h2>
              <p className="text-lg md:text-xl text-slate-500 font-medium max-w-3xl mx-auto">
                {t('features.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="group bg-white rounded-[3rem] p-10 shadow-sm hover:shadow-2xl border border-slate-100 hover-lift transition-all">
                  <div className={`w-16 h-16 rounded-[1.5rem] ${feature.color} text-white flex items-center justify-center mb-8 text-2xl group-hover:rotate-12 transition-transform shadow-xl`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-black text-xl md:text-2xl text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-slate-500 font-bold leading-relaxed text-sm md:text-base">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
                        {t('home.cta.title')}
                    </h2>
                    <p className="text-xl md:text-2xl mb-12 text-blue-100/60 font-medium leading-relaxed">
                        {t('home.cta.subtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-12">
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
                    </div>

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
                </div>
              </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
