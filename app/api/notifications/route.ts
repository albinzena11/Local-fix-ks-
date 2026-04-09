import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const notifications = await prisma.notification.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(notifications);
    } catch {
        return NextResponse.json(
            { error: "Error fetching notifications" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    // Mark as read
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await request.json(); // Notification ID or 'all'

        if (id === 'all') {
            await prisma.notification.updateMany({
                where: { userId: session.user.id, read: false },
                data: { read: true }
            });
        } else {
            await prisma.notification.update({
                where: { id, userId: session.user.id },
                data: { read: true }
            });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { error: "Error updating notification" },
            { status: 500 }
        );
    }
}
