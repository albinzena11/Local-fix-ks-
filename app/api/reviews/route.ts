import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/reviews?jobId=xxx  OR  GET /api/reviews?revieweeId=xxx
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");
    const revieweeId = searchParams.get("revieweeId");

    if (jobId) {
        const review = await prisma.review.findFirst({
            where: { jobId },
            include: { reviewer: { select: { name: true, avatar: true } } }
        });
        return NextResponse.json(review);
    }

    if (revieweeId) {
        const reviews = await prisma.review.findMany({
            where: { revieweeId },
            orderBy: { createdAt: "desc" },
            include: {
                reviewer: { select: { name: true, avatar: true } },
                job: { select: { title: true } }
            }
        });

        const avg = reviews.length
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        return NextResponse.json({ reviews, avgRating: avg, count: reviews.length });
    }

    return NextResponse.json({ error: "Provide jobId or revieweeId" }, { status: 400 });
}

// POST /api/reviews
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { jobId, rating, comment } = await req.json();

        if (!jobId || !rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Validate job
        const job = await prisma.job.findUnique({ where: { id: jobId } });
        if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

        // Only client of that completed job can review
        if (job.clientId !== user.id) {
            return NextResponse.json({ error: "Only the client can leave a review" }, { status: 403 });
        }
        if (job.status !== "COMPLETED") {
            return NextResponse.json({ error: "Job must be completed first" }, { status: 400 });
        }
        if (!job.providerId) {
            return NextResponse.json({ error: "No provider assigned" }, { status: 400 });
        }

        // Check if already reviewed
        const existing = await prisma.review.findFirst({ where: { jobId } });
        if (existing) {
            return NextResponse.json({ error: "Already reviewed" }, { status: 409 });
        }

        // Create review
        const review = await prisma.review.create({
            data: {
                jobId,
                rating,
                comment: comment || null,
                reviewerId: user.id,
                revieweeId: job.providerId
            }
        });

        // Update provider's average rating
        const allReviews = await prisma.review.findMany({
            where: { revieweeId: job.providerId }
        });
        const avgRating = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
        await prisma.user.update({
            where: { id: job.providerId },
            data: { rating: Math.round(avgRating * 10) / 10 }
        });

        return NextResponse.json(review, { status: 201 });

    } catch (error) {
        console.error("Review error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
