import { UserButton } from "@clerk/nextjs";

const DashboardPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <UserButton />
        </div>
    )
}

export default DashboardPage;
