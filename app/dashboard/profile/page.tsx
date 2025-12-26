import { currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Mail, User, Calendar, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
    const user = await currentUser();

    if (!user) {
        redirect("/");
    }

    const email = user.emailAddresses[0]?.emailAddress;
    const initial = user.firstName ? user.firstName[0] : (email ? email[0].toUpperCase() : "U");

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col items-center pb-12 px-6 animate-in fade-in duration-500 text-slate-900">
            <div className="w-full max-w-2xl space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Your Profile
                    </h1>
                    <p className="text-slate-500">
                        Manage your account and settings
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-100 p-8 flex flex-col items-center space-y-4">
                        <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-sm overflow-hidden bg-white">
                            {user.imageUrl ? (
                                <Image
                                    src={user.imageUrl}
                                    alt="Profile Image"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 text-3xl font-bold">
                                    {initial}
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-slate-900">
                                {user.fullName || "User"}
                            </h2>
                            <p className="text-slate-500 text-sm font-medium">
                                {email}
                            </p>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Full Name</p>
                                <p className="text-slate-900 font-medium">{user.fullName || "N/A"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email Address</p>
                                <p className="text-slate-900 font-medium truncate">{email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Joined On</p>
                                <p className="text-slate-900 font-medium">
                                    {new Date(user.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Account Status</p>
                                <p className="text-slate-900 font-medium flex items-center gap-2">
                                    Active
                                    <span className="inline-flex w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                        <SignOutButton>
                            <Button variant="destructive" className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-none border border-slate-900">
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </Button>
                        </SignOutButton>
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-xs text-slate-400">
                        Member since {new Date(user.createdAt).getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    );
}