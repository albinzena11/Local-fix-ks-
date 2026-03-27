'use client';

import { Link } from "@/frontend/i18n/routing";
import {
  FiTool,
  FiHeart,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiArrowRight,
} from "react-icons/fi";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations();

  const footerLinks = [
    {
      title: t('footer.services'),
      links: [
        { name: t('services.electrical'), href: "/services?category=electrical" },
        { name: t('services.plumbing'), href: "/services?category=plumbing" },
        { name: t('services.cleaning'), href: "/services?category=cleaning" },
        { name: t('services.construction'), href: "/services?category=construction" },
        { name: t('services.it'), href: "/services?category=it" },
      ]
    },
    {
      title: t('footer.company'),
      links: [
        { name: t('footer.about'), href: "/about" },
        { name: t('footer.howItWorks'), href: "/how-it-works" },
        { name: t('footer.trustSafety'), href: "/trust-safety" },
        { name: t('footer.blog'), href: "/blog" },
        { name: t('footer.careers'), href: "/careers" },
      ]
    },
    {
      title: t('footer.support'),
      links: [
        { name: t('footer.helpCenter'), href: "/help" },
        { name: t('footer.contact'), href: "/contact" },
        { name: t('footer.faq'), href: "/faq" },
        { name: t('footer.disputes'), href: "/disputes" },
        { name: t('footer.community'), href: "/community" },
      ]
    },
    {
      title: t('footer.legal'),
      links: [
        { name: t('footer.terms'), href: "/terms" },
        { name: t('footer.privacy'), href: "/privacy" },
        { name: t('footer.cookies'), href: "/cookies" },
        { name: t('footer.licenses'), href: "/licenses" },
        { name: t('footer.accessibility'), href: "/accessibility" },
      ]
    }
  ];

  const socialLinks = [
    { icon: <FiFacebook />, href: "https://facebook.com/local-fix", label: "Facebook" },
    { icon: <FiInstagram />, href: "https://instagram.com/local-fix", label: "Instagram" },
    { icon: <FiTwitter />, href: "https://twitter.com/local-fix", label: "Twitter" },
    { icon: <FiLinkedin />, href: "https://linkedin.com/company/local-fix", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-slate-950 text-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] -mr-48 -mb-48"></div>

      <div className="container mx-auto px-4 pt-20 pb-12 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
          {/* Brand & Newsletter Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-8 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-transform">
                <FiTool className="text-white text-2xl" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tighter leading-none">Local<span className="text-blue-500">FIX</span></span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{t('footer.tagline')}</span>
              </div>
            </Link>

            <p className="text-slate-400 font-medium leading-relaxed mb-8 max-w-sm">
              {t('footer.description')}
            </p>

            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-blue-600 rounded-2xl flex items-center justify-center text-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20"
                  aria-label={social.label}
                >
                  <span className="text-xl">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {footerLinks.map((column, index) => (
            <div key={index} className="lg:col-span-1">
              <h3 className="font-black text-sm uppercase tracking-widest mb-8 text-slate-100">{column.title}</h3>
              <ul className="space-y-4">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-all text-sm font-bold flex items-center group"
                    >
                      <FiArrowRight className="mr-2 w-0 group-hover:w-4 opacity-0 group-hover:opacity-100 transition-all text-blue-500" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-slate-900">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-slate-500 text-sm font-bold uppercase tracking-wider">
              <span>© {new Date().getFullYear()} LocalFIX. {t('footer.no1Albania')}</span>
              <div className="hidden md:block h-4 w-px bg-slate-800"></div>
              <div className="flex items-center gap-6">
                 <Link href="/privacy" className="hover:text-blue-500 transition-colors uppercase tracking-widest text-[10px]">Privacy</Link>
                 <Link href="/terms" className="hover:text-blue-500 transition-colors uppercase tracking-widest text-[10px]">Terms</Link>
                 <Link href="/cookies" className="hover:text-blue-500 transition-colors uppercase tracking-widest text-[10px]">Cookies</Link>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-2 bg-slate-900 rounded-full border border-slate-800 text-xs font-black text-slate-400">
              <span>{t('footer.madeWith')}</span>
              <FiHeart className="text-rose-500 animate-pulse" />
              <span>{t('footer.in')}</span>
              <span className="text-white">{t('footer.location')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}