import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/backend/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    
    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    try {
        const services = await prisma.service.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                provider: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        return NextResponse.json(services);
    } catch (error) {
        console.error("Admin Services GET Error:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    
    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
        }

        await prisma.service.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Service deleted successfully" });
    } catch (error) {
        console.error("Admin Service DELETE Error:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
