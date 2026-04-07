import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Handle checkout in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) throw new Error("Product not found");
      if (product.status !== "ACTIVE") throw new Error("Product is not available for sale");
      if (product.sellerId === (session.user as any).id) throw new Error("You cannot buy your own product");

      const totalAmount = product.price;
      const commissionAmount = totalAmount * 0.08; // 8% commission
      const netoAmount = totalAmount - commissionAmount;

      // Create the Sale record
      const sale = await tx.sale.create({
        data: {
          productId: product.id,
          buyerId: (session.user as any).id,
          sellerId: product.sellerId,
          totalAmount,
          commissionAmount,
          netoAmount,
          status: "COMPLETED", 
        }
      });

      // Mark the product as SOLD
      await tx.product.update({
        where: { id: product.id },
        data: { status: "SOLD" }
      });

      return sale;
    });

    return NextResponse.json({
      success: true,
      message: "Purchase completed successfully",
      sale: result
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error during checkout:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
