"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FiArrowLeft, FiAlertTriangle, FiCheckCircle, FiClock, FiUpload } from "react-icons/fi";
import ReviewSection from "@/components/ReviewSection";
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
    const { data: session } = useSession();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const t = useTranslations('jobForm'); 
    const te = useTranslations('escrow');

    const [uploading, setUploading] = useState(false);
    const [disputeReason, setDisputeReason] = useState("");
    const [showDisputeModal, setShowDisputeModal] = useState(false);
    
    // Offers and Payment State
    const [offers, setOffers] = useState<any[]>([]);
    const [showCheckout, setShowCheckout] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState("escrow");
    const [isPaying, setIsPaying] = useState(false);

    const [offerPrice, setOfferPrice] = useState("");
    const [offerMessage, setOfferMessage] = useState("");
    const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);
    const [hasSubmittedOffer, setHasSubmittedOffer] = useState(false);

    const fetchJob = useCallback(async () => {
        try {
            const res = await fetch(`/api/jobs/${id}`);
            if (res.ok) {
                const data = await res.json();
                setJob(data);
                
                // Fetch offers if client and job is open
                if (data.status === "OPEN" && (session?.user?.email === data.client?.email || session?.user?.id === data.clientId)) {
                    const offersRes = await fetch(`/api/offers?jobId=${id}`);
                    if (offersRes.ok) {
                        setOffers(await offersRes.json());
                    }
                }
                
                // If provider, check if they already submitted an offer
                if (data.status === "OPEN" && session?.user?.role === "PROVIDER") {
                    const offersRes = await fetch(`/api/offers`);
                    if (offersRes.ok) {
                        const myOffers = await offersRes.json();
                        const submitted = myOffers.find((o: any) => o.jobId === id);
                        if (submitted) setHasSubmittedOffer(true);
                    }
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [id, session]);

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

    const handleHireAndPay = async () => {
        if (!selectedOffer) return;
        setIsPaying(true);
        try {
            const res = await fetch(`/api/jobs/${id}/pay`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    providerId: selectedOffer.providerId,
                    paymentMethod: paymentMethod,
                    amount: selectedOffer.price
                })
            });

            if (res.ok) {
                setShowCheckout(false);
                fetchJob();
                alert("Pagesa u krye me sukses! Profesionisti u punësua.");
            } else {
                alert("Ndodhi një gabim gjatë pagesës.");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsPaying(false);
        }
    };

    const handleMakeOffer = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingOffer(true);
        try {
            const res = await fetch('/api/offers', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jobId: id,
                    price: offerPrice,
                    message: offerMessage
                })
            });

            if (res.ok) {
                setHasSubmittedOffer(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmittingOffer(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!job) return <div className="p-10 text-center">Job not found</div>;

    const isCompleted = job.status === "COMPLETED";
    const isDisputed = job.status === "DISPUTED";
    const isVerifyPending = job.status === "VERIFY_PENDING";
    const isInProgress = job.status === "IN_PROGRESS";
    const isOpen = job.status === "OPEN";

    const isClient = session?.user?.email === job.client?.email || session?.user?.id === job.clientId;
    const isProvider = session?.user?.id === job.providerId;

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

                {/* OFFERS SECTION (Only for client when OPEN) */}
                {isOpen && isClient && (
                    <div className="mb-8">
                        <h3 className="font-black text-xl mb-4 text-slate-900">Ofertat ({offers.length})</h3>
                        {offers.length === 0 ? (
                            <p className="text-slate-500 bg-slate-50 p-4 rounded-xl text-center">Nuk ka asnjë ofertë akoma.</p>
                        ) : (
                            <div className="space-y-4">
                                {offers.map(offer => (
                                    <div key={offer.id} className="border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 bg-white shadow-sm hover:shadow-md transition">
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                                {offer.provider.name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{offer.provider.name}</p>
                                                <p className="text-sm text-slate-500 line-clamp-2">{offer.message}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                            <p className="font-black text-xl text-blue-600">{offer.price}€</p>
                                            <button 
                                                onClick={() => { setSelectedOffer(offer); setShowCheckout(true); }}
                                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md"
                                            >
                                                Punëso
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

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
                    {isOpen && !isClient && !isProvider && (
                        <p className="text-slate-500 text-center">Duhet të jeni i regjistruar si Profesionist për të dërguar një ofertë.</p>
                    )}
                    
                    {isOpen && isProvider && !hasSubmittedOffer && (
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                            <h3 className="font-black text-lg mb-4">Dërgo një Ofertë</h3>
                            <form onSubmit={handleMakeOffer} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Çmimi i Ofertës (€)</label>
                                    <input 
                                        type="number" 
                                        required 
                                        value={offerPrice}
                                        onChange={(e) => setOfferPrice(e.target.value)}
                                        className="w-full p-3 border border-slate-300 rounded-xl focus:border-blue-600 outline-none" 
                                        placeholder="Psh: 50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Mesazhi për Klientin</label>
                                    <textarea 
                                        required
                                        value={offerMessage}
                                        onChange={(e) => setOfferMessage(e.target.value)}
                                        className="w-full p-3 border border-slate-300 rounded-xl focus:border-blue-600 outline-none min-h-[100px]"
                                        placeholder="Pse duhet t'ju zgjedhë juve..."
                                    ></textarea>
                                </div>
                                <button disabled={isSubmittingOffer} className="w-full bg-blue-600 text-white font-black py-3 rounded-xl hover:bg-blue-700 transition">
                                    {isSubmittingOffer ? "Duke u dërguar..." : "Dërgo Ofertën"}
                                </button>
                            </form>
                        </div>
                    )}
                    
                    {isOpen && isProvider && hasSubmittedOffer && (
                        <div className="bg-green-50 p-6 rounded-2xl flex items-center justify-center gap-3 border border-green-200">
                            <FiCheckCircle className="text-2xl text-green-600" />
                            <p className="font-bold text-green-900">Oferta juaj është dërguar me sukses. Prisni përgjigjen e klientit.</p>
                        </div>
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
                        <div className="space-y-0">
                            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 text-2xl">
                                    <FiCheckCircle />
                                </div>
                                <div>
                                    <p className="font-black text-emerald-900">{te('jobCompleted')}</p>
                                    <p className="text-xs text-emerald-700">{te('paymentProcessed')}</p>
                                </div>
                            </div>
                            <ReviewSection
                                jobId={id!}
                                isClient={isClient}
                                isCompleted={isCompleted}
                                revieweeId={job.providerId}
                            />
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
            {/* Checkout Modal */}
            {showCheckout && selectedOffer && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white max-w-md w-full rounded-3xl p-8 shadow-2xl relative">
                        <button onClick={() => setShowCheckout(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Paguaj & Punëso</h2>
                        <p className="text-slate-500 mb-6 font-medium">Jeni duke punësuar <b>{selectedOffer.provider.name}</b> për <b>{selectedOffer.price}€</b>.</p>
                        
                        <div className="space-y-3 mb-8">
                            <label className={`block border-2 p-4 rounded-xl cursor-pointer transition ${paymentMethod === 'escrow' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="payment" value="escrow" checked={paymentMethod === 'escrow'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-blue-600" />
                                    <div>
                                        <p className="font-bold text-slate-900">Escrow (E Rekomanduar)</p>
                                        <p className="text-xs text-slate-500">Paratë mbahen nga platforma derisa puna të kryhet.</p>
                                    </div>
                                </div>
                            </label>
                            <label className={`block border-2 p-4 rounded-xl cursor-pointer transition ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-blue-600" />
                                    <div>
                                        <p className="font-bold text-slate-900">Kartë Bankare</p>
                                        <p className="text-xs text-slate-500">Paguaj menjëherë me Visa/Mastercard.</p>
                                    </div>
                                </div>
                            </label>
                            <label className={`block border-2 p-4 rounded-xl cursor-pointer transition ${paymentMethod === 'cash' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 accent-blue-600" />
                                    <div>
                                        <p className="font-bold text-slate-900">Cash / Dorazi</p>
                                        <p className="text-xs text-slate-500">Pa mbrojtje Escrow nga platforma.</p>
                                    </div>
                                </div>
                            </label>
                        </div>
                        
                        <button 
                            onClick={handleHireAndPay}
                            disabled={isPaying}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-200 transition disabled:opacity-70"
                        >
                            {isPaying ? "Duke procesuar..." : `Paguaj ${selectedOffer.price}€`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
