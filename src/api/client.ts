import axios from 'axios';
import { API_CONFIG } from '@/config/api';

// Criar instância do axios
export const apiClient = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de requisição - adiciona token e contexto
apiClient.interceptors.request.use(
    (config: any) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Adicionar contexto se disponível (via store)
        try {
            const authStorage = localStorage.getItem('auth-storage');
            if (authStorage) {
                const authState = JSON.parse(authStorage);
                if (authState?.state?.currentContext?.escritorioId && config.headers) {
                    config.headers['X-Escritorio-Id'] = authState.state.currentContext.escritorioId.toString();
                }
            }
        } catch (e) {
            // Ignora erros ao acessar o storage
        }
        
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

// Interceptor de resposta - trata erros e refresh token
apiClient.interceptors.response.use(
    (response) => response,
    async (error: any) => {
        const originalRequest = error.config;

        // Se erro 400 com mensagem de escritório não selecionado
        if (error.response?.status === 400 && 
            error.response?.data?.detail?.includes('Escritório não selecionado')) {
            // Redirecionar para seleção de contexto
            window.location.href = '/selecionar-contexto';
            return Promise.reject(error);
        }

        // Se erro 401 e não é retry, tenta refresh token
        if (error.response?.status === 401 && !originalRequest?._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                const response = await axios.post(
                    `${API_CONFIG.baseURL}/auth/refresh`,
                    { refresh_token: refreshToken }
                );

                const { access_token } = response.data;
                localStorage.setItem('accessToken', access_token);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                }

                return apiClient(originalRequest);
            } catch (refreshError) {
                // Se refresh falhar, limpa tokens e redireciona para login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
