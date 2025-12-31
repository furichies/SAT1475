'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Slider,
  SliderSingleThumb,
} from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Star,
  ShoppingCart,
  Filter,
  Search,
  Grid,
  List,
  X
} from 'lucide-react'
import { ProductoTipo } from '@prisma/client'
import Image from 'next/image'
import { useCartStore } from '@/store/use-cart-store'
import { useToast } from '@/hooks/use-toast'

const productosMock = [
  {
    id: '1',
    nombre: 'Portátil Gaming Pro X15',
    descripcionCorta: 'Intel Core i7-13700H, RTX 4070, 32GB RAM DDR5, 1TB SSD',
    descripcion: 'Potente portátil gaming con pantalla 15.6" QHD 240Hz. Ideal para gaming y trabajo profesional.',
    precio: 1499,
    precioOferta: 1299,
    stock: 5,
    marca: 'Asus',
    modelo: 'ROG Strix G15',
    tipo: 'equipo_completo' as ProductoTipo,
    valoracion: 4.8,
    totalValoraciones: 124,
    destacado: true,
    imagenes: ['/images/producto_laptop_gaming.png']
  },
  {
    id: '2',
    nombre: 'Portátil Ultralight ZenBook',
    descripcionCorta: 'Intel Core i5-1340P, 16GB RAM, 512GB SSD, 2.8kg',
    descripcion: 'Portátil ultra ligero perfect para trabajo y estudios con batería de 12 horas.',
    precio: 899,
    precioOferta: null,
    stock: 12,
    marca: 'Asus',
    modelo: 'ZenBook 14 OLED',
    tipo: 'equipo_completo' as ProductoTipo,
    valoracion: 4.6,
    totalValoraciones: 87,
    destacado: false,
    imagenes: ['/images/producto_laptop_gaming.png']
  },
  {
    id: '3',
    nombre: 'SSD NVMe Samsung 980 Pro 2TB',
    descripcionCorta: 'Velocidad de lectura 7.000 MB/s, escritura 5.000 MB/s',
    descripcion: 'SSD de alto rendimiento para gaming y trabajo pesado. Tecnología V-NAND 3-bit MLC.',
    precio: 189.99,
    precioOferta: 159.99,
    stock: 23,
    marca: 'Samsung',
    modelo: '980 Pro',
    tipo: 'componente' as ProductoTipo,
    valoracion: 4.9,
    totalValoraciones: 156,
    destacado: true,
    imagenes: ['/images/producto_ssd.png']
  },
  {
    id: '4',
    nombre: 'Memoria RAM DDR5 32GB Corsair',
    descripcionCorta: '6000MHz CL36 RGB, baja latencia para gaming',
    descripcion: 'Memoria RAM de alto rendimiento con iluminación RGB sincronizable.',
    precio: 129.99,
    precioOferta: 109.99,
    stock: 15,
    marca: 'Corsair',
    modelo: 'Vengeance DDR5',
    tipo: 'componente' as ProductoTipo,
    valoracion: 4.7,
    totalValoraciones: 203,
    destacado: true,
    imagenes: ['/images/producto_ram.png']
  },
  {
    id: '5',
    nombre: 'Monitor Curvo 32" 4K Samsung',
    descripcionCorta: '165Hz, 1ms, HDR10+, AMD FreeSync Premium Pro',
    descripcion: 'Monitor gaming profesional con curvatura 1000R y colores vivos.',
    precio: 549.99,
    precioOferta: 479.99,
    stock: 8,
    marca: 'Samsung',
    modelo: 'Odyssey G7',
    tipo: 'periferico' as ProductoTipo,
    valoracion: 4.6,
    totalValoraciones: 92,
    destacado: false,
    imagenes: ['/images/producto_monitor.png']
  },
  {
    id: '6',
    nombre: 'Teclado Mecánico Logitech G Pro X',
    descripcionCorta: 'Switch Cherry MX Red, iluminación RGB, inalámbrico',
    descripcion: 'Teclado mecánico para esports con switches táctiles y respuesta ultrarrápida.',
    precio: 149.99,
    precioOferta: 119.99,
    stock: 42,
    marca: 'Logitech',
    modelo: 'G Pro X TKL',
    tipo: 'periferico' as ProductoTipo,
    valoracion: 4.5,
    totalValoraciones: 312,
    destacado: false,
    imagenes: ['/images/producto_teclado.png']
  },
  {
    id: '7',
    nombre: 'Ratón Gaming Razer DeathAdder V3',
    descripcionCorta: '25.600 DPI Focus Pro, sensor óptico, 8 botones programables',
    descripcion: 'Ratón gaming ergonómico con sensor de última generación.',
    precio: 79.99,
    precioOferta: 59.99,
    stock: 67,
    marca: 'Razer',
    modelo: 'DeathAdder V3',
    tipo: 'periferico' as ProductoTipo,
    valoracion: 4.7,
    totalValoraciones: 445,
    destacado: false,
    imagenes: ['/images/producto_raton.png']
  },
  {
    id: '8',
    nombre: 'CPU Intel Core i9-13900K',
    descripcionCorta: '24 núcleos (8P+16E), 32 hilos, hasta 5.8 GHz',
    descripcion: 'Procesador de alto rendimiento para gaming y creación de contenido.',
    precio: 599.99,
    precioOferta: null,
    stock: 9,
    marca: 'Intel',
    modelo: 'Core i9-13900K',
    tipo: 'componente' as ProductoTipo,
    valoracion: 4.8,
    totalValoraciones: 178,
    destacado: true,
    imagenes: ['/images/producto_cpu.png']
  },
  {
    id: '9',
    nombre: 'GPU NVIDIA RTX 4080',
    descripcionCorta: '16GB GDDR6X, 9728 CUDA cores, DLSS 3.0',
    descripcion: 'Tarjeta gráfica de última generación con Ray Tracing y DLSS.',
    precio: 1199.99,
    precioOferta: 1099.99,
    stock: 4,
    marca: 'NVIDIA',
    modelo: 'RTX 4080',
    tipo: 'componente' as ProductoTipo,
    valoracion: 4.9,
    totalValoraciones: 234,
    destacado: true,
    imagenes: ['/images/producto_gpu.png']
  },
  {
    id: '10',
    nombre: 'Auriculares Sennheiser HD 600',
    descripcionCorta: 'Open-back, 150 Ohm, respuesta en frecuencia 12-39500 Hz',
    descripcion: 'Auriculares de alta fidelidad para audiófilos y profesionales.',
    precio: 299.99,
    precioOferta: 249.99,
    stock: 18,
    marca: 'Sennheiser',
    modelo: 'HD 600',
    tipo: 'periferico' as ProductoTipo,
    valoracion: 4.9,
    totalValoraciones: 567,
    destacado: false,
    imagenes: ['/images/producto_auriculares.png']
  },
  {
    id: '11',
    nombre: 'Disco Duro HDD Seagate 8TB',
    descripcionCorta: '5400 RPM, caché 256MB, NAS optimizado',
    descripcion: 'Disco duro de gran capacidad para almacenamiento masivo y NAS.',
    precio: 179.99,
    precioOferta: null,
    stock: 31,
    marca: 'Seagate',
    modelo: 'IronWolf 8TB',
    tipo: 'componente' as ProductoTipo,
    valoracion: 4.4,
    totalValoraciones: 89,
    destacado: false,
    imagenes: ['/images/producto_hdd.png']
  },
  {
    id: '12',
    nombre: 'Memoria RAM DDR4 16GB Kingston',
    descripcionCorta: '3200MHz CL16, baja latencia, sin RGB',
    descripcion: 'Memoria RAM económica y fiable para actualizaciones básicas.',
    precio: 39.99,
    precioOferta: 29.99,
    stock: 55,
    marca: 'Kingston',
    modelo: 'Fury Beast',
    tipo: 'componente' as ProductoTipo,
    valoracion: 4.3,
    totalValoraciones: 321,
    destacado: false,
    imagenes: ['/images/producto_ram_basic.png']
  }
]

