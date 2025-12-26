import { db } from "@/config/db";
import { scans } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { ArrowLeft, BrainCircuit, CheckCircle2, ChevronRight, Scale, ScanSearch, Sparkles, Info, AlertCircle, HelpCircle, Clock } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ReactMarkdown, { Components } from "react-markdown";
import { Button } from "@/components/ui/button";

interface PageProps {
    params: Promise<{ id: string }>;
}

interface IngredientData {
    name: string;
    why: string;
    when: string;
    longTerm: string;
    uncertain: string;
}

function parseIngredients(text: string): IngredientData[] {
    if (!text) return [];

    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const ingredients: IngredientData[] = [];

    let currentIngredient: Partial<IngredientData> = {};

    lines.forEach(line => {
        if (line.startsWith('•') || line.startsWith('-')) {
            const content = line.replace(/^[•-]\s*/, '');

            if (content.toLowerCase().startsWith('why it’s here:') || content.toLowerCase().startsWith('why it\'s here:')) {
                currentIngredient.why = content.split(':')[1]?.trim() || content;
            } else if (content.toLowerCase().startsWith('when it matters:')) {
                currentIngredient.when = content.split(':')[1]?.trim() || content;
            } else if (content.toLowerCase().startsWith('in case of regular') || content.toLowerCase().startsWith('for frequent')) {
                currentIngredient.longTerm = content.split(':')[1]?.trim() || content;
            } else if (content.toLowerCase().startsWith('what’s uncertain:') || content.toLowerCase().startsWith('what\'s uncertain:')) {
                currentIngredient.uncertain = content.split(':')[1]?.trim() || content;
            }
        } else {
            if (currentIngredient.name) {
                ingredients.push(currentIngredient as IngredientData);
            }
            currentIngredient = { name: line };
        }
    });

    if (currentIngredient.name) {
        ingredients.push(currentIngredient as IngredientData);
    }

    return ingredients;
}


