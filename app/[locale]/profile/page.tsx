// app/profile/page.tsx - FAQA KRYESORE E PROFILIT
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { FiArrowLeft, FiUser, FiSettings, FiShield, FiBell, FiCreditCard, FiHelpCircle, FiEdit } from "react-icons/fi";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Kthehu në Dashboard
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              {/* User Info */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                  {session.user?.name?.charAt(0) || "U"}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{session.user?.name}</h2>
                <p className="text-gray-600 text-sm">{session.user?.email}</p>
                <span className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                  {session.user?.role}
                </span>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium"
                >
                  <FiUser className="w-5 h-5 mr-3" />
                  Profili
                </Link>
                <Link
                  href="/profile/edit"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <FiEdit className="w-5 h-5 mr-3" />
                  Editoni Profilin
                </Link>
                <Link
                  href="/profile/security"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <FiShield className="w-5 h-5 mr-3" />
                  Siguria
                </Link>
                <Link
                  href="/profile/notifications"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <FiBell className="w-5 h-5 mr-3" />
                  Njoftimet
                </Link>
                <Link
                  href="/profile/billing"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <FiCreditCard className="w-5 h-5 mr-3" />
                  Pagesat
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <FiSettings className="w-5 h-5 mr-3" />
                  Cilësimet
                </Link>
                <Link
                  href="/support"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <FiHelpCircle className="w-5 h-5 mr-3" />
                  Ndihmë
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Profili Juaj</h1>
              <p className="text-gray-600 mb-8">
                Shikoni dhe menaxhoni informacionet e profilit tuaj
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiUser className="w-5 h-5 mr-2 text-blue-600" />
                    Informacione Personale
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emri i Plotë
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900">{session.user?.name || "Nuk është vendosur"}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Adresa
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900">{session.user?.email}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Roli
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900 capitalize">{session.user?.role}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiShield className="w-5 h-5 mr-2 text-blue-600" />
                    Informacione të Llogarisë
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID e Përdoruesit
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <code className="text-sm font-mono text-gray-900">
                          {session.user?.id}
                        </code>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Statusi i Llogarisë
                      </label>
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <span className="inline-flex items-center text-green-700">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Aktiv
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data e Anëtarësimit
                      </label>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-900">Sot</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistikat Tuaja</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-blue-600 font-medium">Kërkesa</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-xs text-gray-500">Aktiv</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-green-600 font-medium">Oferta</p>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                    <p className="text-xs text-gray-500">Pranuar</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <p className="text-sm text-yellow-600 font-medium">Vlerësimi</p>
                    <p className="text-2xl font-bold text-gray-900">4.8</p>
                    <p className="text-xs text-gray-500">Mesatar</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-sm text-purple-600 font-medium">Profesionistë</p>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                    <p className="text-xs text-gray-500">Kontraktuar</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/profile/edit"
                  className="inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-sm"
                >
                  <FiSettings className="w-5 h-5 mr-2" />
                  Editoni Profilin
                </Link>
                <button className="inline-flex justify-center items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition">
                  Eksportoni Të Dhënat
                </button>
                <button className="inline-flex justify-center items-center px-6 py-3 bg-white border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition">
                  Fshij Llogarinë
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}