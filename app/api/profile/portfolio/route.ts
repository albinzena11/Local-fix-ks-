import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const portfolio = await prisma.portfolioItem.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(portfolio);
    } catch (error) {
        console.error("Portfolio GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { title, description, imageUrl } = await req.json();

        if (!title || !imageUrl) {
            return NextResponse.json({ error: "Title and Image are required" }, { status: 400 });
        }

        const item = await prisma.portfolioItem.create({
            data: {
                title,
                description,
                imageUrl,
                userId: session.user.id
            }
        });

        return NextResponse.json(item);
    } catch (error) {
        console.error("Portfolio POST Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        // Verify ownership
        const item = await prisma.portfolioItem.findUnique({ where: { id } });
        if (!item || item.userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.portfolioItem.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Portfolio DELETE Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
