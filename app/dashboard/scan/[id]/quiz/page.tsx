import { db } from "@/config/db";
import { scans } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import QuizClient from "./quiz-client";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function QuizPage({ params }: PageProps) {
    const { id } = await params;
    const user = await currentUser();

    if (!user || !user.emailAddresses?.[0]?.emailAddress) {
        redirect("/");
    }

    const scanId = parseInt(id);
    if (isNaN(scanId)) {
        notFound();
    }

    const scan = await db.query.scans.findFirst({
        where: eq(scans.id, scanId),
    });

    if (!scan) {
        notFound();
    }

    if (scan.userEmail !== user.emailAddresses[0].emailAddress) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-slate-500">You are not authorized to take this quiz.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <QuizClient scanId={scanId} />
        </div>
    );
}