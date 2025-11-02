import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50/30 via-white to-purple-100/30 relative">
            {/* Formas Geométricas de Fundo - Mais sutis para não interferir no conteúdo */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                {/* Círculos grandes com blur - Elementos suaves */}
                <div className="absolute top-20 right-20 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-300/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-purple-100/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />

                {/* Retângulos sutis - Estruturas arquitetônicas */}
                <div className="absolute top-40 right-1/4 w-64 h-64 bg-primary/3 rotate-12 rounded-2xl" />
                <div className="absolute bottom-40 left-1/4 w-56 h-56 bg-primary/3 -rotate-12 rounded-2xl" />

                {/* Linhas e grades - Plantas arquitetônicas */}
                <div className="absolute top-1/3 right-1/3 w-40 h-40 border border-primary/5 rotate-45 rounded-lg" />
                <div className="absolute bottom-1/3 left-1/3 w-36 h-36 border border-primary/5 -rotate-45 rounded-lg" />

                {/* Pequenos detalhes geométricos */}
                <div className="absolute top-32 left-1/3 w-12 h-12 bg-primary/5 rounded-lg rotate-12" />
                <div className="absolute bottom-32 right-1/3 w-14 h-14 bg-primary/5 rounded-lg -rotate-12" />
                <div className="absolute top-2/3 right-1/4 w-10 h-10 bg-primary/8 rounded-full" />
                <div className="absolute bottom-2/3 left-1/4 w-8 h-8 bg-primary/8 rounded-full" />
            </div>

            {/* Conteúdo com z-index maior */}
            <div className="relative z-10">
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
        </div>
    );
}
