'use server';

import { db } from "@/config/db";
import { scans } from "@/config/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { currentUser } from "@clerk/nextjs/server";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are an AI-native consumer health co-pilot.

Your task is to explain food ingredients with extreme clarity and brevity.
Optimize for scannability and minimal cognitive load.

STRICT RULES:
1. Highlight ONLY 2–3 ingredients maximum.
2. Each section must be concise and never exceed 2 short lines.
3. Avoid long sentences, compound clauses, or academic phrasing.
4. Do NOT repeat information across sections.
5. Do NOT stack explanations or over-elaborate.
6. Never use fear-based language or absolute claims.
7. Use calm, neutral, decision-support framing.
8. Prefer simple sentence structures over descriptive paragraphs.

OUTPUT FORMAT (MUST FOLLOW EXACTLY):

---
🧠 What Matters
(2–3 short sentences total. High-level insight only.)

🔍 Ingredients in Focus

Ingredient Name
• Why it’s here: (1 short sentence)
• When it matters: (1 short sentence)
• In case of regular or long-term use: (1 short sentence)
• What’s uncertain: (1 short sentence)

(Repeat for max 2–3 ingredients)

⚖️ The Big Picture
(2 sentences max. End with a reflective, decision-oriented line.)

🎯 Want to lock this in?
(1 short sentence inviting the user to take a contextual quiz.)
---

STYLE GUIDELINES:
- Sentence length: ideally under 15 words.
- No bullet should exceed one idea.
- Tone: calm, clear, non-judgmental.
- Think “label margin note,” not “article paragraph.”

Your goal is to reduce reading effort while preserving reasoning quality.`;

export async function analyzeImage(formData: FormData) {
    const user = await currentUser();
    if (!user || !user.emailAddresses?.[0]?.emailAddress) {
        throw new Error("Unauthorized");
    }

    const file = formData.get("file") as File;
    if (!file) {
        throw new Error("No file provided");
    }

    const buffer = await file.arrayBuffer();
    const filename = `LabelLens/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filename);
    
    await uploadBytes(storageRef, buffer, {
        contentType: file.type
    });
    
    const imageUrl = await getDownloadURL(storageRef);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const base64Image = Buffer.from(buffer).toString("base64");
    
    const result = await model.generateContent([
        SYSTEM_PROMPT,
        {
            inlineData: {
                data: base64Image,
                mimeType: file.type
            }
        }
    ]);

    const analysis = result.response.text();

    const [scan] = await db.insert(scans).values({
        imageUrl,
        analysis,
        userEmail: user.emailAddresses[0].emailAddress,
    }).returning();

    return scan.id;
}