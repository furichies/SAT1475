'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Search,
  Filter,
  Plus,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Eye,
  Edit,
  Package,
  MoreHorizontal,
  Settings,
  LayoutDashboard,
  Menu,
  MessageSquare,
  ShoppingCart,
  ShoppingBag,
  FileText,
  Calendar,
  Tag,
  User as UserIcon,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

const ticketsMock = [
  { id: '1', numero: 'SAT-2023-0045', cliente: 'Pedro Sánchez', asunto: 'Portátil no enciende', prioridad: 'urgente', tipo: 'incidencia', tecnico: 'Carlos García', fecha: '2023-12-30 08:00', estado: 'pendiente' },
  { id: '2', numero: 'SAT-2023-0044', cliente: 'Laura Rodríguez', asunto: 'SSD corrupto', prioridad: 'alta', tipo: 'reparacion', tecnico: 'María Martínez', fecha: '2023-12-30 07:30', estado: 'asignado' },
  { id: '3', numero: 'SAT-2023-0043', cliente: 'Diego Fernández', asunto: 'Instalación de software', prioridad: 'media', tipo: 'consulta', tecnico: 'Carlos García', fecha: '2023-12-29 15:00', estado: 'en_progreso' },
  { id: '4', numero: 'SAT-2023-0042', cliente: 'Carmen Vázquez', asunto: 'Garantía monitor', prioridad: 'baja', tipo: 'garantia', tecnico: 'María Martínez', fecha: '2023-12-28 10:30', estado: 'resuelto' }
]

const estados = {
  pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
  asignado: { label: 'Asignado', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: User },
  en_progreso: { label: 'En Progreso', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Package },
  resuelto: { label: 'Resuelto', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle }
}

