"use client";

import { useState, useEffect } from "react";
import { FiCheckCircle, FiXCircle, FiUser, FiBriefcase } from "react-icons/fi";
import { useSession } from "next-auth/react";

interface Application {
    id: string;
    category: string;
    bio: string;
    experience: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
        avatar: string | null;
        createdAt: string;
    };
}

export default function AdminApplicationsPage() {
    const { data: session } = useSession();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchApplications = async () => {
        try {
            const res = await fetch("/api/admin/applications");
            if (res.ok) {
                const data = await res.json();
                setApplications(data);
            }
        } catch (error) {
            console.error("Failed to fetch applications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
        setActionLoading(id);
        try {
            const res = await fetch("/api/admin/applications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ applicationId: id, status })
            });

            if (res.ok) {
                // Remove from list
                setApplications(prev => prev.filter(app => app.id !== id));
            } else {
                alert("Ndodhi një gabim gjatë përditësimit.");
            }
        } catch (error) {
            console.error(error);
            alert("Ndodhi një gabim.");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div className="text-center py-20 text-slate-500">Duke ngarkuar...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2 text-slate-900">Aplikimet e Profesionistëve</h1>
            <p className="text-slate-500 mb-8">Shikoni dhe menaxhoni kërkesat për t'u bërë profesionist në platformë.</p>

            {applications.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 shadow-sm">
                    <FiBriefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">Nuk ka aplikime të reja</h3>
                    <p className="text-slate-500 mt-1">Të gjitha kërkesat janë shqyrtuar.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {applications.map((app) => (
                        <div key={app.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* User Info */}
                                <div className="lg:w-1/3 flex gap-4 border-r border-slate-100 pr-6">
                                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                                        {app.user.avatar ? (
                                            <img src={app.user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <FiUser />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">{app.user.name || "Përdorues i panjohur"}</h3>
                                        <p className="text-slate-500 text-sm">{app.user.email}</p>
                                        <p className="text-xs text-slate-400 mt-2">
                                            Anëtarësuar: {new Date(app.user.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Application Details */}
                                <div className="lg:w-2/3">
                                    <div className="mb-4">
                                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold uppercase tracking-wider mb-2">
                                            {app.category}
                                        </span>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                            <div className="bg-slate-50 p-4 rounded-xl">
                                                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Eksperienca</p>
                                                <p className="text-slate-700 text-sm">{app.experience}</p>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-xl">
                                                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Biografia</p>
                                                <p className="text-slate-700 text-sm">{app.bio}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                                        <button
                                            onClick={() => handleAction(app.id, "REJECTED")}
                                            disabled={actionLoading === app.id}
                                            className="px-5 py-2 text-red-600 font-bold hover:bg-red-50 rounded-xl transition flex items-center gap-2 disabled:opacity-50"
                                        >
                                            <FiXCircle /> Refuzo
                                        </button>
                                        <button
                                            onClick={() => handleAction(app.id, "APPROVED")}
                                            disabled={actionLoading === app.id}
                                            className="px-6 py-2 bg-blue-600 text-white font-bold hover:bg-blue-700 rounded-xl transition flex items-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-50"
                                        >
                                            <FiCheckCircle /> Aprovo Profesionistin
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
