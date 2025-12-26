import { ReactNode } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppHeader from '@/components/fulcrum/AppHeader';
import AppSidebar from '@/components/fulcrum/AppSidebar';

const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className='w-full'>
                <AppHeader />
                <div className='p-10'>
                    {children}
                </div>
            </div>
        </SidebarProvider>
    )
}

export default WorkspaceProvider;
