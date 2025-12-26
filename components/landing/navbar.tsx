"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Navbar() {
    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "How it Works", href: "#how-it-works" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative w-8 h-8">
                        <Image
                            src="/favicon.png"
                            alt="LabelLens Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-black">
                        LabelLens
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="relative text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            {link.name}
                            <motion.span
                                className="absolute left-0 right-0 -bottom-1 h-0.5 bg-indigo-600 origin-left"
                                initial={{ scaleX: 0 }}
                                whileHover={{ scaleX: 1 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            />
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button
                            suppressHydrationWarning
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 shadow-lg shadow-indigo-200"
                        >
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}