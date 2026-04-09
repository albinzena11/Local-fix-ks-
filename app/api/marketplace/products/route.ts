import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const sellerId = searchParams.get("sellerId");
    
    const where: any = { 
       status: { not: "DELETED" }
    };
    
    if (category) where.category = category;
    if (sellerId) where.sellerId = sellerId;
    else where.status = "ACTIVE"; // If browsing, only show active ones

    const products = await (prisma as any).product.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, price, category, images } = body;

    if (!name || !price || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { sellerStatus: true } as any
    });

    if (!user || (user as any).sellerStatus !== "APPROVED") {
        return NextResponse.json({ error: "Duhet të jeni shitës i aprovuar" }, { status: 403 });
    }

    const product = await (prisma as any).product.create({
      data: {
        name,
        description: description || "",
        price: parseFloat(price),
        category,
        images: images || [],
        sellerId: (session.user as any).id,
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
