import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    
    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    try {
        const [
            totalUsers,
            activeProviders,
            totalJobs,
            openDisputes,
            recentUsers,
            recentJobs
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: "PROVIDER" } }),
            prisma.job.count(),
            prisma.dispute.count({ where: { status: "OPEN" } }),
            prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                select: { id: true, name: true, email: true, role: true, createdAt: true }
            }),
            prisma.job.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: { client: { select: { name: true } } }
            })
        ]);

        // Mock revenue for now (logic would depend on payment system)
        const revenue = "1,250.00";

        return NextResponse.json({
            stats: {
                totalUsers,
                activeProviders,
                totalJobs,
                openDisputes,
                revenue
            },
            recentUsers,
            recentJobs
        });
    } catch (error) {
        console.error("Admin Stats GET Error:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
