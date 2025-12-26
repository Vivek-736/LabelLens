import { db } from "@/config/db";
import { scans } from "@/config/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const QUIZ_SYSTEM_PROMPT = `You are an AI-native learning co-pilot.

Your task is to generate a short multiple-choice quiz based ONLY on the ingredient analysis provided.

QUIZ GOAL:
Reinforce understanding and reasoning, not test memory or definitions.

STRICT RULES:
1. Generate exactly 3 questions.
2. Each question must have exactly 4 answer options.
3. Only ONE option must be clearly correct.
4. Questions must be scenario-based or takeaway-based.
5. Do NOT ask factual or definition-style questions.
6. Do NOT use fear-based, absolute, or judgmental language.
7. Questions must relate directly to the scanned product and highlighted ingredients.
8. The quiz should feel reflective, calm, and confidence-building.

QUESTION TYPES TO USE (mix them):
- “Which ingredient matters most if consumed frequently?”
- “Which concern is least relevant for occasional consumption?”
- “What is the most accurate overall takeaway for this product?”

AVOID:
- True/False questions
- “What is X?” questions
- Multiple-correct answers
- Timed or competitive framing

OUTPUT FORMAT (STRICT — FOLLOW EXACTLY):

Question 1:
[Question text]

A. [Option]
B. [Option]
C. [Option]
D. [Option]

Correct Answer: [Letter]

(Repeat for Question 2 and 3)

TONE:
- Calm
- Supportive
- Non-judgmental
- Decision-oriented

End the quiz with a reassuring message like:
“Nice work — you’ve captured the key ideas from this label.”`;

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

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const result = await model.generateContent([
            QUIZ_SYSTEM_PROMPT,
            `\n\nANALYSIS CONTEXT:\n${scan.analysis}`
        ]);

        const text = result.response.text();
        
        const questions = parseQuizText(text);

        return NextResponse.json({ questions });

    } catch (error) {
        console.error("Quiz generation error:", error);
        return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
    }
}

function parseQuizText(text: string) {
    const questions = [];
    
    const blocks = text.split(/Question \d+:/).filter(b => b.trim().length > 0);

    for (const block of blocks) {
        const lines = block.trim().split('\n').map(l => l.trim()).filter(l => l);

        let questionText = "";
        let optionsMap: Record<string, string> = {};
        let correctAnswer = "";

        const optionRegex = /^([A-D])\.\s*(.+)/;
        const correctRegex = /^Correct Answer:\s*([A-D])/i;

        let currentSection = "question";
        
        for (const line of lines) {
            if (correctRegex.test(line)) {
                const match = line.match(correctRegex);
                if (match) correctAnswer = match[1].toUpperCase();
                continue;
            }

            if (optionRegex.test(line)) {
                const match = line.match(optionRegex);
                if (match) {
                    optionsMap[match[1]] = match[2];
                    currentSection = "options";
                }
                continue;
            }
            
            if (currentSection === "question") {
                questionText += (questionText ? " " : "") + line;
            }
        }

        if (questionText && Object.keys(optionsMap).length >= 2 && correctAnswer) {
            questions.push({
                question: questionText,
                options: [
                    optionsMap['A'],
                    optionsMap['B'],
                    optionsMap['C'],
                    optionsMap['D']
                ].filter(Boolean),
                correctAnswer: correctAnswer
            });
        }
    }

    return questions.map(q => ({
        ...q,
        correctOptionIndex: q.correctAnswer.charCodeAt(0) - 65
    }));
}