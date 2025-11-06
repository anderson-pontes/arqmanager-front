
export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-purple-200/50 bg-linear-to-r from-purple-50/50 via-white/50 to-purple-50/50 backdrop-blur-md mt-8">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col items-center justify-center gap-4">
                    
                    {/* Copyright */}
                    <p className="text-center text-sm text-muted-foreground">
                       ARQManager © {currentYear} Todos os direitos reservados
                    </p>

                   
                    
                </div>
            </div>
        </footer>
    );
}
