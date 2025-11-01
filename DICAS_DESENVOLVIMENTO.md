# 💡 Dicas de Desenvolvimento - ARQManager

## 🎯 Boas Práticas

### 1. Componentes

```tsx
// ✅ BOM - Componente tipado e reutilizável
interface ButtonProps {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
    return <button onClick={onClick}>{label}</button>;
}

// ❌ EVITAR - Sem tipos e props genéricas
export function Button(props: any) {
    return <button>{props.label}</button>;
}
```

### 2. Hooks Customizados

```tsx
// ✅ BOM - Hook reutilizável
export function useClientes() {
    return useQuery({
        queryKey: ['clientes'],
        queryFn: () => apiClient.get('/clientes'),
    });
}

// Uso
const { data, isLoading } = useClientes();
```

### 3. Formulários

```tsx
// ✅ BOM - Com validação Zod
const schema = z.object({
    nome: z.string().min(3, 'Mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
});

const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
});
```

### 4. Estado Global

```tsx
// ✅ BOM - Zustand store
export const useClienteStore = create<ClienteState>((set) => ({
    clientes: [],
    setClientes: (clientes) => set({ clientes }),
}));

// Uso
const { clientes, setClientes } = useClienteStore();
```

## 🔧 Padrões de Código

### Nomenclatura

```tsx
// Componentes: PascalCase
export function ClienteCard() {}

// Hooks: camelCase com prefixo 'use'
export function useClientes() {}

// Utilitários: camelCase
export function formatCurrency() {}

// Constantes: UPPER_SNAKE_CASE
export const API_BASE_URL = '';

// Tipos/Interfaces: PascalCase
export interface Cliente {}
```

### Organização de Imports

```tsx
// 1. React e bibliotecas externas
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Componentes internos
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageHeader';

// 3. Hooks e stores
import { useAuthStore } from '@/store/authStore';

// 4. Utilitários e tipos
import { formatCurrency } from '@/utils/formatters';
import { Cliente } from '@/types';

// 5. Estilos (se necessário)
import './styles.css';
```

### Estrutura de Componente

```tsx
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Tipos/Interfaces
interface ClienteCardProps {
    cliente: Cliente;
    onEdit: (id: number) => void;
}

// 3. Componente
export function ClienteCard({ cliente, onEdit }: ClienteCardProps) {
    // 3.1. Hooks
    const [isExpanded, setIsExpanded] = useState(false);

    // 3.2. Handlers
    const handleEdit = () => {
        onEdit(cliente.id);
    };

    // 3.3. Render
    return (
        <div>
            <h3>{cliente.nome}</h3>
            <Button onClick={handleEdit}>Editar</Button>
        </div>
    );
}
```

## 🎨 Estilização com Tailwind

### Classes Utilitárias

```tsx
// ✅ BOM - Classes organizadas
<div className="flex items-center justify-between gap-4 p-4 rounded-lg border bg-white hover:shadow-md transition-shadow">

// ❌ EVITAR - Classes desorganizadas
<div className="p-4 flex bg-white gap-4 border items-center rounded-lg justify-between hover:shadow-md transition-shadow">
```

### Uso do cn() para Classes Condicionais

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  isDisabled && 'disabled-classes'
)}>
```

### Componentes Responsivos

```tsx
<div className="
  grid
  grid-cols-1
  md:grid-cols-2
  lg:grid-cols-3
  gap-4
">
```

## 📊 Gerenciamento de Estado

### Quando usar cada solução:

#### 1. useState - Estado Local

```tsx
// Para estado de UI simples
const [isOpen, setIsOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
```

#### 2. Zustand - Estado Global

```tsx
// Para estado compartilhado entre componentes
const { user, setUser } = useAuthStore();
const { escritorio } = useEscritorioStore();
```

#### 3. TanStack Query - Estado do Servidor

```tsx
// Para dados da API
const { data, isLoading } = useQuery({
    queryKey: ['clientes'],
    queryFn: fetchClientes,
});
```

## 🔄 Chamadas de API

### Padrão Recomendado

```tsx
// 1. Criar hook customizado
export function useClientes() {
    return useQuery({
        queryKey: ['clientes'],
        queryFn: async () => {
            const { data } = await apiClient.get('/clientes');
            return data;
        },
    });
}

// 2. Usar no componente
function ClientesList() {
    const { data: clientes, isLoading, error } = useClientes();

    if (isLoading) return <LoadingSpinner />;
    if (error) return <div>Erro ao carregar</div>;

    return <div>{/* renderizar clientes */}</div>;
}
```

### Mutations

```tsx
export function useCreateCliente() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (cliente: ClienteForm) =>
            apiClient.post('/clientes', cliente),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] });
            toast.success('Cliente criado com sucesso!');
        },
        onError: () => {
            toast.error('Erro ao criar cliente');
        },
    });
}
```

## 🎯 Formulários

### Padrão com React Hook Form + Zod

```tsx
// 1. Definir schema
const clienteSchema = z.object({
    nome: z.string().min(3, 'Mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    telefone: z.string().min(10, 'Telefone inválido'),
});

type ClienteForm = z.infer<typeof clienteSchema>;

// 2. Usar no componente
function ClienteForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ClienteForm>({
        resolver: zodResolver(clienteSchema),
    });

    const onSubmit = (data: ClienteForm) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Input {...register('nome')} />
            {errors.nome && <span>{errors.nome.message}</span>}

            <Button type="submit">Salvar</Button>
        </form>
    );
}
```

## 🚀 Performance

### 1. Memoização

```tsx
// useMemo para cálculos pesados
const totalValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0);
}, [items]);

