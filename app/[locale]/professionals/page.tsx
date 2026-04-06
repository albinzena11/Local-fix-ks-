"use client";

import { useState } from "react";
import Link from "next/link";
import { FiArrowLeft, FiSearch, FiStar, FiMapPin, FiFilter } from "react-icons/fi";

// Mock data
const professionals = [
    { id: 1, name: "Arben Elezi", category: "Hidraulik", rating: 4.8, reviews: 124, location: "Tiranë", image: null },
    { id: 2, name: "Blerina K.", category: "Pastrim", rating: 4.9, reviews: 85, location: "Durrës", image: null },
    { id: 3, name: "ElektroFix", category: "Elektricist", rating: 4.7, reviews: 210, location: "Tiranë", image: null },
    { id: 4, name: "Gerti Construction", category: "Ndërtim", rating: 4.5, reviews: 56, location: "Elbasan", image: null },
    { id: 5, name: "Mirela S.", category: "Kujdestari", rating: 5.0, reviews: 32, location: "Tiranë", image: null },
];

export default function ProfessionalsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredPros = professionals.filter(pro =>
        (selectedCategory === "All" || pro.category === selectedCategory) &&
        (pro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pro.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium">
                        <FiArrowLeft className="w-4 h-4 mr-2" />
                        Kthehu në Dashboard
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Gjej Profesionistë</h1>
                            <p className="text-gray-600 mt-1">Eksploro ofruesit më të mirë për nevojat tua</p>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Kërko sipas emrit ose shërbimit..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-50 transition ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-300 text-gray-700'}`}
                        >
                            <FiFilter className="mr-2" />
                            Filtra
                        </button>
                    </div>

                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {["All", "Hidraulik", "Elektricist", "Pastrim", "Ndërtim", "Kujdestari"].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {cat === "All" ? "Të gjitha" : cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Professionals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPros.map((pro) => (
                        <div key={pro.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-700 text-xl font-bold">
                                        {pro.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{pro.name}</h3>
                                        <p className="text-blue-600 text-sm font-medium">{pro.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                                    <FiStar className="text-yellow-400 w-4 h-4 mr-1 fill-current" />
                                    <span className="font-bold text-gray-900 text-sm">{pro.rating}</span>
                                </div>
                            </div>

                            <div className="flex items-center text-gray-500 text-sm mb-6">
                                <FiMapPin className="w-4 h-4 mr-1" />
                                {pro.location}
                                <span className="mx-2">•</span>
                                <span>{pro.reviews} vlerësime</span>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">
                                    Kontakto
                                </button>
                                <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-gray-700 font-medium">
                                    Profili
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
