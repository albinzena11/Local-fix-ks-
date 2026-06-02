import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    
    // Check if user is ADMIN
    if (!session || (session.user as { role?: string }).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    try {
        const disputes = await prisma.dispute.findMany({
            where: {
                status: "OPEN",
            },
            include: {
                job: {
                    include: {
                        client: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                            }
                        },
                        provider: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                            }
                        }
                    }
                },
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(disputes);
    } catch (error) {
        console.error("Admin Disputes GET Error:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as { role?: string }).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    try {
        const { disputeId, resolution } = await req.json();

        if (!disputeId || !['RESOLVED_CLIENT', 'RESOLVED_PROVIDER'].includes(resolution)) {
            return NextResponse.json({ error: "Invalid dispute ID or resolution" }, { status: 400 });
        }

        const dispute = await prisma.dispute.findUnique({
            where: { id: disputeId },
            include: { job: true }
        });

        if (!dispute) {
            return NextResponse.json({ error: "Dispute not found" }, { status: 404 });
        }

        const jobId = dispute.jobId;

        // Perform resolution in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Update Dispute
            const updatedDispute = await tx.dispute.update({
                where: { id: disputeId },
                data: {
                    status: resolution as 'RESOLVED_CLIENT' | 'RESOLVED_PROVIDER',
                    resolution: `Resolved by admin ${session.user?.email} in favor of ${resolution === 'RESOLVED_CLIENT' ? 'Client' : 'Provider'}`
                }
            });

            // Update Job Status
            const newJobStatus = resolution === 'RESOLVED_PROVIDER' ? 'COMPLETED' : 'CANCELLED';
            const updatedJob = await tx.job.update({
                where: { id: jobId },
                data: {
                    status: newJobStatus,
                    paymentReleased: resolution === 'RESOLVED_PROVIDER',
                    verifiedAt: resolution === 'RESOLVED_PROVIDER' ? new Date() : null
                } as any
            });

            // Create notification for both parties
            const notificationBase = {
                type: "DISPUTE_RESOLVED",
                link: `/dashboard/jobs/${jobId}`,
                createdAt: new Date(),
            };

            await tx.notification.createMany({
                data: [
                    {
                        ...notificationBase,
                        userId: updatedJob.clientId,
                        message: `The dispute for job "${updatedJob.title}" has been resolved in favor of the ${resolution === 'RESOLVED_CLIENT' ? 'Client (You)' : 'Provider'}.`
                    },
                    {
                        ...notificationBase,
                        userId: updatedJob.providerId!,
                        message: `The dispute for job "${updatedJob.title}" has been resolved in favor of the ${resolution === 'RESOLVED_PROVIDER' ? 'Provider (You)' : 'Client'}.`
                    }
                ]
            });

            return { updatedDispute, updatedJob };
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Admin Disputes PATCH Error:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
