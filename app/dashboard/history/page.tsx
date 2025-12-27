import { db } from "@/config/db";
import { scans } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { ArrowRight, Calendar, History, ScanSearch } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import Loading from "@/app/loading";

export const dynamic = "force-dynamic";

export default function HistoryPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 animate-in fade-in duration-500 pb-24">
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-900">
                        <History className="w-5 h-5 text-indigo-600" />
                        <span className="font-semibold tracking-tight">
                            Scan History
                        </span>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-6 py-10">
                <Suspense fallback={<div className="flex h-[50vh] w-full items-center justify-center"><Loading className="flex items-center justify-center" /></div>}>
                    <HistoryList />
                </Suspense>
            </main>
        </div>
    );
}

async function HistoryList() {
    const user = await currentUser();

    if (!user || !user.emailAddresses?.[0]?.emailAddress) {
        redirect("/");
    }

    const userScans = await db.query.scans.findMany({
        where: eq(scans.userEmail, user.emailAddresses[0].emailAddress),
        orderBy: [desc(scans.createdAt)],
    });

    if (userScans.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                    <ScanSearch className="w-10 h-10 text-slate-300" />
                </div>
                <div className="space-y-2 max-w-md">
                    <h2 className="text-xl font-bold text-slate-900">No scans yet</h2>
                    <p className="text-slate-500">
                        You haven&apos;t analyzed any ingredients yet. Upload a label to get started!
                    </p>
                </div>
                <Button asChild size="lg" className="rounded-full px-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20">
                    <Link href="/dashboard">
                        Start your first scan
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {userScans.map((scan) => (
                <Link
                    key={scan.id}
                    href={`/dashboard/scan/${scan.id}`}
                    className="group block bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                    <div className="aspect-4/3 w-full bg-slate-50 relative border-b border-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={scan.imageUrl}
                            alt={`Scan ${scan.id}`}
                            className="w-full h-full object-contain p-4 transition-transform duration-300"
                        />
                    </div>
                    <div className="p-4">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(scan.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            Your Scan
                        </h3>
                    </div>
                </Link>
            ))}
        </div>
    );
}