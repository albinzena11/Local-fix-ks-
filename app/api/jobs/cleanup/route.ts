import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const now = new Date();
        const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
        const twentyHoursAgo = new Date(now.getTime() - 20 * 60 * 60 * 1000);
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // 1. Find jobs to auto-verify (> 24h)
        const autoVerifyJobs = await prisma.job.findMany({
            where: {
                status: 'VERIFY_PENDING',
                completedAt: { lt: twentyFourHoursAgo }
            }
        });

        for (const job of autoVerifyJobs) {
            await prisma.job.update({
                where: { id: job.id },
                data: {
                    status: 'COMPLETED',
                    clientAccepted: true,
                    paymentReleased: true,
                    verifiedAt: new Date()
                }
            });
            
            // Create a notification for the provider
            await prisma.notification.create({
                data: {
                    userId: job.providerId!,
                    type: 'success',
                    message: `Puna "${job.title}" është verifikuar automatikisht sepse klienti nuk u përgjigj mbrenda 24 orëve.`,
                    link: `/jobs/${job.id}`
                }
            });
        }

        // 2. Find jobs for 2nd reminder (> 20h, sent < 2)
        const secondReminderJobs = await prisma.job.findMany({
            where: {
                status: 'VERIFY_PENDING',
                completedAt: { lt: twentyHoursAgo },
                remindersSent: 1
            }
        });

        for (const job of secondReminderJobs) {
            await prisma.notification.create({
                data: {
                    userId: job.clientId,
                    type: 'warning',
                    message: `Përkujtim i dytë: Ju lutem verifikoni punën "${job.title}". Ajo do të verifikohet automatikisht në 4 orët e ardhshme.`,
                    link: `/jobs/${job.id}`
                }
            });
            await prisma.job.update({
                where: { id: job.id },
                data: { remindersSent: 2 }
            });
        }

        // 3. Find jobs for 1st reminder (> 12h, sent < 1)
        const firstReminderJobs = await prisma.job.findMany({
            where: {
                status: 'VERIFY_PENDING',
                completedAt: { lt: twelveHoursAgo },
                remindersSent: 0
            }
        });

        for (const job of firstReminderJobs) {
            await prisma.notification.create({
                data: {
                    userId: job.clientId,
                    type: 'info',
                    message: `Përkujtim: Ju lutem verifikoni nese puna "${job.title}" është kryer.`,
                    link: `/jobs/${job.id}`
                }
            });
            await prisma.job.update({
                where: { id: job.id },
                data: { remindersSent: 1 }
            });
        }

        return NextResponse.json({ 
            processed: autoVerifyJobs.length, 
            reminders1: firstReminderJobs.length,
            reminders2: secondReminderJobs.length
        });
    } catch (error) {
        console.error("Cleanup error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
