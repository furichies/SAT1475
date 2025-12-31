'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Edit, Trash2, Package, Filter, MoreHorizontal, Image as ImageIcon, DollarSign, Settings, LayoutDashboard, Menu, ShoppingBag, ChevronRight, Upload, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

// Mock data simplificado
const productosMock = [
  { id: '1', sku: 'LAP-GAM-X15', nombre: 'Portátil Gaming Pro X15', precio: 1499, stock: 12, categoria: 'ordenadores', marca: 'Asus', imagen: '/images/producto_laptop_gaming.png', enOferta: true, destacado: true },
  { id: '2', sku: 'SSD-SAM-2TB', nombre: 'SSD NVMe Samsung 2TB', precio: 329, stock: 8, categoria: 'almacenamiento', marca: 'Samsung', imagen: '/images/producto_ssd.png', enOferta: true },
  { id: '3', sku: 'RAM-COR-DD5-32', nombre: 'RAM DDR5 32GB Corsair', precio: 169, stock: 15, categoria: 'ram', marca: 'Corsair', imagen: '/images/producto_ram.png', enOferta: true, destacado: true },
  { id: '4', sku: 'MON-SAM-32-4K', nombre: 'Monitor Curvo 32" 4K', precio: 749, stock: 3, categoria: 'perifericos', marca: 'Samsung', imagen: '/images/producto_monitor.png', enOferta: true },
  { id: '5', sku: 'CPU-INT-i9', nombre: 'CPU Intel Core i9', precio: 649, stock: 5, categoria: 'componentes', marca: 'Intel', imagen: '/images/producto_cpu.png', enOferta: false, destacado: true },
  { id: '6', sku: 'GPU-NV-RTX4080', nombre: 'NVIDIA RTX 4080', precio: 1899, stock: 2, categoria: 'componentes', marca: 'NVIDIA', imagen: '/images/producto_gpu.png', enOferta: false }
]

