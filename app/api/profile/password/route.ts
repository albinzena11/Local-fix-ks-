import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: "Të dhënat janë të paplota." }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: "Fjalëkalimi i ri duhet të ketë të paktën 6 karaktere." }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "Përdoruesi nuk u gjet." }, { status: 404 });
        }

        // Check if the user signed up via OAuth (Google) and doesn't have a password
        if (!user.password) {
            return NextResponse.json({ error: "Llogaria juaj është e lidhur me Google. Nuk mund të ndryshoni fjalëkalimin këtu." }, { status: 400 });
        }

        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return NextResponse.json({ error: "Fjalëkalimi aktual është i pasaktë." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email: session.user.email },
            data: { password: hashedPassword }
        });

        return NextResponse.json({ message: "Fjalëkalimi u ndryshua me sukses!" });
    } catch (error) {
        console.error("Password update error:", error);
        return NextResponse.json({ error: "Ndodhi një gabim gjatë ndryshimit të fjalëkalimit." }, { status: 500 });
    }
}
