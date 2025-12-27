import { db } from "@/config/db";
import { scans } from "@/config/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { Leaf, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import Loading from "@/app/loading";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const REFLECTION_SYSTEM_PROMPT = `You are an AI-native learning reflection engine.

Your task is to generate a calm, non-judgmental Progress summary based on a user’s past scans and quiz interactions.

GOAL:
Help the user reflect on what they’ve learned over time without scoring, ranking, or evaluating performance.

STRICT RULES:
1. Do NOT show scores, percentages, or grades.
2. Do NOT compare the user to others.
3. Do NOT use gamified or competitive language.
4. Focus on patterns, exposure, and awareness.
5. Use supportive, neutral, reflective tone.
6. Keep all sections concise and readable.

STRUCTURE (FOLLOW EXACTLY):

---
🧠 Your Learning Overview
(1–2 sentences summarizing scans and exploration.)

🔍 Ingredients You’ve Encountered
(List 3–5 common ingredient themes with simple counts or frequency phrasing.)

📈 Understanding Over Time
(2–3 short statements showing growing awareness or repeated engagement.)

✨ Recent Insight
(One reflective takeaway drawn from recent scans or quizzes.)
---

TONE:
- Calm
- Encouraging
- Observational
- Non-prescriptive

The Progress page should feel like a personal reflection space, not an analytics dashboard.`;

export default function ProgressPage() {
    return (
        <Suspense fallback={<div className="bg-slate-50/50 flex items-center justify-center"><Loading className="min-h-[70vh] mt-64" /></div>}>
            <ProgressContent />
        </Suspense>
    );
}

async function ProgressContent() {
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
            <div className="min-h-[70vh] bg-slate-50/50 flex flex-col items-center justify-center p-6 text-center space-y-6">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm">
                    <TrendingUp className="w-8 h-8 text-slate-300" />
                </div>
                <div className="space-y-2 max-w-md">
                    <h2 className="text-xl font-bold text-slate-900">Your Journey Begins</h2>
                    <p className="text-slate-500">
                        Once you start scanning ingredients and taking quizzes, this space will fill with personal insights and reflections.
                    </p>
                </div>
                <Button asChild size="lg" className="rounded-full px-8">
                    <Link href="/dashboard">
                        <div className="flex items-center gap-2">
                            <span>Start First Scan</span>
                        </div>
                    </Link>
                </Button>
            </div>
        );
    }

    const contextData = userScans.slice(0, 10).map(s => ({
        date: s.createdAt,
        analysisSnippet: s.analysis.substring(0, 200) + "...",
        quizCompleted: s.quizCompleted
    }));

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let reflection = "";
    try {
        const result = await model.generateContent([
            REFLECTION_SYSTEM_PROMPT,
            `\n\nUSER HISTORY CONTEXT:\n${JSON.stringify(contextData, null, 2)}`
        ]);
        reflection = result.response.text();
    } catch (error) {
        console.error("Reflection generation failed", error);
        reflection = "We're updating your reflection engine. Check back soon!";
    }

    const sections = parseReflection(reflection);

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-900 pb-24 animate-in fade-in duration-500">
            <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Progress</h1>
                    </div>
                    <p className="text-slate-500 text-lg">A reflection on your ingredient awareness journey.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-3 hover:shadow-md transition-shadow duration-200">
                        <div className="p-4 bg-indigo-50 rounded-full text-indigo-600 mb-2">
                            <Leaf className="w-8 h-8" />
                        </div>
                        <div className="text-3xl font-bold text-slate-900">{userScans.length}</div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Scans Completed</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-3 hover:shadow-md transition-shadow duration-200">
                        <div className="p-4 bg-emerald-50 rounded-full text-emerald-600 mb-2">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <div className="text-3xl font-bold text-slate-900">
                            {userScans.filter(s => s.quizCompleted).length}
                        </div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Quizzes Taken</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-3 hover:shadow-md transition-shadow duration-200">
                        <div className="p-4 bg-amber-50 rounded-full text-amber-600 mb-2">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <div className="text-3xl font-bold text-slate-900">Active</div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Learning Status</div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                            <Sparkles className="w-32 h-32" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2 mb-2">
                                <span className="text-2xl">🧠</span>
                                Learning Overview
                            </h2>
                            <p className="text-slate-700 leading-relaxed text-lg font-medium">
                                {sections.overview || "Your journey is just beginning. Keep scanning to see patterns emerge."}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col h-full hover:border-indigo-200 transition-colors duration-200">
                            <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2 mb-6 border-b border-indigo-50 pb-4">
                                <span className="text-xl">🔍</span> Common Themes
                            </h2>
                            <div className="prose prose-slate prose-sm max-w-none grow text-slate-600">
                                <ReactMarkdown>{sections.ingredients}</ReactMarkdown>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col h-full hover:border-indigo-200 transition-colors duration-200">
                            <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2 mb-6 border-b border-indigo-50 pb-4">
                                <span className="text-xl">📈</span> Growing Awareness
                            </h2>
                            <div className="prose prose-slate prose-sm max-w-none grow text-slate-600">
                                <ReactMarkdown>{sections.understanding}</ReactMarkdown>
                            </div>
                        </div>
                    </div>

                    <div className="bg-linear-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-700">
                            <TrendingUp className="w-48 h-48" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <h2 className="text-lg font-bold text-indigo-100 flex items-center gap-2 opacity-90 uppercase tracking-widest">
                                <span className="text-lg">✨</span> Recent Insight
                            </h2>
                            <p className="text-white text-xl font-medium leading-relaxed italic opacity-95">
                                &ldquo;{sections.insight || "Keep exploring to unlock new insights."}&rdquo;
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function parseReflection(text: string) {
    const sections = {
        overview: "",
        ingredients: "",
        understanding: "",
        insight: ""
    };

    try {
        const overviewMatch = text.match(/🧠\s*(?:Your)?\s*Learning Overview\s*([\s\S]*?)(?=🔍|$)/i);
        const ingredientsMatch = text.match(/🔍\s*Ingredients(?: You’ve Encountered)?\s*([\s\S]*?)(?=📈|$)/i);
        const understandingMatch = text.match(/📈\s*Understanding(?: Over Time)?\s*([\s\S]*?)(?=✨|$)/i);
        const insightMatch = text.match(/✨\s*Recent Insight\s*([\s\S]*?)(?=$)/i);

        sections.overview = overviewMatch ? overviewMatch[1].trim() : "";
        sections.ingredients = ingredientsMatch ? ingredientsMatch[1].trim() : "";
        sections.understanding = understandingMatch ? understandingMatch[1].trim() : "";
        sections.insight = insightMatch ? insightMatch[1].trim() : "";
    } catch (e) {
        console.error("Failed to parse reflection", e);
    }
    return sections;
}