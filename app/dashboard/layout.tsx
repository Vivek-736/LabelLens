import { ReactNode } from "react";
import DashboardProvider from "./provider";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
    return (
        <DashboardProvider>
            {children}
        </DashboardProvider>
    );
};

export default DashboardLayout;
