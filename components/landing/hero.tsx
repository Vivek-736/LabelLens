"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, ScanLine, Sparkles, Brain } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-white">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-white/40 z-10" />

                <Image
                    src="/hero-bg-2.png"
                    alt="Natural Ingredients Suspended"
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-r from-white via-white/80 to-transparent z-10" />
            </div>

            <div className="max-w-7xl mx-auto px-6 z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-8 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium w-fit"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>AI-Native Food Intelligence</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight text-black leading-tight"
                    >
                        Know What <br />
                        <span className="text-indigo-600">You Eat.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-lg"
                    >
                        LabelLens decodes complexity. Scan ingredients, get clear insights, and make healthy decisions instantly with our cognitive AI.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-wrap items-center gap-4"
                    >
                        <Link href={'/dashboard'}>
                            <Button
                                suppressHydrationWarning
                                size="lg"
                                className="bg-black hover:bg-gray-800 text-white rounded-full h-12 px-12 text-base shadow-xl hover:shadow-2xl transition-all duration-300 group"
                            >
                                Get Started
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="pt-8 flex items-center gap-8 text-gray-400"
                    >
                        <div className="flex items-center gap-2">
                            <ScanLine className="w-5 h-5 text-indigo-500" />
                            <span className="text-sm font-medium">Instant Scan</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Brain className="w-5 h-5 text-indigo-500" />
                            <span className="text-sm font-medium">Deep Reasoning</span>
                        </div>
                    </motion.div>
                </div>
                <div className="hidden lg:flex justify-center items-center relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative z-20"
                    >
                        <div className="w-80 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl p-6 relative ml-56">
                            <div className="absolute -top-6 -right-6 bg-indigo-600 text-white p-4 rounded-2xl shadow-lg duration-3000">
                                <ScanLine className="w-6 h-6" />
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        <span className="text-2xl">🥑</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Avocado Oil</h3>
                                        <p className="text-xs text-gray-500">Scan detected</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Heart Health</p>
                                            <p className="text-xs text-gray-500">Rich in oleic acid and antioxidants.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Nutrient Absorption</p>
                                            <p className="text-xs text-gray-500">Enhances absorption of carotenoids.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full w-[95%] bg-indigo-600 rounded-full" />
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs font-medium">
                                        <span className="text-gray-400">Health Score</span>
                                        <span className="text-indigo-600">95/100</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute -z-10 top-10 -left-10 w-24 h-24 bg-indigo-200 rounded-full opacity-50 blur-xl"
                        />
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                            className="absolute -z-10 bottom-10 -right-5 w-32 h-32 bg-blue-200 rounded-full opacity-50 blur-xl"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}