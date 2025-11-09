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
            const errorMessage =
                err.response?.data?.detail || 'Erro ao criar cliente';
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
            const errorMessage =
                err.response?.data?.detail || 'Erro ao atualizar cliente';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const deleteCliente = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await clientesService.delete(id);
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
