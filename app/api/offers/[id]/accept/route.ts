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

        const offer = await prisma.offer.findUnique({
            where: { id },
            include: { job: true }
        });

        if (!offer) {
            return new NextResponse("Offer not found", { status: 404 });
        }

        // Only the client of the job can accept the offer
        if (offer.job.clientId !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        if (offer.job.status !== "OPEN") {
            return new NextResponse("Job is no longer open", { status: 400 });
        }

        // Update Job: set status to IN_PROGRESS, assign provider, setup escrow
        const updatedJob = await prisma.job.update({
            where: { id: offer.jobId },
            data: {
                status: "IN_PROGRESS",
                providerId: offer.providerId,
                escrowAmount: offer.price,
                paymentMethod: "CASH_ESCROW",
            }
        });

        // Also we could mark the offer as accepted or delete other offers, but keeping it simple for MVP
        
        return NextResponse.json(updatedJob);
    } catch (error) {
        console.error("[OFFER_ACCEPT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
