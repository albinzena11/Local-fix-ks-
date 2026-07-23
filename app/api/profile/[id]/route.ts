import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/profile/[id] — public profile of any user
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
            bio: true,
            skills: true,
            location: true,
            rating: true,
            createdAt: true,
            providerStatus: true,
            services: {
                where: { isActive: true },
                select: { id: true, title: true, price: true, category: true, images: true },
                take: 6
            },
            reviewsReceived: {
                orderBy: { createdAt: "desc" },
                take: 5,
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    createdAt: true,
                    reviewer: { select: { name: true, avatar: true } },
                    job: { select: { title: true } }
                }
            },
            _count: {
                select: {
                    reviewsReceived: true,
                    providerJobs: true,
                }
            }
        }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Compute average rating
    const avgRating = user.reviewsReceived.length > 0
        ? user.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) / user.reviewsReceived.length
        : 0;

    return NextResponse.json({ ...user, avgRating });
}
