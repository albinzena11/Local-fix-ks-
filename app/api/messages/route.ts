import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/messages — get all conversations for current user
// GET /api/messages?conversationId=xxx — get messages in a conversation
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (conversationId) {
        // Get messages in conversation
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: { participants: { select: { id: true } } }
        });

        if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

        const isParticipant = conversation.participants.some(p => p.id === user.id);
        if (!isParticipant) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" },
            include: {
                sender: { select: { id: true, name: true, avatar: true } }
            }
        });
        return NextResponse.json(messages);
    }

    // Get all conversations
    const conversations = await prisma.conversation.findMany({
        where: {
            participants: { some: { id: user.id } }
        },
        orderBy: { updatedAt: "desc" },
        include: {
            participants: { select: { id: true, name: true, avatar: true } },
            messages: {
                orderBy: { createdAt: "desc" },
                take: 1,
                select: { content: true, createdAt: true, senderId: true }
            }
        }
    });

    return NextResponse.json(conversations);
}

// POST /api/messages — send a message
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { recipientId, content, conversationId } = await req.json();

    if (!content?.trim()) {
        return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    }

    let convId = conversationId;

    if (!convId) {
        // Find or create conversation between two users
        if (!recipientId) return NextResponse.json({ error: "recipientId required" }, { status: 400 });

        const existing = await prisma.conversation.findFirst({
            where: {
                AND: [
                    { participants: { some: { id: user.id } } },
                    { participants: { some: { id: recipientId } } }
                ]
            }
        });

        if (existing) {
            convId = existing.id;
        } else {
            const newConv = await prisma.conversation.create({
                data: {
                    participants: {
                        connect: [{ id: user.id }, { id: recipientId }]
                    }
                }
            });
            convId = newConv.id;
        }
    }

    const message = await prisma.message.create({
        data: {
            content: content.trim(),
            senderId: user.id,
            conversationId: convId
        },
        include: {
            sender: { select: { id: true, name: true, avatar: true } }
        }
    });

    // Update conversation timestamp
    await prisma.conversation.update({
        where: { id: convId },
        data: { updatedAt: new Date() }
    });

    return NextResponse.json(message, { status: 201 });
}
