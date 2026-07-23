"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiArrowLeft, FiCreditCard, FiCheckCircle, FiAlertCircle,
  FiDollarSign, FiLock, FiShield, FiInfo
} from "react-icons/fi";
import { BsBank2, BsCash } from "react-icons/bs";

type PaymentMethod = "escrow" | "card" | "cash" | "transfer";

interface PaymentHistory {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "refunded";
  method: string;
}

const MOCK_HISTORY: PaymentHistory[] = [
  { id: "1", description: "Riparim elektrik - Burim H.", amount: 45, date: "18 Korrik 2026", status: "completed", method: "Escrow" },
  { id: "2", description: "Pastrimi i apartamentit - Arta K.", amount: 30, date: "10 Korrik 2026", status: "completed", method: "Cash" },
  { id: "3", description: "Montim mobiljesh - Driton M.", amount: 60, date: "02 Korrik 2026", status: "pending", method: "Escrow" },
];

export default function BillingPage() {
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>("escrow");
  const [savedPreference, setSavedPreference] = useState<PaymentMethod | null>(null);
  const [saved, setSaved] = useState(false);

  // Card form state
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Bank transfer state
  const [ibanSaved, setIbanSaved] = useState(false);

  useEffect(() => {
    const pref = localStorage.getItem("payment_preference") as PaymentMethod | null;
    if (pref) {
      setActiveMethod(pref);
      setSavedPreference(pref);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("payment_preference", activeMethod);
    setSavedPreference(activeMethod);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const formatCardNumber = (val: string) => {
    const numeric = val.replace(/\D/g, "").substring(0, 16);
    return numeric.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const numeric = val.replace(/\D/g, "").substring(0, 4);
    if (numeric.length >= 2) return numeric.substring(0, 2) + "/" + numeric.substring(2);
    return numeric;
  };

  const getStatusColor = (status: PaymentHistory["status"]) => {
    if (status === "completed") return "text-emerald-600 bg-emerald-50";
    if (status === "pending") return "text-amber-600 bg-amber-50";
    return "text-slate-500 bg-slate-100";
  };

  const getStatusLabel = (status: PaymentHistory["status"]) => {
    if (status === "completed") return "Paguar";
    if (status === "pending") return "Në pritje";
    return "Rimbursuar";
  };

  const methods = [
    {
      id: "escrow" as PaymentMethod,
      icon: <FiLock className="w-6 h-6" />,
      title: "Paguaj pas punës (Escrow)",
      subtitle: "Metoda kryesore & e rekomanduar",
      desc: "Paratë mbahen të bllokuara deri kur të konfirmoni që puna është bërë siç duhet. Nëse keni problem, hapet disputa dhe i kthehen paratë.",
      badge: "E REKOMANDUAR",
      badgeColor: "bg-emerald-100 text-emerald-700",
      color: "border-blue-500 bg-blue-50/30",
    },
    {
      id: "card" as PaymentMethod,
      icon: <FiCreditCard className="w-6 h-6" />,
      title: "Kartë Bankare (Visa / Mastercard)",
      subtitle: "BKT, Raiffeisen, ProCredit, TEB etj.",
      desc: "Paguani me kartën tuaj të debitit ose kreditit. Pranohen kartat e lëshuara nga të gjitha bankat e Kosovës.",
      badge: null,
      badgeColor: "",
      color: "border-slate-300 bg-white",
    },
    {
      id: "cash" as PaymentMethod,
      icon: <BsCash className="w-6 h-6" />,
      title: "Pagesa me para në dorë",
      subtitle: "Paguani direkt te profesionisti",
      desc: "Bien dakord me profesionistin dhe paguani cash pas kryerjes së shërbimit. Kjo metodë nuk ofron mbrojtje nga platforma.",
      badge: "PA MBROJTJE",
      badgeColor: "bg-amber-100 text-amber-700",
      color: "border-slate-300 bg-white",
    },
    {
      id: "transfer" as PaymentMethod,
      icon: <BsBank2 className="w-6 h-6" />,
      title: "Transfertë Bankare",
      subtitle: "Nëpërmjet sistemit bankar",
      desc: "Bëni transfertë direkte në llogarinë bankare të profesionistit. Kjo metodë ka vonesë 1-2 ditë pune.",
      badge: null,
      badgeColor: "",
      color: "border-slate-300 bg-white",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-slate-500 hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition-colors mb-6">
            <FiArrowLeft className="mr-2" /> Kthehu në Dashboard
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pagesat & Faturimi</h1>
          <p className="text-slate-500 mt-1 font-medium">Zgjidhni metodën e pagesës që i përshtatet nevojave tuaja</p>
        </div>

        {/* Escrow Info Banner */}
        <div className="bg-blue-600 text-white rounded-2xl p-5 mb-8 flex gap-4 items-start shadow-lg shadow-blue-200">
          <FiShield className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-black text-sm">Sistemi Escrow i LocalFIX</p>
            <p className="text-blue-100 text-sm mt-1">
              Paratë tuaja mbahen të sigurta nga platforma deri kur të konfirmoni punën. Nuk rrezikoni asgjë.
            </p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-black text-slate-900 mb-5">Zgjidhni Metodën e Pagesës</h2>
          <div className="space-y-3">
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMethod(m.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  activeMethod === m.id ? m.color + " ring-2 ring-blue-400/40" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${activeMethod === m.id ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                    {m.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-slate-900 text-sm">{m.title}</span>
                      {m.badge && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${m.badgeColor}`}>
                          {m.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-semibold">{m.subtitle}</p>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{m.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 transition-all ${
                    activeMethod === m.id ? "border-blue-500 bg-blue-500" : "border-slate-300"
                  }`}>
                    {activeMethod === m.id && <div className="w-full h-full rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full" /></div>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Card Details (only when card selected) */}
        {activeMethod === "card" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 animate-in slide-in-from-top-2 duration-200">
            <h2 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              <FiCreditCard className="text-blue-600" /> Të dhënat e Kartës
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Emri në Kartë</label>
                <input
                  value={cardHolder}
                  onChange={e => setCardHolder(e.target.value)}
                  placeholder="p.sh. Albin Krasniqi"
                  className="w-full px-4 py-3 border-2 border-slate-100 bg-slate-50 rounded-xl focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-700 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Numri i Kartës</label>
                <input
                  value={cardNumber}
                  onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  className="w-full px-4 py-3 border-2 border-slate-100 bg-slate-50 rounded-xl focus:border-blue-500 focus:bg-white outline-none font-mono font-bold text-slate-700 tracking-widest transition-all"
                />
                <p className="text-xs text-slate-400 mt-1.5 font-medium flex items-center gap-1">
                  <FiInfo className="w-3 h-3" /> Pranohen kartat e BKT, Raiffeisen, ProCredit, TEB dhe bankave të tjera
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Data e Skadencës</label>
                  <input
                    value={cardExpiry}
                    onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/VV"
                    maxLength={5}
                    className="w-full px-4 py-3 border-2 border-slate-100 bg-slate-50 rounded-xl focus:border-blue-500 focus:bg-white outline-none font-mono font-bold text-slate-700 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">CVC / CVV</label>
                  <input
                    value={cardCvc}
                    onChange={e => setCardCvc(e.target.value.replace(/\D/g, "").substring(0, 4))}
                    placeholder="•••"
                    maxLength={4}
                    type="password"
                    className="w-full px-4 py-3 border-2 border-slate-100 bg-slate-50 rounded-xl focus:border-blue-500 focus:bg-white outline-none font-mono font-bold text-slate-700 transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-xl p-3">
                <FiLock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="font-semibold">Të dhënat tuaja janë të enkriptuara dhe të sigurta (SSL 256-bit)</span>
              </div>
            </div>
          </div>
        )}

        {/* Bank Transfer Info */}
        {activeMethod === "transfer" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 animate-in slide-in-from-top-2 duration-200">
            <h2 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              <BsBank2 className="text-blue-600" /> Informacion për Transfertën
            </h2>
            <div className="space-y-3 text-sm">
              <div className="bg-slate-50 rounded-xl p-4 font-mono text-slate-700 space-y-1">
                <p><span className="font-black text-slate-900">Emri:</span> LocalFIX Kosovo Sh.p.k</p>
                <p><span className="font-black text-slate-900">IBAN:</span> XK05 1212 0123 4567 8906</p>
                <p><span className="font-black text-slate-900">Banka:</span> Banka për Biznes (BpB)</p>
                <p><span className="font-black text-slate-900">Swift:</span> BPBKXKPR</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-xl p-3">
                <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold">Shënoni numrin e porosisë tuaj në fushën "qëllimi i pagesës" gjatë transfertës.</span>
              </div>
              {!ibanSaved ? (
                <button
                  onClick={() => setIbanSaved(true)}
                  className="w-full py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition text-sm"
                >
                  E kuptova — Konfirmo transfertën
                </button>
              ) : (
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 rounded-xl p-3">
                  <FiCheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="font-bold text-xs">Transferta e konfirmuar. Pritini 1-2 ditë pune.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cash Warning */}
        {activeMethod === "cash" && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 animate-in slide-in-from-top-2 duration-200">
            <div className="flex gap-3 items-start">
              <FiAlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-amber-900 text-sm">Kujdes me pagesën cash</p>
                <p className="text-amber-800 text-xs mt-1 leading-relaxed">
                  Pagesa me para në dorë nuk ofron mbrojtjen e sistemit Escrow. Nëse profesionisti nuk e kryen punën si duhet, platforma nuk mund të kthejë paratë tuaja. Rekomandojmë metodën Escrow.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black text-base rounded-2xl shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          {saved ? (
            <><FiCheckCircle className="w-5 h-5" /> Preferencat u ruajtën!</>
          ) : (
            <><FiDollarSign className="w-5 h-5" /> Ruaj Metodën e Pagesës</>
          )}
        </button>

        {savedPreference && (
          <p className="text-center text-xs text-slate-400 font-bold mt-3">
            Metoda aktive: <span className="text-blue-600">{methods.find(m => m.id === savedPreference)?.title}</span>
          </p>
        )}

        {/* Payment History */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-8">
          <h2 className="text-lg font-black text-slate-900 mb-5">Historiku i Pagesave</h2>
          <div className="space-y-3">
            {MOCK_HISTORY.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiDollarSign className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{item.description}</p>
                    <p className="text-xs text-slate-400 font-medium">{item.date} · {item.method}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-black text-slate-900">{item.amount}€</p>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${getStatusColor(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-5 py-3 border-2 border-slate-200 rounded-xl text-slate-600 font-black text-sm hover:bg-slate-50 transition">
            Shiko të gjitha pagesat
          </button>
        </div>

      </div>
    </div>
  );
}
