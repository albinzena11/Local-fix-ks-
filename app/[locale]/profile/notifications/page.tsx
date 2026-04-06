// app/profile/notifications/page.tsx - SISTEMI I PLOTË PËR NJOFTIMET
"use client";

import { useState } from "react";
import Link from "next/link";
import { FiArrowLeft, FiBell, FiMail, FiPhone, FiCheck } from "react-icons/fi";

const notificationTypes = [
  {
    id: "requests",
    title: "Kërkesa",
    description: "Njoftime për kërkesat e reja dhe përditësime",
    icon: "📋",
    subTypes: [
      { id: "new_requests", label: "Kërkesa të reja", enabled: true },
      { id: "status_updates", label: "Përditësime statusi", enabled: true },
      { id: "offers_received", label: "Oferta të pranuara", enabled: true },
      { id: "deadline_reminders", label: "Kujtime afati", enabled: true },
    ]
  },
  {
    id: "professionals",
    title: "Profesionistë",
    description: "Njoftime për profesionistët dhe vlerësimet",
    icon: "👷",
    subTypes: [
      { id: "new_professionals", label: "Profesionistë të rinj", enabled: false },
      { id: "ratings_reviews", label: "Vlerësime dhe komente", enabled: true },
      { id: "availability_updates", label: "Përditësime disponueshmërie", enabled: true },
    ]
  },
  {
    id: "messages",
    title: "Mesazhe",
    description: "Njoftime për mesazhet dhe komunikimet",
    icon: "💬",
    subTypes: [
      { id: "new_messages", label: "Mesazhe të reja", enabled: true },
      { id: "message_reminders", label: "Kujtime mesazhesh", enabled: false },
    ]
  },
  {
    id: "system",
    title: "Sistemi",
    description: "Njoftime për sistemi dhe përditësime",
    icon: "⚙️",
    subTypes: [
      { id: "maintenance", label: "Mirëmbajtje sistemi", enabled: true },
      { id: "updates", label: "Përditësime të reja", enabled: true },
      { id: "security", label: "Njoftime sigurie", enabled: true },
    ]
  },
  {
    id: "marketing",
    title: "Promovime",
    description: "Oferta dhe promovime speciale",
    icon: "🎯",
    subTypes: [
      { id: "special_offers", label: "Oferta speciale", enabled: false },
      { id: "newsletter", label: "Lajmërimet", enabled: true },
      { id: "tips_advice", label: "Këshilla dhe truke", enabled: true },
    ]
  },
];

const deliveryMethods = [
  {
    id: "email",
    name: "Email",
    icon: <FiMail className="w-5 h-5" />,
    description: "Merrni njoftime me email",
    enabled: true
  },
  {
    id: "push",
    name: "Push Notifications",
    icon: <FiBell className="w-5 h-5" />,
    description: "Njoftime në browser ose aplikacion",
    enabled: true
  },
  {
    id: "sms",
    name: "SMS",
    icon: <FiPhone className="w-5 h-5" />,
    description: "Njoftime me SMS",
    enabled: false
  }
];

