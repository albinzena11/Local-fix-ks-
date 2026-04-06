// app/profile/security/page.tsx - FAQA PËR SIGURINË
"use client";

import { useState } from "react";
import Link from "next/link";
import { FiArrowLeft, FiShield, FiLock, FiEye, FiEyeOff, FiCheck } from "react-icons/fi";

export default function SecurityPage() {
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [activeSessions, setActiveSessions] = useState([
    { id: 1, device: "Chrome on Windows", location: "Tirana, AL", lastActive: "2 min më parë", current: true },
    { id: 2, device: "Safari on iPhone", location: "Durrës, AL", lastActive: "1 orë më parë", current: false },
    { id: 3, device: "Firefox on Mac", location: "New York, US", lastActive: "1 javë më parë", current: false },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Fjalëkalimet nuk përputhen!");
      return;
    }

    if (formData.newPassword.length < 8) {
      alert("Fjalëkalimi duhet të jetë së paku 8 karaktere!");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Password change request:", formData);
      alert("Fjalëkalimi u ndryshua me sukses!");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setLoading(false);
    }, 1500);
  };

  const handleToggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const handleRevokeSession = (id: number) => {
    if (window.confirm("Jeni të sigurt që doni të shkëputeni nga kjo sesion?")) {
      setActiveSessions(prev => prev.filter(session => session.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Kthehu në Profil
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <FiShield className="w-8 h-8 mr-3 text-blue-600" />
            Siguria
          </h1>
          <p className="text-gray-600">
            Menaxhoni sigurinë e llogarisë suaj dhe aktivitetin e hyrjeve
          </p>
        </div>

        <div className="space-y-8">
          {/* Change Password */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FiLock className="w-5 h-5 mr-2 text-blue-600" />
              Ndryshoni Fjalëkalimin
            </h2>

            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fjalëkalimi Aktual
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    required
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Fjalëkalimi aktual"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fjalëkalimi i Ri
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    required
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Fjalëkalimi i ri (së paku 8 karaktere)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Fjalëkalimi duhet të përmbajë së paku 8 karaktere, shkronja dhe numra
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmo Fjalëkalimin e Ri
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Konfirmoni fjalëkalimin e ri"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Po ndryshohet...
                  </div>
                ) : (
                  'Ndrysho Fjalëkalimin'
                )}
              </button>
            </form>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Autentikim Dy-Faktorësh
                </h2>
                <p className="text-gray-600">
                  Shtoni një shtresë shtesë sigurie në llogarinë tuaj
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={handleToggleTwoFactor}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            {twoFactorEnabled ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-start">
                  <FiCheck className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-900 mb-2">
                      Autentikimi 2FA është aktivizuar
                    </h3>
                    <p className="text-green-700 text-sm">
                      Llogaria juaj është mbrojtur me autentikim dy-faktorësh
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="font-medium text-yellow-900 mb-2">
                  Autentikimi 2FA është çaktivizuar
                </h3>
                <p className="text-yellow-700 text-sm mb-4">
                  Aktivizoni për shtresë shtesë sigurie
                </p>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  Mësoni më shumë rreth 2FA →
                </button>
              </div>
            )}
          </div>

          {/* Active Sessions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Sesionet Aktive
            </h2>

            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-4 ${session.current ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                      <FiShield />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{session.device}</p>
                      <p className="text-sm text-gray-500">
                        {session.location} • {session.lastActive}
                        {session.current && (
                          <span className="ml-2 text-blue-600 font-medium">Sesioni aktual</span>
                        )}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <button
                      onClick={() => handleRevokeSession(session.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Shkëputu
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                Shiko të gjitha sesionet
                <span className="ml-1">→</span>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
            <h2 className="text-lg font-semibold text-red-900 mb-4">
              Zona e Rrezikut
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-900">Fshij Llogarinë</p>
                  <p className="text-red-700 text-sm">
                    Ky veprim është i përkthyershëm. Të gjitha të dhënat tuaja do të fshihen përgjithmonë.
                  </p>
                </div>
                <button className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition">
                  Fshij Llogarinë
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-900">Eksporto Të Dhënat</p>
                  <p className="text-red-700 text-sm">
                    Shkarkoni kopje të të gjitha të dhënave tuaja në formatin JSON.
                  </p>
                </div>
                <button className="px-6 py-2.5 bg-white border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition">
                  Eksporto
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}