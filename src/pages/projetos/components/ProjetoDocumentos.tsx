import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatters';
import { Plus, FileText, Download, Trash2, Upload } from 'lucide-react';
import type { Projeto } from '@/types';

interface ProjetoDocumentosProps {
    projetoId: number;
}

export function ProjetoDocumentos({ projetoId }: ProjetoDocumentosProps) {
    // Mock de documentos - em produção viria da API
    const documentos = [
        {
            id: 1,
            nome: 'Contrato.pdf',
            tipo: 'PDF',
            dataUpload: '2024-01-15',
            tamanho: '2.5 MB',
        },
        {
            id: 2,
            nome: 'Projeto_Arquitetonico.dwg',
            tipo: 'DWG',
            dataUpload: '2024-02-01',
            tamanho: '15.8 MB',
        },
        {
            id: 3,
            nome: 'Memorial_Descritivo.docx',
            tipo: 'DOCX',
            dataUpload: '2024-02-10',
            tamanho: '1.2 MB',
        },
    ];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Documentos do Projeto
                    </CardTitle>
                    <Button size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {documentos.map((doc) => (
                        <div
                            key={doc.id}
                            className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">{doc.nome}</p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Badge variant="outline">{doc.tipo}</Badge>
                                        <span>{doc.tamanho}</span>
                                        <span>•</span>
                                        <span>{formatDate(doc.dataUpload)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="ghost">
                                    <Download className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {documentos.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <p className="mt-4 text-muted-foreground">Nenhum documento enviado</p>
                        <Button className="mt-4" variant="outline">
                            <Upload className="mr-2 h-4 w-4" />
                            Enviar Primeiro Documento
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
