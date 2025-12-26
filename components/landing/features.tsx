"use client";

import { motion } from "framer-motion";
import { Scan, BrainCircuit, HeartPulse, ShieldCheck, Zap } from "lucide-react";

export function Features() {
    return (
        <section id="features" className="py-24 bg-gray-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-8">
                <div className="flex flex-col items-center text-center mb-16 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium"
                    >
                        <Zap className="w-4 h-4" />
                        <span>Why LabelLens?</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black">
                        Beyond the label.
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl">
                        We don't just read ingredients; we interpret them for your specific health needs using advanced cognitive AI.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-2 row-span-1 rounded-3xl bg-white p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Scan className="w-48 h-48 text-indigo-600" />
                        </div>
                        <div className="relative z-10 h-full flex flex-col justify-end">
                            <Scan className="w-10 h-10 text-indigo-600 mb-4" />
                            <h3 className="text-2xl font-bold text-black mb-2">Instant OCR Scanning</h3>
                            <p className="text-gray-500">
                                Capture any ingredient list in seconds. Our computer vision engine instantly digitizes text from curved packages, bottles, and boxes with 99% accuracy.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-1 row-span-1 md:row-span-2 rounded-3xl bg-indigo-600 p-8 border border-transparent shadow-lg text-white relative overflow-hidden group"
                    >
                        <div className="absolute -bottom-10 -right-10 opacity-20 group-hover:opacity-30 transition-opacity">
                            <BrainCircuit className="w-64 h-64 text-white" />
                        </div>
                        <div className="relative z-10 h-full flex flex-col">
                            <BrainCircuit className="w-10 h-10 text-white mb-6" />
                            <h3 className="text-2xl font-bold mb-4">Cognitive AI Reasoning</h3>
                            <p className="text-indigo-100 leading-relaxed">
                                Most apps highlight keywords. LabelLens *thinks*. It understands that "Citric Acid" is fine but "High Fructose Corn Syrup" appearing 3rd in the list is a warning sign.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="md:col-span-1 row-span-1 rounded-3xl bg-white p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
                    >
                        <HeartPulse className="w-10 h-10 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold text-black mb-2">Health Impact</h3>
                        <p className="text-gray-500 text-sm">
                            Simple red-yellow-green indicators for your specific diet goals (Vegan, Keto, Gluten-Free).
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="md:col-span-1 row-span-1 rounded-3xl bg-white p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
                    >
                        <ShieldCheck className="w-10 h-10 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold text-black mb-2">Verified Data</h3>
                        <p className="text-gray-500 text-sm">
                            Insights backed by nutritional science databases, not just internet folklore.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}