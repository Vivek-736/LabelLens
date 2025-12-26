"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1 space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="relative w-6 h-6">
                                <Image
                                    src="/favicon.png"
                                    alt="LabelLens Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-black">
                                LabelLens
                            </span>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Decoding food labels with cognitive AI. Empowering you to make healthier decisions, one scan at a time.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-black tracking-wider uppercase">Product</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#features" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#how-it-works" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                                    How it Works
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                                    Pricing
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company/Legal */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-black tracking-wider uppercase">Support</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-black tracking-wider uppercase">Stay Updated</h4>
                        <p className="text-sm text-gray-500">
                            Get the latest updates on food science and AI features.
                        </p>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter your email"
                                className="h-9 text-sm bg-gray-50 border-gray-200 focus-visible:ring-indigo-500"
                            />
                            <Button size="sm" className="h-9 bg-black text-white hover:bg-gray-800">
                                Join
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} LabelLens. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6">
                        <span className="text-sm text-gray-500 font-medium">
                            Made with 💖 by Vivek
                        </span>
                        <div className="h-4 w-px bg-gray-200"></div>
                        <div className="flex items-center">
                            <a href="https://github.com/Vivek-736" target="_blank" className="text-gray-400 hover:text-black transition-colors">
                                <Github className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}