"use client";

import { useState, useEffect, useCallback } from "react";
import { FiStar, FiSend, FiCheckCircle, FiUser } from "react-icons/fi";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: { name: string | null; avatar: string | null };
  job?: { title: string };
}

interface ReviewSectionProps {
  jobId: string;
  isClient: boolean;
  isCompleted: boolean;
  revieweeId?: string;
}

function StarRating({ value, onChange, readonly = false }: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`text-2xl transition-all ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
        >
          <FiStar
            className={`w-6 h-6 transition-colors ${
              (hovered || value) >= star
                ? "text-amber-400 fill-amber-400"
                : "text-slate-300"
            }`}
            fill={(hovered || value) >= star ? "currentColor" : "none"}
          />
        </button>
      ))}
    </div>
  );
}

const RATING_LABELS: Record<number, string> = {
  1: "Shumë keq",
  2: "Keq",
  3: "Mesatar",
  4: "Mirë",
  5: "Shkëlqyeshëm!"
};

export default function ReviewSection({ jobId, isClient, isCompleted }: ReviewSectionProps) {
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const fetchReview = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?jobId=${jobId}`);
      if (res.ok) {
        const data = await res.json();
        setExistingReview(data || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (isCompleted) fetchReview();
    else setLoading(false);
  }, [isCompleted, fetchReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, rating, comment })
      });

      if (res.ok) {
        setSubmitted(true);
        fetchReview();
      } else {
        const data = await res.json();
        if (res.status === 409) {
          setError("Keni lënë tashmë një vlerësim për këtë punë.");
        } else {
          setError(data.error || "Ndodhi një gabim. Provoni përsëri.");
        }
      }
    } catch (e) {
      console.error(e);
      setError("Problem me lidhjen. Kontrolloni internetin.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isCompleted) return null;
  if (loading) return (
    <div className="animate-pulse bg-slate-100 rounded-2xl h-32 mt-6" />
  );

  return (
    <div className="mt-6 border-t border-slate-100 pt-6">
      <h3 className="font-black text-slate-900 text-lg mb-4 flex items-center gap-2">
        <FiStar className="text-amber-400" />
        Vlerësimi i Punës
      </h3>

      {/* Existing review — show to everyone */}
      {existingReview ? (
        <div className="bg-white border-2 border-amber-100 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden flex-shrink-0">
              {existingReview.reviewer.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={existingReview.reviewer.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <FiUser className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="font-black text-slate-900 text-sm">
                {existingReview.reviewer.name || "Klient"}
              </p>
              <p className="text-xs text-slate-400 font-medium">
                {new Date(existingReview.createdAt).toLocaleDateString("sq-AL", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </p>
            </div>
            <div className="ml-auto">
              <StarRating value={existingReview.rating} readonly />
            </div>
          </div>

          {existingReview.comment && (
            <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
              &ldquo;{existingReview.comment}&rdquo;
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold">
            <FiCheckCircle className="w-4 h-4" />
            Vlerësim i verifikuar
          </div>
        </div>
      ) : isClient ? (
        // Review form — only for client who hasn't reviewed yet
        submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
            <FiCheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <p className="font-black text-emerald-900">Faleminderit për vlerësimin!</p>
            <p className="text-emerald-700 text-sm mt-1">Feedback-u juaj ndihmon profesionistët të rriten.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 space-y-4">
            <p className="text-sm text-slate-600 font-semibold">
              Si ishte shërbimi? Lini feedback-un tuaj për të ndihmuar të tjerët.
            </p>

            {/* Stars */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Vlerësimi juaj *
              </label>
              <StarRating value={rating} onChange={setRating} />
              {rating > 0 && (
                <p className="text-sm font-black text-amber-500 animate-in fade-in duration-200">
                  {RATING_LABELS[rating]}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Komenti (opsional)
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Tregoni të tjerëve si ishte puna, pikat e forta, dhe nëse e rekomandoni..."
                className="w-full px-4 py-3 border-2 border-slate-200 bg-white rounded-xl focus:border-blue-500 outline-none text-slate-700 text-sm font-medium resize-none transition-all"
              />
              <p className="text-xs text-slate-400 text-right">{comment.length}/500</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!rating || submitting}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span className="animate-pulse">Duke dërguar...</span>
              ) : (
                <><FiSend className="w-4 h-4" /> Dërgo Vlerësimin</>
              )}
            </button>
          </form>
        )
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
          <FiStar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500 text-sm font-medium">Klienti nuk ka lënë akoma vlerësim për këtë punë.</p>
        </div>
      )}
    </div>
  );
}
