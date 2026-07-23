import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const job = await prisma.job.findUnique({
            where: { id }
        });

        if (!job) {
            return new NextResponse("Job not found", { status: 404 });
        }

        // Only the client who created the job can verify it
        if (job.clientId !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        if (job.status !== "VERIFY_PENDING") {
            return new NextResponse("Job must be completed by provider first", { status: 400 });
        }

        const updatedJob = await prisma.job.update({
            where: { id },
            data: {
                status: "COMPLETED",
                completedAt: new Date(),
                verifiedAt: new Date(),
                paymentReleased: true, // Escrow released
            }
        });

        // Add a notification for the provider
        if (job.providerId) {
            await prisma.notification.create({
                data: {
                    userId: job.providerId,
                    type: 'success',
                    message: `Klienti e ka verifikuar punën "${job.title}". Fondet (Escrow) janë liruar për ju!`,
                    link: `/dashboard`
                }
            });
        }

        return NextResponse.json(updatedJob);
    } catch (error) {
        console.error("[JOB_VERIFY]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
