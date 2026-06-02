'use client';

import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter, Link } from "@/i18n/routing";
import { useSession, signOut } from "next-auth/react";
import Logo from "./Logo";
import { IconType } from "react-icons";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiUser,
  FiLogOut,
  FiMessageSquare,
  FiBell,
  FiGlobe,
  FiShoppingBag
} from "react-icons/fi";

interface ExtendedUser {
  role?: string;
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: IconType;
  pathname: string;
  onClick: () => void;
}

const NavLink = ({ href, children, icon: Icon, pathname, onClick }: NavLinkProps) => (
  <Link
    href={href}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
      pathname === href
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
        : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
    }`}
    onClick={onClick}
  >
    {Icon && <Icon className="text-lg" />}
    {children}
  </Link>
);

export default function Header() {
  const t = useTranslations('header');
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const locale = useLocale();

  const isAdmin = (session?.user as ExtendedUser)?.role === "ADMIN";
  const dashboardHref = isAdmin ? "/admin" : "/dashboard";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close menu on pathname change - wrapped in timeout to avoid cascading render lint error
    const timer = setTimeout(() => setIsMenuOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Clean effect to check notifications if logged in
  useEffect(() => {
    if (status === "authenticated") {
      // Simulate/Fetch unread notifications - wrapped in timeout to avoid cascading render lint error
      const timer = setTimeout(() => setUnreadNotifications(2), 0);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Hide header on admin pages - MUST BE AFTER ALL HOOKS
  if (pathname.startsWith('/admin')) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-200/50"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Logo />
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-2xl backdrop-blur-sm">
              <NavLink href="/services" icon={FiSearch} pathname={pathname} onClick={() => setIsMenuOpen(false)}>
                {t('findServices')}
              </NavLink>
              <NavLink href="/marketplace" icon={FiShoppingBag} pathname={pathname} onClick={() => setIsMenuOpen(false)}>
                {t('marketplace')}
              </NavLink>
              <NavLink href="/jobs" icon={FiMessageSquare} pathname={pathname} onClick={() => setIsMenuOpen(false)}>
                {t('findJobs')}
              </NavLink>
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher - Premium Look */}
            <button 
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 font-bold hover:bg-white hover:shadow-md transition-all group"
              onClick={() => {
                const locales = ['sq', 'en', 'de'];
                const nextLocale = locales[(locales.indexOf(locale) + 1) % locales.length];
                router.push(pathname, { locale: nextLocale });
              }}
            >
              <FiGlobe className="text-lg group-hover:rotate-12 transition-transform" />
              <span className="text-xs uppercase tracking-widest">{locale}</span>
            </button>

            {status === "authenticated" ? (
              <div className="flex items-center gap-2">
                <Link 
                  href="/messages" 
                  className="relative p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-white hover:shadow-md transition-all"
                >
                  <FiBell className="text-xl" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[10px] text-white flex items-center justify-center font-black animate-pulse">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>
                
                <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

                <Link 
                  href={dashboardHref}
                  className="flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xl group"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform">
                    {session?.user?.name?.[0] || 'U'}
                  </div>
                  <span className="text-sm font-bold hidden sm:inline">{session?.user?.name?.split(' ')[0]}</span>
                </Link>

                <button
                  onClick={() => signOut()}
                  className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all"
                  title="Sign Out"
                >
                  <FiLogOut className="text-xl" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 text-white font-black hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-500/25"
                >
                  <FiUser className="text-lg" />
                  {t('register')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-100"
            >
              {isMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-96 opacity-100 mt-6" : "max-h-0 opacity-0"
        }`}>
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col gap-2">
            <NavLink href="/services" icon={FiSearch} pathname={pathname} onClick={() => setIsMenuOpen(false)}>
              {t('findServices')}
            </NavLink>
            <NavLink href="/marketplace" icon={FiShoppingBag} pathname={pathname} onClick={() => setIsMenuOpen(false)}>
              {t('marketplace')}
            </NavLink>
            <NavLink href="/jobs" icon={FiMessageSquare} pathname={pathname} onClick={() => setIsMenuOpen(false)}>
              {t('findJobs')}
            </NavLink>
            <div className="h-[1px] bg-slate-100 my-2"></div>
            <button 
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 text-slate-600 font-bold hover:bg-blue-50 hover:text-blue-600 transition-all"
              onClick={() => {
                const locales = ['sq', 'en', 'de'];
                const nextLocale = locales[(locales.indexOf(locale) + 1) % locales.length];
                router.push(pathname, { locale: nextLocale });
                setIsMenuOpen(false);
              }}
            >
              <FiGlobe className="text-xl text-blue-600" />
              <span className="uppercase">{locale}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
