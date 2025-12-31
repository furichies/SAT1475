'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  FileText,
  Tag,
  Calendar,
  User,
  Clock,
  Heart,
  MessageSquare,
  CheckCircle,
  X,
  Settings,
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare as MessageIcon,
  ShoppingBag,
  ChevronRight,
  MoreHorizontal,
  FileUp
} from 'lucide-react'
import Link from 'next/link'

const articulosMock = [
  {
    id: '1',
    titulo: 'Cómo instalar un SSD NVMe en portátil',
    contenido: 'Guía paso a paso para instalar un SSD NVMe en tu portátil. Aprende los requisitos previos, herramientas necesarias y procedimiento completo de instalación...',
    categoria: 'Almacenamiento',
    tags: ['SSD', 'NVMe', 'Instalación', 'Hardware'],
    autor: 'Carlos García',
    rol: 'tecnico',
    estado: 'publicado',
    vistas: 1234,
    likes: 87,
    comentarios: 15,
    fechaCreacion: '2023-12-20',
    fechaActualizacion: '2023-12-28'
  },
  {
    id: '2',
    titulo: 'Solución a problemas de conexión WiFi',
    contenido: 'Guía completa para solucionar problemas de conexión WiFi en ordenadores portátiles y de escritorio. Incluye diagnósticos, soluciones comunes y...',
    categoria: 'Redes',
    tags: ['WiFi', 'Conexión', 'Redes', 'Troubleshooting'],
    autor: 'María Martínez',
    rol: 'tecnico',
    estado: 'publicado',
    vistas: 890,
    likes: 65,
    comentarios: 23,
    fechaCreacion: '2023-12-18',
    fechaActualizacion: '2023-12-25'
  },
  {
    id: '3',
    titulo: 'Guía de reparación de portátiles - Diagnóstico inicial',
    contenido: 'Aprende cómo realizar un diagnóstico inicial de tu portátil antes de llevarlo al técnico. Identifica problemas comunes de hardware y software...',
    categoria: 'Reparación',
    tags: ['Portátiles', 'Diagnóstico', 'Hardware', 'Software'],
    autor: 'Admin Principal',
    rol: 'admin',
    estado: 'publicado',
    vistas: 2345,
    likes: 156,
    comentarios: 34,
    fechaCreacion: '2023-12-15',
    fechaActualizacion: '2023-12-30'
  },
  {
    id: '4',
    titulo: 'Actualización de BIOS y UEFI - Guía completa',
    contenido: 'Guía completa sobre cómo actualizar la BIOS o UEFI de tu ordenador. Incluye pasos de seguridad, métodos de actualización y...',
    categoria: 'Sistema',
    tags: ['BIOS', 'UEFI', 'Actualización', 'Sistema'],
    autor: 'Diego Fernández',
    rol: 'tecnico',
    estado: 'publicado',
    vistas: 1567,
    likes: 92,
    comentarios: 18,
    fechaCreacion: '2023-12-12',
    fechaActualizacion: '2023-12-22'
  },
  {
    id: '5',
    titulo: 'Borrador: Instalación de GPU NVIDIA RTX 4090',
    contenido: 'Guía paso a paso para instalar una RTX 4090 en tu ordenador. Incluye requisitos de sistema, fuentes de alimentación...',
    categoria: 'Hardware',
    tags: ['GPU', 'NVIDIA', 'RTX', 'Instalación', 'Hardware'],
    autor: 'Ana Rodríguez',
    rol: 'admin',
    estado: 'borrador',
    vistas: 0,
    likes: 0,
    comentarios: 0,
    fechaCreacion: '2023-12-28',
    fechaActualizacion: '2023-12-28'
  },
  {
    id: '6',
    titulo: 'Guía de limpieza y mantenimiento de monitores',
    contenido: 'Aprende cómo limpiar y mantener tu monitor para prolongar su vida útil. Incluye productos recomendados, frecuencia de limpieza...',
    categoria: 'Periféricos',
    tags: ['Monitor', 'Limpieza', 'Mantenimiento', 'Cuidado'],
    autor: 'Admin Principal',
    rol: 'admin',
    estado: 'archivado',
    vistas: 678,
    likes: 45,
    comentarios: 8,
    fechaCreacion: '2023-11-20',
    fechaActualizacion: '2023-12-01'
  }
]

