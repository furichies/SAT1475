'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  Clock,
  ChevronRight,
  MoreHorizontal,
  MessageSquare,
  Settings,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  LayoutDashboard,
  Menu,
  ShoppingBag,
  XCircle,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock data para métricas
const kpiMock = [
  {
    id: 'ventas',
    titulo: 'Ventas Totales',
    valor: 45678,
    valorAnterior: 38542,
    cambio: 18.5,
    moneda: true,
    icon: DollarSign,
    color: 'text-green-600',
    trend: 'up'
  },
  {
    id: 'pedidos',
    titulo: 'Pedidos',
    valor: 234,
    valorAnterior: 198,
    cambio: 18.2,
    icon: ShoppingCart,
    color: 'text-blue-600',
    trend: 'up'
  },
  {
    id: 'clientes',
    titulo: 'Clientes Nuevos',
    valor: 56,
    valorAnterior: 42,
    cambio: 33.3,
    icon: Users,
    color: 'text-purple-600',
    trend: 'up'
  },
  {
    id: 'ingresos',
    titulo: 'Ingresos del Mes',
    valor: 156789,
    valorAnterior: 134521,
    cambio: 16.5,
    moneda: true,
    icon: TrendingUp,
    color: 'text-green-600',
    trend: 'up'
  },
  {
    id: 'tasaConversion',
    titulo: 'Tasa de Conversión',
    valor: 3.2,
    valorAnterior: 2.8,
    cambio: 14.3,
    porcentaje: true,
    icon: Activity,
    color: 'text-orange-600',
    trend: 'up'
  },
  {
    id: 'valorMedio',
    titulo: 'Valor Medio del Pedido',
    valor: 654,
    valorAnterior: 623,
    cambio: 5.0,
    moneda: true,
    icon: Package,
    color: 'text-blue-600',
    trend: 'up'
  },
  {
    id: 'stock',
    titulo: 'Productos en Stock',
    valor: 1234,
    valorAnterior: 1289,
    cambio: -4.3,
    icon: Package,
    color: 'text-yellow-600',
    trend: 'down'
  },
  {
    id: 'ticketsPendientes',
    titulo: 'Tickets Pendientes',
    valor: 12,
    valorAnterior: 15,
    cambio: -20.0,
    icon: MessageSquare,
    color: 'text-red-600',
    trend: 'down'
  }
]

const ventasPorDiaMock = [
  { dia: 'Lun', valor: 4520, progreso: 75 },
  { dia: 'Mar', valor: 6230, progreso: 100 },
  { dia: 'Mie', valor: 5180, progreso: 85 },
  { dia: 'Jue', valor: 4890, progreso: 80 },
  { dia: 'Vie', valor: 5780, progreso: 92 },
  { dia: 'Sáb', valor: 4120, progreso: 68 },
  { dia: 'Dom', valor: 3890, progreso: 64 }
]

const ventasPorMesMock = [
  { mes: 'Jul', ventas: 32450 },
  { mes: 'Ago', ventas: 35120 },
  { mes: 'Sep', ventas: 38450 },
  { mes: 'Oct', ventas: 36890 },
  { mes: 'Nov', ventas: 42100 },
  { mes: 'Dic', ventas: 45678 }
]

