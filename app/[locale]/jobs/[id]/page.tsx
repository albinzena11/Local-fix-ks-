"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FiArrowLeft, FiAlertTriangle, FiCheckCircle, FiClock, FiUpload } from "react-icons/fi";
import { useSession } from "next-auth/react";

interface Job {
    id: string;
    title: string;
    description: string;
    location: string;
    budget: string;
    status: string;
    clientId: string;
    client: { email: string; name?: string };
    providerId?: string;
    proofImages: string[];
    clientProofImages: string[];
    clientAccepted: boolean;
    paymentReleased: boolean;
}

export default function JobDetailsPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const t = useTranslations('jobForm'); 
    const te = useTranslations('escrow');

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
                    body: JSON.stringify({ 
                        action: isDisputed ? "dispute" : "mark_complete", 
                        proofImage: base64 
                    })
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

    const { data: session } = useSession();
    const isCompleted = job.status === "COMPLETED";
    const isDisputed = job.status === "DISPUTED";
    const isVerifyPending = job.status === "VERIFY_PENDING";
    const isInProgress = job.status === "IN_PROGRESS";
    const isOpen = job.status === "OPEN";

    const isClient = session?.user?.email === job.client?.email || (session?.user as any)?.id === job.clientId;
    const isProvider = (session?.user as any)?.id === job.providerId;

    const handleVerify = async () => {
        if (!confirm(te('confirmVerify'))) return;
        try {
            await fetch(`/api/jobs/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "verify_completion" })
            });
            fetchJob();
        } catch (e) { console.error(e); }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
            <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-md">
                <div className="mb-6 flex justify-between items-center">
                    <Link href="/dashboard" className="flex items-center text-blue-600 hover:underline">
                        <FiArrowLeft className="mr-2" /> {te('backToDashboard')}
                    </Link>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold shadow-sm ${isOpen ? "bg-green-100 text-green-700" :
                        isInProgress ? "bg-blue-100 text-blue-700" :
                        isVerifyPending ? "bg-yellow-100 text-yellow-700" :
                            isCompleted ? "bg-emerald-100 text-emerald-700" :
                                "bg-red-100 text-red-700"
                        }`}>
                        {isVerifyPending ? te('verifyPending').toUpperCase() : job.status}
                    </span>
                </div>

                <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                <p className="text-gray-500 mb-6">{job.location} | {job.budget}</p>

                {/* DESCRIPTION */}
                <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <FiClock className="text-blue-600" />
                        {t('detailedDescription')}
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>
                </div>

                {/* PROOFS SECTION */}
                {(isCompleted || isDisputed || isVerifyPending) && (
                    <div className="space-y-6 mb-8">
                        {job.proofImages.length > 0 && (
                            <div className="p-4 border rounded-xl bg-gray-50">
                                <h3 className="font-bold mb-4 flex items-center text-gray-900">
                                    <FiCheckCircle className="mr-2 text-green-600" />
                                    {te('workProofProvider')}
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {job.proofImages.map((img: string, idx: number) => (
                                        <div key={idx} className="relative group overflow-hidden rounded-lg border shadow-sm">
                                            <Image src={img} alt="Provider Proof" width={300} height={200} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {job.clientProofImages.length > 0 && (
                            <div className="p-4 border rounded-xl bg-red-50/30">
                                <h3 className="font-bold mb-4 flex items-center text-gray-900">
                                    <FiAlertTriangle className="mr-2 text-red-600" />
                                    {te('workProofClient')}
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {job.clientProofImages.map((img: string, idx: number) => (
                                        <div key={idx} className="relative group overflow-hidden rounded-lg border shadow-sm">
                                            <Image src={img} alt="Client Proof" width={300} height={200} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* STATUS ACTIONS */}
                <div className="border-t pt-6 flex flex-col gap-4">
                    {isOpen && !isClient && (
                        <button
                            onClick={handleAccept}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                            {te('acceptJob')}
                        </button>
                    )}

                    {isInProgress && isProvider && (
                        <div className="bg-blue-50 p-6 rounded-2xl flex flex-col items-center border border-blue-100">
                            <FiClock className="text-4xl text-blue-600 mb-3" />
                            <p className="font-bold mb-1 text-blue-900">{te('inProgress')}</p>
                            <p className="text-sm text-blue-600 mb-6 text-center">{te('inProgressDesc')}</p>
                            <label className="cursor-pointer bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 font-bold flex items-center gap-2">
                                {uploading ? te('uploading') : <><FiUpload /> {te('uploadProofAndComplete')}</>}
                                <input type="file" accept="image/*" className="hidden" onChange={handleComplete} disabled={uploading} />
                            </label>
                        </div>
                    )}

                    {isVerifyPending && (
                        <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600 text-2xl">
                                    <FiClock />
                                </div>
                                <div>
                                    <p className="font-black text-yellow-900">{te('verifyPending')}</p>
                                    <p className="text-xs text-yellow-700">{te('verifyPendingDesc')}</p>
                                </div>
                            </div>
                            
                            {isClient ? (
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={handleVerify}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-black shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <FiCheckCircle /> {te('verifyAndPay')}
                                    </button>
                                    <button 
                                        onClick={() => setShowDisputeModal(true)}
                                        className="w-full bg-white border-2 border-red-100 text-red-600 py-4 rounded-xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <FiAlertTriangle /> {te('openDispute')}
                                    </button>
                                </div>
                            ) : (
                                <p className="text-sm text-yellow-800 font-medium bg-white/50 p-4 rounded-xl border border-yellow-100">
                                    {te('waitingClient')}
                                </p>
                            )}
                        </div>
                    )}

                    {isCompleted && (
                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 text-2xl">
                                <FiCheckCircle />
                            </div>
                            <div>
                                <p className="font-black text-emerald-900">{te('jobCompleted')}</p>
                                <p className="text-xs text-emerald-700">{te('paymentProcessed')}</p>
                            </div>
                        </div>
                    )}

                    {!isDisputed && !isOpen && !isCompleted && (
                        <button
                            onClick={() => setShowDisputeModal(true)}
                            className="text-red-500 text-sm font-semibold hover:underline mt-4 self-center flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
                        >
                            <FiAlertTriangle /> {te('reportProblem')}
                        </button>
                    )}

                    {isDisputed && (
                        <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-red-900">
                            <div className="flex items-center gap-3 mb-4">
                                <FiAlertTriangle className="text-2xl text-red-600" />
                                <p className="font-black">{te('disputeTitle')}</p>
                            </div>
                            <p className="text-sm bg-white/50 p-4 rounded-xl border border-red-100">
                                {te('disputeDesc')}
                                {isClient && (
                                    <label className="mt-4 block cursor-pointer bg-red-600 text-white text-center py-2 rounded-lg font-bold">
                                        {uploading ? te('uploading') : te('uploadAdditionalProof')}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleComplete} disabled={uploading} />
                                    </label>
                                )}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* DISPUTE MODAL */}
            {showDisputeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-all">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl scale-100 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 text-2xl">
                                <FiAlertTriangle />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">{te('reportDispute')}</h3>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-4">{te('disputeDesc')}</p>
                        
                        <textarea
                            className="w-full border-2 border-gray-100 p-4 rounded-xl mb-6 focus:border-red-500 outline-none transition-colors min-h-[120px] text-gray-700"
                            placeholder={te('disputeReasonPlaceholder')}
                            value={disputeReason}
                            onChange={e => setDisputeReason(e.target.value)}
                        />
                        
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={handleDispute} 
                                className="w-full bg-red-600 text-white py-4 rounded-xl font-black hover:bg-red-700 transition shadow-lg shadow-red-100"
                            >
                                {te('submitReport')}
                            </button>
                            <button 
                                onClick={() => setShowDisputeModal(false)} 
                                className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition"
                            >
                                {te('cancel', { defaultValue: 'Anulo' })}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
