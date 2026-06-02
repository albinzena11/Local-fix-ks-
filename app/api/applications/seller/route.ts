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
        await req.json().catch(() => ({}));

        // Update user status to PENDING for seller
        await prisma.user.update({
            where: { id: session.user.id },
            data: { sellerStatus: "PENDING" }
        });

        return NextResponse.json({ success: true, status: "PENDING" });
    } catch (error) {
        console.error("Seller application error:", error);
        return NextResponse.json({ error: "Gabim gjatë dërgimit të kërkesës." }, { status: 500 });
    }
}

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Paautorizuar" }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { sellerStatus: true }
        });

        return NextResponse.json({ status: user?.sellerStatus || "NONE" });
    } catch (error) {
        console.error("Get seller status error:", error);
        return NextResponse.json({ error: "Gabim gjatë marrjes së statusit." }, { status: 500 });
    }
}
