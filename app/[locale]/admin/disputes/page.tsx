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
                // Remove from list or update local state
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
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Dispute Resolution</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading disputes...</div>
                ) : disputes.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                            <FiCheckCircle className="text-green-600 text-3xl" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">All Clear!</h3>
                        <p className="text-gray-500">No open disputes requiring attention.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {disputes.map((dispute) => (
                            <div key={dispute.id} className="p-6 hover:bg-gray-50">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                                            Job: {dispute.job.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">Reported by {dispute.createdBy.name} on {new Date(dispute.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                        {dispute.status}
                                    </span>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                                    <h4 className="text-sm font-bold text-gray-700 mb-1">Reason:</h4>
                                    <p className="text-gray-600">{dispute.reason}</p>
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => handleResolve(dispute.id, 'RESOLVED_PROVIDER')}
                                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                    >
                                        Resolve for Provider
                                    </button>
                                    <button
                                        onClick={() => handleResolve(dispute.id, 'RESOLVED_CLIENT')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
                                    >
                                        Resolve for Client
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
