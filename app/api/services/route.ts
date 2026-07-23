import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/services?search=...&category=...
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const where: Record<string, unknown> = { isActive: true };

    if (category) where.category = category;
    if (search) {
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
        ];
    }

    try {
        const services = await prisma.service.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                provider: {
                    select: { id: true, name: true, avatar: true, rating: true }
                }
            }
        });
        return NextResponse.json(services);
    } catch (error) {
        console.error("Services GET error:", error);
        return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
    }
}

// POST /api/services — create a new service (provider only)
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.providerStatus !== "APPROVED") {
        return NextResponse.json({ error: "Only approved providers can create services" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, price, category, location, images } = body;

    if (!title || !description || !price || !category) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const service = await prisma.service.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                category,
                location: location || null,
                images: images || [],
                providerId: user.id,
            }
        });
        return NextResponse.json(service, { status: 201 });
    } catch (error) {
        console.error("Service create error:", error);
        return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
    }
}