const prioridades = {
  urgente: { label: 'Urgente', color: 'bg-red-100 text-red-800 border-red-200' },
  alta: { label: 'Alta', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  media: { label: 'Media', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  baja: { label: 'Baja', color: 'bg-green-100 text-green-800 border-green-200' }
}

const tipos = {
  incidencia: 'Incidencia',
  consulta: 'Consulta',
  reparacion: 'Reparación',
  garantia: 'Garantía',
  devolucion: 'Devolución',
  otro: 'Otro'
}

export default function AdminTicketsPage() {
  const [busqueda, setBusqueda] = useState('')
  const [prioridad, setPrioridad] = useState('todos')
  const [tipo, setTipo] = useState('todos')
  const [tecnico, setTecnico] = useState('todos')
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null)
  
  const ticketsFiltrados = ticketsMock.filter(t => {
    if (busqueda && !t.asunto.toLowerCase().includes(busqueda.toLowerCase()) && 
        !t.numero.toLowerCase().includes(busqueda.toLowerCase()) &&
        !t.cliente.toLowerCase().includes(busqueda.toLowerCase())) return false
    if (prioridad !== 'todos' && t.prioridad !== prioridad) return false
    if (tipo !== 'todos' && t.tipo !== tipo) return false
    if (tecnico !== 'todos' && t.tecnico.toLowerCase().includes(tecnico.toLowerCase())) return false
    return true
  })

  const getPrioridadBadge = (prio: string) => {
    return prioridades[prio as keyof typeof prioridades] || prioridades.media
  }

  const getEstadoBadge = (est: string) => {
    return estados[est as keyof typeof estados] || estados.pendiente
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
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
            <Link href="/admin/pedidos" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
              <ShoppingCart className="h-5 w-5" />
              Pedidos
            </Link>
            <Link href="/admin/tickets" className="flex items-center gap-3 px-4 py-2 bg-primary text-white rounded">
              <MessageSquare className="h-5 w-5" />
              Tickets SAT
            </Link>
            <Link href="/admin/tecnicos" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
              <User className="h-5 w-5" />
              Técnicos
            </Link>
            <Link href="/admin/conocimiento" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
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

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Gestión de Tickets SAT</h1>
            <p className="text-gray-600">
              Administra, asigna y gestiona todos los tickets de soporte técnico.
            </p>
          </div>

          {/* Buscar y Filtrar */}
          <div className="bg-white border-b p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar tickets por asunto, número o cliente..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                className="p-2 border rounded w-40"
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value)}
              >
                <option value="todos">Todas las prioridades</option>
                <option value="urgente">Urgente</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
              <select
                className="p-2 border rounded w-40"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="todos">Todos los tipos</option>
                <option value="incidencia">Incidencia</option>
                <option value="consulta">Consulta</option>
                <option value="reparacion">Reparación</option>
                <option value="garantia">Garantía</option>
              </select>
              <select
                className="p-2 border rounded w-40"
                value={tecnico}
                onChange={(e) => setTecnico(e.target.value)}
              >
                <option value="todos">Todos los técnicos</option>
                <option value="carlos">Carlos García</option>
                <option value="maria">María Martínez</option>
              </select>
              <div className="text-sm text-gray-600">
                {ticketsFiltrados.length} tickets
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Columna Pendiente */}
            <div>
              <div className="bg-white border-b border-gray-200 p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <h2 className="text-lg font-bold">Pendiente</h2>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {ticketsFiltrados.filter(t => t.estado === 'pendiente').length}
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                {ticketsFiltrados.filter(t => t.estado === 'pendiente').map((ticket) => {
                  const prioBadge = getPrioridadBadge(ticket.prioridad)
                  return (
                    <Card key={ticket.id} className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-yellow-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="text-xs">
                            {ticket.numero}
                          </Badge>
                          <Badge className={prioBadge.color}>
                            {prioBadge.label}
                          </Badge>
                        </div>
                        <p className="font-semibold line-clamp-2">{ticket.asunto}</p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-2 mb-2 text-sm">
                          <UserIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{ticket.cliente}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{ticket.fecha}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            <span>{tipos[ticket.tipo as keyof typeof tipos]}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => setTicketSeleccionado(ticket)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Columna Asignado */}
            <div>
              <div className="bg-white border-b border-gray-200 p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-bold">Asignado</h2>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {ticketsFiltrados.filter(t => t.estado === 'asignado').length}
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                {ticketsFiltrados.filter(t => t.estado === 'asignado').map((ticket) => {
                  const prioBadge = getPrioridadBadge(ticket.prioridad)
                  return (
                    <Card key={ticket.id} className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="text-xs">
                            {ticket.numero}
                          </Badge>
                          <Badge className={prioBadge.color}>
                            {prioBadge.label}
                          </Badge>
                        </div>
                        <p className="font-semibold line-clamp-2">{ticket.asunto}</p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-2 mb-2 text-sm">
                          <UserIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{ticket.cliente}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{ticket.fecha}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            <span>{tipos[ticket.tipo as keyof typeof tipos]}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 mb-2 p-2 bg-blue-50 rounded">
                          <UserIcon className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">{ticket.tecnico}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => setTicketSeleccionado(ticket)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Columna En Progreso */}
            <div>
              <div className="bg-white border-b border-gray-200 p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-purple-600" />
                    <h2 className="text-lg font-bold">En Progreso</h2>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">
                    {ticketsFiltrados.filter(t => t.estado === 'en_progreso').length}
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                {ticketsFiltrados.filter(t => t.estado === 'en_progreso').map((ticket) => {
                  const prioBadge = getPrioridadBadge(ticket.prioridad)
                  return (
                    <Card key={ticket.id} className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-purple-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="text-xs">
                            {ticket.numero}
                          </Badge>
                          <Badge className={prioBadge.color}>
                            {prioBadge.label}
                          </Badge>
                        </div>
                        <p className="font-semibold line-clamp-2">{ticket.asunto}</p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-2 mb-2 text-sm">
                          <UserIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{ticket.cliente}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{ticket.fecha}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            <span>{tipos[ticket.tipo as keyof typeof tipos]}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 mb-2 p-2 bg-purple-50 rounded">
                          <UserIcon className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">{ticket.tecnico}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => setTicketSeleccionado(ticket)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Columna Resuelto */}
            <div>
              <div className="bg-white border-b border-gray-200 p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h2 className="text-lg font-bold">Resuelto</h2>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {ticketsFiltrados.filter(t => t.estado === 'resuelto').length}
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                {ticketsFiltrados.filter(t => t.estado === 'resuelto').map((ticket) => {
                  const prioBadge = getPrioridadBadge(ticket.prioridad)
                  return (
                    <Card key={ticket.id} className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-green-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="text-xs">
                            {ticket.numero}
                          </Badge>
                          <Badge className={prioBadge.color}>
                            {prioBadge.label}
                          </Badge>
                        </div>
                        <p className="font-semibold line-clamp-2">{ticket.asunto}</p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-2 mb-2 text-sm">
                          <UserIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{ticket.cliente}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{ticket.fecha}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            <span>{tipos[ticket.tipo as keyof typeof tipos]}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 mb-2 p-2 bg-green-50 rounded">
                          <UserIcon className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">{ticket.tecnico}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => setTicketSeleccionado(ticket)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Modal de Detalle de Ticket */}
          {ticketSeleccionado && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex items-center justify-between">
                  <div>
                    <CardTicketTitle>Detalle del Ticket</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {ticketSeleccionado.numero}
                    </p>
                  </div>
                  <Button variant="ghost" onClick={() => setTicketSeleccionado(null)}>
                    <X className="h-5 w-5" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Información del Ticket */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">Información del Ticket</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Estado</p>
                        <Badge className={getEstadoBadge(ticketSeleccionado.estado).color}>
                          <div className="flex items-center gap-1">
                            <getEstadoBadge(ticketSeleccionado.estado).icon className="h-3 w-3" />
                            {getEstadoBadge(ticketSeleccionado.estado).label}
                          </div>
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Prioridad</p>
                        <Badge className={getPrioridadBadge(ticketSeleccionado.prioridad).color}>
                          {getPrioridadBadge(ticketSeleccionado.prioridad).label}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Tipo</p>
                        <p className="font-medium">{tipos[ticketSeleccionado.tipo as keyof typeof tipos]}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Fecha de Creación</p>
                        <p className="text-sm">{ticketSeleccionado.fecha}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-1">Asunto</p>
                      <p className="font-semibold">{ticketSeleccionado.asunto}</p>
                    </div>
                  </div>

                  {/* Información del Cliente */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">Información del Cliente</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {ticketSeleccionado.cliente.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{ticketSeleccionado.cliente}</p>
                        <p className="text-sm text-gray-600">cliente@email.com</p>
                      </div>
                    </div>
                  </div>

                  {/* Asignación de Técnico */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">Asignación de Técnico</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600 mb-1">Técnico Asignado</label>
                        <select
                          className="w-full p-2 border rounded"
                          defaultValue={ticketSeleccionado.tecnico}
                        >
                          <option value="">Sin asignar</option>
                          <option value="Carlos García">Carlos García - Experto</option>
                          <option value="María Martínez">María Martínez - Senior</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1">Estado</label>
                        <select className="w-full p-2 border rounded">
                          <option value="pendiente">Pendiente</option>
                          <option value="asignado">Asignado</option>
                          <option value="en_progreso">En Progreso</option>
                          <option value="resuelto">Resuelto</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Notas Internas */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">Notas Internas del Técnico</h3>
                    <Textarea
                      placeholder="Añade notas internas solo visibles para técnicos y administradores..."
                      rows={4}
                      className="w-full"
                    />
                  </div>

                  {/* Seguimiento */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Seguimiento</h3>
                    <div className="space-y-2">
                      <div className="flex gap-3 p-3 bg-gray-50 rounded">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                          TC
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">Técnico asignado</p>
                          <p className="text-xs text-gray-600">Ticket asignado a {ticketSeleccionado.tecnico}</p>
                          <p className="text-xs text-gray-500">{ticketSeleccionado.fecha}</p>
                        </div>
                      </div>
                      {ticketSeleccionado.estado === 'resuelto' && (
                        <div className="flex gap-3 p-3 bg-green-50 rounded">
                          <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold text-xs">
                            TC
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold">Resuelto</p>
                            <p className="text-xs text-gray-600">Ticket marcado como resuelto</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <div className="flex gap-3 p-6 border-t">
                  <Button variant="outline" className="flex-1 gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Añadir Comentario
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <FileText className="h-4 w-4" />
                    Descargar PDF
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function CardTicketTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-xl font-bold">{children}</div>
}
