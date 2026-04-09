
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { jobId, price, message } = body;

        if (!jobId || !price) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const offer = await prisma.offer.create({
            data: {
                jobId,
                price: parseFloat(price),
                message,
                providerId: session.user.id,
            }
        });

        return NextResponse.json(offer);
    } catch (error) {
        console.error("[OFFERS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const jobId = searchParams.get("jobId");

        // If jobId is provided, return offers for that job (only for job owner)
        if (jobId) {
            const job = await prisma.job.findUnique({
                where: { id: jobId }
            });

            if (job?.clientId !== session.user.id) {
                return new NextResponse("Forbidden", { status: 403 });
            }

            const offers = await prisma.offer.findMany({
                where: { jobId },
                include: { provider: true } // Include provider details
            });
            return NextResponse.json(offers);
        }

        // Otherwise return offers made by the provider
        const offers = await prisma.offer.findMany({
            where: { providerId: session.user.id },
            include: { job: true }
        });

        return NextResponse.json(offers);

    } catch (error) {
        console.error("[OFFERS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
