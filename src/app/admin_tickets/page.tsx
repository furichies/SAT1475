'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  Plus,
  User,
  Clock,
  CheckCircle,
  X,
  Eye,
  Edit,
  Package,
  Settings,
  LayoutDashboard,
  MessageSquare,
  ShoppingCart,
  ShoppingBag,
  FileText,
  Calendar,
  Tag,
} from 'lucide-react'
import Link from 'next/link'

const ticketsMock = [
  { id: '1', numero: 'SAT-2023-0045', cliente: 'Pedro Sánchez', asunto: 'Portátil no enciende', prioridad: 'urgente', tipo: 'incidencia', tecnico: 'Carlos García', fecha: '2023-12-30 08:00', estado: 'pendiente', descripcion: 'El equipo no da señal de vida tras una subida de tensión.' },
  { id: '2', numero: 'SAT-2023-0044', cliente: 'Laura Rodríguez', asunto: 'SSD corrupto', prioridad: 'alta', tipo: 'reparacion', tecnico: 'María Martínez', fecha: '2023-12-30 07:30', estado: 'asignado', descripcion: 'Errores constantes de lectura/escritura en el disco principal.' },
  { id: '3', numero: 'SAT-2023-0043', cliente: 'Diego Fernández', asunto: 'Instalación de software', prioridad: 'media', tipo: 'consulta', tecnico: 'Carlos García', fecha: '2023-12-29 15:00', estado: 'en_progreso', descripcion: 'Necesita instalar suite Adobe y configurar drivers.' },
  { id: '4', numero: 'SAT-2023-0042', cliente: 'Carmen Vázquez', asunto: 'Garantía monitor', prioridad: 'baja', tipo: 'garantia', tecnico: 'María Martínez', fecha: '2023-12-28 10:30', estado: 'resuelto', descripcion: 'Píxeles muertos en la zona central superior.' }
]

