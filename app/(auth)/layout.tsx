"use client";

import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white overflow-hidden">
            <div className="hidden lg:block relative h-full bg-indigo-50">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/auth-bg.png"
                        alt="LabelLens Food Intelligence"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-indigo-900/10 mix-blend-overlay" />
                </div>

                <div className="relative z-10 h-full flex flex-col justify-between p-12 text-black">
                    <Link href="/" className="flex items-center gap-2 w-fit">
                        <div className="bg-white/80 backdrop-blur-md p-2 rounded-lg shadow-sm">
                            <Image
                                src="/favicon.png"
                                alt="LabelLens Logo"
                                width={24}
                                height={24}
                                className="object-contain"
                            />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-indigo-950 drop-shadow-md">
                            Label Lens
                        </span>
                    </Link>

                    <div className="space-y-4 max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-2xl">
                        <h2 className="text-3xl font-bold leading-tight text-black">
                            Smart Food Choices, <br /> Made Simple.
                        </h2>
                        <p className="text-gray-700 text-base font-medium">
                            Join thousands of health-conscious users decoding labels with our cognitive AI engine.
                        </p>
                    </div>
                </div>

                <div className="absolute top-0 right-0 bottom-0 w-32 z-20 pointer-events-none">
                    <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 0 L0 100 L100 100 Z" fill="white" />
                    </svg>
                </div>
            </div>

            <div className="flex items-center justify-center p-8 lg:p-12 relative">
                <div className="lg:hidden absolute top-8 left-8">
                    <Link href="/" className="flex items-center gap-2">
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
                </div>

                <div className="w-full max-w-md space-y-8">
                    {children}
                </div>
            </div>
        </div>
    );
}