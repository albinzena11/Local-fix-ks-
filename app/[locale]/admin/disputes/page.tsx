"use client";

import { useState, useEffect } from "react";
import { FiCheckCircle } from "react-icons/fi";

interface Dispute {
    id: string;
    reason: string;
    status: string;
    createdAt: string;
    job: {
        id: string;
        title: string;
        budget: string;
        proofImages: string[];
        clientProofImages: string[];
        client: {
            name: string;
            email: string;
        };
        provider: {
            name: string;
            email: string;
        };
    };
    createdBy: {
        name: string;
        email: string;
    };
}

export default function AdminDisputesPage() {
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDisputes();
    }, []);

    const fetchDisputes = async () => {
        try {
            const res = await fetch("/api/admin/disputes");
            if (res.ok) {
                const data = await res.json();
                setDisputes(data);
            }
        } catch (error) {
            console.error("Error fetching disputes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id: string, resolution: 'RESOLVED_CLIENT' | 'RESOLVED_PROVIDER') => {
        if (!confirm(`Are you sure you want to resolve this dispute in favor of the ${resolution === 'RESOLVED_CLIENT' ? 'Client' : 'Provider'}?`)) return;

        try {
            const res = await fetch("/api/admin/disputes", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ disputeId: id, resolution })
            });

            if (res.ok) {
                setDisputes(disputes.filter(d => d.id !== id));
            } else {
                alert("Failed to resolve dispute. Please try again.");
            }
        } catch (error) {
            console.error("Error resolving dispute", error);
            alert("Error resolving dispute.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dispute Resolution</h1>
                    <p className="text-gray-500 mt-1">Review evidence and resolve conflicts between parties.</p>
                </div>
            </div>

            <div className="space-y-6">
                {loading ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                        Loading disputes...
                    </div>
                ) : disputes.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
                        <div className="mx-auto bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                            <FiCheckCircle className="text-green-500 text-4xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Excellent!</h3>
                        <p className="text-gray-500 max-w-xs mx-auto text-lg">All disputes have been cleared. No pending actions required.</p>
                    </div>
                ) : (
                    disputes.map((dispute) => (
                        <div key={dispute.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Job ID</span>
                                        <p className="text-sm font-mono text-blue-600 font-bold">{dispute.job.id.slice(0, 8)}...</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-extrabold text-gray-900">{dispute.job.title}</h3>
                                        <p className="text-sm text-gray-500">Reported by <span className="font-semibold text-gray-700">{dispute.createdBy.name}</span> • {new Date(dispute.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Job Budget</p>
                                    <span className="text-2xl font-black text-gray-900">€{dispute.job.budget}</span>
                                </div>
                            </div>

                            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* Dispute Reason */}
                                <div className="space-y-4">
                                    <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100 h-full">
                                        <h4 className="flex items-center gap-2 text-red-800 font-bold mb-3 uppercase text-xs tracking-widest">
                                            <span className="bg-red-500 w-2 h-2 rounded-full animate-pulse"></span>
                                            Dispute Reason
                                        </h4>
                                        <p className="text-gray-700 leading-relaxed italic">"{dispute.reason}"</p>
                                        
                                        <div className="mt-8 pt-6 border-t border-red-100/50 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Client</p>
                                                <p className="font-bold text-gray-800">{dispute.job.client.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{dispute.job.client.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Provider</p>
                                                <p className="font-bold text-gray-800">{dispute.job.provider.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{dispute.job.provider.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Evidence Gallery */}
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center justify-between">
                                            Provider Evidence
                                            <span className="text-xs font-normal text-gray-400">{dispute.job.proofImages.length} images</span>
                                        </h4>
                                        {dispute.job.proofImages.length > 0 ? (
                                            <div className="grid grid-cols-3 gap-2">
                                                {dispute.job.proofImages.map((img, i) => (
                                                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group relative">
                                                        <img src={img} alt="Provider proof" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                            <a href={img} target="_blank" className="text-white text-xs font-bold underline">View Full</a>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center">
                                                <p className="text-xs text-gray-400">No images provided by provider</p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center justify-between">
                                            Client Evidence
                                            <span className="text-xs font-normal text-gray-400">{dispute.job.clientProofImages.length} images</span>
                                        </h4>
                                        {dispute.job.clientProofImages.length > 0 ? (
                                            <div className="grid grid-cols-3 gap-2">
                                                {dispute.job.clientProofImages.map((img, i) => (
                                                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group relative">
                                                        <img src={img} alt="Client proof" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                            <a href={img} target="_blank" className="text-white text-xs font-bold underline">View Full</a>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center">
                                                <p className="text-xs text-gray-400">No images provided by client</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex gap-4 justify-end items-center">
                                <p className="text-sm text-gray-400 mr-auto flex items-center gap-2 italic">
                                    Review all evidence before making a final decision. This action cannot be undone.
                                </p>
                                <button
                                    onClick={() => handleResolve(dispute.id, 'RESOLVED_PROVIDER')}
                                    className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-bold shadow-sm transition-all"
                                >
                                    Resolve for Provider
                                </button>
                                <button
                                    onClick={() => handleResolve(dispute.id, 'RESOLVED_CLIENT')}
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-md hover:shadow-lg transition-all"
                                >
                                    Resolve for Client
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
