import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/backend/lib/auth";
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

        const { action, proofImage, reason } = await req.json(); // action: 'accept' | 'mark_complete' | 'verify_completion' | 'dispute'
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

        // MARK COMPLETE (Provider finishes work)
        if (action === 'mark_complete' || action === 'complete') {
            if (job.providerId !== user.id) {
                return NextResponse.json({ error: "Only provider can mark as complete" }, { status: 403 });
            }

            const updated = await prisma.job.update({
                where: { id },
                data: {
                    status: 'VERIFY_PENDING',
                    completedAt: new Date(),
                    proofImages: proofImage ? [...job.proofImages, proofImage] : job.proofImages 
                }
            });
            return NextResponse.json(updated);
        }

        // VERIFY COMPLETION (Client confirms)
        if (action === 'verify_completion') {
            if (job.clientId !== user.id) {
                return NextResponse.json({ error: "Only client can verify completion" }, { status: 403 });
            }

            const updated = await prisma.job.update({
                where: { id },
                data: {
                    status: 'COMPLETED',
                    verifiedAt: new Date(),
                    clientAccepted: true,
                    paymentReleased: true
                }
            });
            return NextResponse.json(updated);
        }

        // DISPUTE
        if (action === 'dispute') {
            if (job.clientId !== user.id && job.providerId !== user.id) {
                return NextResponse.json({ error: "Not authorized" }, { status: 403 });
            }

            const updated = await prisma.job.update({
                where: { id },
                data: {
                    status: 'DISPUTED',
                    clientProofImages: (job.clientId === user.id && proofImage) ? [...job.clientProofImages, proofImage] : job.clientProofImages
                }
            });

            // Also create a Dispute record if possible
            try {
                await prisma.dispute.upsert({
                    where: { jobId: id },
                    create: {
                        jobId: id,
                        reason: reason || "No reason provided",
                        createdById: user.id
                    },
                    update: {
                        reason: reason || "No reason provided",
                        status: 'OPEN'
                    }
                });
            } catch (e) {
                console.error("Error creating dispute record:", e);
            }

            return NextResponse.json(updated);
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error) {
        console.error("Error updating job:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
