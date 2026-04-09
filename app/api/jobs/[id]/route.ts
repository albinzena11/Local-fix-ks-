import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // Fetch single job details
    const job = await prisma.job.findUnique({
        where: { id },
        include: {
            client: true,
            provider: true,
            dispute: true
        }
    });

    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
    return NextResponse.json(job);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { action, proofImage } = await req.json(); // action: 'accept' | 'complete'
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const job = await prisma.job.findUnique({ where: { id } });
        if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

        // ACCEPT JOB
        if (action === 'accept') {
            if (job.status !== 'OPEN') {
                return NextResponse.json({ error: "Job is not open" }, { status: 400 });
            }
            // Provider cannot be client
            if (job.clientId === user.id) {
                return NextResponse.json({ error: "Cannot accept your own job" }, { status: 400 });
            }

            const updated = await prisma.job.update({
                where: { id },
                data: {
                    status: 'IN_PROGRESS',
                    providerId: user.id
                }
            });
            return NextResponse.json(updated);
        }

        // COMPLETE JOB (Upload Proof)
        if (action === 'complete') {
            // Only involved parties can complete? Usually Provider completes, Client confirms. 
            // For simplicity: Provider uploads proof and marks complete.
            if (job.providerId !== user.id && job.clientId !== user.id) {
                return NextResponse.json({ error: "Not authorized" }, { status: 403 });
            }

            const updated = await prisma.job.update({
                where: { id },
                data: {
                    status: 'COMPLETED',
                    proofImages: proofImage ? [proofImage] : job.proofImages // Append or replace? Simple replacement or single add for now
                }
            });
            return NextResponse.json(updated);
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error) {
        console.error("Error updating job:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
