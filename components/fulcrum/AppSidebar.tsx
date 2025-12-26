'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "@/components/ui/sidebar";
import { History, Scan, User2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const MenuOptions = [
    {
        title: "Scan",
        url: "/dashboard",
        icon: Scan
    },
    {
        title: "History",
        url: "/dashboard/history",
        icon: History
    },
    {
        title: "Profile",
        url: "/dashboard/profile",
        icon: User2Icon
    }
]

function AppSidebar() {
    const { open } = useSidebar();
    const path = usePathname();
    const { user } = useUser();

    return (
        <Sidebar collapsible="icon" className="border-r border-border/50 bg-white">
            <SidebarHeader className="pt-4 pb-2">
                <Link href="/">
                    <div className={`flex items-center gap-3 px-2 transition-all duration-300 ${open ? 'justify-start' : 'justify-center'}`}>
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl shadow-sm ring-1 ring-border/50">
                            <Image
                                src="/favicon.png"
                                alt="LabelLens Logo"
                                fill
                                className="object-cover p-1"
                            />
                        </div>
                        {open && (
                            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
                                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                                    LabelLens
                                </h2>
                            </div>
                        )}
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarContent className={`mt-6 transition-all ${open ? 'px-2' : 'px-0 items-center'}`}>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className={`space-y-2 ${!open && 'items-center'}`}>
                            {MenuOptions.map((menu, index) => {
                                const isActive = path === menu.url;
                                return (
                                    <SidebarMenuItem key={index}>
                                        <SidebarMenuButton
                                            asChild
                                            size="lg"
                                            tooltip={menu.title}
                                            className={`
                                                rounded-xl transition-all duration-200 ease-in-out font-medium
                                                ${open ? 'w-full' : 'w-10 h-10 justify-center p-0'}
                                                ${isActive
                                                    ? 'bg-indigo-100 text-black shadow-sm'
                                                    : 'text-slate-900 hover:bg-slate-100 hover:text-black'
                                                }
                                            `}
                                        >
                                            <Link href={menu.url} className={`flex items-center ${open ? 'gap-3 px-3 py-3 w-full' : 'justify-center w-full h-full'}`}>
                                                <menu.icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                                                {open && <span className="text-sm">{menu.title}</span>}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className={`pb-4 ${open ? 'px-4' : 'px-0 items-center'}`}>
                {user && (
                    <div className={`
                        flex items-center gap-3 w-full pt-4 border-t border-slate-200
                        ${open ? 'justify-start' : 'justify-center border-t-0 pt-2'}
                    `}>
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-slate-200">
                            <Image
                                src={user.imageUrl}
                                alt={user.fullName || "User"}
                                fill
                                className="object-cover"
                            />
                        </div>
                        {open && (
                            <div className="flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
                                <span className="text-sm font-semibold text-slate-900 truncate">
                                    {user.fullName}
                                </span>
                                <span className="text-xs text-slate-500 truncate">
                                    {user.primaryEmailAddress?.emailAddress}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar;
