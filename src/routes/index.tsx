import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PrivateRoute } from './PrivateRoute';
import { Login } from '@/pages/auth/Login';
import { Dashboard } from '@/pages/dashboard/Dashboard';
import { ColaboradoresList } from '@/pages/colaboradores/ColaboradoresList';
import { ColaboradorForm } from '@/pages/colaboradores/ColaboradorForm';
import { ColaboradorDetail } from '@/pages/colaboradores/ColaboradorDetail';
import { ClientesList } from '@/pages/clientes/ClientesList';
import { ClienteForm } from '@/pages/clientes/ClienteForm';
import { ClienteDetail } from '@/pages/clientes/ClienteDetail';
import { ContasList } from '@/pages/financeiro/contas/ContasList';
import { ContaForm } from '@/pages/financeiro/contas/ContaForm';
import { ContaDetail } from '@/pages/financeiro/contas/ContaDetail';
import { CalendarioView } from '@/pages/calendario/CalendarioView';
import { CalendarioPage } from '@/pages/calendario/CalendarioPage';
import { FeriadoForm } from '@/pages/calendario/FeriadoForm';
import { EscritorioPage } from '@/pages/escritorio/EscritorioPage';
import { ConfiguracoesPage } from '@/pages/configuracoes/ConfiguracoesPage';
import { ProjetosList } from '@/pages/projetos/ProjetosList';
import { ProjetoDetail } from '@/pages/projetos/ProjetoDetail';
import { ProjetoForm } from '@/pages/projetos/ProjetoForm';
import { PropostasList } from '@/pages/propostas/PropostasList';
import { PropostaDetail } from '@/pages/propostas/PropostaDetail';
import { PropostaForm } from '@/pages/propostas/PropostaForm';

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
            {
                path: 'colaboradores',
                element: <ColaboradoresList />,
            },
            {
                path: 'colaboradores/novo',
                element: <ColaboradorForm />,
            },
            {
                path: 'colaboradores/:id',
                element: <ColaboradorDetail />,
            },
            {
                path: 'colaboradores/:id/editar',
                element: <ColaboradorForm />,
            },
            {
                path: 'clientes',
                element: <ClientesList />,
            },
            {
                path: 'clientes/novo',
                element: <ClienteForm />,
            },
            {
                path: 'clientes/:id',
                element: <ClienteDetail />,
            },
            {
                path: 'clientes/:id/editar',
                element: <ClienteForm />,
            },
            {
                path: 'financeiro/contas',
                element: <ContasList />,
            },
            {
                path: 'financeiro/contas/novo',
                element: <ContaForm />,
            },
            {
                path: 'financeiro/contas/:id',
                element: <ContaDetail />,
            },
            {
                path: 'financeiro/contas/:id/editar',
                element: <ContaForm />,
            },
            {
                path: 'calendario',
                element: <CalendarioView />,
            },
            {
                path: 'calendario/feriados',
                element: <CalendarioPage />,
            },
            {
                path: 'calendario/feriados/novo',
                element: <FeriadoForm />,
            },
            {
                path: 'calendario/feriados/:id/editar',
                element: <FeriadoForm />,
            },
            {
                path: 'escritorio',
                element: <EscritorioPage />,
            },
            {
                path: 'configuracoes',
                element: <ConfiguracoesPage />,
            },
            {
                path: 'projetos',
                element: <ProjetosList />,
            },
            {
                path: 'projetos/novo',
                element: <ProjetoForm />,
            },
            {
                path: 'projetos/:id',
                element: <ProjetoDetail />,
            },
            {
                path: 'projetos/:id/editar',
                element: <ProjetoForm />,
            },
            {
                path: 'propostas',
                element: <PropostasList />,
            },
            {
                path: 'propostas/novo',
                element: <PropostaForm />,
            },
            {
                path: 'propostas/:id',
                element: <PropostaDetail />,
            },
            {
                path: 'propostas/:id/editar',
                element: <PropostaForm />,
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
    },
]);
