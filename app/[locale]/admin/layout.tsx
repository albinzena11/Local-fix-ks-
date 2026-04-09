"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "@/frontend/i18n/routing";
import { useEffect, useState } from "react";
import Link from "next/link"; // Ideally use i18n link, but for internal admin admin/ link might be okay or use routing Link
import { FiHome, FiUsers, FiAlertTriangle, FiLogOut, FiMenu, FiBriefcase, FiTool } from "react-icons/fi";
import { useTranslations } from "next-intl";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const t = useTranslations('admin');

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            if ((session?.user as { role?: string })?.role !== "ADMIN") {
                router.push("/dashboard");
            }
        }
    }, [status, session, router]);

    if (status === "loading") {
        return <div className="flex h-screen items-center justify-center">{t('loading')}</div>;
    }

    if (!session || (session.user as { role?: string }).role !== "ADMIN") {
        return null; // Will redirect via useEffect
    }

    const navItems = [
        { name: t('overview'), href: "/admin", icon: <FiHome /> },
        { name: t('usersProviders'), href: "/admin/users", icon: <FiUsers /> },
        { name: "Jobs", href: "/admin/jobs", icon: <FiBriefcase /> }, // Use translation key if available
        { name: "Services", href: "/admin/services", icon: <FiTool /> },
        { name: t('disputes'), href: "/admin/disputes", icon: <FiAlertTriangle /> },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside
                className={`bg-gray-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col fixed h-full z-20`}
            >
                <div className="h-16 flex items-center justify-center border-b border-gray-800">
                    {isSidebarOpen ? <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">{t('title')}</span> : <span className="font-bold text-blue-500">LF</span>}
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                                title={!isSidebarOpen ? item.name : ""}
                            >
                                <span className="text-xl">{item.icon}</span>
                                {isSidebarOpen && <span className="ml-3 font-medium">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <Link href="/dashboard" className="flex items-center px-4 py-3 text-gray-400 hover:text-white transition-colors">
                        <FiLogOut className="text-xl" />
                        {isSidebarOpen && <span className="ml-3">{t('exit')}</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 sticky top-0 z-10">
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 focus:outline-none"
                    >
                        <FiMenu className="text-xl" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-gray-900">{session.user?.name}</p>
                            <p className="text-xs text-green-600 font-bold">{t('role')}</p>
                        </div>
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            {session.user?.name?.[0] || "A"}
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
