

"use client";

import { useAppContext } from '@/contexts/app-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Edit, Save, MessageSquare, Heart, Send, Camera, User, Phone, MapPin, PackageCheck, LayoutDashboard, Settings, BarChart2, Shield, Users, Package, DollarSign, Pencil, Trash2, PlusCircle, List, Image as ImageIcon, ShoppingCart, Download, X, TrendingUp, Calendar, ShieldCheck, User as UserIcon, Mail, UploadCloud, Paperclip, FileText, FileArchive } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ConfirmationDialog } from '@/components/confirmation-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { PublicationEditor } from '@/components/publication-editor';
import type { Product, User as UserType, UserPermissions, ChatMessage, Chat } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';


const initialHistoricalData = [
    {
        month: 'Junio 2024',
        summary: 'Ventas: 95 | Ingresos: $7,540.00 | Comisión: $377.00',
        details: [
            { date: '2024-06-28 10:00', product: 'Teclado Gamer', amount: 150.00, commission: 7.50 },
            { date: '2024-06-25 11:30', product: 'Monitor 4K', amount: 450.00, commission: 22.50 },
            { date: '2024-06-22 15:00', product: 'Silla Gamer', amount: 250.00, commission: 12.50 },
        ]
    },
    {
        month: 'Mayo 2024',
        summary: 'Ventas: 88 | Ingresos: $6,980.00 | Comisión: $349.00',
        details: [
            { date: '2024-05-20 18:00', product: 'Silla de Oficina', amount: 350.00, commission: 17.50 },
            { date: '2024-05-15 12:00', product: 'Escritorio Eléctrico', amount: 400.00, commission: 20.00 },
        ]
    },
    {
        month: 'Abril 2024',
        summary: 'Ventas: 92 | Ingresos: $7,210.50 | Comisión: $360.53',
        details: [
             { date: '2024-04-15 09:45', product: 'Webcam HD', amount: 80.00, commission: 4.00 },
             { date: '2024-04-10 16:20', product: 'Micrófono Condensador', amount: 120.00, commission: 6.00 },
        ]
    },
];

type HistoricalData = typeof initialHistoricalData;
type MonthlyData = HistoricalData[number];


