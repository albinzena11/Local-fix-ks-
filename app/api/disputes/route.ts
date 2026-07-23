import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { jobId, reason } = await req.json();

        if (!jobId || !reason) {
            return NextResponse.json({ error: "Job ID and reason are required" }, { status: 400 });
        }

        // Create the dispute and update job status in a transaction
        const result = await prisma.$transaction([
            prisma.dispute.create({
                data: {
                    jobId,
                    reason,
                    createdById: session.user.id,
                    status: "OPEN"
                }
            }),
            prisma.job.update({
                where: { id: jobId },
                data: { status: "DISPUTED" }
            })
        ]);

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error("Dispute Error:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
