import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { AuthProvider } from '@/components/providers/AuthProvider';
import HeaderWrapper from '@/components/HeaderWrapper';
import FooterWrapper from '@/components/FooterWrapper';

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });

export const viewport: Viewport = { themeColor: "#2563eb", width: "device-width", initialScale: 1 };
export const metadata: Metadata = { title: "LocalFIX", description: "Platforma pÃ«r ShÃ«rbime Lokale" };

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) { notFound(); }
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${outfit.variable} scroll-smooth`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="font-sans antialiased text-slate-900 bg-[#fafafa] transition-colors duration-300">
        <AuthProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <HeaderWrapper />
            <main className="min-h-screen">
              {children}
            </main>
            <FooterWrapper />
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
