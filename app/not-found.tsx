"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 overflow-hidden">
            <div className="relative flex items-center justify-center w-full max-w-2xl h-80 mb-8">
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <div className="w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
                    <div className="absolute h-full w-px bg-linear-to-b from-transparent via-slate-200 to-transparent" />
                </div>

                <div className="relative z-0">
                    <h1 className="text-[12rem] font-black text-slate-50 tracking-tighter select-none leading-none">
                        404
                    </h1>
                </div>

                <motion.div
                    className="absolute z-10 w-48 h-48 rounded-full border-2 border-indigo-500/50 bg-indigo-50/10 backdrop-blur-xs flex items-center justify-center shadow-2xl shadow-indigo-500/20"
                    animate={{
                        x: [-120, 120, -120],
                        y: [0, -20, 0],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <div className="absolute inset-2 rounded-full border border-indigo-200/30" />
                    <div className="absolute w-full h-full rounded-full bg-linear-to-tr from-indigo-500/5 to-transparent" />

                    <Search className="w-12 h-12 text-indigo-600 opacity-80" strokeWidth={1.5} />

                    <motion.div
                        className="absolute w-full h-0.5 bg-indigo-400/50"
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center space-y-6 max-w-md z-10 relative"
            >
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Page Not Found
                    </h2>
                    <p className="text-slate-500 text-lg">
                        We searched everywhere, but this page seems to be out of focus.
                    </p>
                </div>
                <Button asChild className="rounded-xl px-8 h-12 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300" size="lg">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Return Home
                    </Link>
                </Button>
            </motion.div>
        </div>
    );
}