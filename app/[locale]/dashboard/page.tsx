// app/dashboard/page.tsx - VERSION ME NJOFTIME REALE DHE I18N
"use client";

import { useState, useEffect } from "react";
import { useRouter, Link, usePathname } from "@/frontend/i18n/routing"; // Fixed import
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { FiSettings, FiUser, FiBell, FiHelpCircle, FiLogOut, FiSearch, FiCalendar, FiTrendingUp, FiEdit, FiCreditCard, FiGlobe, FiImage, FiPlus, FiBriefcase } from "react-icons/fi";
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

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tStats = useTranslations('stats');
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const [session, setSession] = useState<{ user?: { name?: string; email?: string; role?: string; id?: string; image?: string; providerStatus?: string; sellerStatus?: string } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ title: '', date: '', description: '' });
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetchSession();
    fetchNotifications();
    fetchAppointments();
    fetchStats();
  }, []);

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
      const response = await fetch('/api/dashboard/stats');
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

  const isProvider = session.user?.role === "PROVIDER";
  const isAdmin = session.user?.role === "ADMIN";

  // Ridrejto adminët automatikisht te paneli i adminit
  useEffect(() => {
    if (isAdmin) {
      router.push("/admin");
    }
  }, [isAdmin, router]);

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
    { title: t('quickActions.postRequest'), description: t('quickActions.postRequestDesc'), icon: "📝", color: "from-blue-500 to-blue-600", link: "/requests/create" },
    { title: t('quickActions.findPros'), description: t('quickActions.findProsDesc'), icon: "🔍", color: "from-green-500 to-green-600", link: "/professionals" },
    { title: t('quickActions.myHires'), description: t('quickActions.myHiresDesc'), icon: "🤝", color: "from-yellow-500 to-yellow-600", link: "/jobs" },
    { title: t('quickActions.marketplace'), description: t('quickActions.marketplaceDesc'), icon: "🛒", color: "from-orange-500 to-orange-600", link: "/marketplace" },
    { title: t('quickActions.support'), description: t('quickActions.supportDesc'), icon: "❓", color: "from-purple-500 to-purple-600", link: "/support" },
  ];

  const providerActions = [
    { title: t('quickActions.findJobs'), description: t('quickActions.findJobsDesc'), icon: "💼", color: "from-blue-500 to-blue-600", link: "/jobs" },
    { title: t('quickActions.manageOffers'), description: t('quickActions.manageOffers'), icon: "🛠️", color: "from-green-500 to-green-600", link: "/profile/services" },
    { title: t('quickActions.earnings'), description: t('quickActions.earningsDesc'), icon: "💰", color: "from-yellow-500 to-yellow-600", link: "/finance" },
    { title: t('quickActions.marketplace'), description: t('quickActions.marketplaceDesc'), icon: "🛒", color: "from-orange-500 to-orange-600", link: "/marketplace" },
    { title: t('quickActions.providerHelp'), description: t('quickActions.providerHelpDesc'), icon: "❓", color: "from-purple-500 to-purple-600", link: "/help-provider" },
  ];

  const adminActions = [
    { title: "Statistikat e Platformës", description: "Shiko përdoruesit, punët dhe mosmarrëveshjet.", icon: "📊", color: "from-red-600 to-red-700", link: "/admin" },
    { title: "Menaxho Përdoruesit", description: "Shiko dhe edito përdoruesit e regjistruar.", icon: "👥", color: "from-blue-600 to-blue-700", link: "/admin/users" },
    { title: "Zgjidh Mosmarrëveshjet", description: "Shiko raportet e hapur platformë-mbarë.", icon: "⚠️", color: "from-orange-600 to-orange-700", link: "/admin/disputes" },
  ];

  const quickActions = isAdmin ? adminActions : (isProvider ? providerActions : clientActions);

  // Role-based Recent Activity (Mock)
  const clientActivity = [
    { id: 1, title: isProvider ? t('recentActivity.newRequest') : t('recentActivity.requestApproved'), time: "1h", status: t('profileCard.active'), type: "request" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                LocalFix
              </h1>
              <span className="ml-4 text-gray-500 hidden md:inline border-l pl-4 border-gray-300">
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
                className="p-2 rounded-full hover:bg-gray-100 transition flex items-center space-x-2 text-gray-600"
                title="Change Language"
              >
                <FiGlobe className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">{locale}</span>
              </button>

              {/* Notifications */}
              <div className="relative group">
                <button className="p-2 rounded-full hover:bg-gray-100 transition relative">
                  <FiBell className="w-5 h-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <h3 className="font-semibold text-gray-900">{t('notifications.title')}</h3>
                    {notifications.length > 0 && (
                      <Link href="/profile/notifications" className="text-blue-600 hover:text-blue-800 text-xs font-semibold uppercase tracking-wide">
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
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FiBell className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500">{t('notifications.noNotifications')}</p>
                        <p className="text-gray-400 text-xs mt-1">{t('notifications.noNotificationsSub')}</p>
                      </div>
                    ) : (
                      <div className="p-2">
                        {notifications.map((notification) => (
                          <button
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)}
                            className={`w-full text-left flex items-start p-3 hover:bg-gray-50 rounded-lg transition ${!notification.read ? 'bg-blue-50' : ''}`}
                          >
                            <div className={`p-2 rounded-lg mr-3 shadow-sm ${getNotificationColor(notification.type)}`}>
                              <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate text-sm">{notification.title}</p>
                              <p className="text-xs text-gray-500 truncate">{notification.message}</p>
                              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">{formatTime(notification.createdAt)}</p>
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
                    <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                      <button
                        onClick={markAllAsRead}
                        className="w-full text-center text-blue-600 hover:text-blue-800 font-medium text-sm py-1"
                      >
                        {t('notifications.markAllRead')}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Settings */}
              <div className="relative group">
                <button className="p-2 rounded-full hover:bg-gray-100 transition">
                  <FiSettings className="w-5 h-5 text-gray-600" />
                </button>

                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                    <h3 className="font-semibold text-gray-900">{t('settings.title')}</h3>
                  </div>
                  <div className="p-2 space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-2">{t('settings.profile')}</p>
                    <Link href="/profile" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
                      <FiUser className="w-4 h-4 mr-3 text-gray-400" /> {t('settings.viewProfile')}
                    </Link>
                    <Link href="/profile/edit" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
                      <FiEdit className="w-4 h-4 mr-3 text-gray-400" /> {t('settings.editProfile')}
                    </Link>

                    <div className="my-2 border-t border-gray-100"></div>

                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-2">{t('settings.account')}</p>
                    <Link href="/settings" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
                      <FiSettings className="w-4 h-4 mr-3 text-gray-400" /> {t('settings.systemSettings')}
                    </Link>
                    <Link href="/help" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
                      <FiHelpCircle className="w-4 h-4 mr-3 text-gray-400" /> {t('settings.helpSupport')}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Profile Dropdown */}
              <div className="relative group pl-2 border-l border-gray-200">
                <button className="flex items-center space-x-3 p-1 rounded-full hover:bg-gray-100 transition ring-2 ring-transparent focus:ring-blue-100">
                  <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {session.user?.name?.charAt(0) || "U"}
                  </div>
                </button>

                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <p className="font-bold text-gray-900 truncate">{session.user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                    <span className="mt-2 inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded">
                      {session.user?.role}
                    </span>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => signOut({ callbackUrl: '/login' })}
                      className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {t('welcome.joined')}, {session.user?.name?.split(" ")[0]}!
              </h2>
              <p className="text-blue-100 max-w-lg">
                {isProvider ? t('welcome.providerDesc') : t('welcome.clientDesc')}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20">
              <p className="text-xs text-blue-200 uppercase tracking-wider mb-1">{t('welcome.today')}</p>
              <p className="text-2xl font-bold font-mono">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            ...
            
            {/* Provider Application Status (if not approved) */}
            {session.user?.role !== "PROVIDER" && (
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
                  
                  {session.user?.providerStatus === "PENDING" ? (
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
            {session.user?.role === "PROVIDER" && (
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 text-lg">{t('recentActivity.title')}</h3>
                <Link href="/activity" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                  {t('recentActivity.viewAll')}
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {clientActivity.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-4"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-lg">
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500 overflow-hidden border-2 border-white shadow-lg">
                  {session.user?.image ? (
                    <Image src={session.user.image} alt={session.user.name || "User"} width={64} height={64} className="w-full h-full object-cover" />
                  ) : (
                    session.user?.name?.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">{session.user?.name}</h4>
                  <p className="text-sm text-gray-500">{session.user?.email}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">{t('profileCard.status')}</span>
                  <span className="font-bold text-green-600 flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>{t('profileCard.active')}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">{t('profileCard.joined')}</span>
                  <span className="font-semibold text-gray-900">{new Date().toLocaleDateString()}</span>
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
                  <p className="text-sm text-gray-500 italic text-center py-4">No upcoming appointments</p>
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
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Add Appointment</h3>
                  <form onSubmit={handleAddAppointment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={newAppointment.title}
                        onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
                        placeholder="e.g. Consultation"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                      <input
                        type="datetime-local"
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={newAppointment.date}
                        onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                      <textarea
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        rows={3}
                        value={newAppointment.description}
                        onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })}
                        placeholder="Additional details..."
                      />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowAppointmentModal(false)}
                        className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
                      >
                        Save Appointment
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