// app/login/page.tsx - VERSION FIXED
"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { signIn } from "next-auth/react";
import { FiMail, FiLock, FiHome } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations('auth');
  const tForms = useTranslations('forms');
  const router = useRouter(); // Use localized router
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(t('emailError'));
        setLoading(false);
        return;
      }

      if (result?.ok) {
        // Fetch session to check role and redirect accordingly
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        
        if (sessionData?.user?.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      console.error(err);
      setError(t('generalError'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mesh-gradient-bg py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center relative overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow [animation-delay:2s]"></div>

      <div className="max-w-md w-full mx-auto relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <FiHome className="text-white text-2xl" />
            </div>
            <div>
              <span className="font-black text-3xl text-slate-900 tracking-tight">Local</span>
              <span className="font-black text-3xl text-gradient-accent tracking-tight">FIX</span>
            </div>
          </Link>
          <h2 className="mt-8 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('loginTitle')}
          </h2>
          <p className="mt-2 text-slate-600 font-semibold">
            {t('loginSubtitle')}
          </p>
        </div>

        <div className="glass-card py-10 px-6 sm:px-10 rounded-[2.5rem] border border-white/80">
          <div className="mb-6">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-slate-200/80 rounded-2xl shadow-sm bg-white/90 text-sm font-extrabold text-slate-700 hover:bg-white hover:shadow-md transition-all"
            >
              <FcGoogle className="text-2xl" />
              Vazhdo me Google
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs font-black uppercase tracking-widest">
              <span className="px-3 bg-white/80 rounded-full text-slate-400">Ose me email</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50/90 border-l-4 border-red-500 p-4 rounded-r-xl">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-bold text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                {tForms('email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-12 block w-full px-4 py-4 border border-slate-200/80 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/70 font-semibold text-slate-900 placeholder:text-slate-400"
                  placeholder={t('emailPlaceholder')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                {tForms('password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-12 block w-full px-4 py-4 border border-slate-200/80 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/70 font-semibold text-slate-900 placeholder:text-slate-400"
                  placeholder={t('passwordPlaceholder')}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link href="/forgot-password" className="font-extrabold text-blue-600 hover:text-blue-500">
                  {t('forgotPassword')}
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl text-base font-black text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('signingIn')}
                  </span>
                ) : (
                  t('signIn')
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200/80">
            <p className="text-center text-sm font-bold text-slate-600">
              {t('noAccount')}{" "}
              <Link href="/register" className="font-black text-blue-600 hover:text-blue-500">
                {t('registerHere')}
              </Link>
            </p>
            <div className="mt-4 text-center">
              <Link
                href="/register?role=provider"
                className="inline-flex items-center px-5 py-2.5 text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 rounded-xl transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                </svg>
                {t('registerProvider')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}