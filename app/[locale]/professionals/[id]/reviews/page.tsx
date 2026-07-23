"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiStar, FiArrowLeft, FiUser, FiMessageSquare } from "react-icons/fi";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewer: { name: string | null; avatar: string | null };
  job: { title: string };
}

interface ReviewsData {
  reviews: Review[];
  avgRating: number;
  count: number;
}

function StarDisplay({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const sz = size === "lg" ? "w-6 h-6" : "w-4 h-4";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <FiStar
          key={s}
          className={`${sz} ${rating >= s ? "text-amber-400" : "text-slate-200"}`}
          fill={rating >= s ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

const RATING_DIST_LABEL: Record<number, string> = {
  5: "Shkëlqyeshëm",
  4: "Mirë",
  3: "Mesatar",
  2: "Keq",
  1: "Shumë keq",
};

export default function ProviderReviewsPage() {
  const params = useParams();
  const providerId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/reviews?revieweeId=${providerId}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [providerId]);

  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: data?.reviews.filter(r => r.rating === star).length || 0,
    pct: data?.count
      ? Math.round((data.reviews.filter(r => r.rating === star).length / data.count) * 100)
      : 0
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="space-y-3 w-full max-w-2xl px-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-white rounded-2xl h-28 shadow-sm" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition-colors mb-8">
          <FiArrowLeft /> Kthehu
        </Link>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <h1 className="text-2xl font-black text-slate-900 mb-4">Vlerësimet e Profesionistit</h1>

          {data && data.count > 0 ? (
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Big rating */}
              <div className="text-center flex-shrink-0">
                <div className="text-5xl font-black text-slate-900">{data.avgRating.toFixed(1)}</div>
                <StarDisplay rating={Math.round(data.avgRating)} size="lg" />
                <p className="text-xs text-slate-400 font-bold mt-1">{data.count} vlerësime</p>
              </div>

              {/* Distribution bars */}
              <div className="flex-1 space-y-2 w-full">
                {distribution.map(({ star, count: cnt, pct }) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-500 w-16 flex-shrink-0 text-right">
                      {RATING_DIST_LABEL[star]}
                    </span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-amber-400 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-black text-slate-400 w-6 flex-shrink-0">{cnt}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FiStar className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 font-bold">Ky profesionist nuk ka akoma vlerësime.</p>
            </div>
          )}
        </div>

        {/* Reviews List */}
        {data && data.reviews.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-black text-slate-900 text-sm uppercase tracking-widest px-1">
              Të gjitha vlerësimet
            </h2>
            {data.reviews.map(review => (
              <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                      {review.reviewer.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={review.reviewer.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <FiUser className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-sm">
                        {review.reviewer.name || "Klient"}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        {new Date(review.createdAt).toLocaleDateString("sq-AL", {
                          day: "numeric", month: "long", year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>
                  <StarDisplay rating={review.rating} />
                </div>

                {/* Job label */}
                <p className="text-xs text-blue-600 font-black bg-blue-50 px-3 py-1 rounded-full w-fit flex items-center gap-1">
                  <FiMessageSquare className="w-3 h-3" />
                  {review.job.title}
                </p>

                {/* Comment */}
                {review.comment && (
                  <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
