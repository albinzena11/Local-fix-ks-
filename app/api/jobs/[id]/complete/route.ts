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

        // Only the assigned provider can mark the job as complete
        if (job.providerId !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        if (job.status !== "IN_PROGRESS") {
            return new NextResponse("Job must be in progress to complete", { status: 400 });
        }

        const updatedJob = await prisma.job.update({
            where: { id },
            data: {
                status: "VERIFY_PENDING",
            }
        });

        // Add a notification for the client here if desired
        await prisma.notification.create({
            data: {
                userId: job.clientId,
                type: 'success',
                message: `Profesionisti juaj ka shënuar punën "${job.title}" si të përfunduar. Ju lutem verifikojeni.`,
                link: `/dashboard`
            }
        });

        return NextResponse.json(updatedJob);
    } catch (error) {
        console.error("[JOB_COMPLETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