export default function NotificationsPage() {
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState(notificationTypes);
  const [delivery, setDelivery] = useState(deliveryMethods);
  const [quietHours, setQuietHours] = useState({
    enabled: false,
    start: "22:00",
    end: "08:00"
  });
  const [notificationFrequency, setNotificationFrequency] = useState("immediate");

  const toggleNotificationType = (typeId: string, subTypeId?: string) => {
    setNotifications(prev => prev.map(type => {
      if (type.id === typeId) {
        if (subTypeId) {
          return {
            ...type,
            subTypes: type.subTypes.map(sub =>
              sub.id === subTypeId ? { ...sub, enabled: !sub.enabled } : sub
            )
          };
        } else {
          const allEnabled = type.subTypes.every(sub => sub.enabled);
          return {
            ...type,
            subTypes: type.subTypes.map(sub => ({ ...sub, enabled: !allEnabled }))
          };
        }
      }
      return type;
    }));
  };

  const toggleDeliveryMethod = (methodId: string) => {
    setDelivery(prev => prev.map(method =>
      method.id === methodId ? { ...method, enabled: !method.enabled } : method
    ));
  };

  const toggleQuietHours = () => {
    setQuietHours(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  const handleSave = async () => {
    setSaving(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Saving notification settings:", {
        notifications,
        delivery,
        quietHours,
        frequency: notificationFrequency
      });
      alert("Cilësimet e njoftimeve u ruajtën me sukses!");
      setSaving(false);
    }, 1000);
  };

  const handleReset = () => {
    if (window.confirm("Dëshironi të riktheni cilësimet e parazgjedhura?")) {
      setNotifications(notificationTypes);
      setDelivery(deliveryMethods);
      setQuietHours({
        enabled: false,
        start: "22:00",
        end: "08:00"
      });
      setNotificationFrequency("immediate");
    }
  };

  const getNotificationCount = (typeId: string) => {
    const type = notifications.find(t => t.id === typeId);
    return type?.subTypes.filter(sub => sub.enabled).length || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Kthehu në Profil
          </Link>

          <div className="flex items-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white mr-4">
              <FiBell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Njoftimet
              </h1>
              <p className="text-gray-600">
                Kontrolloni se cilat njoftime dëshironi të merrni dhe si
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Notification Types */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Llojet e Njoftimeve
              </h2>

              <div className="space-y-6">
                {notifications.map((type) => (
                  <div key={type.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start">
                        <span className="text-2xl mr-4">{type.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{type.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{type.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleNotificationType(type.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${type.subTypes.every(sub => sub.enabled)
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {type.subTypes.every(sub => sub.enabled) ? 'Të gjitha aktiv' : `${getNotificationCount(type.id)}/${type.subTypes.length} aktiv`}
                      </button>
                    </div>

                    <div className="space-y-3">
                      {type.subTypes.map((subType) => (
                        <div key={subType.id} className="flex items-center justify-between">
                          <span className="text-gray-700">{subType.label}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={subType.enabled}
                              onChange={() => toggleNotificationType(type.id, subType.id)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Methods */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Metodat e Dërgimit
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {delivery.map((method) => (
                  <div
                    key={method.id}
                    className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${method.enabled
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => toggleDeliveryMethod(method.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${method.enabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {method.icon}
                      </div>
                      {method.enabled && (
                        <FiCheck className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{method.name}</h3>
                    <p className="text-gray-600 text-sm">{method.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quiet Hours */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Orët e Qetësisë
                </h2>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quietHours.enabled}
                    onChange={toggleQuietHours}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {quietHours.enabled && (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Nuk do të merrni njoftime gjatë këtyre orëve
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nga
                      </label>
                      <input
                        type="time"
                        value={quietHours.start}
                        onChange={(e) => setQuietHours(prev => ({ ...prev, start: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deri
                      </label>
                      <input
                        type="time"
                        value={quietHours.end}
                        onChange={(e) => setQuietHours(prev => ({ ...prev, end: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Frequency */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Frekuenca
              </h2>

              <div className="space-y-3">
                {[
                  { id: "immediate", label: "Menjëherë", description: "Njoftime sapo ndodhin" },
                  { id: "hourly", label: "Çdo orë", description: "Përmbledhje çdo orë" },
                  { id: "daily", label: "Ditore", description: "Përmbledhje ditore në mëngjes" },
                ].map((option) => (
                  <label key={option.id} className="flex items-start cursor-pointer">
                    <input
                      type="radio"
                      name="frequency"
                      value={option.id}
                      checked={notificationFrequency === option.id}
                      onChange={(e) => setNotificationFrequency(e.target.value)}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{option.label}</p>
                      <p className="text-gray-600 text-sm">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-sm p-8 text-white">
              <h2 className="text-lg font-bold mb-4">Njoftimet e Fundit</h2>

              <div className="space-y-4">
                {[
                  { id: 1, title: "Ofertë e re për kërkesën tuaj", time: "10 min më parë", read: false },
                  { id: 2, title: "Profesionisti konfirmoi termin", time: "1 orë më parë", read: true },
                  { id: 3, title: "Shërbimi i ri në zonën tuaj", time: "2 orë më parë", read: true },
                ].map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${!notification.read ? 'bg-white/10' : 'bg-white/5'}`}
                  >
                    <p className="font-medium mb-1">{notification.title}</p>
                    <p className="text-gray-300 text-sm">{notification.time}</p>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    )}
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg transition text-sm font-medium">
                Shiko të gjitha njoftimet
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Po ruhet...
                  </>
                ) : (
                  'Ruaj Cilësimet'
                )}
              </button>

              <button
                onClick={handleReset}
                className="w-full px-8 py-3.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Rikthe Parazgjedhjet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}