'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Search,
  Package,
  Edit,
  Eye,
  Download,
  X,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  ShoppingCart,
  FileText,
  Settings,
  LayoutDashboard,
  ShoppingBag,
  User,
  MoreHorizontal,
  Printer,
  FileDown
} from 'lucide-react'
import Link from 'next/link'

const pedidosMock = [
  { id: '1', numero: 'PED-2023-0123', cliente: 'Juan Pérez', estado: 'pendiente', fecha: '2023-12-30 10:30', total: 1340 },
  { id: '2', numero: 'PED-2023-0122', cliente: 'Maria García', estado: 'en_proceso', fecha: '2023-12-30 09:15', total: 2286 },
  { id: '3', numero: 'PED-2023-0121', cliente: 'Carlos López', estado: 'enviado', fecha: '2023-12-29 16:45', total: 735 },
  { id: '4', numero: 'PED-2023-0120', cliente: 'Ana Martínez', estado: 'entregado', fecha: '2023-12-29 14:20', total: 1517 },
  { id: '5', numero: 'PED-2023-0119', cliente: 'Diego Fernández', estado: 'cancelado', fecha: '2023-12-28 11:30', total: 1086 }
]

export default function AdminPedidosPage() {
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState('todos')
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)

  const pedidosFiltrados = pedidosMock.filter(p => {
    if (busqueda && !p.numero.toLowerCase().includes(busqueda.toLowerCase()) && !p.cliente.toLowerCase().includes(busqueda.toLowerCase())) return false
    if (estado !== 'todos' && p.estado !== estado) return false
    return true
  })

  const getEstadoInfo = (est: string) => {
    const estados = {
      pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      en_proceso: { label: 'En Proceso', color: 'bg-blue-100 text-blue-800', icon: Package },
      enviado: { label: 'Enviado', color: 'bg-purple-100 text-purple-800', icon: Truck },
      entregado: { label: 'Entregado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: XCircle }
    }
    return estados[est as keyof typeof estados] || { label: est, color: 'bg-gray-100', icon: Package }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-screen p-4 fixed left-0 top-0 z-10 hidden lg:block">
          <div className="flex items-center gap-2 mb-8">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">MicroInfo Admin</span>
          </div>
          <nav className="space-y-2">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/admin/productos" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
              <Package className="h-5 w-5" />
              Productos
            </Link>
            <Link href="/admin_pedidos" className="flex items-center gap-3 px-4 py-2 bg-primary text-white rounded">
              <ShoppingCart className="h-5 w-5" />
              Pedidos
            </Link>
            <Link href="/admin_tickets" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
              <FileText className="h-5 w-5" />
              Tickets SAT
            </Link>
          </nav>
          <div className="mt-8 pt-8 border-t">
            <p className="text-xs text-gray-500 mb-2">Administrador</p>
            <p className="text-sm font-semibold">Admin Principal</p>
          </div>
        </aside>

        <main className="flex-1 lg:ml-64 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Gestión de Pedidos</h1>
            <p className="text-gray-600">
              Administra, gestiona y realiza seguimiento de todos los pedidos de la tienda.
            </p>
          </div>

          <div className="bg-white border-b p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por número de pedido o cliente..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                className="w-40 p-2 border rounded"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En Proceso</option>
                <option value="enviado">Enviado</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
              <div className="text-sm text-gray-600">
                {pedidosFiltrados.length} pedidos
              </div>
            </div>
          </div>

          <div className="bg-white m-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 font-medium text-gray-600">Pedido</th>
                    <th className="text-left p-4 font-medium text-gray-600">Cliente</th>
                    <th className="text-left p-4 font-medium text-gray-600">Fecha</th>
                    <th className="text-left p-4 font-medium text-gray-600">Estado</th>
                    <th className="text-right p-4 font-medium text-gray-600">Total</th>
                    <th className="text-right p-4 font-medium text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosFiltrados.map((pedido) => {
                    const estadoInfo = getEstadoInfo(pedido.estado)
                    return (
                      <tr key={pedido.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="font-medium">{pedido.numero}</div>
                        </td>
                        <td className="p-4">{pedido.cliente}</td>
                        <td className="p-4 text-sm">{pedido.fecha}</td>
                        <td className="p-4">
                          <Badge className={estadoInfo.color}>
                            <div className="flex items-center gap-1">
                              <estadoInfo.icon className="h-3 w-3" />
                              {estadoInfo.label}
                            </div>
                          </Badge>
                        </td>
                        <td className="p-4 text-right font-bold">{pedido.total}€</td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setPedidoSeleccionado(pedido)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between p-6 border-t">
              <div className="text-sm text-gray-600">
                Mostrando 1-{pedidosFiltrados.length} de {pedidosMock.length} pedidos
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Anterior</Button>
                <Button variant="outline" size="sm">Siguiente</Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {pedidoSeleccionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Detalle del Pedido</CardTitle>
              <Button variant="ghost" onClick={() => setPedidoSeleccionado(null)}>
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Información del Pedido</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Número de Pedido</p>
                    <p className="font-medium">{pedidoSeleccionado.numero}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estado</p>
                    <Badge className={getEstadoInfo(pedidoSeleccionado.estado).color}>
                      <div className="flex items-center gap-1">
                        {React.createElement(getEstadoInfo(pedidoSeleccionado.estado).icon, { className: "h-3 w-3" })}
                        {getEstadoInfo(pedidoSeleccionado.estado).label}
                      </div>
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Cliente</p>
                    <p className="font-medium">{pedidoSeleccionado.cliente}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Fecha</p>
                    <p className="text-sm">{pedidoSeleccionado.fecha}</p>
                  </div>
                </div>
              </div>

              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Documentos</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    Factura
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Truck className="h-4 w-4" />
                    Albarán
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Printer className="h-4 w-4" />
                    Imprimir
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2">
                  <Printer className="h-4 w-4" />
                  Imprimir Resumen
                </Button>
                <Button className="flex-1 gap-2">
                  <FileDown className="h-4 w-4" />
                  Exportar PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
