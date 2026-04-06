"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowLeft, FiPlus, FiEdit, FiTrash2, FiTool, FiCheck, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";

type Service = {
    id: string;
    title: string;
    price: number;
    duration?: string;
    description: string;
    category: string;
    isActive: boolean;
};

export default function ServicesPage() {
    const [myServices, setMyServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        duration: "",
        description: "",
        category: "General"
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services/mine");
            if (res.ok) {
                const data = await res.json();
                setMyServices(data);
            }
        } catch {
            toast.error("Gabim në marrjen e shërbimeve");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Jeni të sigurt që doni ta fshini këtë shërbim?")) return;

        try {
            const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
            if (res.ok) {
                setMyServices(prev => prev.filter(s => s.id !== id));
                toast.success("Shërbimi u fshi me sukses");
            } else {
                toast.error("Gabim gjatë fshirjes");
            }
        } catch {
            toast.error("Gabim gjatë fshirjes");
        }
    };

    const handleToggleStatus = async (service: Service) => {
        try {
            const updatedStatus = !service.isActive;
            const res = await fetch(`/api/services/${service.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: updatedStatus })
            });

            if (res.ok) {
                setMyServices(prev => prev.map(s => s.id === service.id ? { ...s, isActive: updatedStatus } : s));
                toast.success(`Shërbimi tani është ${updatedStatus ? 'aktiv' : 'jo-aktiv'}`);
            }
        } catch {
            toast.error("Gabim gjatë ndryshimit të statusit");
        }
    };

    const handleEdit = (service: Service) => {
        setEditingId(service.id);
        setFormData({
            title: service.title,
            price: service.price.toString(),
            duration: service.duration || "",
            description: service.description,
            category: service.category
        });
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditingId(null);
        setFormData({ title: "", price: "", duration: "", description: "", category: "General" });
        setIsFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingId ? `/api/services/${editingId}` : "/api/services";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success(editingId ? "Shërbimi u përditësua" : "Shërbimi u krijua");
                setIsFormOpen(false);
                fetchServices();
            } else {
                const data = await res.json();
                toast.error(data.error || "Ndodhi një gabim");
            }
        } catch (error) {
            console.error(error);
            toast.error("Ndodhi një gabim");
        }
    };

    if (loading) return <div className="p-8 text-center">Duke ngarkuar...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium">
                        <FiArrowLeft className="w-4 h-4 mr-2" />
                        Kthehu në Dashboard
                    </Link>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Shërbimet e Mia</h1>
                            <p className="text-gray-600 mt-1">
                                Menaxho ofertat dhe çmimet. Këto shërbime do të jenë të dukshme për klientët.
                            </p>
                        </div>
                        <button
                            onClick={handleAddNew}
                            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-sm"
                        >
                            <FiPlus className="mr-2" />
                            Shto Shërbim
                        </button>
                    </div>
                </div>

                {isFormOpen && (
                    <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-6 mb-8 animate-fade-in-down">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">{editingId ? 'Ndrysho Shërbimin' : 'Shto Shërbim të Ri'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Titulli i Shërbimit</label>
                                    <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="p.sh. Montim Kondicioneri" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Çmimi (€)</label>
                                    <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="p.sh. 50" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategoria</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    >
                                        <option value="General">Të përgjithshme</option>
                                        <option value="Plumbing">Hidraulik</option>
                                        <option value="Electrical">Elektricist</option>
                                        <option value="Cleaning">Pastrim</option>
                                        <option value="Construction">Ndërtim</option>
                                        <option value="IT">IT & Teknologji</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kohëzgjatja (opcionale)</label>
                                    <input type="text" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="p.sh. 2 orë" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Përshkrimi</label>
                                <textarea required rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="Përshkruani shkurtimisht çfarë ofroni..." />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Anullo</button>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">{editingId ? 'Ruaj Ndryshimet' : 'Shto Shërbimin'}</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                    {myServices.length === 0 && !isFormOpen && (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500 mb-4">Nuk keni asnjë shërbim të regjistruar akoma.</p>
                            <button onClick={handleAddNew} className="text-blue-600 font-bold hover:underline">Shto të parin</button>
                        </div>
                    )}

                    {myServices.map((service) => (
                        <div key={service.id} className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${service.isActive ? 'border-gray-200' : 'border-gray-100 opacity-75 grayscale-[0.5]'}`}>
                            <div className="flex items-start space-x-4">
                                <div className={`p-3 rounded-lg ${service.isActive ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <FiTool className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-gray-900 text-lg">{service.title}</h3>
                                        {!service.isActive && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">Jo Aktiv</span>}
                                    </div>
                                    <p className="text-gray-500 text-sm mt-1">{service.description}</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm font-medium text-gray-700">
                                        <span className="bg-gray-100 px-3 py-1 rounded-full">{service.price} €</span>
                                        {service.duration && <span className="bg-gray-100 px-3 py-1 rounded-full">{service.duration}</span>}
                                        <span className="text-gray-400 text-xs uppercase">{service.category}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                                <button
                                    onClick={() => handleToggleStatus(service)}
                                    className={`flex-1 sm:flex-none flex items-center justify-center px-4 py-2 border rounded-lg font-medium transition ${service.isActive ? 'border-orange-200 text-orange-600 hover:bg-orange-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                                    title={service.isActive ? "Çaktivizo" : "Aktivizo"}
                                >
                                    {service.isActive ? <FiX className="mr-2" /> : <FiCheck className="mr-2" />}
                                    {service.isActive ? "Ndal" : "Aktivizo"}
                                </button>
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition"
                                >
                                    <FiEdit className="mr-2 h-4 w-4" /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition"
                                >
                                    <FiTrash2 className="mr-2 h-4 w-4" /> Fshi
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
