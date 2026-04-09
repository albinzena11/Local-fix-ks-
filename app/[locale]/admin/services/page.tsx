
"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiTrash2 } from "react-icons/fi";

interface Service {
    id: string;
    title: string;
    category: string;
    price: number;
    provider: {
        name: string;
        email: string;
    };
    isActive: boolean;
}

export default function AdminServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await fetch("/api/admin/services");
            if (res.ok) {
                const data = await res.json();
                setServices(data);
            }
        } catch (error) {
            console.error("Error fetching services", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteService = async (id: string) => {
        if (!confirm("Are you sure you want to remove this service?")) return;

        try {
            const res = await fetch(`/api/admin/services?id=${id}`, {
                method: "DELETE"
            });

            if (res.ok) {
                setServices(services.filter(s => s.id !== id));
            }
        } catch (error) {
            console.error("Error deleting service", error);
        }
    };

    const filteredServices = services.filter(service =>
        service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.provider.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Service Management</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search services..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {loading ? (
                        <div className="col-span-full text-center py-12 text-gray-500">Loading services...</div>
                    ) : filteredServices.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-500">No services found.</div>
                    ) : (
                        filteredServices.map((service) => (
                            <div key={service.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                                        {service.category}
                                    </span>
                                    <span className="font-bold text-gray-900">€{service.price}</span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-1">{service.title}</h3>
                                <p className="text-sm text-gray-500 mb-4">by {service.provider.name}</p>

                                <div className="flex gap-2 border-t pt-4">
                                    <button
                                        onClick={() => handleDeleteService(service.id)}
                                        className="flex-1 flex items-center justify-center py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <FiTrash2 className="mr-2" /> Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
