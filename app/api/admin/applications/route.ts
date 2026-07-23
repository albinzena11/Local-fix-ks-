import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProviderStatus } from "@prisma/client";

// GET /api/admin/applications — Fetch pending provider applications
export async function GET() {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const applications = await prisma.providerApplication.findMany({
            where: { status: "PENDING" },
            include: {
                user: {
                    select: { name: true, email: true, avatar: true, createdAt: true }
                }
            },
            orderBy: { createdAt: "asc" }
        });

        return NextResponse.json(applications);
    } catch (error) {
        console.error("Admin applications error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

// PATCH /api/admin/applications — Approve or Reject application
export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { applicationId, status } = await req.json(); // 'APPROVED' or 'REJECTED'

        if (!applicationId || !["APPROVED", "REJECTED"].includes(status)) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const application = await prisma.providerApplication.findUnique({
            where: { id: applicationId }
        });

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        // Update application status
        await prisma.providerApplication.update({
            where: { id: applicationId },
            data: { status: status as ProviderStatus }
        });

        // Update user status
        await prisma.user.update({
            where: { id: application.userId },
            data: {
                providerStatus: status as ProviderStatus,
                ...(status === "APPROVED" && { role: "PROVIDER" })
            }
        });

        return NextResponse.json({ success: true, message: `Application ${status}` });
    } catch (error) {
        console.error("Admin applications patch error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