export default function AdminDashboardPage() {
  const [periodo, setPeriodo] = useState<'7d' | '30d' | '90d'>('30d')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar de navegación */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4 fixed left-0 top-0 z-10 hidden lg:block">
          <div className="flex items-center gap-2 mb-8">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">MicroInfo Admin</span>
          </div>

          <nav className="space-y-2">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2 bg-primary text-white rounded-lg font-medium">
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/admin/productos" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              <Package className="h-5 w-5" />
              Productos
            </Link>
            <Link href="/admin_pedidos" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              <ShoppingCart className="h-5 w-5" />
              Pedidos
            </Link>
            <Link href="/admin_tickets" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              <MessageSquare className="h-5 w-5" />
              Tickets SAT
            </Link>
            <Link href="/admin_tecnicos" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              <Users className="h-5 w-5" />
              Técnicos
            </Link>
            <Link href="/admin_conocimiento" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              <Settings className="h-5 w-5" />
              Base de Conocimiento
            </Link>
          </nav>

          <div className="mt-8 pt-8 border-t">
            <p className="text-xs text-gray-500 mb-2">Administrador</p>
            <p className="text-sm font-semibold">Admin Principal</p>
            <p className="text-xs text-gray-500">admin@microinfo.es</p>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 lg:ml-64 p-8">
          {/* Header móvil */}
          <div className="lg:hidden flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">MicroInfo Admin</span>
            </div>
            <Button variant="outline" size="sm">
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          {/* Título del dashboard */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Bienvenido al panel de administración. Aquí tienes una vista general de tu negocio.
            </p>
          </div>

          {/* Selector de periodo */}
          <div className="mb-8">
            <Tabs value={periodo} onValueChange={setPeriodo}>
              <TabsList>
                <TabsTrigger value="7d">Últimos 7 días</TabsTrigger>
                <TabsTrigger value="30d">Últimos 30 días</TabsTrigger>
                <TabsTrigger value="90d">Últimos 90 días</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiMock.map((kpi) => (
              <Card key={kpi.id} className="hover:shadow-lg transition-all">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {kpi.titulo}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${kpi.color} bg-opacity-10`}>
                    <kpi.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl font-bold">
                      {kpi.moneda && '€'}
                      {kpi.valor.toLocaleString()}
                      {kpi.porcentaje && '%'}
                    </div>
                    <div className={`flex items-center text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {kpi.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="ml-1 font-medium">
                        {Math.abs(kpi.cambio).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    vs {kpi.valorAnterior.toLocaleString()} {kpi.moneda ? '€' : ''} el mes anterior
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gráficos y widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Ventas por día */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Ventas por Día</CardTitle>
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                </div>
                <CardDescription className="mt-2">
                  Tendencia de ventas diarias de la última semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ventasPorDiaMock.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.dia}</span>
                        <span className="text-gray-600 font-semibold">
                          {item.valor.toLocaleString()}€
                        </span>
                      </div>
                      <Progress value={item.progreso} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Distribución por categoría */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Distribución por Categoría</CardTitle>
                  <PieChart className="h-5 w-5 text-gray-400" />
                </div>
                <CardDescription className="mt-2">
                  Ventas por categoría este mes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { categoria: 'Ordenadores', ventas: 15678, porcentaje: 34.3, color: 'bg-blue-500' },
                    { categoria: 'Componentes', ventas: 12345, porcentaje: 27.0, color: 'bg-purple-500' },
                    { categoria: 'Almacenamiento', ventas: 7890, porcentaje: 17.3, color: 'bg-green-500' },
                    { categoria: 'Periféricos', ventas: 5670, porcentaje: 12.4, color: 'bg-orange-500' },
                    { categoria: 'Audio', ventas: 4195, porcentaje: 9.0, color: 'bg-pink-500' }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.categoria}</span>
                        <span className="text-gray-600 font-semibold">
                          {item.ventas.toLocaleString()}€ ({item.porcentaje}%)
                        </span>
                      </div>
                      <Progress value={item.porcentaje} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Widget de alertas */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Alertas y Notificaciones</CardTitle>
              <Badge variant="destructive">4 nuevas</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { tipo: 'stock_bajo', titulo: 'Stock Bajo: Monitor Curvo 32"', descripcion: 'Solo 2 unidades disponibles (mínimo: 5)', severidad: 'alta', color: 'bg-orange-100 text-orange-800' },
                  { tipo: 'ticket_urgente', titulo: 'Ticket Urgente: Portátil no enciende', descripcion: 'Ticket SAT-2023-0045 sin asignar', severidad: 'alta', color: 'bg-red-100 text-red-800' },
                  { tipo: 'stock_bajo', titulo: 'Stock Bajo: CPU Intel Core i9', descripcion: 'Solo 1 unidad disponible (mínimo: 5)', severidad: 'media', color: 'bg-yellow-100 text-yellow-800' },
                  { tipo: 'ticket_pendiente', titulo: 'Tickets Pendientes de Asignación', descripcion: '2 tickets sin técnico asignado', severidad: 'media', color: 'bg-blue-100 text-blue-800' }
                ].map((alerta, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className={`p-2 rounded-lg ${alerta.color}`}>
                      {alerta.tipo === 'ticket_urgente' ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : alerta.tipo === 'ticket_pendiente' ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <Package className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold mb-1">
                        {alerta.titulo}
                      </p>
                      <p className="text-xs text-gray-600">
                        {alerta.descripcion}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Hace {idx + 1}h
                      </p>
                    </div>
                    <XCircle className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Ver todas las alertas
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>

          {/* Widget de pedidos recientes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pedidos Recientes</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin_pedidos">
                    Ver todos
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
              <CardDescription className="mt-2">
                Últimos 5 pedidos recibidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: '1', numero: 'PED-2023-0123', cliente: 'Juan Pérez', estado: 'pendiente', total: 1254, fecha: new Date('2023-12-30T10:30:00Z') },
                  { id: '2', numero: 'PED-2023-0122', cliente: 'María García', estado: 'en_proceso', total: 678, fecha: new Date('2023-12-30T09:15:00Z') },
                  { id: '3', numero: 'PED-2023-0121', cliente: 'Carlos López', estado: 'enviado', total: 1890, fecha: new Date('2023-12-29T16:45:00Z') },
                  { id: '4', numero: 'PED-2023-0120', cliente: 'Ana Martínez', estado: 'entregado', total: 456, fecha: new Date('2023-12-29T14:20:00Z') },
                  { id: '5', numero: 'PED-2023-0119', cliente: 'Diego Fernández', estado: 'cancelado', total: 890, fecha: new Date('2023-12-28T11:30:00Z') }
                ].map((pedido) => (
                  <div key={pedido.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      {pedido.estado === 'pendiente' && (
                        <Clock className="h-4 w-4 text-yellow-600" />
                      )}
                      {pedido.estado === 'en_proceso' && (
                        <Activity className="h-4 w-4 text-blue-600" />
                      )}
                      {pedido.estado === 'enviado' && (
                        <ShoppingCart className="h-4 w-4 text-purple-600" />
                      )}
                      {pedido.estado === 'entregado' && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {pedido.estado === 'cancelado' && (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold line-clamp-1">
                          {pedido.numero}
                        </p>
                        <p className="text-xs text-gray-500">
                          Hace {Math.floor((Date.now() - pedido.fecha.getTime()) / (1000 * 60 * 60))}h
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-600">{pedido.cliente}</p>
                        <p className="text-sm font-bold text-gray-900">
                          {pedido.total.toLocaleString()}€
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
