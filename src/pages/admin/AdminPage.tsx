import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, UserCog, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EscritoriosTab } from './tabs/EscritoriosTab';
import { SystemAdminsTab } from './tabs/SystemAdminsTab';
import { EscritorioAdminsTab } from './tabs/EscritorioAdminsTab';
import { useAuthStore } from '@/store/authStore';

export function AdminPage() {
    const { isSystemAdmin, isAdminMode } = useAuthStore();
    const [activeTab, setActiveTab] = useState('escritorios');

    if (!isSystemAdmin || !isAdminMode) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Acesso Negado</CardTitle>
                        <CardDescription>
                            Você precisa estar em modo administrativo para acessar esta área.
                            <br />
                            <br />
                            Acesse a seleção de contexto e escolha "Área Administrativa".
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Área Administrativa</h1>
                    <p className="text-muted-foreground mt-1">
                        Gerencie escritórios e administradores do sistema
                    </p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="escritorios" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Escritórios
                    </TabsTrigger>
                    <TabsTrigger value="system-admins" className="flex items-center gap-2">
                        <UserCog className="h-4 w-4" />
                        Admins do Sistema
                    </TabsTrigger>
                    <TabsTrigger value="escritorio-admins" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Admins de Escritório
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="escritorios" className="space-y-4">
                    <EscritoriosTab />
                </TabsContent>

                <TabsContent value="system-admins" className="space-y-4">
                    <SystemAdminsTab />
                </TabsContent>

                <TabsContent value="escritorio-admins" className="space-y-4">
                    <EscritorioAdminsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}

