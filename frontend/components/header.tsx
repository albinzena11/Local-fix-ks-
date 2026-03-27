"use client";

import { useState, useEffect } from "react";
import { Link, usePathname, useRouter } from "@/frontend/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import {
  FiMenu,
  FiX,
  FiTool,
  FiSearch,
  FiUser,
  FiLogOut,
  FiMessageSquare,
  FiBell,
  FiGlobe,
  FiShoppingBag
} from "react-icons/fi";

export default function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('header');
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const dashboardHref = isAdmin ? "/admin" : "/dashboard";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Clean effect to check notifications if logged in
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/notifications").then(res => res.json()).then(data => {
        if (Array.isArray(data)) {
          setUnreadNotifications(data.filter((n: { read: boolean }) => !n.read).length);
        }
      }).catch(e => console.error(e));
    }
  }, [status, pathname]); // Re-check on nav change

  const isActive = (path: string) => {
    // Check if pathname starts with path (account for locale prefix logic handled by usePathname?)
    // next-intl usePathname returns path WITHOUT locale prefix.
    return pathname === path;
  };

  const toggleLanguage = () => {
    const locales = ['sq', 'en', 'de'];
    const currentIndex = locales.indexOf(locale);
    const nextLocale = locales[(currentIndex + 1) % locales.length];
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-sm'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <FiTool className="text-white text-xl" />
            </div>
            <div>
              <span className="font-extrabold text-2xl text-gray-900 tracking-tight">Local</span>
              <span className="font-extrabold text-2xl text-blue-600 tracking-tight">FIX</span>
              <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mt-1"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-all"
            >
              <FiGlobe className="text-lg" />
              <span className="uppercase">{locale}</span>
            </button>

            <Link
              href="/services"
              className={`ml-4 flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium transition-all ${isActive('/services')
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}
            >
              <FiSearch className="text-lg" />
              <span>{t('searchService')}</span>
            </Link>

            <Link
              href="/marketplace"
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium transition-all ${isActive('/marketplace')
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}
            >
              <FiShoppingBag className="text-lg" />
              <span>{t('marketplace')}</span>
            </Link>

            {status === "authenticated" ? (
              <>
                <Link
                  href="/messages"
                  className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl font-medium transition-all ${isActive('/messages') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}
                >
                  <FiMessageSquare className="text-xl" />
                </Link>

                <Link
                  href="/dashboard" // Or opens a dropdown
                  className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl font-medium transition-all text-gray-700 hover:text-blue-600 hover:bg-blue-50 relative`}
                >
                  <FiBell className="text-xl" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </Link>

                <div className="flex items-center space-x-4 ml-4">
                  <Link href={dashboardHref} className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium">
                    {session.user?.image ? (
                      <Image src={session.user.image} alt="Profile" width={32} height={32} className="rounded-full" />
                    ) : (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {session.user?.name?.charAt(0) || "U"}
                      </div>
                    )}
                    <span>{t('dashboard')}</span>
                  </Link>
                  
                  {/* Admin link removed as per user request to avoid buttons for it */}
                  
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <FiLogOut className="text-xl" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4 ml-6">
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={toggleLanguage}
              className="p-2 text-gray-700 hover:text-blue-600"
            >
              <FiGlobe className="text-xl" />
            </button>

            <button
              className="p-2 text-gray-700 hover:text-blue-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="space-y-3">
              <Link
                href="/services"
                className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-4 py-3 rounded-xl font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <FiSearch />
                <span>{t('searchService')}</span>
              </Link>

              <Link
                href="/marketplace"
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium ${isActive('/marketplace') ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FiShoppingBag />
                <span>{t('marketplace')}</span>
              </Link>

              {status === "authenticated" ? (
                <>
                  <Link
                    href="/messages"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiMessageSquare />
                    <span>{t('messages')}</span>
                  </Link>
                  <Link
                    href={dashboardHref}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiUser />
                    <span>{t('dashboard')}</span>
                  </Link>
                  
                  {/* Admin link removed as per user request */}
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex w-full items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl"
                  >
                    <FiLogOut />
                    <span>{t('logout')}</span>
                  </button>
                </>
              ) : (
                <div className="pt-4 border-t space-y-3">
                  <Link
                    href="/login"
                    className="flex items-center justify-center px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-xl font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
