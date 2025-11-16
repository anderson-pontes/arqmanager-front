import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PrivateRoute } from './PrivateRoute';
import { Login } from '@/pages/auth/Login';
import { SelecionarEscritorio } from '@/pages/auth/SelecionarEscritorio';
import { SelecionarContexto } from '@/pages/auth/SelecionarContexto';
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
import { NovaReceitaContaPage } from '@/pages/financeiro/contas/NovaReceitaContaPage';
import { NovaDespesaContaPage } from '@/pages/financeiro/contas/NovaDespesaContaPage';
import { MovimentacoesList } from '@/pages/financeiro/movimentacoes/MovimentacoesList';
import { ReceitaForm } from '@/pages/financeiro/receitas/ReceitaForm';
import { DespesaForm } from '@/pages/financeiro/despesas/DespesaForm';
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
import { AdminPage } from '@/pages/admin/AdminPage';
import { ViewEscritorioPage } from '@/pages/admin/ViewEscritorioPage';
import { EditEscritorioPage } from '@/pages/admin/EditEscritorioPage';
import { ViewSystemAdminPage } from '@/pages/admin/ViewSystemAdminPage';
import { ViewEscritorioAdminPage } from '@/pages/admin/ViewEscritorioAdminPage';
import { ServicosPage } from '@/pages/admin/servicos/ServicosPage';
import { EtapasPage } from '@/pages/admin/servicos/EtapasPage';
import { EtapaFormPage } from '@/pages/admin/servicos/EtapaFormPage';
import TestIntegration from '@/pages/TestIntegration';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/test-integration',
        element: <TestIntegration />,
    },
    {
        path: '/selecionar-escritorio',
        element: (
            <PrivateRoute>
                <SelecionarEscritorio />
            </PrivateRoute>
        ),
    },
    {
        path: '/selecionar-contexto',
        element: (
            <PrivateRoute>
                <SelecionarContexto />
            </PrivateRoute>
        ),
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
                path: 'financeiro/contas/:id/receitas/nova',
                element: <NovaReceitaContaPage />,
            },
            {
                path: 'financeiro/contas/:id/despesas/nova',
                element: <NovaDespesaContaPage />,
            },
            {
                path: 'financeiro/contas/:id/editar',
                element: <ContaForm />,
            },
            {
                path: 'financeiro/movimentacoes',
                element: <MovimentacoesList />,
            },
            {
                path: 'financeiro/receitas/novo',
                element: <ReceitaForm />,
            },
            {
                path: 'financeiro/despesas/novo',
                element: <DespesaForm />,
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
                path: 'servicos',
                element: <ServicosPage />,
            },
            {
                path: 'servicos/etapas',
                element: <EtapasPage />,
            },
            {
                path: 'servicos/etapas/novo',
                element: <EtapaFormPage />,
            },
            {
                path: 'servicos/etapas/:id/editar',
                element: <EtapaFormPage />,
            },
            {
                path: 'admin',
                element: <AdminPage />,
            },
            {
                path: 'admin/escritorios/:id',
                element: <ViewEscritorioPage />,
            },
            {
                path: 'admin/escritorios/:id/editar',
                element: <EditEscritorioPage />,
            },
            {
                path: 'admin/system-admins/:id',
                element: <ViewSystemAdminPage />,
            },
            {
                path: 'admin/escritorios/:escritorioId/admins/:id',
                element: <ViewEscritorioAdminPage />,
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