const categoriasMock = [
  'Almacenamiento', 'Redes', 'Reparación', 'Sistema', 'Hardware', 'Periféricos',
  'Software', 'Configuración', 'Troubleshooting', 'Seguridad'
]

const estadosMock = {
  publicado: { label: 'Publicado', color: 'bg-green-100 text-green-800' },
  borrador: { label: 'Borrador', color: 'bg-yellow-100 text-yellow-800' },
  archivado: { label: 'Archivado', color: 'bg-gray-100 text-gray-800' }
}

export default function AdminConocimientoPage() {
  const [articulos, setArticulos] = useState(articulosMock)
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('todos')
  const [estado, setEstado] = useState('todos')
  const [autor, setAutor] = useState('todos')
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<any>(null)
  const [isVerModalOpen, setIsVerModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Estado para el formulario
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    categoria: '',
    estado: 'borrador',
    tags: ''
  })

  const resetForm = () => {
    setFormData({
      titulo: '',
      contenido: '',
      categoria: '',
      estado: 'borrador',
      tags: ''
    })
    setArticuloSeleccionado(null)
    setIsEditing(false)
  }

  const handleNuevo = () => {
    resetForm()
    setIsEditing(false)
    setIsFormModalOpen(true)
  }

  const handleVer = (articulo: any) => {
    setArticuloSeleccionado(articulo)
    setIsVerModalOpen(true)
  }

  const handleEditar = (articulo: any) => {
    setArticuloSeleccionado(articulo)
    setFormData({
      titulo: articulo.titulo,
      contenido: articulo.contenido,
      categoria: articulo.categoria,
      estado: articulo.estado,
      tags: articulo.tags.join(', ')
    })
    setIsEditing(true)
    setIsFormModalOpen(true)
  }

  const handleBorrar = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este artículo?')) {
      setArticulos(articulos.filter(a => a.id !== id))
    }
  }

  const handleGuardar = () => {
    if (!formData.titulo || !formData.contenido) {
      alert('Por favor, rellena los campos obligatorios (*)')
      return
    }

    if (isEditing && articuloSeleccionado) {
      setArticulos(articulos.map(a =>
        a.id === articuloSeleccionado.id
          ? {
            ...a,
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
            fechaActualizacion: new Date().toISOString().split('T')[0]
          }
          : a
      ))
    } else {
      const nuevo = {
        id: (articulos.length + 1).toString(),
        titulo: formData.titulo,
        contenido: formData.contenido,
        categoria: formData.categoria || 'General',
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
        autor: 'Admin Principal',
        rol: 'admin',
        estado: formData.estado,
        vistas: 0,
        likes: 0,
        comentarios: 0,
        fechaCreacion: new Date().toISOString().split('T')[0],
        fechaActualizacion: new Date().toISOString().split('T')[0]
      }
      setArticulos([nuevo, ...articulos])
    }

    setIsFormModalOpen(false)
    resetForm()
  }

  const articulosFiltrados = articulos.filter(a => {
    if (busqueda && !a.titulo.toLowerCase().includes(busqueda.toLowerCase()) &&
      !a.contenido.toLowerCase().includes(busqueda.toLowerCase()) &&
      !a.tags.some(t => t.toLowerCase().includes(busqueda.toLowerCase()))) return false
    if (categoria !== 'todos' && a.categoria !== categoria) return false
    if (estado !== 'todos' && a.estado !== estado) return false
    if (autor !== 'todos' && a.autor.toLowerCase() !== autor.toLowerCase()) return false
    return true
  })

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
            <Link href="/admin_pedidos" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
              <ShoppingCart className="h-5 w-5" />
              Pedidos
            </Link>
            <Link href="/admin_tickets" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
              <MessageIcon className="h-5 w-5" />
              Tickets SAT
            </Link>
            <Link href="/admin_tecnicos" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
              <User className="h-5 w-5" />
              Técnicos
            </Link>
            <Link href="/admin_conocimiento" className="flex items-center gap-3 px-4 py-2 bg-primary text-white rounded">
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
            <h1 className="text-3xl font-bold mb-2">Base de Conocimiento</h1>
            <p className="text-gray-600">
              Administra la base de conocimiento: crear, editar, archivar y gestionar artículos de soporte técnico.
            </p>
          </div>

          {/* Buscar y Filtrar */}
          <div className="bg-white border-b p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar artículos por título, contenido o tags..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                className="w-40 p-2 border rounded"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="todos">Todas las categorías</option>
                {categoriasMock.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                className="w-40 p-2 border rounded"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="todos">Todos los estados</option>
                <option value="publicado">Publicado</option>
                <option value="borrador">Borrador</option>
                <option value="archivado">Archivado</option>
              </select>
              <select
                className="w-40 p-2 border rounded"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
              >
                <option value="todos">Todos los autores</option>
                <option value="carlos">Carlos García (Técnico)</option>
                <option value="maria">María Martínez (Técnica)</option>
                <option value="diego">Diego Fernández (Técnico)</option>
                <option value="ana">Ana Rodríguez (Admin)</option>
                <option value="admin">Admin Principal (Admin)</option>
              </select>
              <div className="text-sm text-gray-600">
                {articulosFiltrados.length} artículos
              </div>
            </div>
          </div>

          {/* Grid de Artículos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {articulosFiltrados.map((articulo) => {
              const estadoInfo = estadosMock[articulo.estado as keyof typeof estadosMock]
              return (
                <Card key={articulo.id} className="hover:shadow-lg transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary">
                        {articulo.categoria}
                      </Badge>
                      <Badge className={estadoInfo.color}>
                        {estadoInfo.label}
                      </Badge>
                    </div>
                    <p className="font-semibold line-clamp-2">{articulo.titulo}</p>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {articulo.contenido}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {articulo.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{articulo.autor}</span>
                      </div>
                      <div className={`px-2 py-1 rounded ${articulo.rol === 'tecnico' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {articulo.rol === 'tecnico' ? 'Técnico' : 'Admin'}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{articulo.vistas} vistas</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{articulo.likes} likes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{articulo.comentarios} comentarios</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Creado: {articulo.fechaCreacion}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Actualizado: {articulo.fechaActualizacion}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleVer(articulo)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditar(articulo)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleBorrar(articulo.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditar(articulo)}>Editar artículo</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleVer(articulo)}>Ver detalles</DropdownMenuItem>
                          <DropdownMenuItem>Duplicar borrador</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleBorrar(articulo.id)}>Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Botón Nuevo */}
          <div className="fixed bottom-8 right-8">
            <Button onClick={handleNuevo} className="gap-2 shadow-lg">
              <Plus className="h-4 w-4" />
              Nuevo Artículo
            </Button>
          </div>
        </main>
      </div>

      {/* Modal Detalles */}
      <Dialog open={isVerModalOpen} onOpenChange={setIsVerModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{articuloSeleccionado?.titulo}</DialogTitle>
          </DialogHeader>
          {articuloSeleccionado && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Badge variant="secondary">{articuloSeleccionado.categoria}</Badge>
                <Badge className={estadosMock[articuloSeleccionado.estado as keyof typeof estadosMock].color}>
                  {estadosMock[articuloSeleccionado.estado as keyof typeof estadosMock].label}
                </Badge>
              </div>

              <div className="prose max-w-none text-gray-700 leading-relaxed">
                {articuloSeleccionado.contenido}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm">
                <div className="space-y-2">
                  <p className="text-gray-500">Autor</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{articuloSeleccionado.autor} ({articuloSeleccionado.rol})</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-500">Fechas</p>
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Creado: {articuloSeleccionado.fechaCreacion}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Actualizado: {articuloSeleccionado.fechaActualizacion}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t flex flex-wrap gap-2">
                {articuloSeleccionado.tags.map((tag: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVerModalOpen(false)}>Cerrar</Button>
            <Button onClick={() => { setIsVerModalOpen(false); handleEditar(articuloSeleccionado); }}>
              Editar Artículo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Formulario (Crear/Editar) */}
      <Dialog open={isFormModalOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsFormModalOpen(open); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Artículo' : 'Crear Nuevo Artículo'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input
                placeholder="Título del artículo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Contenido *</Label>
              <Textarea
                placeholder="Escribe el contenido del artículo..."
                rows={8}
                value={formData.contenido}
                onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoría *</Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(v) => setFormData({ ...formData, categoria: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasMock.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Estado *</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(v) => setFormData({ ...formData, estado: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="borrador">Borrador</SelectItem>
                    <SelectItem value="publicado">Publicado</SelectItem>
                    <SelectItem value="archivado">Archivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <Input
                placeholder="tag1, tag2, tag3..."
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
              <p className="text-xs text-gray-500">Separar por comas</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleGuardar}>
              {isEditing ? 'Actualizar Artículo' : 'Crear Artículo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
