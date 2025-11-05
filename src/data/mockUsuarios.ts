import type { User, UserEscritorio } from '@/types';
import { mockEscritorios } from './mockEscritorios';

export const mockUsuariosEscritorios: UserEscritorio[] = [
    // Ana Silva - 3 escritórios
    {
        id: 1,
        escritorio: mockEscritorios[0],
        perfil: 'Administrador',
        ativo: true,
        dataVinculo: '2020-01-15',
    },
    {
        id: 2,
        escritorio: mockEscritorios[1],
        perfil: 'Arquiteto',
        ativo: true,
        dataVinculo: '2021-06-20',
    },
    {
        id: 3,
        escritorio: mockEscritorios[2],
        perfil: 'Consultor',
        ativo: true,
        dataVinculo: '2022-03-10',
    },
    // Carlos Oliveira - 2 escritórios
    {
        id: 4,
        escritorio: mockEscritorios[0],
        perfil: 'Arquiteto',
        ativo: true,
        dataVinculo: '2020-02-01',
    },
    {
        id: 5,
        escritorio: mockEscritorios[1],
        perfil: 'Coordenador',
        ativo: true,
        dataVinculo: '2021-08-15',
    },
    // Juliana Santos - 1 escritório
    {
        id: 6,
        escritorio: mockEscritorios[0],
        perfil: 'Financeiro',
        ativo: true,
        dataVinculo: '2020-03-10',
    },
];

export const mockUsuarios: User[] = [
    {
        id: 1,
        nome: 'Ana Silva',
        email: 'ana.silva@email.com',
        perfil: 'Administrador',
        escritorios: [
            mockUsuariosEscritorios[0],
            mockUsuariosEscritorios[1],
            mockUsuariosEscritorios[2],
        ],
        foto: undefined,
    },
    {
        id: 2,
        nome: 'Carlos Oliveira',
        email: 'carlos.oliveira@email.com',
        perfil: 'Arquiteto',
        escritorios: [mockUsuariosEscritorios[3], mockUsuariosEscritorios[4]],
        foto: undefined,
    },
    {
        id: 3,
        nome: 'Juliana Santos',
        email: 'juliana.santos@email.com',
        perfil: 'Financeiro',
        escritorios: [mockUsuariosEscritorios[5]],
        foto: undefined,
    },
];

// Função helper para buscar usuário por email
export const findUserByEmail = (email: string): User | undefined => {
    return mockUsuarios.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
    );
};
