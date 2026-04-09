
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userId = session.user.id;
        const isProvider = session.user.role === "PROVIDER";

        if (isProvider) {
            const activeJobs = await prisma.job.count({
                where: { providerId: userId, status: "IN_PROGRESS" }
            });
            const completedJobs = await prisma.job.count({
                where: { providerId: userId, status: "COMPLETED" }
            });

            return NextResponse.json({
                activeJobs,
                completedJobs,
            });
        } else {
            // Client Stats
            const activeRequests = await prisma.job.count({
                where: { clientId: userId, status: "OPEN" }
            });

            const jobs = await prisma.job.findMany({
                where: { clientId: userId },
                select: { id: true }
            });
            const jobIds = jobs.map(j => j.id);

            const offersReceived = await prisma.offer.count({
                where: { jobId: { in: jobIds }, status: "PENDING" }
            });

            const hiredProfessionals = await prisma.job.count({
                where: { clientId: userId, status: { in: ["IN_PROGRESS", "COMPLETED"] }, providerId: { not: null } }
            });

            return NextResponse.json({
                activeRequests,
                offersReceived,
                hiredProfessionals,
            });
        }

    } catch (error) {
        console.error("[STATS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
