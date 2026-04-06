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
        // For seller application, we might just need a request
        // or maybe some details like what they intend to sell.
        const { reason } = await req.json();

        // Update user status to PENDING for seller
        await prisma.user.update({
            where: { id: session.user.id },
            data: { sellerStatus: "PENDING" } as any
        });

        // We could also create a log or a specific model if needed, 
        // but for now, the status on User is enough to track.
        
        return NextResponse.json({ success: true, status: "PENDING" });
    } catch (error) {
        return NextResponse.json({ error: "Gabim gjatë dërgimit të kërkesës." }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Paautorizuar" }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { sellerStatus: true } as any
        });

        return NextResponse.json({ status: user?.sellerStatus || "NONE" });
    } catch (error) {
        return NextResponse.json({ error: "Gabim gjatë marrjes së statusit." }, { status: 500 });
    }
}