export default async function ScanResultPage({ params }: PageProps) {
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
                <p className="text-slate-500">You are not authorized to view this scan.</p>
            </div>
        );
    }

    const analysisText = scan.analysis || "";

    const sections = {
        summary: "",
        ingredientsRaw: "",
        conclusion: "",
        quiz: ""
    };

    try {
        const summaryMatch = analysisText.match(/🧠\s*What Matters\s*([\s\S]*?)(?=🔍|$)/i);
        const ingredientsMatch = analysisText.match(/🔍\s*Ingredients in Focus\s*([\s\S]*?)(?=⚖️|$)/i);
        const conclusionMatch = analysisText.match(/⚖️\s*The Big Picture\s*([\s\S]*?)(?=🎯|$)/i);
        const quizMatch = analysisText.match(/🎯\s*Want to lock this in\?\s*([\s\S]*?)(?=$)/i);

        sections.summary = summaryMatch ? summaryMatch[1].trim() : "";
        sections.ingredientsRaw = ingredientsMatch ? ingredientsMatch[1].trim() : "";
        sections.conclusion = conclusionMatch ? conclusionMatch[1].trim() : "";
        sections.quiz = quizMatch ? quizMatch[1].trim() : "";
    } catch (e) {
        console.error("Failed to parse analysis sections", e);
    }

    const showRaw = !sections.summary && !sections.ingredientsRaw;
    const structuredIngredients = parseIngredients(sections.ingredientsRaw);

    const MarkdownComponents: Components = {
        p: ({ node, ...props }) => <p className="text-slate-600 leading-relaxed" {...props} />,
        strong: ({ node, ...props }) => <span className="font-semibold text-indigo-700" {...props} />,
    };

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-900 animate-in fade-in duration-500 pb-24">
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200/60 support-backdrop-blur:bg-white/60">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Button variant="ghost" size="sm" asChild className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 -ml-2 rounded-full px-3">
                        <Link href="/dashboard">
                            <ArrowLeft className="w-4 h-4 mr-1.5" />
                            Back to Scan
                        </Link>
                    </Button>
                    <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold uppercase tracking-wider">AI Analysis</span>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">

                <div className="grid md:grid-cols-[200px_1fr] gap-8 items-start">
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white p-2">
                        <div className="relative w-full h-full rounded-xl overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={scan.imageUrl}
                                alt="Scanned Label"
                                className="w-full h-full object-contain bg-slate-50"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">
                                Analysis Result
                            </h1>
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <ScanSearch className="w-4 h-4" />
                                <span>Scanned on {scan.createdAt.toLocaleDateString()}</span>
                            </div>
                        </div>

                        {showRaw ? (
                            <div className="prose prose-slate max-w-none">
                                <ReactMarkdown>{scan.analysis}</ReactMarkdown>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <BrainCircuit className="w-24 h-24 text-indigo-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-3">
                                    <BrainCircuit className="w-5 h-5 text-indigo-600" />
                                    What Matters
                                </h3>
                                <div className="relative z-10">
                                    <ReactMarkdown components={MarkdownComponents}>
                                        {sections.summary}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {!showRaw && (
                    <>
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 px-1">
                                <div className="w-1 h-6 bg-indigo-500 rounded-full mr-1"></div>
                                Ingredients in Focus
                            </h2>

                            <div className="grid gap-6 md:grid-cols-2">
                                {structuredIngredients.map((ing, idx) => (
                                    <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-100">
                                            <h3 className="font-semibold text-lg text-slate-900">{ing.name}</h3>
                                        </div>
                                        <div className="p-5 space-y-4">
                                            {ing.why && (
                                                <div className="flex gap-3 text-sm">
                                                    <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                                    <div>
                                                        <span className="font-medium text-slate-700 block mb-0.5">Why it&apos;s here</span>
                                                        <p className="text-slate-600 leading-relaxed">{ing.why}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {ing.when && (
                                                <div className="flex gap-3 text-sm">
                                                    <Clock className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                                                    <div>
                                                        <span className="font-medium text-slate-700 block mb-0.5">When it matters</span>
                                                        <p className="text-slate-600 leading-relaxed">{ing.when}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {ing.longTerm && (
                                                <div className="flex gap-3 text-sm">
                                                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                                    <div>
                                                        <span className="font-medium text-slate-700 block mb-0.5">Long-term view</span>
                                                        <p className="text-slate-600 leading-relaxed">{ing.longTerm}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {ing.uncertain && (
                                                <div className="flex gap-3 text-sm">
                                                    <HelpCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                                                    <div>
                                                        <span className="font-medium text-slate-700 block mb-0.5">What&apos;s uncertain</span>
                                                        <p className="text-slate-600 leading-relaxed">{ing.uncertain}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-linear-to-br from-indigo-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />

                            <div className="relative z-10 space-y-4">
                                <h3 className="text-xl font-semibold flex items-center gap-2 text-indigo-100">
                                    <Scale className="w-6 h-6" />
                                    The Big Picture
                                </h3>
                                <div className="text-indigo-50/90 text-lg leading-relaxed">
                                    <ReactMarkdown components={{
                                        p: ({ node, ...props }) => <p {...props} />
                                    }}>
                                        {sections.conclusion}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </section>

                        <section className="flex flex-col items-center justify-center text-center space-y-6 pt-8 pb-4">
                            <div className="space-y-2 max-w-xl mx-auto">
                                <h4 className="text-2xl font-bold text-slate-900">
                                    Want to lock this in?
                                </h4>
                                <p className="text-slate-500">
                                    {sections.quiz || "Take a quick quiz to see if you really know what you're eating."}
                                </p>
                            </div>

                            <Button size="lg" className="rounded-full px-8 h-12 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 transition-all hover:scale-105 group">
                                <Link href="/dashboard/quiz" className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                                    Take the Quick Quiz
                                    <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}