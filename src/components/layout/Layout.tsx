import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <Header onMenuClick={() => setSidebarOpen(true)} />

            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile Sidebar */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side="left" className="w-64 p-0">
                    <Sidebar className="relative border-0" />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <main className="md:pl-64">
                <div className="container mx-auto px-4 py-3">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
