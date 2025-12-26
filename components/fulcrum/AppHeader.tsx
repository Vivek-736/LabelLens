import { UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "../ui/sidebar";

const AppHeader = () => {
    return (
        <div className="flex items-center justify-between p-4 shadow-sm sticky top-0 bg-white z-10">
            <SidebarTrigger />
            <UserButton />
        </div>
    )
}

export default AppHeader;