export default function AdminProductosPage() {
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('todos')
  const [mostrarCrear, setMostrarCrear] = useState(false)
  const [productos, setProductos] = useState(productosMock)

  const productosFiltrados = productosMock.filter(p => {
    if (busqueda && !p.nombre.toLowerCase().includes(busqueda.toLowerCase()) && !p.sku.toLowerCase().includes(busqueda.toLowerCase())) return false
    if (categoria !== 'todos' && p.categoria !== categoria) return false
    return true
  })

  const handleStockUpdate = (id: string, delta: number) => {
    setProductos(productos.map(p => {
      if (p.id === id) {
        const nuevoStock = Math.max(0, p.stock + delta)
        return { ...p, stock: nuevoStock }
      }
      return p
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen p-4 hidden lg:block">
          <div className="flex items-center gap-2 mb-8">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">MicroInfo Admin</span>
          </div>
          <nav className="space-y-2">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/admin/productos" className="flex items-center gap-3 px-4 py-2 bg-primary text-white rounded">
              <Package className="h-5 w-5" />
              Productos
            </Link>
            <Link href="/admin_pedidos" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded">
              <Settings className="h-5 w-5" />
              Pedidos
            </Link>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 lg:ml-64">
          {/* Header */}
          <div className="bg-white border-b p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Gestión de Productos</h1>
                <p className="text-gray-600 text-sm">
                  Administra el catálogo de productos: crear, editar, eliminar y gestionar stock.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filtrar
                </Button>
                <Button onClick={() => setMostrarCrear(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Producto
                </Button>
              </div>
            </div>
          </div>

          {/* Buscar y Filtrar */}
          <div className="bg-white border-b p-4 mb-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar productos por nombre o SKU..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="ordenadores">Ordenadores</SelectItem>
                  <SelectItem value="componentes">Componentes</SelectItem>
                  <SelectItem value="almacenamiento">Almacenamiento</SelectItem>
                  <SelectItem value="ram">RAM</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-gray-600">
                {productosFiltrados.length} productos
              </div>
            </div>
          </div>

          {/* Tabla de Productos */}
          <div className="bg-white m-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4"><Checkbox /></th>
                    <th className="text-left p-4">SKU</th>
                    <th className="text-left p-4">Producto</th>
                    <th className="text-left p-4">Categoría</th>
                    <th className="text-left p-4">Marca</th>
                    <th className="text-right p-4">Precio</th>
                    <th className="text-right p-4">Stock</th>
                    <th className="text-center p-4">Estado</th>
                    <th className="text-right p-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map((producto) => (
                    <tr key={producto.id} className="border-b hover:bg-gray-50">
                      <td className="p-4"><Checkbox /></td>
                      <td className="p-4 font-medium text-xs">{producto.sku}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded flex-shrink-0 overflow-hidden">
                            <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium line-clamp-1">{producto.nombre}</div>
                            <div className="text-xs text-gray-500 line-clamp-1">{producto.sku}</div>
                          </div>
                          {producto.destacado && <Badge className="ml-2 bg-yellow-100 text-yellow-800">Destacado</Badge>}
                          {producto.enOferta && <Badge className="ml-2 bg-red-100 text-red-800">Oferta</Badge>}
                        </div>
                      </td>
                      <td className="p-4"><Badge variant="secondary" className="capitalize">{producto.categoria}</Badge></td>
                      <td className="p-4 text-sm">{producto.marca}</td>
                      <td className="p-4 text-right font-semibold">{producto.precio.toLocaleString()}€</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`font-semibold ${producto.stock < 3 ? 'text-red-600' : ''}`}>{producto.stock}</span>
                          {producto.stock < 3 && <Badge variant="destructive" className="text-xs"><AlertTriangle className="h-3 w-3 mr-1" />Stock Bajo</Badge>}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant="default" className="bg-green-100 text-green-800">En Stock</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleStockUpdate(producto.id, 1)} disabled={producto.stock >= 999}>+</Button>
                          <Button variant="ghost" size="sm" onClick={() => handleStockUpdate(producto.id, -1)} disabled={producto.stock <= 0}>-</Button>
                          <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                          <Button variant="outline" size="sm"><Trash2 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal de crear producto (simplificado) */}
            {mostrarCrear && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-2xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Nuevo Producto</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setMostrarCrear(false)}>
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>SKU *</Label>
                        <Input placeholder="Ej: LAP-GAM-X15" />
                      </div>
                      <div className="space-y-2">
                        <Label>Nombre *</Label>
                        <Input placeholder="Nombre del producto" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Precio *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input type="number" placeholder="0.00" className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Stock *</Label>
                        <Input type="number" placeholder="0" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Categoría</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Selecciona..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ordenadores">Ordenadores</SelectItem>
                            <SelectItem value="componentes">Componentes</SelectItem>
                            <SelectItem value="almacenamiento">Almacenamiento</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Marca</Label>
                        <Select>
                          <SelectTrigger><SelectValue placeholder="Selecciona..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Asus">Asus</SelectItem>
                            <SelectItem value="Samsung">Samsung</SelectItem>
                            <SelectItem value="Intel">Intel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="oferta" />
                          <Label htmlFor="oferta">En Oferta</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="destacado" />
                          <Label htmlFor="destacado">Destacado</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="activo" defaultChecked />
                          <Label htmlFor="activo">Activo</Label>
                        </div>
                      </div>
                      <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm font-medium mb-2">Subir Imagen</p>
                        <p className="text-xs text-gray-500 mb-4">
                          Arrastra la imagen aquí o haz clic para seleccionar
                        </p>
                        <Button variant="outline" size="sm">
                          Seleccionar Archivo
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <div className="flex justify-between p-6 border-t">
                    <Button variant="outline" onClick={() => setMostrarCrear(false)}>Cancelar</Button>
                    <Button>Crear Producto</Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Paginación */}
            <div className="flex items-center justify-between p-6 border-t">
              <div className="text-sm text-gray-600">
                Mostrando 1-{productosFiltrados.length} de {productosFiltrados.length} productos
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Anterior</Button>
                <Button variant="outline" size="sm">Siguiente</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