const marcas = ['Asus', 'Samsung', 'Corsair', 'Logitech', 'Razer', 'Intel', 'NVIDIA', 'Sennheiser', 'Seagate', 'Kingston']

const tiposProductos = [
  { value: 'equipo_completo', label: 'Equipos Completos' },
  { value: 'componente', label: 'Componentes' },
  { value: 'periferico', label: 'Periféricos' },
  { value: 'accesorio', label: 'Accesorios' },
  { value: 'software', label: 'Software' },
]

const ordenarPor = [
  { value: 'novedad', label: 'Novedad' },
  { value: 'precio_asc', label: 'Precio: Menor a Mayor' },
  { value: 'precio_desc', label: 'Precio: Mayor a Menor' },
  { value: 'valoracion', label: 'Mejor Valorados' },
  { value: 'nombre', label: 'Nombre A-Z' },
]

export default function TiendaPage() {
  const [busqueda, setBusqueda] = useState('')
  const [precioMax, setPrecioMax] = useState([2000])
  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState<string[]>([])
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string>('')
  const [enStock, setEnStock] = useState(false)
  const [enOferta, setEnOferta] = useState(false)
  const [ordenar, setOrdenar] = useState('novedad')
  const [vista, setVista] = useState<'grid' | 'list'>('grid')
  const [pagina, setPagina] = useState(1)
  const [itemsPorPagina, setItemsPorPagina] = useState(12)

  const productosFiltrados = productosMock.filter((producto) => {
    const matchBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.descripcionCorta?.toLowerCase().includes(busqueda.toLowerCase())
    const matchPrecio = producto.precio <= precioMax[0]
    const matchTipo = !tipoSeleccionado || producto.tipo === tipoSeleccionado
    const matchStock = !enStock || producto.stock > 0
    const matchOferta = !enOferta || !!producto.precioOferta

    return matchBusqueda && matchPrecio && matchTipo && matchStock && matchOferta
  })

  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    switch (ordenar) {
      case 'precio_asc':
        return (a.precioOferta || a.precio) - (b.precioOferta || b.precio)
      case 'precio_desc':
        return (b.precioOferta || b.precio) - (a.precioOferta || a.precio)
      case 'valoracion':
        return b.valoracion - a.valoracion
      case 'nombre':
        return a.nombre.localeCompare(b.nombre)
      default:
        return 0
    }
  })

  const totalPages = Math.ceil(productosOrdenados.length / itemsPorPagina)
  const startIndex = (pagina - 1) * itemsPorPagina
  const productosPaginados = productosOrdenados.slice(startIndex, startIndex + itemsPorPagina)

  const limpiarFiltros = () => {
    setBusqueda('')
    setPrecioMax([2000])
    setMarcasSeleccionadas([])
    setTipoSeleccionado('')
    setEnStock(false)
    setEnOferta(false)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tienda</h1>
          <p className="text-muted-foreground">
            {productosFiltrados.length} productos encontrados
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={ordenar} onValueChange={setOrdenar}>
            <SelectTrigger className="w-full lg:w-64">
              <SelectValue placeholder="Ordenar por..." />
            </SelectTrigger>
            <SelectContent>
              {ordenarPor.map((opcion) => (
                <SelectItem key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant={vista === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setVista('grid')}
            >
              <Grid className="h-5 w-5" />
            </Button>
            <Button
              variant={vista === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setVista('list')}
            >
              <List className="h-5 w-5" />
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <Filter className="h-5 w-5 mr-2" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <FiltrosPanel
                marcas={marcas}
                marcasSeleccionadas={marcasSeleccionadas}
                setMarcasSeleccionadas={setMarcasSeleccionadas}
                tipoSeleccionado={tipoSeleccionado}
                setTipoSeleccionado={setTipoSeleccionado}
                precioMax={precioMax}
                setPrecioMax={setPrecioMax}
                enStock={enStock}
                setEnStock={setEnStock}
                enOferta={enOferta}
                setEnOferta={setEnOferta}
                onLimpiar={limpiarFiltros}
              />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20">
              <FiltrosPanel
                marcas={marcas}
                marcasSeleccionadas={marcasSeleccionadas}
                setMarcasSeleccionadas={setMarcasSeleccionadas}
                tipoSeleccionado={tipoSeleccionado}
                setTipoSeleccionado={setTipoSeleccionado}
                precioMax={precioMax}
                setPrecioMax={setPrecioMax}
                enStock={enStock}
                setEnStock={setEnStock}
                enOferta={enOferta}
                setEnOferta={setEnOferta}
                onLimpiar={limpiarFiltros}
              />
            </div>
          </aside>

          <div className="flex-1">
            {productosPaginados.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground mb-4">
                  No se encontraron productos
                </p>
                <Button onClick={limpiarFiltros} variant="outline">
                  Limpiar filtros
                </Button>
              </div>
            ) : vista === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {productosPaginados.map((producto) => (
                  <ProductCardGrid key={producto.id} producto={producto} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {productosPaginados.map((producto) => (
                  <ProductCardList key={producto.id} producto={producto} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPagina(Math.max(1, pagina - 1))}
                        className={pagina === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, i) => {
                      const paginaNum = i + 1
                      const mostrarPagina =
                        paginaNum === 1 ||
                        paginaNum === totalPages ||
                        (paginaNum >= pagina - 1 && paginaNum <= pagina + 1)

                      if (!mostrarPagina && paginaNum === pagina - 2) {
                        return (
                          <PaginationItem key={`ellipsis-${paginaNum}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )
                      }

                      if (!mostrarPagina) return null

                      return (
                        <PaginationItem key={paginaNum}>
                          <PaginationLink
                            onClick={() => setPagina(paginaNum)}
                            isActive={paginaNum === pagina}
                            className="cursor-pointer"
                          >
                            {paginaNum}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPagina(Math.min(totalPages, pagina + 1))}
                        className={pagina === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function FiltrosPanel({
  marcas,
  marcasSeleccionadas,
  setMarcasSeleccionadas,
  tipoSeleccionado,
  setTipoSeleccionado,
  precioMax,
  setPrecioMax,
  enStock,
  setEnStock,
  enOferta,
  setEnOferta,
  onLimpiar
}: {
  marcas: string[]
  marcasSeleccionadas: string[]
  setMarcasSeleccionadas: (marcas: string[]) => void
  tipoSeleccionado: string
  setTipoSeleccionado: (tipo: string) => void
  precioMax: number[]
  setPrecioMax: (precio: number[]) => void
  enStock: boolean
  setEnStock: (stock: boolean) => void
  enOferta: boolean
  setEnOferta: (oferta: boolean) => void
  onLimpiar: () => void
}) {
  const toggleMarca = (marca: string) => {
    setMarcasSeleccionadas(
      marcasSeleccionadas.includes(marca)
        ? marcasSeleccionadas.filter(m => m !== marca)
        : [...marcasSeleccionadas, marca]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filtros</h3>
        <Button variant="ghost" size="sm" onClick={onLimpiar}>
          <X className="h-4 w-4 mr-1" />
          Limpiar
        </Button>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Tipo</h4>
        <div className="space-y-2">
          {tiposProductos.map((tipo) => (
            <div key={tipo.value} className="flex items-center space-x-2">
              <Checkbox
                id={`tipo-${tipo.value}`}
                checked={tipoSeleccionado === tipo.value}
                onCheckedChange={(checked) => {
                  setTipoSeleccionado(checked ? tipo.value : '')
                }}
              />
              <label htmlFor={`tipo-${tipo.value}`} className="text-sm cursor-pointer">
                {tipo.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Precio máximo</h4>
        <div className="space-y-2">
          <Slider
            value={precioMax}
            onValueChange={setPrecioMax}
            min={0}
            max={3000}
            step={50}
            className="w-full"
          >
            <SliderSingleThumb />
          </Slider>
          <div className="text-center text-sm font-medium">
            Hasta {precioMax[0]}€
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Marcas</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {marcas.map((marca) => (
            <div key={marca} className="flex items-center space-x-2">
              <Checkbox
                id={`marca-${marca}`}
                checked={marcasSeleccionadas.includes(marca)}
                onCheckedChange={() => toggleMarca(marca)}
              />
              <label htmlFor={`marca-${marca}`} className="text-sm cursor-pointer">
                {marca}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Disponibilidad</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="en-stock"
              checked={enStock}
              onCheckedChange={setEnStock}
            />
            <label htmlFor="en-stock" className="text-sm cursor-pointer">
              En stock
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="en-oferta"
              checked={enOferta}
              onCheckedChange={setEnOferta}
            />
            <label htmlFor="en-oferta" className="text-sm cursor-pointer">
              En oferta
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCardGrid({ producto }: { producto: typeof productosMock[0] }) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()

  const descuento = producto.precioOferta
    ? Math.round((1 - producto.precioOferta / producto.precio) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precioOferta || producto.precio,
      imagen: producto.imagenes[0] || '',
      cantidad: 1
    })
    toast({
      title: "Producto añadido",
      description: `${producto.nombre} se ha añadido al carrito`,
    })
  }

  return (
    <Card className="group hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden">
      <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
        {producto.imagenes[0] && (
          <Image
            src={producto.imagenes[0]}
            alt={producto.nombre}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        )}
        {descuento > 0 && (
          <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
            -{descuento}%
          </Badge>
        )}
        {producto.stock < 10 && (
          <Badge variant="outline" className="absolute top-3 right-3 border-destructive text-destructive">
            Últimas unidades!
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <Link href={`/producto/${producto.id}`}>
          <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {producto.nombre}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {producto.descripcionCorta}
        </p>
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="text-sm font-medium">{producto.valoracion}</span>
          <span className="text-xs text-muted-foreground">
            ({producto.totalValoraciones})
          </span>
        </div>
        <div className="flex items-end gap-2">
          {producto.precioOferta ? (
            <>
              <span className="text-lg font-bold text-destructive">
                {producto.precioOferta.toFixed(2)}€
              </span>
              <span className="text-sm text-muted-foreground line-through">
                {producto.precio.toFixed(2)}€
              </span>
            </>
          ) : (
            <span className="text-lg font-bold">
              {producto.precio.toFixed(2)}€
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/producto/${producto.id}`}>Ver Detalles</Link>
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Añadir
        </Button>
      </CardFooter>
    </Card>
  )
}

function ProductCardList({ producto }: { producto: typeof productosMock[0] }) {
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()

  const descuento = producto.precioOferta
    ? Math.round((1 - producto.precioOferta / producto.precio) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precioOferta || producto.precio,
      imagen: producto.imagenes[0] || '',
      cantidad: 1
    })
    toast({
      title: "Producto añadido",
      description: `${producto.nombre} se ha añadido al carrito`,
    })
  }

  return (
    <Card className="group hover:shadow-lg transition-all overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
            {producto.imagenes[0] && (
              <Image
                src={producto.imagenes[0]}
                alt={producto.nombre}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
            {descuento > 0 && (
              <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs">
                -{descuento}%
              </Badge>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <Link href={`/producto/${producto.id}`}>
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors truncate">
                {producto.nombre}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {producto.descripcionCorta}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm font-medium">{producto.valoracion}</span>
                <span className="text-xs text-muted-foreground">
                  ({producto.totalValoraciones})
                </span>
              </div>
              <div className="flex items-end gap-2">
                {producto.precioOferta ? (
                  <>
                    <span className="font-bold text-destructive">
                      {producto.precioOferta.toFixed(2)}€
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {producto.precio.toFixed(2)}€
                    </span>
                  </>
                ) : (
                  <span className="font-bold">
                    {producto.precio.toFixed(2)}€
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {producto.stock} disponibles
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              className="w-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Añadir
            </Button>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href={`/producto/${producto.id}`}>Ver Detalles</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