const MonthlyDetailsModal = ({ monthData, open, onOpenChange, onDelete }: { monthData: MonthlyData | null; open: boolean; onOpenChange: (open: boolean) => void; onDelete: (month: string) => void; }) => {
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    if (!monthData) return null;

    const handleDelete = () => {
        onDelete(monthData.month);
        setConfirmDeleteOpen(false);
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[825px]">
                    <DialogHeader>
                        <DialogTitle>Detalle de Ventas - {monthData.month}</DialogTitle>
                        <DialogDescription>
                            Resumen de todas las ventas, ganancias y comisiones del mes.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="main-table-container p-2 max-h-[50vh] overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fecha y Hora</TableHead>
                                    <TableHead>Producto</TableHead>
                                    <TableHead>Monto</TableHead>
                                    <TableHead className="text-right">Comisión</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {monthData.details.map((detail, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{detail.date}</TableCell>
                                        <TableCell className="font-medium">{detail.product}</TableCell>
                                        <TableCell>${detail.amount.toFixed(2)}</TableCell>
                                        <TableCell className="text-right text-green-500 font-semibold">+${detail.commission.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex justify-end items-center gap-4 mt-4">
                        <Button className="glass-button glass-button-red" onClick={() => setConfirmDeleteOpen(true)}>
                            <Trash2 className="mr-2 h-4 w-4"/>
                            Eliminar Mes
                        </Button>
                        <Button className="glass-button glass-button-green">
                            <Download className="mr-2 h-4 w-4"/>
                            Exportar a Excel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <ConfirmationDialog
                open={confirmDeleteOpen}
                onOpenChange={setConfirmDeleteOpen}
                onConfirm={handleDelete}
                title={`¿Eliminar ${monthData.month}?`}
                description="Se borrará todo el historial de ventas de este mes."
            />
        </>
    )
}


const OperatorDetailsModal = ({ operatorName, open, onOpenChange }: { operatorName: string | null, open: boolean, onOpenChange: (open: boolean) => void }) => {
    const [commission, setCommission] = useState(5);
    const [historicalData, setHistoricalData] = useState(initialHistoricalData);
    const [selectedMonth, setSelectedMonth] = useState<MonthlyData | null>(null);
    const [isMonthlyModalOpen, setIsMonthlyModalOpen] = useState(false);
    const [monthToDelete, setMonthToDelete] = useState<string | null>(null);

    useEffect(() => {
        if (!open) {
            setHistoricalData(initialHistoricalData);
        }
    }, [open]);

    const handleDeleteMonth = () => {
        if (monthToDelete) {
            setHistoricalData(prev => prev.filter(item => item.month !== monthToDelete));
            setIsMonthlyModalOpen(false);
            setSelectedMonth(null);
            setMonthToDelete(null);
        }
    };

    const handleViewDetails = (monthData: MonthlyData) => {
        setSelectedMonth(monthData);
        setIsMonthlyModalOpen(true);
    }

    if (!operatorName) return null;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:w-[90vw] lg:max-w-[1600px]">
                    <DialogHeader>
                        <DialogTitle>Detalles del Operario: {operatorName}</DialogTitle>
                        <DialogDescription>
                            Rendimiento de ventas y estadísticas.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Card className="stats-box">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
                                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">102</div>
                                    <p className="text-xs text-muted-foreground">+12% vs el mes pasado</p>
                                </CardContent>
                            </Card>
                            <Card className="stats-box">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">$8,450.50</div>
                                    <p className="text-xs text-muted-foreground">+15% vs el mes pasado</p>
                                </CardContent>
                            </Card>
                            <Card className="stats-box md:col-span-2 lg:col-span-1">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                        Comisión
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">$422.52</div>
                                    <p className="text-xs text-muted-foreground">Comisión de este mes</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Input type="number" value={commission} onChange={e => setCommission(parseInt(e.target.value))} className="w-20 h-8" />
                                        <span className="text-lg font-bold">%</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <h4 className="font-bold mt-4 md:col-span-2">Ventas Recientes (Mes Actual)</h4>
                        <div className="main-table-container p-2 md:col-span-2 overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead>Operario</TableHead>
                                        <TableHead>Comprador</TableHead>
                                        <TableHead>Fecha de Compra</TableHead>
                                        <TableHead className="text-right">Precio</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Laptop UltraSlim</TableCell>
                                        <TableCell>Carlos Ruiz</TableCell>
                                        <TableCell>Maria Rodriguez</TableCell>
                                        <TableCell>2024-07-22</TableCell>
                                        <TableCell className="text-right">$1299.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Smartphone X-Pro</TableCell>
                                        <TableCell>Ana García</TableCell>
                                        <TableCell>Luis Fernandez</TableCell>
                                        <TableCell>2024-07-21</TableCell>
                                        <TableCell className="text-right">$899.99</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Auriculares SoundWave</TableCell>
                                        <TableCell>Ana García</TableCell>
                                        <TableCell>Sofia Gomez</TableCell>
                                        <TableCell>2024-07-20</TableCell>
                                        <TableCell className="text-right">$199.50</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex justify-end mt-2 md:col-span-2">
                            <Button className="glass-button glass-button-green"><Download className="mr-2 h-4 w-4"/>Descargar Excel (Mes Actual)</Button>
                        </div>
                        
                        <Separator className="my-4 bg-white/40 md:col-span-2"/>

                        <h4 className="font-bold md:col-span-2">Historial de Ventas</h4>
                        <Accordion type="single" collapsible className="w-full md:col-span-2">
                        {historicalData.map(data => (
                                <AccordionItem value={data.month} key={data.month} className="stats-box !border-b-0 mb-2">
                                    <AccordionTrigger className="px-4 py-2 text-base font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-muted-foreground"/>
                                            {data.month}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 pb-4">
                                        <p className="text-sm text-muted-foreground mb-4">{data.summary}</p>
                                        <div className="flex items-center gap-4">
                                            <Button variant="link" className="p-0 h-auto text-sm text-primary hover:underline" onClick={() => handleViewDetails(data)}>
                                                Ver detalles completos
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => setMonthToDelete(data.month)}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Borrar
                                            </Button>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                        ))}
                        </Accordion>
                        <Card className="stats-box mt-4 md:col-span-2">
                            <CardHeader>
                                <CardTitle>Balance Total</CardTitle>
                                <CardDescription>Desde que el operario se unió.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-2xl font-bold">520</p>
                                    <p className="text-sm text-muted-foreground">Ventas Totales</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">$41,500.00</p>
                                    <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">$2,075.00</p>
                                    <p className="text-sm text-muted-foreground">Comisión Total</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {isMonthlyModalOpen && (
                        <MonthlyDetailsModal 
                            open={isMonthlyModalOpen} 
                            onOpenChange={setIsMonthlyModalOpen}
                            monthData={selectedMonth}
                            onDelete={(month) => setMonthToDelete(month)}
                        />
                    )}
                </DialogContent>
            </Dialog>
            <ConfirmationDialog
                open={!!monthToDelete}
                onOpenChange={(open) => !open && setMonthToDelete(null)}
                onConfirm={handleDeleteMonth}
                title={`¿Eliminar ${monthToDelete}?`}
                description="Se borrará todo el historial de ventas de este mes para este operario."
            />
        </>
    )
}

const AdminDashboard = () => {
    const { user, products, permissions } = useAppContext();
    const isSuperAdmin = user?.role === 'superadmin';

    const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
    const [isOperatorModalOpen, setIsOperatorModalOpen] = useState(false);
    const [isPublicationHistoryDetailOpen, setPublicationHistoryDetailOpen] = useState(false);
    const [selectedPublicationMonth, setSelectedPublicationMonth] = useState<any>(null);

    const [historicalPublications, setHistoricalPublications] = useState([
        { month: 'Junio 2024', summary: '120 publicaciones, 85 vendidas.' },
        { month: 'Mayo 2024', summary: '110 publicaciones, 78 vendidas.' },
        { month: 'Abril 2024', summary: '135 publicaciones, 92 vendidas.' },
        { month: 'Marzo 2024', summary: '140 publicaciones, 102 vendidas.' },
        { month: 'Febrero 2024', summary: '100 publicaciones, 70 vendidas.' },
    ]);
    const [monthToDelete, setMonthToDelete] = useState<string | null>(null);

    const handleOperatorClick = (operatorName: string) => {
        setSelectedOperator(operatorName);
        setIsOperatorModalOpen(true);
    }
    
    const handleViewPublicationHistory = (monthData: any) => {
        setSelectedPublicationMonth(monthData);
        setPublicationHistoryDetailOpen(true);
    };

    const handleDeletePublicationHistory = () => {
        if (monthToDelete) {
            setHistoricalPublications(prev => prev.filter(p => p.month !== monthToDelete));
            setMonthToDelete(null);
        }
    };
    
    const canViewContentTab = permissions.canManageCategories || permissions.canManageBanners;
    
    const tabs = [
        ...(isSuperAdmin ? [{ value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }] : []),
        ...(permissions.canManagePublications ? [{ value: 'publications', label: 'Publicaciones', icon: Package }] : []),
        ...(permissions.canManageChats ? [{ value: 'chats', label: 'Chats', icon: MessageSquare }] : []),
        ...(canViewContentTab ? [{ value: 'content', label: 'Contenido', icon: List }] : []),
        { value: 'settings', label: 'Ajustes', icon: Settings }
    ].filter(Boolean);

    return (
    <>
        <div className="container mx-auto px-4 py-8 pt-24 animate-fadeIn">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Panel de Administrador</h1>
                    <p className="text-muted-foreground">Bienvenido, {user?.name}. Aquí puedes gestionar el marketplace.</p>
                </div>
                <Avatar className="w-12 h-12 border-2 border-primary">
                    <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${user?.email}.png`} alt={user?.name} />
                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
             <Tabs defaultValue={tabs[0]?.value} className="w-full">
                <TabsList className={`grid w-full`} style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)`}}>
                    {tabs.map(tab => (
                        <TabsTrigger key={tab.value} value={tab.value}>
                            <tab.icon className="mr-2 h-4 w-4" />
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {isSuperAdmin && (
                    <TabsContent value="dashboard">
                        <div className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card className="stats-box">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Ventas Realizadas</CardTitle>
                                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">1,250</div>
                                    <p className="text-xs text-muted-foreground">+15.3% desde el mes pasado</p>
                                </CardContent>
                                </Card>
                                <Card className="stats-box">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Usuarios Registrados</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">+2350</div>
                                    <p className="text-xs text-muted-foreground">+180.1% desde el mes pasado</p>
                                </CardContent>
                                </Card>
                                <Card className="stats-box">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Ventas</CardTitle>
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">+12,234</div>
                                    <p className="text-xs text-muted-foreground">+19% desde el mes pasado</p>
                                </CardContent>
                                </Card>
                                <Card className="stats-box">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">$45,231.89</div>
                                        <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
                                    </CardContent>
                                </Card>
                            </div>
                            <Card className="main-table-container">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Publicaciones Recientes</CardTitle>
                                        <CardDescription>Las últimas 5 publicaciones creadas por operarios.</CardDescription>
                                    </div>
                                    <Button className="glass-button glass-button-green">
                                        <Download className="mr-2 h-4 w-4" />
                                        Exportar a Excel
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                            <TableHead>Producto</TableHead>
                                            <TableHead>Categoría</TableHead>
                                            <TableHead>Operario</TableHead>
                                            <TableHead className="text-right">Precio</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {products.slice(0, 5).map(p => (
                                                <TableRow key={p.id}>
                                                    <TableCell className="font-medium">{p.name}</TableCell>
                                                    <TableCell>{p.category}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => handleOperatorClick(p.operator || 'Sistema')}>
                                                            {p.operator || 'Sistema'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">${p.price.toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                            
                            <div className="main-table-container p-6">
                                <h3 className="text-xl font-bold mb-4">Historial de Publicaciones</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                    {historicalPublications.map((data) => (
                                        <Card key={data.month} className="stats-box flex flex-col">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-base">
                                                    <Calendar className="h-5 w-5" />
                                                    {data.month}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex-grow">
                                                <p className="text-sm text-muted-foreground">{data.summary}</p>
                                            </CardContent>
                                            <div className="p-4 pt-0 mt-auto">
                                                <div className="flex items-center gap-2">
                                                    <Button variant="link" className="p-0 h-auto text-sm" onClick={() => handleViewPublicationHistory(data)}>
                                                        Ver detalles
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => setMonthToDelete(data.month)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                )}
                {permissions.canManagePublications && (
                    <TabsContent value="publications">
                        <PublicationsTab />
                    </TabsContent>
                )}
                 {permissions.canManageChats && (
                    <TabsContent value="chats">
                        <ChatTab />
                    </TabsContent>
                )}
                {canViewContentTab && (
                    <TabsContent value="content">
                        <ContentTab />
                    </TabsContent>
                )}
                <TabsContent value="settings" className="main-table-container mt-4 p-6">
                     <SettingsTab />
                </TabsContent>
             </Tabs>
        </div>

        <OperatorDetailsModal 
            operatorName={selectedOperator} 
            open={isOperatorModalOpen}
            onOpenChange={setIsOperatorModalOpen}
        />
        
        <Dialog open={isPublicationHistoryDetailOpen} onOpenChange={setPublicationHistoryDetailOpen}>
            <DialogContent className="sm:max-w-[1024px]">
                <DialogHeader>
                    <DialogTitle>Detalle de Publicaciones - {selectedPublicationMonth?.month}</DialogTitle>
                    <DialogDescription>
                       {selectedPublicationMonth?.summary}
                    </DialogDescription>
                </DialogHeader>
                 <div className="main-table-container p-2 max-h-[50vh] overflow-y-auto">
                    <Table>
                         <TableHeader>
                            <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead>Operario</TableHead>
                            <TableHead>Comprador</TableHead>
                            <TableHead>Fecha de Compra</TableHead>
                            <TableHead className="text-right">Precio</TableHead>
                            </TableRow>
                        </TableHeader>
                         <TableBody>
                            {products.slice(0, 8).map(p => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">{p.name}</TableCell>
                                    <TableCell>
                                         <Badge variant="outline">{p.operator || 'Sistema'}</Badge>
                                    </TableCell>
                                    <TableCell>Juan Perez</TableCell>
                                    <TableCell>2024-07-15</TableCell>
                                    <TableCell className="text-right">${p.price.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-end items-center gap-4 mt-4">
                    <Button 
                        className="glass-button glass-button-red" 
                        onClick={() => {
                            if (selectedPublicationMonth) {
                                setMonthToDelete(selectedPublicationMonth.month);
                                setPublicationHistoryDetailOpen(false); // Close this modal to open confirm dialog
                            }
                        }}
                    >
                        <Trash2 className="mr-2 h-4 w-4"/>
                        Eliminar Mes
                    </Button>
                    <Button className="glass-button glass-button-green">
                        <Download className="mr-2 h-4 w-4"/>
                        Exportar a Excel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

        <ConfirmationDialog
            open={!!monthToDelete}
            onOpenChange={(open) => !open && setMonthToDelete(null)}
            onConfirm={handleDeletePublicationHistory}
            title={`¿Eliminar ${monthToDelete}?`}
            description="Se borrará todo el historial de publicaciones de este mes."
        />
    </>
    )
}

const PublicationsTab = () => {
    const { products, deleteProduct } = useAppContext();
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleDelete = () => {
        if (itemToDelete) {
            deleteProduct(itemToDelete);
            setItemToDelete(null);
        }
    }
    
    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsEditorOpen(true);
    }

    const handleCreate = () => {
        setSelectedProduct(null);
        setIsEditorOpen(true);
    }

    return (
        <>
            <div className="main-table-container mt-4 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Gestionar Publicaciones</h3>
                    <Button className="glass-button glass-button-green" onClick={handleCreate}><PlusCircle className="mr-2 h-4 w-4"/>Crear Nueva</Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Imagen</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <Image src={product.images[0]} alt={product.name} width={64} height={64} className="rounded-md object-cover" />
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>${product.price.toFixed(2)}</TableCell>
                                <TableCell><Badge>Publicado</Badge></TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}><Pencil className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setItemToDelete(product.id)}><Trash2 className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <PublicationEditor 
                open={isEditorOpen}
                onOpenChange={setIsEditorOpen}
                product={selectedProduct}
            />
            <ConfirmationDialog
                open={!!itemToDelete}
                onOpenChange={(open) => !open && setItemToDelete(null)}
                onConfirm={handleDelete}
                title="¿Eliminar Publicación?"
                description="Esta acción eliminará permanentemente la publicación. ¿Estás seguro?"
            />
        </>
    )
}

const initialChats: Chat[] = [
    {
        id: 'chat-1',
        userName: 'Juan Perez',
        userAvatar: 'https://avatar.vercel.sh/juan.png',
        unreadCount: 2,
        messages: [
            { sender: 'user', type: 'text', content: 'Hola, ¿sigue disponible el Smartphone X-Pro?', timestamp: '10:45 AM' },
            { sender: 'admin', type: 'text', content: 'Hola Juan, sí, todavía tenemos stock. ¿Te gustaría que te ayude con algo más?', timestamp: '10:46 AM' },
            { sender: 'user', type: 'text', content: 'Genial. ¿El envío es gratuito?', timestamp: '10:47 AM' },
            { sender: 'user', type: 'text', content: 'Y viene con cargador?', timestamp: '10:47 AM' },
        ]
    },
    {
        id: 'chat-2',
        userName: 'Maria Rodriguez',
        userAvatar: 'https://avatar.vercel.sh/maria.png',
        unreadCount: 0,
        messages: [
             { sender: 'admin', type: 'text', content: 'Hola Maria, el envío demora 48hs hábiles.', timestamp: 'Ayer' },
             { sender: 'user', type: 'text', content: 'Perfecto, ya mismo realizo la compra.', timestamp: 'Ayer' },
        ]
    }
];

const ChatTab = () => {
    const { user } = useAppContext();
    const { toast } = useToast();
    const [chats, setChats] = useState<Chat[]>(initialChats);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(chats[0] || null);
    const [message, setMessage] = useState("");
    const [chatToDelete, setChatToDelete] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatBodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [selectedChat?.messages]);

    const handleSendMessage = () => {
        if (!message.trim() || !selectedChat) return;

        const newMessage: ChatMessage = {
            sender: 'admin',
            type: 'text',
            content: message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const updatedChats = chats.map(chat =>
            chat.id === selectedChat.id
                ? { ...chat, messages: [...chat.messages, newMessage] }
                : chat
        );
        setChats(updatedChats);
        setSelectedChat(updatedChats.find(c => c.id === selectedChat.id)!);
        setMessage("");
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !selectedChat) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const fileContent = e.target?.result as string;
            const fileType = file.type.split('/')[0];
            
            let messageType: 'image' | 'file' = 'file';
            if (fileType === 'image') messageType = 'image';

            const newMessage: ChatMessage = {
                sender: 'admin',
                type: messageType,
                content: fileContent,
                fileName: file.name,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            const updatedChats = chats.map(chat =>
                chat.id === selectedChat.id
                    ? { ...chat, messages: [...chat.messages, newMessage] }
                    : chat
            );
            setChats(updatedChats);
            setSelectedChat(updatedChats.find(c => c.id === selectedChat.id)!);
        };
        reader.readAsDataURL(file);
    };

    const confirmDeleteChat = () => {
        if (chatToDelete) {
            setChats(chats.filter(chat => chat.id !== chatToDelete));
            if (selectedChat?.id === chatToDelete) {
                setSelectedChat(chats.length > 1 ? chats.find(c => c.id !== chatToDelete) || null : null);
            }
            setChatToDelete(null);
        }
    };
    
    const FileIcon = ({ fileName }: { fileName: string }) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf': return <FileText className="h-8 w-8 text-red-500" />;
            case 'zip':
            case 'rar':
            case '7z': return <FileArchive className="h-8 w-8 text-yellow-500" />;
            default: return <FileText className="h-8 w-8 text-gray-500" />;
        }
    };

    return (
        <>
            <div className="main-table-container mt-4 p-0 flex h-[calc(100vh-280px)]">
                <aside className="w-1/3 border-r border-white/20">
                    <div className="p-4 border-b border-white/20">
                        <h3 className="text-xl font-bold">Conversaciones</h3>
                    </div>
                    <ScrollArea className="h-[calc(100%-65px)]">
                        {chats.map(chat => (
                            <button 
                                key={chat.id} 
                                className={cn(
                                    "w-full text-left p-4 flex items-center gap-4 hover:bg-white/10 transition-colors",
                                    selectedChat?.id === chat.id && "bg-primary/20"
                                )}
                                onClick={() => setSelectedChat(chat)}
                            >
                                <Avatar>
                                    <AvatarImage src={chat.userAvatar} />
                                    <AvatarFallback>{chat.userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow overflow-hidden">
                                    <p className="font-semibold truncate">{chat.userName}</p>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {chat.messages[chat.messages.length - 1].type === 'text'
                                            ? chat.messages[chat.messages.length - 1].content
                                            : `Archivo: ${chat.messages[chat.messages.length - 1].fileName}`
                                        }
                                    </p>
                                </div>
                                <div className="flex flex-col items-end text-xs text-muted-foreground self-start">
                                    <span>{chat.messages[chat.messages.length - 1].timestamp}</span>
                                    {chat.unreadCount > 0 && (
                                        <Badge className="mt-1">{chat.unreadCount}</Badge>
                                    )}
                                </div>
                            </button>
                        ))}
                    </ScrollArea>
                </aside>
                <main className="w-2/3 flex flex-col">
                    {selectedChat ? (
                        <>
                            <div className="p-4 border-b border-white/20 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={selectedChat.userAvatar} />
                                        <AvatarFallback>{selectedChat.userName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <h4 className="font-semibold">{selectedChat.userName}</h4>
                                </div>
                                <div>
                                    <Button variant="ghost" size="icon" onClick={() => toast({ title: "Función en desarrollo", description: "La exportación de chats estará disponible pronto." })}>
                                        <Download className="h-5 w-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setChatToDelete(selectedChat.id)}>
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                            <ScrollArea className="flex-grow p-6" ref={chatBodyRef}>
                               <div className="space-y-4">
                                {selectedChat.messages.map((msg, index) => (
                                    <div key={index} className={cn("flex gap-3", msg.sender === 'user' ? 'justify-start' : 'justify-end')}>
                                        {msg.sender === 'user' && (
                                            <Avatar className="w-8 h-8 self-end">
                                                <AvatarImage src={selectedChat.userAvatar} />
                                                <AvatarFallback>{selectedChat.userName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={cn(
                                            "p-3 rounded-lg max-w-sm",
                                            msg.sender === 'user' ? "bg-card" : "bg-primary text-primary-foreground"
                                        )}>
                                            {msg.type === 'text' && <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}
                                            {msg.type === 'image' && <Image src={msg.content} alt={msg.fileName || "Imagen adjunta"} width={200} height={200} className="rounded-md" />}
                                            {msg.type === 'file' && (
                                                <div className="flex items-center gap-3">
                                                    <FileIcon fileName={msg.fileName || ''} />
                                                    <div className="text-sm">{msg.fileName}</div>
                                                </div>
                                            )}
                                        </div>
                                        {msg.sender === 'admin' && (
                                            <Avatar className="w-8 h-8 self-end">
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                ))}
                               </div>
                            </ScrollArea>
                            <div className="p-4 border-t border-white/20 flex items-center gap-4">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    accept="image/jpeg,image/png,image/gif,application/pdf,application/zip,application/x-rar-compressed,application/x-7z-compressed,text/plain,.doc,.docx"
                                />
                                <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}><Paperclip className="h-5 w-5" /></Button>
                                <Input 
                                    placeholder="Escribe un mensaje..." 
                                    className="flex-grow"
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                />
                                <Button className="glass-button glass-button-green" onClick={handleSendMessage}><Send className="h-5 w-5" /></Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>Selecciona un chat para empezar a conversar</p>
                        </div>
                    )}
                </main>
            </div>
            <ConfirmationDialog
                open={!!chatToDelete}
                onOpenChange={(open) => !open && setChatToDelete(null)}
                onConfirm={confirmDeleteChat}
                title="¿Eliminar conversación?"
                description="Esta acción es permanente y no se puede deshacer. Se borrará todo el historial de mensajes."
            />
        </>
    );
}

const ContentTab = () => {
    const { 
        permissions,
        categories, 
        addCategory, 
        products, 
        topBanners, 
        footerBanners, 
        updateTopBanner, 
        updateFooterBanner 
    } = useAppContext();
    
    const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string; hasProducts: boolean } | null>(null);

    const bannerInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const checkProductsInCategory = (categoryName: string) => {
        return products.some(p => p.category === categoryName);
    };

    const handleDeleteCategoryClick = (categoryId: string, categoryName: string) => {
        const hasProducts = checkProductsInCategory(categoryName);
        setCategoryToDelete({ id: categoryId, name: categoryName, hasProducts });
    };

    const handleConfirmDeleteCategory = () => {
        if (categoryToDelete && !categoryToDelete.hasProducts) {
            console.log(`Deleting category:`, categoryToDelete.id);
            // Here you would add the actual deletion logic from context
        }
        setCategoryToDelete(null);
    };
    
    const handleAddCategory = () => {
        if (newCategoryName.trim() !== "") {
            addCategory(newCategoryName.trim());
            setNewCategoryName("");
            setIsAddCategoryOpen(false);
        }
    };
    
    const handleBannerImageChange = (event: React.ChangeEvent<HTMLInputElement>, index: number, type: 'top' | 'footer') => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                if (type === 'top') {
                    updateTopBanner(index, base64String);
                } else {
                    updateFooterBanner(index, base64String);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBannerUploadClick = (index: number) => {
        bannerInputRefs.current[index]?.click();
    };

    const removeBannerImage = (index: number, type: 'top' | 'footer') => {
        if (type === 'top') {
            updateTopBanner(index, null);
        } else {
            updateFooterBanner(index, null);
        }
    };

    const BannerManager = ({ title, banners, type, onUpload, onRemove, onImageChange, refs }: any) => (
        <div>
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {banners.map((src: string | null, index: number) => (
                    <div key={index} className="space-y-2">
                        <p className="text-sm font-medium text-center">Banner Slot {index + 1}</p>
                        <div className="relative aspect-video">
                            {src ? (
                                <div className="group">
                                    <Image
                                        src={src}
                                        alt={`Vista previa del Banner ${index + 1}`}
                                        width={400}
                                        height={200}
                                        className="w-full h-full object-cover rounded-lg border"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        onClick={() => onRemove(index, type)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                     <div 
                                        className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => onUpload(type === 'top' ? index : index + 3)}
                                     >
                                        <Camera className="w-8 h-8 text-white" />
                                     </div>
                                </div>
                            ) : (
                                <div 
                                    className="flex flex-col items-center justify-center w-full h-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                    onClick={() => onUpload(type === 'top' ? index : index + 3)}
                                >
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <UploadCloud className="w-10 h-10 mb-2 text-gray-500 dark:text-gray-400" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Subir Banner
                                        </p>
                                    </div>
                                </div>
                            )}
                             <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                onChange={(e) => onImageChange(e, index, type)}
                                ref={(el) => (refs.current[type === 'top' ? index : index + 3] = el)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <>
            <div className="main-table-container mt-4 p-6 space-y-6">
                {permissions.canManageCategories && (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Gestionar Categorías</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {categories.map(cat => (
                                <Card key={cat.id} className="stats-box p-4 flex justify-between items-center">
                                    <span className="font-medium">{cat.name}</span>
                                    <div>
                                        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteCategoryClick(cat.id, cat.name)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                            <DialogTrigger asChild>
                                <Button className="glass-button glass-button-green mt-4"><PlusCircle className="mr-2 h-4 w-4"/>Añadir Categoría</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Añadir Nueva Categoría</DialogTitle>
                                    <DialogDescription>
                                        Escribe el nombre para la nueva categoría que deseas crear.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="category-name" className="text-right">
                                        Nombre
                                    </Label>
                                    <Input
                                        id="category-name"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        className="col-span-3"
                                        placeholder="Ej: Jardinería"
                                    />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => setIsAddCategoryOpen(false)} variant="outline">Cancelar</Button>
                                    <Button onClick={handleAddCategory}>Añadir</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
                
                {permissions.canManageCategories && permissions.canManageBanners && (
                    <Separator className="bg-white/40"/>
                )}

                {permissions.canManageBanners && (
                    <>
                        <BannerManager
                            title="Gestionar Banners Top"
                            banners={topBanners}
                            type="top"
                            onUpload={handleBannerUploadClick}
                            onRemove={removeBannerImage}
                            onImageChange={handleBannerImageChange}
                            refs={bannerInputRefs}
                        />

                        <Separator className="bg-white/40"/>

                        <BannerManager
                            title="Gestionar Banners Pie"
                            banners={footerBanners}
                            type="footer"
                            onUpload={handleBannerUploadClick}
                            onRemove={removeBannerImage}
                            onImageChange={handleBannerImageChange}
                            refs={bannerInputRefs}
                        />
                    </>
                )}
            </div>

            {/* Dialog for category with products */}
            <AlertDialog open={!!categoryToDelete && categoryToDelete.hasProducts} onOpenChange={() => setCategoryToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>No se puede eliminar la categoría</AlertDialogTitle>
                    <AlertDialogDescription>
                        La categoría "{categoryToDelete?.name}" no se puede eliminar porque contiene productos. Por favor, mueva o elimine los productos de esta categoría antes de intentar eliminarla.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setCategoryToDelete(null)}>Entendido</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            {/* Confirmation for empty category */}
            <ConfirmationDialog
                open={!!categoryToDelete && !categoryToDelete.hasProducts}
                onOpenChange={(open) => !open && setCategoryToDelete(null)}
                onConfirm={handleConfirmDeleteCategory}
                title={`¿Eliminar Categoría "${categoryToDelete?.name}"?`}
                description="Esta acción es irreversible. ¿Estás seguro de que deseas eliminar esta categoría?"
            />
        </>
    )
}

const SettingsTab = () => {
    const { user, users, updateUser, addUser, deleteUser } = useAppContext();
    const isSuperAdmin = user?.role === 'superadmin';
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [adminName, setAdminName] = useState(user.name);
    const [adminPhone, setAdminPhone] = useState(user.phone || '');
    const [adminPassword, setAdminPassword] = useState(user.password || '');
    const [isEditingPermissions, setIsEditingPermissions] = useState<string | null>(null);
    const [currentUserPermissions, setCurrentUserPermissions] = useState<UserPermissions | null>(null);
    const [isAddOperatorOpen, setIsAddOperatorOpen] = useState(false);
    const [newOperatorName, setNewOperatorName] = useState("");
    const [newOperatorEmail, setNewOperatorEmail] = useState("");
    const [newOperatorPassword, setNewOperatorPassword] = useState("");

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                updateUser(user.id, { avatar: base64String });
                toast({ title: "Avatar Actualizado", description: "Tu nueva imagen de perfil ha sido guardada." });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = () => {
        updateUser(user.id, { name: adminName, phone: adminPhone, password: adminPassword });
        toast({ title: "Perfil de Administrador Actualizado" });
    }

    const handlePermissionChange = (userId: string, permission: keyof UserPermissions, value: boolean) => {
        if(isEditingPermissions === userId && currentUserPermissions) {
            setCurrentUserPermissions(prev => ({...prev!, [permission]: value}));
        }
    }

    const startEditingPermissions = (operator: UserType) => {
        setIsEditingPermissions(operator.id);
        setCurrentUserPermissions(operator.permissions || {
            canManagePublications: false,
            canManageBanners: false,
            canManageCategories: false,
            canManageChats: false,
        });
    }

    const savePermissions = (userId: string) => {
        if(currentUserPermissions) {
            updateUser(userId, { permissions: currentUserPermissions });
        }
        setIsEditingPermissions(null);
        setCurrentUserPermissions(null);
        toast({ title: "Permisos actualizados" });
    }

    const handleAddOperator = (e: React.FormEvent) => {
        e.preventDefault();
        if (newOperatorName && newOperatorEmail && newOperatorPassword) {
            addUser({
                name: newOperatorName,
                email: newOperatorEmail,
                password: newOperatorPassword,
                role: 'admin',
                permissions: {
                    canManagePublications: false,
                    canManageBanners: false,
                    canManageCategories: false,
                    canManageChats: false,
                }
            });
            toast({ title: "Operador añadido", description: `${newOperatorName} ha sido añadido como operador.` });
            setNewOperatorName("");
            setNewOperatorEmail("");
            setNewOperatorPassword("");
            setIsAddOperatorOpen(false);
        } else {
            toast({ variant: "destructive", title: "Error", description: "Por favor, completa todos los campos." });
        }
    }

    const operators = users.filter(u => u.role === 'admin' || u.role === 'superadmin');

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-bold mb-4">Mi Perfil de Administrador</h3>
                <Card className="stats-box p-6">
                    <div className="flex items-start gap-6">
                        <div className="relative group">
                            <Avatar className="w-24 h-24 border-4 border-white/50 shadow-lg">
                                <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="h-8 w-8 text-white" />
                                <input
                                    ref={fileInputRef}
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                            <div className="space-y-1">
                                <Label htmlFor="admin-name">Nombre de Usuario</Label>
                                <Input id="admin-name" value={adminName} onChange={e => setAdminName(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="admin-password">Contraseña</Label>
                                <Input id="admin-password" type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="admin-phone">Celular</Label>
                                <Input id="admin-phone" value={adminPhone} onChange={e => setAdminPhone(e.target.value)} />
                            </div>
                             <div className="md:col-span-2 flex justify-end">
                                <Button className="glass-button glass-button-green" onClick={handleProfileUpdate}>
                                    <Save className="mr-2 h-4 w-4"/> Guardar Cambios
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            
            {isSuperAdmin && (
              <>
                <Separator className="bg-white/40"/>
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Gestionar Operadores</h3>
                        <Dialog open={isAddOperatorOpen} onOpenChange={setIsAddOperatorOpen}>
                            <DialogTrigger asChild>
                                <Button className="glass-button glass-button-green" onClick={() => setIsAddOperatorOpen(true)}><PlusCircle className="mr-2 h-4 w-4"/>Añadir Operador</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Añadir Nuevo Operador</DialogTitle>
                                    <DialogDescription>
                                        Crea una cuenta para un nuevo operador y asigna sus credenciales.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleAddOperator}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="op-name" className="text-right">Nombre</Label>
                                            <Input id="op-name" value={newOperatorName} onChange={(e) => setNewOperatorName(e.target.value)} className="col-span-3" placeholder="Ej: Juan Perez" required />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="op-email" className="text-right">Email</Label>
                                            <Input id="op-email" type="email" value={newOperatorEmail} onChange={(e) => setNewOperatorEmail(e.target.value)} className="col-span-3" placeholder="ejemplo@megatec.com" required />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="op-password" className="text-right">Contraseña</Label>
                                            <Input id="op-password" type="password" value={newOperatorPassword} onChange={(e) => setNewOperatorPassword(e.target.value)} className="col-span-3" placeholder="********" required />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsAddOperatorOpen(false)}>Cancelar</Button>
                                        <Button type="submit">Crear Operador</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="main-table-container p-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Operador</TableHead>
                                    <TableHead>Publicaciones</TableHead>
                                    <TableHead>Banners</TableHead>
                                    <TableHead>Categorías</TableHead>
                                    <TableHead>Chats</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {operators.map(op => (
                                    <TableRow key={op.id}>
                                        <TableCell className="font-medium flex items-center gap-3">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={op.avatar || `https://avatar.vercel.sh/${op.email}.png`} alt={op.name} />
                                                <AvatarFallback>{op.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-semibold">{op.name}</span>
                                                <span className="text-xs text-muted-foreground">{op.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                disabled={isEditingPermissions !== op.id}
                                                checked={isEditingPermissions === op.id ? currentUserPermissions?.canManagePublications : op.permissions?.canManagePublications}
                                                onCheckedChange={(val) => handlePermissionChange(op.id, 'canManagePublications', val)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                disabled={isEditingPermissions !== op.id}
                                                checked={isEditingPermissions === op.id ? currentUserPermissions?.canManageBanners : op.permissions?.canManageBanners}
                                                onCheckedChange={(val) => handlePermissionChange(op.id, 'canManageBanners', val)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                disabled={isEditingPermissions !== op.id}
                                                checked={isEditingPermissions === op.id ? currentUserPermissions?.canManageCategories : op.permissions?.canManageCategories}
                                                onCheckedChange={(val) => handlePermissionChange(op.id, 'canManageCategories', val)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                disabled={isEditingPermissions !== op.id}
                                                checked={isEditingPermissions === op.id ? currentUserPermissions?.canManageChats : op.permissions?.canManageChats}
                                                onCheckedChange={(val) => handlePermissionChange(op.id, 'canManageChats', val)}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {isEditingPermissions === op.id ? (
                                                <>
                                                    <Button variant="ghost" size="icon" className="text-green-500" onClick={() => savePermissions(op.id)}><Save className="h-4 w-4"/></Button>
                                                    <Button variant="ghost" size="icon" onClick={() => setIsEditingPermissions(null)}><X className="h-4 w-4"/></Button>
                                                </>
                                            ) : (
                                                <Button variant="ghost" size="icon" onClick={() => startEditingPermissions(op)}><Pencil className="h-4 w-4"/></Button>
                                            )}
                                            <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4"/></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
              </>
            )}
        </div>
    );
};


const UserProfile = () => {
  const { user, favorites, toggleFavorite, updateUser } = useAppContext();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [productToRemove, setProductToRemove] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user && user.role !== 'guest') {
      setName(user.name);
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSave = () => {
    updateUser(user.id, { name, phone });
    setIsEditing(false);
    toast({ title: "Perfil Actualizado", description: "Tus datos han sido guardados." });
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateUser(user.id, { avatar: base64String });
        toast({ title: "Avatar Actualizado", description: "Tu nueva imagen de perfil ha sido guardada." });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFavorite = () => {
    if (productToRemove) {
      const product = favorites.find(p => p.id === productToRemove);
      if (product) {
        toggleFavorite(product);
      }
      setProductToRemove(null);
    }
  };

  if (!user || user.role === 'guest') {
    return null;
  }

  const avatarSrc = user.avatar || `https://avatar.vercel.sh/${user.email}.png`;

  return (
    <>
      <div className="container mx-auto px-4 py-8 pt-24 animate-fadeIn">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          <aside className="lg:col-span-1 space-y-6 sticky top-24">
            <Card className="stats-box">
              <CardHeader className="items-center text-center p-6 relative">
                 <div className="relative group">
                    <Avatar className="w-24 h-24 border-4 border-white/50 shadow-lg">
                        <AvatarImage src={avatarSrc} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                        <label htmlFor="avatar-upload-user" className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="h-8 w-8 text-white" />
                            <input
                                ref={fileInputRef}
                                id="avatar-upload-user"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </label>
                    )}
                 </div>
                
                <CardTitle className="text-2xl mt-4">{user.name}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-2 text-xs">
                    <ShieldCheck className="h-4 w-4 text-green-400" />
                    ID: {user.id}
                </CardDescription>

                 <div className="absolute top-4 right-4">
                    {isEditing ? (
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={handleSave}>
                            <Save className="h-5 w-5" />
                         </Button>
                    ) : (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setIsEditing(true)}>
                            <Edit className="h-5 w-5" />
                        </Button>
                    )}
                 </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground text-left space-y-4 pt-0 p-6">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 w-6 text-center"/>
                    {isEditing ? (
                        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre completo" />
                    ) : (
                        <span>{user.name}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 w-6 text-center"/>
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 w-6 text-center"/>
                    {isEditing ? (
                        <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Número de celular" />
                    ) : (
                        <span>{user.phone || 'No especificado'}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 w-6 text-center"/>
                    <span>Av. Siempreviva 742, Springfield</span>
                  </div>
              </CardContent>
            </Card>
          </aside>

          <main className="lg:col-span-2">
            <Tabs defaultValue="favorites" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="favorites"><Heart className="mr-2 h-4 w-4" />Favoritos</TabsTrigger>
                <TabsTrigger value="chat"><MessageSquare className="mr-2 h-4 w-4"/>Chat con Soporte</TabsTrigger>
              </TabsList>
              <TabsContent value="favorites" className="main-table-container mt-4 p-6">
                <h3 className="text-xl font-bold mb-4">Tus Artículos Favoritos</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {favorites.length > 0 ? (
                        favorites.map((product) => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            showDelete={true}
                            onDelete={() => setProductToRemove(product.id)}
                        />
                        ))
                    ) : (
                        <p className="text-muted-foreground col-span-full text-center">No tienes productos favoritos.</p>
                    )}
                  </div>
              </TabsContent>
              <TabsContent value="chat" className="main-table-container mt-4">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">Habla con un Administrador</h3>
                  <div className="flex flex-col h-[500px] bg-white/20 rounded-lg">
                      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                          {/* Chat messages */}
                          <div className="flex items-end gap-2">
                              <Avatar className="h-8 w-8">
                                  <AvatarImage src="https://avatar.vercel.sh/admin.png" />
                                  <AvatarFallback>S</AvatarFallback>
                              </Avatar>
                              <div className="bg-secondary rounded-lg px-4 py-2 max-w-xs">
                                  <p className="text-sm">Hola {user.name}, ¿en qué puedo ayudarte hoy?</p>
                              </div>
                          </div>
                          <div className="flex items-end gap-2 justify-end">
                              <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-xs">
                                  <p className="text-sm">¡Hola! Tengo una pregunta sobre mi último pedido.</p>
                              </div>
                              <Avatar className="h-8 w-8">
                                  <AvatarImage src={avatarSrc} />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                          </div>
                      </div>
                      <Separator className="bg-white/40" />
                      <div className="p-4 flex items-center gap-2">
                          <Textarea placeholder="Escribe tu mensaje aquí..." className="flex-grow bg-white/50 border-gray-300 resize-none"/>
                          <Button className="glass-button glass-button-green h-full">
                              <Send className="h-5 w-5" />
                          </Button>
                      </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </main>

        </div>
      </div>

      <ConfirmationDialog
        open={!!productToRemove}
        onOpenChange={(open) => !open && setProductToRemove(null)}
        onConfirm={handleRemoveFavorite}
        title="¿Eliminar de favoritos?"
        description="Este producto se quitará de tu lista de favoritos."
      />
    </>
  );
}

export default function ProfilePage() {
  const { user, isClient } = useAppContext();

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24 animate-fadeIn">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <aside className="lg:col-span-1 space-y-6 sticky top-24">
            <Card className="stats-box">
              <CardHeader className="items-center text-center p-6">
                <Skeleton className="w-24 h-24 rounded-full" />
                <Skeleton className="h-8 w-48 mt-4" />
                <Skeleton className="h-4 w-32 mt-2" />
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </CardContent>
            </Card>
          </aside>
          <main className="lg:col-span-2">
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-[500px] w-full mt-4" />
          </main>
        </div>
      </div>
    );
  }
  
  if (user.role === 'guest') {
    return (
      <div className="text-center py-20 stats-box mt-16 animate-fadeIn">
        <UserIcon className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Acceso Restringido</h2>
        <p className="text-muted-foreground mb-6">Por favor, inicia sesión para ver tu perfil.</p>
        {/* You could add a login button here */}
      </div>
    );
  }
  
  const isAdmin = user.role === 'admin' || user.role === 'superadmin';

  return isAdmin ? <AdminDashboard /> : <UserProfile />;
}

    

    

