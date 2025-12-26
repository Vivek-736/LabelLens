"use client";

import { analyzeImage } from "@/app/actions/scan";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudUpload, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";

const DashboardPage = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.type === "image/jpeg" || droppedFile.type === "image/png" || droppedFile.type === "image/webp")) {
            setFile(droppedFile);
            setPreview(URL.createObjectURL(droppedFile));
            handleAnalysis(droppedFile);
        } else {
            toast.error("Please upload a valid image (JPG, PNG, WEBP)");
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleAnalysis = (fileToAnalyze: File | null = file) => {
        if (!fileToAnalyze) {
            toast.error("Please select an image first");
            return;
        }

        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append("file", fileToAnalyze);

                const scanId = await analyzeImage(formData);
                toast.success("Analysis complete!");
                router.push(`/dashboard/scan/${scanId}`);
            } catch (error) {
                console.error(error);
                toast.error("Failed to analyze image. Please try again.");
            }
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full bg-white text-slate-900 animate-in fade-in duration-500">
            <div className="w-full max-w-lg space-y-8 p-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Scan Ingredients
                    </h1>
                </div>
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className={`
                        group relative flex flex-col items-center justify-center w-full h-72
                        rounded-3xl border-2 border-dashed transition-all duration-300 ease-out cursor-pointer overflow-hidden
                        ${isDragging
                            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]'
                            : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                        }
                    `}
                >
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleFileSelect}
                    />

                    {preview ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className="object-contain p-4"
                            />
                            {isPending && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                                        <span className="text-sm font-medium text-indigo-900">Analyzing...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-5 text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl pointer-events-none">
                            <div className={`
                                p-5 rounded-2xl transition-all duration-300 shadow-sm
                                ${isDragging
                                    ? 'bg-indigo-100 text-indigo-600 rotate-3 scale-110'
                                    : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'
                                }
                            `}>
                                <CloudUpload className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <div className="space-y-1.5">
                                <p className="font-medium text-slate-900">
                                    Drag & drop or click to upload
                                </p>
                                <p className="text-sm text-slate-400">
                                    Supports JPG, PNG, WEBP
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6 pt-2">
                    <div className="relative group">
                        <Input
                            placeholder="Anything specific you want to know? (Optional)"
                            className="h-14 pl-4 border-0 border-b-2 border-slate-100 focus-visible:ring-0 focus-visible:border-indigo-500 rounded-none bg-transparent text-base transition-all px-0 placeholder:text-slate-300"
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-3">
                        <Button
                            size="lg"
                            onClick={() => handleAnalysis()}
                            disabled={isPending || !file}
                            className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200 hover:shadow-indigo-300/50 transition-all duration-300 font-medium text-base group"
                        >
                            {isPending ? (
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            ) : (
                                <Sparkles className="w-5 h-5 mr-2 text-indigo-200 group-hover:text-white transition-colors" />
                            )}
                            {isPending ? "Analyzing Ingredients..." : "Explain Ingredients"}
                        </Button>

                        <p className="text-center text-xs font-medium text-slate-400">
                            We’ll highlight only what’s worth your attention.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage;
