import { db } from "@/config/db";
import { scans } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        if (!user || !user.emailAddresses?.[0]?.emailAddress) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { scanId } = body;

        if (!scanId) {
            return NextResponse.json({ error: "Scan ID is required" }, { status: 400 });
        }

        const scan = await db.query.scans.findFirst({
            where: eq(scans.id, scanId),
        });

        if (!scan) {
            return NextResponse.json({ error: "Scan not found" }, { status: 404 });
        }

        if (scan.userEmail !== user.emailAddresses[0].emailAddress) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await db.update(scans)
            .set({ quizCompleted: true })
            .where(eq(scans.id, scanId));

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Quiz completion error:", error);
        return NextResponse.json({ error: "Failed to update quiz status" }, { status: 500 });
    }
}