// useCallback para funções
const handleClick = useCallback(() => {
    console.log('clicked');
}, []);

// React.memo para componentes
export const ClienteCard = React.memo(({ cliente }: Props) => {
    return <div>{cliente.nome}</div>;
});
```

### 2. Lazy Loading

```tsx
// Componentes
const ClienteDetail = lazy(() => import('./ClienteDetail'));

// Uso
<Suspense fallback={<LoadingSpinner />}>
    <ClienteDetail />
</Suspense>;
```

### 3. Virtualização (para listas grandes)

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

// Para listas com 1000+ itens
```

## 🐛 Debug

### 1. React DevTools

```tsx
// Adicionar displayName para debug
ClienteCard.displayName = 'ClienteCard';
```

### 2. Console Logs Úteis

```tsx
// ✅ BOM - Logs informativos
console.log('Cliente carregado:', cliente);
console.table(clientes);

// ❌ EVITAR - Logs genéricos
console.log('teste');
console.log(data);
```

### 3. TanStack Query DevTools

```tsx
// Adicionar no App.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>;
```

## 🔒 Segurança

### 1. Validação de Inputs

```tsx
// Sempre validar no cliente E no servidor
const schema = z.object({
    email: z.string().email(),
    cpf: z.string().refine(isValidCPF, 'CPF inválido'),
});
```

### 2. Sanitização

```tsx
// Evitar XSS
import DOMPurify from 'dompurify';

const cleanHTML = DOMPurify.sanitize(dirtyHTML);
```

### 3. Tokens

```tsx
// Nunca expor tokens no código
// Usar variáveis de ambiente
const API_KEY = import.meta.env.VITE_API_KEY;
```

## 📱 Responsividade

### Breakpoints Tailwind

```tsx
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px

<div className="
  w-full
  sm:w-1/2
  md:w-1/3
  lg:w-1/4
">
```

### Mobile First

```tsx
// ✅ BOM - Mobile first
<div className="text-sm md:text-base lg:text-lg">

// ❌ EVITAR - Desktop first
<div className="text-lg md:text-base sm:text-sm">
```

## 🎨 Acessibilidade

### 1. Semântica HTML

```tsx
// ✅ BOM
<button onClick={handleClick}>Clique</button>
<nav><a href="/home">Home</a></nav>

// ❌ EVITAR
<div onClick={handleClick}>Clique</div>
<div><span onClick={goHome}>Home</span></div>
```

### 2. ARIA Labels

```tsx
<button aria-label="Fechar modal">
  <X />
</button>

<input aria-describedby="email-error" />
<span id="email-error">Email inválido</span>
```

### 3. Foco e Teclado

```tsx
// Garantir navegação por teclado
<button tabIndex={0}>Acessível</button>
```

## 🧪 Testes (Futuro)

### Estrutura de Teste

```tsx
describe('ClienteCard', () => {
    it('deve renderizar o nome do cliente', () => {
        render(<ClienteCard cliente={mockCliente} />);
        expect(screen.getByText('João Silva')).toBeInTheDocument();
    });

    it('deve chamar onEdit ao clicar no botão', () => {
        const onEdit = jest.fn();
        render(<ClienteCard cliente={mockCliente} onEdit={onEdit} />);

        fireEvent.click(screen.getByText('Editar'));
        expect(onEdit).toHaveBeenCalledWith(mockCliente.id);
    });
});
```

## 📚 Recursos Úteis

### Documentação

-   [React](https://react.dev)
-   [TypeScript](https://www.typescriptlang.org/docs)
-   [Tailwind CSS](https://tailwindcss.com/docs)
-   [shadcn/ui](https://ui.shadcn.com)
-   [TanStack Query](https://tanstack.com/query)
-   [React Hook Form](https://react-hook-form.com)
-   [Zod](https://zod.dev)

### Ferramentas

-   [React DevTools](https://react.dev/learn/react-developer-tools)
-   [TypeScript Playground](https://www.typescriptlang.org/play)
-   [Tailwind Play](https://play.tailwindcss.com)

### Comunidades

-   [React Discord](https://discord.gg/react)
-   [TypeScript Discord](https://discord.gg/typescript)
-   [Stack Overflow](https://stackoverflow.com/questions/tagged/reactjs)

---

**Dica Final**: Mantenha o código simples, legível e bem documentado. Código bom é código que outros desenvolvedores conseguem entender facilmente!
