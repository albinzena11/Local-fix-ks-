import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/services/[id]
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Special: /api/services/mine — fetch current user's services
    if (id === "mine") {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
        const services = await prisma.service.findMany({
            where: { providerId: user.id },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(services);
    }

    const service = await prisma.service.findUnique({
        where: { id },
        include: {
            provider: {
                select: { id: true, name: true, avatar: true, rating: true, bio: true, location: true }
            }
        }
    });

    if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(service);
}

// PATCH /api/services/[id] — update
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });
    if (service.providerId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const updated = await prisma.service.update({
        where: { id },
        data: {
            title: body.title ?? service.title,
            description: body.description ?? service.description,
            price: body.price != null ? parseFloat(body.price) : service.price,
            category: body.category ?? service.category,
            location: body.location ?? service.location,
            images: body.images ?? service.images,
            isActive: body.isActive ?? service.isActive,
        }
    });
    return NextResponse.json(updated);
}

// DELETE /api/services/[id]
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });
    if (service.providerId !== user.id && user.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
