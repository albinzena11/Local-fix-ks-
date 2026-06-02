import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as { role?: string }).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    try {
        const jobs = await prisma.job.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                provider: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        return NextResponse.json(jobs);
    } catch (error) {
        console.error("Admin Jobs GET Error:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as { role?: string }).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    try {
        const { jobId, status } = await req.json();

        if (!jobId || !status) {
            return NextResponse.json({ error: "Job ID and status are required" }, { status: 400 });
        }

        const updatedJob = await prisma.job.update({
            where: { id: jobId },
            data: { status }
        });

        return NextResponse.json(updatedJob);
    } catch (error) {
        console.error("Admin Job PATCH Error:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as { role?: string }).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
        }

        await prisma.job.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Job deleted successfully" });
    } catch (error) {
        console.error("Admin Job DELETE Error:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
