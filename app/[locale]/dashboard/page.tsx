// app/dashboard/page.tsx - VERSION ME NJOFTIME REALE DHE I18N
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { FiSettings, FiUser, FiBell, FiHelpCircle, FiLogOut, FiSearch, FiCalendar, FiTrendingUp, FiEdit, FiCreditCard, FiGlobe, FiImage, FiPlus, FiBriefcase, FiShoppingBag } from "react-icons/fi";
import { TbClipboardCheck, TbTools, TbStar } from "react-icons/tb";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

interface Appointment {
  id: string;
  title: string;
  date: string;
  description?: string;
  status: string;
}

interface DashboardStats {
  activeRequests?: number;
  offersReceived?: number;
  hiredProfessionals?: number;
  activeJobs?: number;
  completedJobs?: number;
  earnings?: number; // Placeholder
}

interface SessionUser {
    name?: string;
    email?: string;
    role?: string;
    id?: string;
    image?: string;
    providerStatus?: string;
    sellerStatus?: string;
}

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tStats = useTranslations('stats');
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const [session, setSession] = useState<{ user?: SessionUser } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ title: '', date: '', description: '' });
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  // Dropdown states
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Close dropdowns when clicking outside (simple approach for now)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.dropdown-container')) {
        setShowNotifications(false);
        setShowSettings(false);
        setShowProfile(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    fetchSession();
    fetchNotifications();
    fetchAppointments();
    fetchStats();
    triggerCleanup();
  }, []);

  const triggerCleanup = async () => {
    try {
      await fetch('/api/jobs/cleanup');
    } catch (e) {
      console.error('Error triggering cleanup:', e);
    }
  };

  const fetchSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const sessionData = await response.json();
      setSession(sessionData);
    } catch (error) {
      console.error('Error fetching session:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setNotifications(data);
          const unread = data.filter((n: Notification) => !n.read).length;
          setUnreadCount(unread);
        } else {
          setNotifications([]);
          setUnreadCount(0);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointment),
      });

      if (response.ok) {
        setShowAppointmentModal(false);
        setNewAppointment({ title: '', date: '', description: '' });
        fetchAppointments(); // Refresh list
      }
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH'
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));

        const notification = notifications.find(n => n.id === notificationId);
        if (notification?.link) {
          router.push(notification.link);
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'PATCH'
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} min`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} h`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'welcome': return '🎉';
      default: return 'ℹ️';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-600';
      case 'warning': return 'bg-yellow-100 text-yellow-600';
      case 'error': return 'bg-red-100 text-red-600';
      case 'welcome': return 'bg-purple-100 text-purple-600';
      default: return 'bg-blue-100 text-blue-600';
    }
  };

  const isProvider = session?.user?.role === "PROVIDER";
  const isAdmin = session?.user?.role === "ADMIN";

  // Ridrejto adminët automatikisht te paneli i adminit
  useEffect(() => {
    if (isAdmin) {
      router.push("/admin");
    }
  }, [isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session?.user) {
    router.push("/login");
    return null;
  }

  if (isAdmin) return null; // Shmang shfaqjen e dashboard-it të thjeshtë për adminët

  // Role-based Stats
  const clientStats = [
    { label: tStats('activeRequests'), value: dashboardStats?.activeRequests?.toString() || "0", change: "+1", icon: <TbClipboardCheck className="text-2xl" />, color: "bg-blue-500", trend: "up" },
    { label: tStats('offersReceived'), value: dashboardStats?.offersReceived?.toString() || "0", change: "+4", icon: <TbStar className="text-2xl" />, color: "bg-yellow-500", trend: "up" },
    { label: tStats('hiredProfessionals'), value: dashboardStats?.hiredProfessionals?.toString() || "0", change: "+2", icon: <FiUser className="text-2xl" />, color: "bg-green-500", trend: "up" },
    { label: tStats('totalExpenses'), value: "450€", change: "+120€", icon: <FiCreditCard className="text-2xl" />, color: "bg-purple-500", trend: "up" },
  ];

  const providerStats = [
    { label: tStats('activeJobs'), value: dashboardStats?.activeJobs?.toString() || "0", change: "+1", icon: <TbTools className="text-2xl" />, color: "bg-blue-500", trend: "up" },
    { label: tStats('monthlyEarnings'), value: "1,250€", change: "+15%", icon: <FiTrendingUp className="text-2xl" />, color: "bg-green-500", trend: "up" },
    { label: tStats('averageRating'), value: "4.9", change: "+0.1", icon: <TbStar className="text-2xl" />, color: "bg-yellow-500", trend: "up" },
    { label: tStats('profileViews'), value: "145", change: "+24", icon: <FiSearch className="text-2xl" />, color: "bg-purple-500", trend: "up" },
  ];

  const stats = isProvider ? providerStats : clientStats;

  // Role-based Quick Actions
  const clientActions = [
    { title: t('quickActions.postRequest'), description: t('quickActions.postRequestDesc'), icon: <FiEdit />, color: "from-blue-500 to-blue-600", link: "/requests/create" },
    { title: t('quickActions.findPros'), description: t('quickActions.findProsDesc'), icon: <FiSearch />, color: "from-green-500 to-green-600", link: "/professionals" },
    { title: t('quickActions.myHires'), description: t('quickActions.myHiresDesc'), icon: <FiUser />, color: "from-yellow-500 to-yellow-600", link: "/jobs" },
    { title: t('quickActions.marketplace'), description: t('quickActions.marketplaceDesc'), icon: <FiShoppingBag />, color: "from-orange-500 to-orange-600", link: "/marketplace" },
    { title: t('quickActions.support'), description: t('quickActions.supportDesc'), icon: <FiHelpCircle />, color: "from-purple-500 to-purple-600", link: "/help" },
  ];

  const providerActions = [
    { title: t('quickActions.findJobs'), description: t('quickActions.findJobsDesc'), icon: <FiBriefcase />, color: "from-blue-500 to-blue-600", link: "/jobs" },
    { title: t('quickActions.manageOffers'), description: t('quickActions.manageOffers'), icon: <TbTools />, color: "from-green-500 to-green-600", link: "/profile/services" },
    { title: t('quickActions.earnings'), description: t('quickActions.earningsDesc'), icon: <FiTrendingUp />, color: "from-yellow-500 to-yellow-600", link: "/finance" },
    { title: t('quickActions.marketplace'), description: t('quickActions.marketplaceDesc'), icon: <FiShoppingBag />, color: "from-orange-500 to-orange-600", link: "/marketplace" },
    { title: t('quickActions.providerHelp'), description: t('quickActions.providerHelpDesc'), icon: <FiHelpCircle />, color: "from-purple-500 to-purple-600", link: "/help" },
  ];

  const quickActions = isProvider ? providerActions : clientActions;

  // Role-based Recent Activity using Real Notifications
  const recentActivity = notifications.slice(0, 5).map(n => ({
    id: n.id,
    title: n.title,
    time: formatTime(n.createdAt),
    status: n.read ? t('recentActivity.read') || 'Lexuar' : t('recentActivity.new') || 'E Re',
    type: n.type
  }));

  if (recentActivity.length === 0) {
      recentActivity.push({
          id: "no-activity",
          title: t('notifications.noNotifications'),
          time: "-",
          status: "-",
          type: "info"
      });
  }

  return (
    <div className="min-h-screen mesh-gradient-bg selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="glass border-b border-white/60 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-black text-gradient-accent">
                LocalFix
              </h1>
              <span className="ml-4 text-slate-500 font-bold text-sm hidden md:inline border-l pl-4 border-slate-200">
                {t('title')}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <button
                onClick={() => {
                  const locales = ['sq', 'en', 'de'];
                  const currentIndex = locales.indexOf(locale);
                  const nextLocale = locales[(currentIndex + 1) % locales.length];
                  router.replace(pathname, { locale: nextLocale });
                }}
                className="p-2.5 rounded-xl bg-slate-50/80 hover:bg-white hover:shadow-md transition flex items-center space-x-2 text-slate-700 font-bold"
                title={t('changeLanguage')}
              >
                <FiGlobe className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-black uppercase tracking-widest">{locale}</span>
              </button>

              {/* Notifications */}
              <div className="relative dropdown-container">
                <button 
                  onClick={() => { setShowNotifications(!showNotifications); setShowSettings(false); setShowProfile(false); }}
                  className="p-2.5 rounded-xl bg-slate-50/80 hover:bg-white hover:shadow-md transition relative focus:outline-none"
                >
                  <FiBell className="w-5 h-5 text-slate-700" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <div className={`absolute right-0 mt-2 w-80 glass-card rounded-2xl shadow-2xl border border-white/80 transition-all duration-200 z-50 ${showNotifications ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                  <div className="p-4 border-b border-slate-200/60 flex justify-between items-center rounded-t-2xl">
                    <h3 className="font-black text-slate-900">{t('notifications.title')}</h3>
                    {notifications.length > 0 && (
                      <Link href="/profile/notifications" className="text-blue-600 hover:text-blue-800 text-xs font-black uppercase tracking-wide">
                        {t('notifications.viewAll')}
                      </Link>
                    )}
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {loadingNotifications ? (
                      <div className="p-8 flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FiBell className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-slate-600 font-bold text-sm">{t('notifications.noNotifications')}</p>
                        <p className="text-slate-400 text-xs mt-1">{t('notifications.noNotificationsSub')}</p>
                      </div>
                    ) : (
                      <div className="p-2">
                        {notifications.map((notification) => (
                          <button
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)}
                            className={`w-full text-left flex items-start p-3 hover:bg-white/80 rounded-xl transition ${!notification.read ? 'bg-blue-50/80' : ''}`}
                          >
                            <div className={`p-2 rounded-xl mr-3 shadow-sm ${getNotificationColor(notification.type)}`}>
                              <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-900 truncate text-sm">{notification.title}</p>
                              <p className="text-xs text-slate-500 truncate">{notification.message}</p>
                              <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wide">{formatTime(notification.createdAt)}</p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {notifications.length > 0 && unreadCount > 0 && (
                    <div className="p-3 border-t border-slate-200/60 rounded-b-2xl">
                      <button
                        onClick={markAllAsRead}
                        className="w-full text-center text-blue-600 hover:text-blue-800 font-extrabold text-sm py-1"
                      >
                        {t('notifications.markAllRead')}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Settings Dropdown */}
              <div className="relative dropdown-container">
                <button 
                  onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); setShowProfile(false); }}
                  className="p-2.5 rounded-xl bg-slate-50/80 hover:bg-white hover:shadow-md transition focus:outline-none"
                >
                  <FiSettings className="w-5 h-5 text-slate-700" />
                </button>

                <div className={`absolute right-0 mt-2 w-64 glass-card rounded-2xl shadow-2xl border border-white/80 transition-all duration-200 z-50 ${showSettings ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                  <div className="p-4 border-b border-slate-200/60 rounded-t-2xl">
                    <h3 className="font-black text-slate-900">{t('settings.title')}</h3>
                  </div>
                  <div className="p-2 space-y-1">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider px-3 py-2">{t('settings.profile')}</p>
                    <Link href="/profile" className="flex items-center px-3 py-2 text-slate-700 hover:bg-blue-50/50 hover:text-blue-600 rounded-xl text-sm font-bold transition-colors">
                      <FiUser className="w-4 h-4 mr-3 text-slate-400" /> {t('settings.viewProfile')}
                    </Link>
                    <Link href="/profile/edit" className="flex items-center px-3 py-2 text-slate-700 hover:bg-blue-50/50 hover:text-blue-600 rounded-xl text-sm font-bold transition-colors">
                      <FiEdit className="w-4 h-4 mr-3 text-slate-400" /> {t('settings.editProfile')}
                    </Link>

                    <div className="my-2 border-t border-slate-100"></div>

                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider px-3 py-2">{t('settings.account')}</p>
                    <Link href="/settings" className="flex items-center px-3 py-2 text-slate-700 hover:bg-blue-50/50 hover:text-blue-600 rounded-xl text-sm font-bold transition-colors">
                      <FiSettings className="w-4 h-4 mr-3 text-slate-400" /> {t('settings.systemSettings')}
                    </Link>
                    <Link href="/help" className="flex items-center px-3 py-2 text-slate-700 hover:bg-blue-50/50 hover:text-blue-600 rounded-xl text-sm font-bold transition-colors">
                      <FiHelpCircle className="w-4 h-4 mr-3 text-slate-400" /> {t('settings.helpSupport')}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Profile Tool */}
              <div className="relative dropdown-container pl-2 border-l border-slate-200">
                <button 
                  onClick={() => { setShowProfile(!showProfile); setShowSettings(false); setShowNotifications(false); }}
                  className="flex items-center space-x-3 p-1 rounded-full hover:bg-slate-100 transition outline-none"
                >
                  <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md">
                    {session?.user?.name?.charAt(0) || "U"}
                  </div>
                </button>

                <div className={`absolute right-0 mt-2 w-60 glass-card rounded-2xl shadow-2xl border border-white/80 transition-all duration-200 z-50 ${showProfile ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                  <div className="p-4 border-b border-slate-100">
                    <p className="font-black text-slate-900 truncate">{session?.user?.name}</p>
                    <p className="text-xs text-slate-500 font-semibold truncate">{session?.user?.email}</p>
                    <span className="mt-2 inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-blue-100">
                      {session?.user?.role}
                    </span>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => signOut({ callbackUrl: '/login' })}
                      className="w-full flex items-center px-3 py-2.5 text-rose-600 hover:bg-rose-50 rounded-xl text-sm font-bold transition-colors"
                    >
                      <FiLogOut className="w-4 h-4 mr-3" /> {t('userMenu.signOut')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">
                {t('welcome.joined')}, {session?.user?.name?.split(" ")[0]}!
              </h2>
              <p className="text-blue-100/80 max-w-lg font-medium text-base">
                {isProvider ? t('welcome.providerDesc') : t('welcome.clientDesc')}
              </p>
            </div>
            <div className="glass-dark px-6 py-4 rounded-2xl border border-white/10 shadow-xl">
              <p className="text-xs text-blue-300 uppercase font-black tracking-widest mb-1">{t('welcome.today')}</p>
              <p className="text-2xl font-black tracking-tight">{isMounted ? new Date().toLocaleDateString() : '...'}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="glass-card rounded-[2rem] p-6 hover-lift border border-white/80 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-[1.5rem] ${stat.color} text-white shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${stat.trend === 'up' ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60' : 'text-rose-700 bg-rose-50 border border-rose-200/60'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">{stat.value}</h3>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link 
                  key={index}
                  href={action.link}
                  className="group glass-card rounded-[2rem] p-6 hover-lift border border-white/80 transition-all flex items-center gap-5"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-[1.25rem] flex items-center justify-center text-2xl text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">
                      {action.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Provider Application Status (if not approved) */}
            {session?.user?.role !== "PROVIDER" && (
              <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-50 p-8 overflow-hidden relative group hover:border-blue-200 transition-all">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-3">
                    <TbTools className="text-blue-600" />
                    {t('becomeProvider')}
                  </h3>
                  <p className="text-slate-500 font-medium mb-6 max-w-md leading-relaxed">
                    {t('becomeProviderDesc')}
                  </p>
                  
                  {session?.user?.providerStatus === "PENDING" ? (
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-50 text-yellow-700 rounded-2xl font-black text-sm border border-yellow-100">
                      <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse"></span>
                      {t('pendingApproval')}
                    </div>
                  ) : (
                    <Link 
                      href="/provider/apply" 
                      className="inline-block px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:scale-105 active:scale-95"
                    >
                      {t('applyNow')}
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Provider Exclusive Sections */}
            {session?.user?.role === "PROVIDER" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Portfolio Card */}
                  <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-100 border border-slate-50 group hover:border-blue-200 transition-all">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <FiImage className="text-2xl text-blue-600" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">{t('providerSections.portfolio')}</h3>
                    <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">{t('providerSections.portfolioDesc')}</p>
                    <Link href="/profile/portfolio" className="inline-flex items-center text-sm font-black text-blue-600 hover:gap-2 transition-all">
                      {t('providerSections.viewAll')} <FiPlus className="ml-1" />
                    </Link>
                  </div>

                  {/* Courses Card */}
                  <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-100 border border-slate-50 group hover:border-indigo-200 transition-all">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <FiBriefcase className="text-2xl text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">{t('providerSections.courses')}</h3>
                    <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">{t('providerSections.coursesDesc')}</p>
                    <Link href="/profile/courses" className="inline-flex items-center text-sm font-black text-indigo-600 hover:gap-2 transition-all">
                      {t('providerSections.add')} <FiPlus className="ml-1" />
                    </Link>
                  </div>

                  {/* Contracts Card */}
                  <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-100 border border-slate-50 group hover:border-purple-200 transition-all">
                    <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <TbClipboardCheck className="text-2xl text-purple-600" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">{t('providerSections.contracts')}</h3>
                    <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">{t('providerSections.contractsDesc')}</p>
                    <Link href="/profile/documents" className="inline-flex items-center text-sm font-black text-purple-600 hover:gap-2 transition-all">
                      {t('providerSections.add')} <FiPlus className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-gray-900 text-lg">{t('recentActivity.title')}</h3>
                <Link href="/activity" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                  {t('recentActivity.viewAll')}
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-4"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    {activity.status !== "-" && (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${activity.status === 'E Re' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {activity.status}
                        </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Summary */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
              <div className="flex items-center space-x-4 mb-8 relative z-10">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500 overflow-hidden border-2 border-white shadow-lg">
                  {session?.user?.image ? (
                    <Image src={session.user.image} alt={session.user.name || "User"} width={64} height={64} className="w-full h-full object-cover" />
                  ) : (
                    session?.user?.name?.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">{session?.user?.name}</h4>
                  <p className="text-sm text-gray-500">{session?.user?.email}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">{t('profileCard.status')}</span>
                  <span className="font-bold text-green-600 flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>{t('profileCard.active')}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">{t('profileCard.joined')}</span>
                  <span className="font-semibold text-gray-900">{isMounted ? new Date().toLocaleDateString() : '...'}</span>
                </div>
              </div>

              <Link href="/profile/edit" className="mt-6 block w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl text-center transition-colors border border-gray-200">
                {t('profileCard.updateProfile')}
              </Link>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <FiCalendar className="mr-2 text-blue-500" /> {t('appointments.title')}
              </h3>
              <div className="space-y-4">
                {appointments.length === 0 ? (
                  <p className="text-sm text-gray-500 italic text-center py-4">{t('appointments.noAppointments')}</p>
                ) : (
                  appointments.map((apt) => (
                    <div key={apt.id} className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                      <p className="text-sm font-bold text-gray-900">{apt.title}</p>
                      <p className="text-xs text-blue-600 mt-1 font-semibold">
                        {new Date(apt.date).toLocaleString()}
                      </p>
                      {apt.description && <p className="text-xs text-gray-500 mt-1">{apt.description}</p>}
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={() => setShowAppointmentModal(true)}
                className="w-full mt-4 text-sm text-blue-600 font-bold hover:underline"
              >
                + {t('appointments.addNew')}
              </button>
            </div>

            {/* Appointment Modal */}
            {showAppointmentModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{t('appointments.addModal.title')}</h3>
                  <form onSubmit={handleAddAppointment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('appointments.addModal.labelTitle')}</label>
                      <input
                        type="text"
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={newAppointment.title}
                        onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
                        placeholder={t('appointments.addModal.placeholderTitle')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('appointments.addModal.labelDate')}</label>
                      <input
                        type="datetime-local"
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={newAppointment.date}
                        onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('appointments.addModal.labelDesc')}</label>
                      <textarea
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        rows={3}
                        value={newAppointment.description}
                        onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })}
                        placeholder={t('appointments.addModal.placeholderDesc')}
                      />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowAppointmentModal(false)}
                        className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
                      >
                        {t('appointments.addModal.cancel')}
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
                      >
                        {t('appointments.addModal.save')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-2">{t('tips.title')}</h3>
              <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
                {t('tips.desc')}
              </p>
              <button className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors">
                {t('tips.learnMore')}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}