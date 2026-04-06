// app/profile/billing/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FiArrowLeft, FiCreditCard, FiPlus, FiTrash2, FiEdit2, FiX } from "react-icons/fi";

interface Card {
    id: string;
    type: string;
    last4: string;
    expiry: string;
    holder: string;
    isDefault: boolean;
}

export default function BillingPage() {
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCard, setEditingCard] = useState<Card | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        holder: "",
        number: "",
        expiry: "",
        cvc: ""
    });

    // Load cards from Local Storage
    useEffect(() => {
        const savedCards = localStorage.getItem("payment_cards");
        if (savedCards) {
            const parsed = JSON.parse(savedCards);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCards(parsed);
        } else {
            // Default mock data if empty
            const initialCards = [
                { id: "1", type: "Visa", last4: "4242", expiry: "12/25", holder: "John Doe", isDefault: true },
                { id: "2", type: "Mastercard", last4: "8888", expiry: "09/24", holder: "John Doe", isDefault: false }
            ];
            setCards(initialCards);
            localStorage.setItem("payment_cards", JSON.stringify(initialCards));
        }
        setLoading(false);
    }, []);

    // Save cards to Local Storage whenever they change
    useEffect(() => {
        if (!loading) {
            localStorage.setItem("payment_cards", JSON.stringify(cards));
        }
    }, [cards, loading]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Simple formatting for card number
        if (name === "number") {
            const numeric = value.replace(/\D/g, "");
            setFormData(prev => ({ ...prev, [name]: numeric }));
            return;
        }

        // Simple formatting for expiry
        if (name === "expiry") {
            let val = value.replace(/\D/g, "");
            if (val.length >= 2) {
                val = val.substring(0, 2) + "/" + val.substring(2, 4);
            }
            setFormData(prev => ({ ...prev, [name]: val }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setEditingCard(null);
        setFormData({ holder: "", number: "", expiry: "", cvc: "" });
        setShowModal(true);
    };

    const openEditModal = (card: Card) => {
        setEditingCard(card);
        setFormData({
            holder: card.holder,
            number: `**** **** **** ${card.last4}`,
            expiry: card.expiry,
            cvc: "***"
        });
        setShowModal(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Jeni i sigurt që doni ta fshini këtë kartë?")) {
            setCards(prev => prev.filter(c => c.id !== id));
        }
    };

    const getVideoCardType = (number: string) => {
        if (number.startsWith("4")) return "Visa";
        if (number.startsWith("5")) return "Mastercard";
        return "Card";
    };

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.holder || !formData.number || !formData.expiry) return;

        if (editingCard) {
            // Update existing
            setCards(prev => prev.map(c => {
                if (c.id === editingCard.id) {
                    // Only update last4 if full number changed (simple check)
                    const last4 = formData.number.includes("*") ? c.last4 : formData.number.slice(-4);
                    return {
                        ...c,
                        holder: formData.holder,
                        expiry: formData.expiry,
                        last4: last4,
                        // type detection could go here
                    };
                }
                return c;
            }));
        } else {
            // Add new
            const newCard: Card = {
                id: Date.now().toString(),
                type: getVideoCardType(formData.number) || "Card",
                last4: formData.number.slice(-4),
                expiry: formData.expiry,
                holder: formData.holder,
                isDefault: cards.length === 0 // First card is default
            };
            setCards(prev => [...prev, newCard]);
        }

        setShowModal(false);
    }, [formData, editingCard, cards.length]);

    const setDefault = (id: string) => {
        setCards(prev => prev.map(c => ({
            ...c,
            isDefault: c.id === id
        })));
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium">
                        <FiArrowLeft className="w-4 h-4 mr-2" />
                        Kthehu në Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Pagesat dhe Faturimi</h1>
                    <p className="text-gray-600 mt-1">Menaxhoni metodat e pagesës</p>
                </div>

                <div className="space-y-6">
                    {/* Payment Methods */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Metodat e Ruajtura</h2>
                            <button
                                onClick={openAddModal}
                                className="text-blue-600 font-medium hover:text-blue-700 text-sm flex items-center bg-blue-50 px-3 py-2 rounded-lg"
                            >
                                <FiPlus className="mr-1" /> Shto të re
                            </button>
                        </div>

                        <div className="space-y-4">
                            {cards.length === 0 && (
                                <p className="text-gray-500 text-center py-4">Nuk keni asnjë kartë të ruajtur.</p>
                            )}

                            {cards.map((card) => (
                                <div key={card.id} className={`flex items-center justify-between p-4 border rounded-xl ${card.isDefault ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200'}`}>
                                    <div className="flex items-center cursor-pointer flex-1" onClick={() => setDefault(card.id)}>
                                        <div className="bg-white p-2 rounded-lg border border-gray-200 mr-4">
                                            <FiCreditCard className={`w-6 h-6 ${card.type === 'Visa' ? 'text-blue-600' : 'text-orange-500'}`} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{card.type} •••• {card.last4}</p>
                                            <p className="text-sm text-gray-500">Skadon {card.expiry} | {card.holder}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        {card.isDefault && (
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mr-2">Kryesore</span>
                                        )}
                                        <button onClick={() => openEditModal(card)} className="p-2 text-gray-400 hover:text-blue-600 transition">
                                            <FiEdit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(card.id)} className="p-2 text-gray-400 hover:text-red-600 transition">
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Billing History */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Historiku i Pagesave</h2>
                        <div className="space-y-4">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                                    <div>
                                        <p className="font-medium text-gray-900">Abonim Mujor - Plan Professional</p>
                                        <p className="text-sm text-gray-500">25 Nëntor 2023</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">19.99€</p>
                                        <p className="text-xs text-green-600">Paguar</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
                            Shiko të gjitha faturat
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-900">
                                {editingCard ? "Ndrysho Kartën" : "Shto Kartë të Re"}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                                <FiX className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Emri në Kartë</label>
                                <input
                                    type="text"
                                    name="holder"
                                    value={formData.holder}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Numri i Kartës</label>
                                <input
                                    type="text"
                                    name="number"
                                    value={formData.number}
                                    onChange={handleInputChange}
                                    placeholder="0000 0000 0000 0000"
                                    maxLength={19}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data e Skadencës</label>
                                    <input
                                        type="text"
                                        name="expiry"
                                        value={formData.expiry}
                                        onChange={handleInputChange}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                    <input
                                        type="text"
                                        name="cvc"
                                        value={formData.cvc}
                                        onChange={handleInputChange}
                                        placeholder="123"
                                        maxLength={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                        required={!editingCard} // Not required on edit
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-500/30"
                                >
                                    {editingCard ? "Ruaj Ndryshimet" : "Shto Kartën"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="w-full mt-2 text-gray-500 font-medium py-2 hover:bg-gray-50 rounded-lg transition"
                                >
                                    Anulo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
