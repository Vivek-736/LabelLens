"use client";

import { motion } from "framer-motion";

const steps = [
    {
        num: "01",
        title: "Snap",
        desc: "Take a photo of the ingredients label.",
    },
    {
        num: "02",
        title: "Analyze",
        desc: "AI extracts and identifies every compound.",
    },
    {
        num: "03",
        title: "Understand",
        desc: "Get an instant summary of health impacts.",
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-8">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black mb-16 text-center">
                    Complexity to Clarity.
                </h2>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gray-100 z-0"></div>

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.num}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative z-10 flex flex-col items-center text-center"
                        >
                            <div className="w-24 h-24 rounded-full bg-white border-4 border-indigo-50 flex items-center justify-center mb-6 shadow-sm">
                                <span className="text-3xl font-bold text-indigo-600">{step.num}</span>
                            </div>
                            <h3 className="text-xl font-bold text-black mb-2">{step.title}</h3>
                            <p className="text-gray-500 max-w-xs">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}