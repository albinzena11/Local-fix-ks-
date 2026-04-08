"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/frontend/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FiArrowLeft, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

interface Job {
    id: string;
    title: string;
    description: string;
    location: string;
    budget: string;
    status: string;
    proofImages?: string[];
}

export default function JobDetailsPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const t = useTranslations('jobForm'); 

    // Actions
    const [uploading, setUploading] = useState(false);
    const [disputeReason, setDisputeReason] = useState("");
    const [showDisputeModal, setShowDisputeModal] = useState(false);

    const fetchJob = useCallback(async () => {
        try {
            const res = await fetch(`/api/jobs/${id}`);
            if (res.ok) {
                setJob(await res.json());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchJob();
    }, [fetchJob]);

    const handleAccept = async () => {
        if (!confirm("Are you sure you want to accept this job?")) return;
        try {
            await fetch(`/api/jobs/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "accept" })
            });
            fetchJob();
        } catch (e) { console.error(e); }
    };

    const handleComplete = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result as string;
            try {
                await fetch(`/api/jobs/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "complete", proofImage: base64 })
                });
                fetchJob();
            } catch (e) { console.error(e); }
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleDispute = async () => {
        if (!disputeReason) return;
        try {
            await fetch(`/api/disputes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId: id, reason: disputeReason })
            });
            setShowDisputeModal(false);
            fetchJob();
        } catch (e) { console.error(e); }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!job) return <div className="p-10 text-center">Job not found</div>;

    const isCompleted = job.status === "COMPLETED";
    const isDisputed = job.status === "DISPUTED";
    const isInProgress = job.status === "IN_PROGRESS";
    const isOpen = job.status === "OPEN";

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
            <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-md">
                <div className="mb-6 flex justify-between items-center">
                    <Link href="/dashboard" className="flex items-center text-blue-600 hover:underline">
                        <FiArrowLeft className="mr-2" /> {t('backToDashboard')}
                    </Link>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${isOpen ? "bg-green-100 text-green-700" :
                        isInProgress ? "bg-blue-100 text-blue-700" :
                            isCompleted ? "bg-gray-100 text-gray-700" :
                                "bg-red-100 text-red-700"
                        }`}>
                        {job.status}
                    </span>
                </div>

                <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                <p className="text-gray-500 mb-6">{job.location} | {job.budget}</p>

                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                    <h3 className="font-bold mb-2">Description</h3>
                    <p className="text-gray-700">{job.description}</p>
                </div>

                {/* PROOFS SECTION */}
                {(isCompleted || isDisputed) && job.proofImages && job.proofImages.length > 0 && (
                    <div className="mb-8 p-4 border rounded-xl">
                        <h3 className="font-bold mb-4 flex items-center">
                            <FiCheckCircle className="mr-2 text-green-600" />
                            Work Proof
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {job.proofImages.map((img: string, idx: number) => (
                                <Image key={idx} src={img} alt="Proof" width={300} height={200} className="w-full h-48 object-cover rounded-lg border" />
                            ))}
                        </div>
                    </div>
                )}

                {/* STATUS ACTIONS */}
                <div className="border-t pt-6 flex flex-col gap-4">
                    {isOpen && (
                        <button
                            onClick={handleAccept}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold"
                        >
                            Accept This Job (Provider)
                        </button>
                    )}

                    {isInProgress && (
                        <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center">
                            <p className="font-bold mb-2 text-blue-800">Job In Progress</p>
                            <p className="text-sm text-blue-600 mb-4">When work is done, upload a photo to complete.</p>
                            <label className="cursor-pointer bg-white border border-blue-200 text-blue-600 px-6 py-2 rounded-lg hover:bg-white/80 transition shadow-sm">
                                {uploading ? "Uploading..." : "📷 Upload Proof & Complete"}
                                <input type="file" accept="image/*" className="hidden" onChange={handleComplete} disabled={uploading} />
                            </label>
                        </div>
                    )}

                    {!isDisputed && !isOpen && (
                        <button
                            onClick={() => setShowDisputeModal(true)}
                            className="text-red-500 text-sm font-medium hover:underline mt-2 self-center flex items-center"
                        >
                            <FiAlertTriangle className="mr-1" /> Report a Problem / Dispute
                        </button>
                    )}

                    {isDisputed && (
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-800">
                            <p className="font-bold flex items-center"><FiAlertTriangle className="mr-2" /> Job is in Dispute</p>
                            <p className="text-sm mt-1">Admin will review the proofs and resolve this case.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* DISPUTE MODAL */}
            {showDisputeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Report Dispute</h3>
                        <textarea
                            className="w-full border p-2 rounded mb-4"
                            rows={4}
                            placeholder="Describe the problem..."
                            value={disputeReason}
                            onChange={e => setDisputeReason(e.target.value)}
                        />
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setShowDisputeModal(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                            <button onClick={handleDispute} className="px-4 py-2 bg-red-600 text-white rounded">Submit Report</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