const estados = {
  abierto: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
  asignado: { label: 'Asignado', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: User },
  en_progreso: { label: 'En Progreso', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Package },
  pendiente_cliente: { label: 'Pendiente Cliente', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Clock },
  pendiente_pieza: { label: 'Esperando Pieza', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Package },
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
  const [tickets, setTickets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [prioridad, setPrioridad] = useState('todos')
  const [tipo, setTipo] = useState('todos')
  const [tecnico, setTecnico] = useState('todos')
  const [ticketSeleccionado, setTicketSeleccionado] = useState<any>(null)
  const [isEdicion, setIsEdicion] = useState(false)
  const [isNuevo, setIsNuevo] = useState(false)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      // Usar un timestamp para evitar el caché de Next.js/Browser
      const res = await fetch(`/api/sat/tickets?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        }
      })
      const data = await res.json()
      if (data.success) {
        const mappedTickets = data.tickets.map((t: any) => ({
          id: t.id,
          numero: t.numeroTicket,
          cliente: t.usuario?.nombre || 'Desconocido',
          asunto: t.asunto,
          prioridad: t.prioridad,
          tipo: t.tipo,
          tecnico: t.tecnico?.usuario?.nombre || 'Sin asignar',
          fecha: new Date(t.fechaCreacion).toLocaleString(),
          estado: t.estado,
          descripcion: t.descripcion
        }))
        setTickets(mappedTickets)
      } else {
        alert('Error al cargar tickets: ' + (data.error || 'error desconocido'))
      }
    } catch (error) {
      console.error('Error fetching admin tickets:', error)
      alert('Error de conexión al cargar tickets')
    } finally {
      setIsLoading(false)
    }
  }

  const [formTicket, setFormTicket] = useState({
    asunto: '',
    descripcion: '',
    prioridad: 'media',
    tipo: 'incidencia',
    estado: 'abierto',
    tecnico: 'Sin asignar',
    cliente: ''
  })

  const handleGuardar = async () => {
    const backupTickets = [...tickets];
    setIsLoading(true)
    try {
      const res = await fetch(isNuevo ? '/api/sat/tickets' : `/api/sat/tickets/${ticketSeleccionado.id}`, {
        method: isNuevo ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formTicket)
      })

      const data = await res.json()
      if (data.success) {
        // Forzamos actualización inmediata
        await fetchTickets()
      } else {
        alert('Error al guardar: ' + data.error)
        setTickets(backupTickets)
      }
      closeModals()
    } catch (error) {
      console.error('Error saving ticket:', error)
      alert('Error de conexión al guardar')
      setTickets(backupTickets)
    } finally {
      setIsLoading(false)
    }
  }

  const openEdicion = (ticket: any) => {
    setTicketSeleccionado(ticket)
    setFormTicket({
      asunto: ticket.asunto,
      descripcion: ticket.descripcion || '',
      prioridad: ticket.prioridad,
      tipo: ticket.tipo,
      estado: ticket.estado,
      tecnico: ticket.tecnico,
      cliente: ticket.cliente
    })
    setIsEdicion(true)
  }

  const openNuevo = () => {
    setFormTicket({
      asunto: '',
      descripcion: '',
      prioridad: 'media',
      tipo: 'incidencia',
      estado: 'abierto',
      tecnico: 'Sin asignar',
      cliente: ''
    })
    setIsNuevo(true)
  }

  const closeModals = () => {
    setTicketSeleccionado(null)
    setIsEdicion(false)
    setIsNuevo(false)
  }

  const ticketsFiltrados = tickets.filter(t => {
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
    return estados[est as keyof typeof estados] || estados.abierto
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
          <Link href="/admin_pedidos" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
            <ShoppingCart className="h-5 w-5" />
            Pedidos
          </Link>
          <Link href="/admin_tickets" className="flex items-center gap-3 px-4 py-2 bg-primary text-white rounded">
            <MessageSquare className="h-5 w-5" />
            Tickets SAT
          </Link>
          <Link href="/admin_tecnicos" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
            <User className="h-5 w-5" />
            Técnicos
          </Link>
          <Link href="/admin_conocimiento" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
            <Settings className="h-5 w-5" />
            Base de Conocimiento
          </Link>
        </nav>
        <div className="mt-8 pt-8 border-t">
          <p className="text-xs text-gray-500 mb-2 font-medium">Administrador</p>
          <p className="text-sm font-semibold">Admin Principal</p>
          <p className="text-xs text-muted-foreground">admin@microinfo.es</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Tickets SAT</h1>
            <p className="text-gray-600">
              Administra, asigna y gestiona todos los tickets de soporte técnico.
            </p>
          </div>
          <Button onClick={openNuevo} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Ticket
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Buscar y Filtrar */}
            <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por asunto, número o cliente..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={prioridad} onValueChange={setPrioridad}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Prioridades</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tipo} onValueChange={setTipo}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los tipos</SelectItem>
                    <SelectItem value="incidencia">Incidencia</SelectItem>
                    <SelectItem value="consulta">Consulta</SelectItem>
                    <SelectItem value="reparacion">Reparación</SelectItem>
                    <SelectItem value="garantia">Garantía</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(estados).map(([key, info]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center gap-2">
                      <info.icon className="h-5 w-5 opacity-70" />
                      <h2 className="font-bold text-gray-700">{info.label}</h2>
                    </div>
                    <Badge variant="secondary">
                      {ticketsFiltrados.filter(t => t.estado === key).length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {ticketsFiltrados.filter(t => t.estado === key).map((ticket) => {
                      const prioBadge = getPrioridadBadge(ticket.prioridad)
                      return (
                        <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardHeader className="p-4 pb-2">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-mono text-muted-foreground">{ticket.numero}</span>
                              <Badge className={`${prioBadge.color} text-[10px] px-1.5 py-0`}>
                                {prioBadge.label}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-sm line-clamp-2">{ticket.asunto}</h3>
                          </CardHeader>
                          <CardContent className="p-4 pt-2 space-y-3">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <User className="h-3 w-3" />
                              <span>{ticket.cliente}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{ticket.fecha}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                <span>{tipos[ticket.tipo as keyof typeof tipos]}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-2 border-t">
                              <Button variant="ghost" size="sm" className="h-8 flex-1" onClick={() => setTicketSeleccionado(ticket)}>
                                <Eye className="h-3.5 w-3.5 mr-1" /> Ver
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 flex-1" onClick={() => openEdicion(ticket)}>
                                <Edit className="h-3.5 w-3.5 mr-1" /> Editar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Modal Detalle */}
        <Dialog open={ticketSeleccionado && !isEdicion} onOpenChange={(open) => !open && closeModals()}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Detalle de Ticket</DialogTitle>
              {ticketSeleccionado && <p className="text-sm font-mono text-muted-foreground mt-1">{ticketSeleccionado.numero}</p>}
            </DialogHeader>

            {ticketSeleccionado && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Estado</p>
                    <Badge className={getEstadoBadge(ticketSeleccionado.estado).color}>
                      {getEstadoBadge(ticketSeleccionado.estado).label}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Prioridad</p>
                    <Badge className={getPrioridadBadge(ticketSeleccionado.prioridad).color}>
                      {getPrioridadBadge(ticketSeleccionado.prioridad).label}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Tipo</p>
                    <p className="text-sm font-medium">{tipos[ticketSeleccionado.tipo as keyof typeof tipos]}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Fecha Creación</p>
                    <p className="text-sm font-medium">{ticketSeleccionado.fecha}</p>
                  </div>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Asunto</p>
                  <p className="text-lg font-semibold">{ticketSeleccionado.asunto}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Descripción</p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {ticketSeleccionado.descripcion || "Sin descripción adicional."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 border-t pt-4">
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Cliente</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {ticketSeleccionado.cliente?.charAt(0)}
                      </div>
                      <p className="font-medium text-sm">{ticketSeleccionado.cliente}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Técnico Asignado</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <p className="font-medium text-sm">{ticketSeleccionado.tecnico || "Sin asignar"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t">
                  <Button variant="outline" className="flex-1" onClick={() => openEdicion(ticketSeleccionado)}>
                    <Edit className="h-4 w-4 mr-2" /> Editar Información
                  </Button>
                  <Button className="flex-1" onClick={() => alert('Función de respuesta preparada')}>
                    <MessageSquare className="h-4 w-4 mr-2" /> Responder Cliente
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal Edición / Nuevo */}
        <Dialog open={isEdicion || isNuevo} onOpenChange={(open) => !open && closeModals()}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{isEdicion ? 'Editar Ticket' : 'Crear Nuevo Ticket'}</DialogTitle>
              {isEdicion && ticketSeleccionado && (
                <p className="text-sm font-mono text-muted-foreground mt-1">{ticketSeleccionado.numero}</p>
              )}
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tipo de Ticket</label>
                  <Select value={formTicket.tipo} onValueChange={(v) => setFormTicket({ ...formTicket, tipo: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(tipos).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Prioridad</label>
                  <Select value={formTicket.prioridad} onValueChange={(v) => setFormTicket({ ...formTicket, prioridad: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(prioridades).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estado Actual</label>
                  <Select value={formTicket.estado} onValueChange={(v) => setFormTicket({ ...formTicket, estado: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(estados).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Asignar Técnico</label>
                  <Select value={formTicket.tecnico} onValueChange={(v) => setFormTicket({ ...formTicket, tecnico: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sin asignar">Sin asignar</SelectItem>
                      <SelectItem value="Carlos García">Carlos García</SelectItem>
                      <SelectItem value="María Martínez">María Martínez</SelectItem>
                      <SelectItem value="Diego Fernández">Diego Fernández</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cliente</label>
                <Input
                  value={formTicket.cliente}
                  onChange={(e) => setFormTicket({ ...formTicket, cliente: e.target.value })}
                  placeholder="Nombre completo del cliente"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Asunto</label>
                <Input
                  value={formTicket.asunto}
                  onChange={(e) => setFormTicket({ ...formTicket, asunto: e.target.value })}
                  placeholder="Resumen corto del problema"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Descripción Detallada</label>
                <Textarea
                  value={formTicket.descripcion}
                  onChange={(e) => setFormTicket({ ...formTicket, descripcion: e.target.value })}
                  placeholder="Explica el problema con detalle..."
                  rows={4}
                />
              </div>

              <div className="flex gap-3 pt-6">
                <Button variant="outline" className="flex-1" onClick={closeModals}>Cancelar</Button>
                <Button className="flex-1" onClick={handleGuardar}>
                  {isEdicion ? 'Actualizar Ticket' : 'Crear Ticket'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
