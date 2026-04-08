import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, location, budget, category, service, phone } = body;

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Update user phone if provided and currently null
    if (phone && !user.phone) {
      await prisma.user.update({
        where: { id: user.id },
        data: { phone }
      });
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        location,
        budget: String(budget),
        category: category || service,
        clientId: user.id,
      }
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode"); // 'my-requests' or 'available'

    if (!session || !session.user?.email) {
      // Allow public viewing of available jobs? Maybe. For now restrict.
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });

    if (mode === 'my-requests' && user) {
      // Jobs created by me
      const jobs = await prisma.job.findMany({
        where: { clientId: user.id },
        orderBy: { createdAt: 'desc' },
        include: { provider: true }
      });
      return NextResponse.json(jobs);
    }

    if (mode === 'my-works' && user) {
      // Jobs assigned to me (Provider)
      const jobs = await prisma.job.findMany({
        where: { providerId: user.id },
        orderBy: { createdAt: 'desc' },
        include: { client: true }
      });
      return NextResponse.json(jobs);
    }

    // Default: Available jobs (OPEN)
    // Filter out my own jobs potentially?
    const jobs = await prisma.job.findMany({
      where: {
        status: 'OPEN',
        // Optional: NOT: { clientId: user.id }
      },
      orderBy: { createdAt: 'desc' },
      include: { client: true }
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}