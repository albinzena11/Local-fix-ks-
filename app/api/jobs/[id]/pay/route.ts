import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { providerId, paymentMethod, amount } = body; 
        // paymentMethod can be 'escrow', 'card', 'cash', 'transfer'

        if (!providerId || !paymentMethod || !amount) {
            return NextResponse.json({ error: "Missing required payment fields" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const job = await prisma.job.findUnique({ where: { id } });
        if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

        if (job.clientId !== user.id) {
            return NextResponse.json({ error: "Only the client can hire and pay" }, { status: 403 });
        }

        if (job.status !== "OPEN") {
            return NextResponse.json({ error: "Job is no longer open" }, { status: 400 });
        }

        // SIMULATE PAYMENT PROCESSING HERE
        // For Escrow/Card/Transfer, the money is considered "locked" in platform.
        // For Cash, it's just recorded but not held by platform.
        
        // Update Job Status
        const updatedJob = await prisma.job.update({
            where: { id },
            data: {
                status: "IN_PROGRESS",
                providerId: providerId,
                paymentMethod: paymentMethod,
                escrowAmount: paymentMethod === 'cash' ? 0 : parseFloat(amount),
                clientAccepted: true // Indicate client has accepted the provider
            }
        });

        // Delete any pending offers for this job since someone is hired
        await prisma.offer.updateMany({
            where: { jobId: id, status: "PENDING" },
            data: { status: "REJECTED" }
        });

        // Accept the specific offer if it existed (optional logic)
        await prisma.offer.updateMany({
            where: { jobId: id, providerId: providerId },
            data: { status: "ACCEPTED" }
        });

        return NextResponse.json({ success: true, job: updatedJob });

    } catch (error) {
        console.error("Payment API Error:", error);
        return NextResponse.json({ error: "Internal Payment Processing Error" }, { status: 500 });
    }
}
