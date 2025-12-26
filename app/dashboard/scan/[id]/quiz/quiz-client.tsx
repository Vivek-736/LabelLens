"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, CheckCircle2, ChevronRight, Loader2, Sparkles, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface Question {
    question: string;
    options: string[];
    correctOptionIndex: number;
}

export default function QuizClient({ scanId }: { scanId: number }) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await axios.post("/api/quiz", { scanId });
                if (response.data.questions && response.data.questions.length > 0) {
                    setQuestions(response.data.questions);
                } else {
                    toast.error("Could not generate quiz. Please try again.");
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load quiz.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [scanId]);

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
    };

    const handleNext = () => {
        if (selectedOption === null) return;

        const isCorrect = selectedOption === questions[currentIndex].correctOptionIndex;

        if (!isAnswered) {
            setIsAnswered(true);
            if (isCorrect) {
                setScore(s => s + 1);
                confetti({
                    particleCount: 30,
                    spread: 60,
                    origin: { y: 0.7 },
                    zIndex: 9999
                });
            }
        } else {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(c => c + 1);
                setSelectedOption(null);
                setIsAnswered(false);
            } else {
                setShowResults(true);
                // Mark quiz as completed in the background
                axios.post("/api/quiz/complete", { scanId }).catch(console.error);

                if (score === questions.length) {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-100 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative bg-white p-4 rounded-full shadow-sm border border-indigo-50">
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                    </div>
                </div>
                <h2 className="text-xl font-medium text-slate-900">Generating your personal quiz...</h2>
                <p className="text-slate-500 max-w-sm">
                    Our AI is crafting questions based on the ingredients we analyzed correctly.
                </p>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <p className="text-slate-500">Something went wrong while creating the quiz.</p>
                <Button asChild variant="outline">
                    <Link href={`/dashboard/scan/${scanId}`}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Analysis
                    </Link>
                </Button>
            </div>
        );
    }

    if (showResults) {
        return (
            <div className="max-w-xl mx-auto py-12 px-6 text-center space-y-8 animate-in zoom-in-95 duration-500">
                <div className="space-y-2">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-full mb-4">
                        <Sparkles className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Quiz Complete!</h1>
                    <p className="text-slate-600">
                        Nice work — you’ve captured the key ideas from this label.
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                    <div className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Your Score</div>
                    <div className="text-5xl font-black text-slate-900 mb-2">
                        {score}/{questions.length}
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-600 transition-all duration-1000 ease-out"
                            style={{ width: `${(score / questions.length) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <Button asChild size="lg" className="rounded-full px-8">
                        <Link href={`/dashboard/scan/${scanId}`}>
                            Back to Analysis
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                        <Link href="/dashboard">
                            Scan New Item
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div className="max-w-2xl mx-auto py-8 px-6 min-h-screen flex flex-col">
            <div className="w-full h-1.5 bg-slate-100 rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
                />
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-8 animate-in slide-in-from-right-4 duration-300" key={currentIndex}>
                <div className="space-y-4">
                    <span className="text-sm font-semibold text-indigo-600 tracking-wider uppercase">
                        Question {currentIndex + 1} of {questions.length}
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 leading-snug">
                        {currentQ.question}
                    </h2>
                </div>

                <div className="space-y-3">
                    {currentQ.options.map((option, idx) => {
                        const isSelected = selectedOption === idx;
                        const isCorrect = idx === currentQ.correctOptionIndex;

                        let cardClass = "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50";
                        if (isAnswered) {
                            if (isCorrect) cardClass = "bg-green-50 border-green-200 text-green-900";
                            else if (isSelected && !isCorrect) cardClass = "bg-red-50 border-red-200 text-red-900";
                            else cardClass = "bg-slate-50 border-slate-200 opacity-50";
                        } else if (isSelected) {
                            cardClass = "bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(idx)}
                                disabled={isAnswered}
                                className={cn(
                                    "w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group",
                                    cardClass
                                )}
                            >
                                <span className={cn("font-medium", isAnswered && !isSelected && !isCorrect && "text-slate-400")}>
                                    {option}
                                </span>
                                {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                                {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="pt-8 flex justify-end">
                <Button
                    size="lg"
                    onClick={handleNext}
                    disabled={selectedOption === null}
                    className="rounded-full px-8 bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50 transition-all font-medium text-base h-12"
                >
                    {isAnswered ? (
                        currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"
                    ) : (
                        "Check Answer"
                    )}
                    {(isAnswered || selectedOption !== null) && <ChevronRight className="w-4 h-4 ml-2" />}
                </Button>
            </div>
        </div>
    );
}