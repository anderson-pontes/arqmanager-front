import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PrivateRoute } from './PrivateRoute';
import { Login } from '@/pages/auth/Login';
import { Dashboard } from '@/pages/dashboard/Dashboard';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/',
        element: (
            <PrivateRoute>
                <Layout />
            </PrivateRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard" replace />,
            },
            {
                path: 'dashboard',
                element: <Dashboard />,
            },
            // TODO: Adicionar outras rotas conforme forem criadas
            // {
            //   path: 'clientes',
            //   element: <ClientesList />,
            // },
            // {
            //   path: 'clientes/:id',
            //   element: <ClienteDetail />,
            // },
            // {
            //   path: 'projetos',
            //   element: <ProjetosList />,
            // },
            // ... outras rotas
        ],
    },
    {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
    },
]);
