import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/backend/lib/auth";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Paautorizuar" }, { status: 401 });
    }

    try {
        const { category, bio, experience } = await req.json();

        // Check if already pending
        const existing = await (prisma as any).providerApplication.findFirst({
            where: { userId: session.user.id, status: "PENDING" }
        });

        if (existing) {
            return NextResponse.json({ error: "Keni një kërkesë aktive në pritje." }, { status: 400 });
        }

        const newApplication = await (prisma as any).providerApplication.create({
            data: {
                userId: session.user.id,
                category,
                bio,
                experience,
                status: "PENDING"
            }
        });

        // Update user status
        await prisma.user.update({
            where: { id: session.user.id },
            data: { providerStatus: "PENDING" } as any
        });

        return NextResponse.json(newApplication, { status: 201 });
    } catch (error) {
        console.error("Provider application error:", error);
        return NextResponse.json({ error: "Gabim gjatë dërgimit të kërkesës." }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Paautorizuar" }, { status: 401 });
    }

    try {
        const application = await (prisma as any).providerApplication.findUnique({
            where: { userId: session.user.id },
        });

        return NextResponse.json(application || { status: "NONE" });
    } catch (error) {
        return NextResponse.json({ error: "Gabim gjatë marrjes së kërkesës." }, { status: 500 });
    }
}
