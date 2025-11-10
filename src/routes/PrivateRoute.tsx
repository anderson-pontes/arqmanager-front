import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface PrivateRouteProps {
    children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
    const { isAuthenticated, requiresEscritorioSelection, currentContext, isAdminMode } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Se precisa selecionar escritório e não tem contexto (exceto na própria página de seleção e área admin)
    const isSelectionPage = window.location.pathname === '/selecionar-contexto' || 
                           window.location.pathname === '/selecionar-escritorio';
    const isAdminPage = window.location.pathname === '/admin' || 
                       window.location.pathname.startsWith('/admin/');
    
    // Se está em modo admin, pode acessar área admin sem contexto de escritório
    if (isAdminMode && isAdminPage) {
        return <>{children}</>;
    }
    
    // Se precisa selecionar contexto e não está em modo admin
    if ((requiresEscritorioSelection || !currentContext.escritorioId) && !isSelectionPage && !isAdminMode) {
        return <Navigate to="/selecionar-contexto" replace />;
    }

    return <>{children}</>;
}
