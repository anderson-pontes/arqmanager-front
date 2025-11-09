import { useState, useEffect } from 'react';
import {
    clientesService,
    type Cliente,
    type ClienteListParams,
} from '@/api/services/clientes.service';

export const useClientes = (params?: ClienteListParams, autoFetch = false) => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchClientes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await clientesService.list(params);
            setClientes(response.items);
            setTotal(response.total);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail || 'Erro ao buscar clientes';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchClientes();
        }
    }, [JSON.stringify(params), autoFetch]);

    const createCliente = async (data: any) => {
        setLoading(true);
        setError(null);
        try {
            const newCliente = await clientesService.create(data);
            setClientes([...clientes, newCliente]);
            setTotal(total + 1);
            return newCliente;
        } catch (err: any) {
            // Melhor tratamento de erro para debug
            console.error('Erro completo:', err);
            console.error('Resposta do servidor:', err.response?.data);

            let errorMessage = 'Erro ao criar cliente';

            if (err.response?.data?.detail) {
                // Se detail é um array (erros de validação do Pydantic)
                if (Array.isArray(err.response.data.detail)) {
                    errorMessage = err.response.data.detail
                        .map((e: any) => `${e.loc.join('.')}: ${e.msg}`)
                        .join(', ');
                } else {
                    errorMessage = err.response.data.detail;
                }
            }

            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const updateCliente = async (id: number, data: any) => {
        setLoading(true);
        setError(null);
        try {
            const updatedCliente = await clientesService.update(id, data);
            setClientes(
                clientes.map((c) => (c.id === id ? updatedCliente : c))
            );
            return updatedCliente;
        } catch (err: any) {
            // Melhor tratamento de erro para debug
            console.error('Erro completo:', err);
            console.error('Resposta do servidor:', err.response?.data);

            let errorMessage = 'Erro ao atualizar cliente';

            if (err.response?.data?.detail) {
                // Se detail é um array (erros de validação do Pydantic)
                if (Array.isArray(err.response.data.detail)) {
                    errorMessage = err.response.data.detail
                        .map((e: any) => `${e.loc.join('.')}: ${e.msg}`)
                        .join(', ');
                } else {
                    errorMessage = err.response.data.detail;
                }
            }

            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const deleteCliente = async (id: number, permanent: boolean = false) => {
        setLoading(true);
        setError(null);
        try {
            await clientesService.delete(id, permanent);
            setClientes(clientes.filter((c) => c.id !== id));
            setTotal(total - 1);
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.detail || 'Erro ao excluir cliente';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        clientes,
        total,
        loading,
        error,
        fetchClientes,
        createCliente,
        updateCliente,
        deleteCliente,
    };
};
