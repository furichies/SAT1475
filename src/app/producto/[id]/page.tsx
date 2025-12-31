'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Package,
  Check,
  Minus,
  Plus,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'
import Image from 'next/image'

// Datos del producto (mock - vendrá de la API)
const productoEjemplo = {
  id: '1',
  nombre: 'Portátil Gaming Pro X15',
  descripcion: 'Potente portátil gaming diseñado para ofrecer el máximo rendimiento en juegos y aplicaciones exigentes. Equipado con el procesador Intel Core i7 de última generación, tarjeta gráfica NVIDIA RTX 4070 y 32GB de memoria RAM DDR5 ultrarrápida.',
  descripcionCorta: 'Intel Core i7, RTX 4070, 32GB RAM DDR5, 1TB SSD NVMe',
  precio: 1499,
  precioOferta: 1299,
  stock: 5,
  stockMinimo: 3,
  marca: 'Asus',
  modelo: 'ROG Strix G15',
  tipo: 'equipo_completo',
  valoracion: 4.8,
  totalValoraciones: 124,
  destacado: true,
  imagen: '/images/producto_laptop_gaming.png',
  imagenes: [
    '/images/producto_laptop_gaming.png',
    '/images/producto_laptop_gaming.png',
    '/images/producto_laptop_gaming.png'
  ],
  garantiaMeses: 24,
  especificaciones: {
    'Procesador': 'Intel Core i7-13700H, 14 núcleos (6P+8E)',
    'Tarjeta Gráfica': 'NVIDIA GeForce RTX 4070, 8GB GDDR6',
    'Memoria RAM': '32GB DDR5 4800MHz Dual Channel',
    'Almacenamiento': '1TB NVMe SSD, 7000MB/s lectura',
    'Pantalla': '15.6" QHD 240Hz, G-Sync Compatible',
    'Batería': '90Wh, hasta 6 horas de uso mixto',
    'Sistema Operativo': 'Windows 11 Home OEM',
    'Conectividad': 'Wi-Fi 6E, Bluetooth 5.3, USB 3.2 Gen2, HDMI 2.1',
    'Peso': '2.8 kg'
  },
  categoria: {
    id: '1',
    nombre: 'Ordenadores'
  }
}

const valoracionesMock = [
  {
    id: '1',
    usuario: 'Juan Pérez',
    puntuacion: 5,
    titulo: '¡Excelente portátil!',
    comentario: 'He estado usando este portátil durante 3 meses y el rendimiento es increíble. Los juegos corren fluidos en Ultra settings y la pantalla QHD es espectacular.',
    fecha: '2023-12-15',
    verificada: true
  },
  {
    id: '2',
    usuario: 'María García',
    puntuacion: 5,
    titulo: 'Mejor compra del año',
    comentario: 'Increíble relación calidad-precio. El RGB de la teclado y el sistema de refrigeración funcionan perfectamente. Totalmente recomendado.',
    fecha: '2023-12-10',
    verificada: true
  },
  {
    id: '3',
    usuario: 'Carlos López',
    puntuacion: 4,
    titulo: 'Bueno para gaming',
    comentario: 'Buen rendimiento en juegos como COD y Valorant. La única pega es que el ventilador se escucha bastante a alta potencia.',
    fecha: '2023-11-28',
    verificada: true
  }
]

const productosRelacionados = [
  {
    id: '2',
    nombre: 'SSD NVMe Samsung 2TB',
    precio: 189.99,
    precioOferta: 159.99,
    stock: 23,
    valoracion: 4.9,
    imagen: '/images/producto_ssd.png'
  },
  {
    id: '3',
    nombre: 'Memoria RAM 32GB DDR5',
    precio: 129.99,
    precioOferta: 109.99,
    stock: 15,
    valoracion: 4.7,
    imagen: '/images/producto_ram.png'
  },
  {
    id: '5',
    nombre: 'Monitor Curvo 32" 4K',
    precio: 549.99,
    precioOferta: 479.99,
    stock: 8,
    valoracion: 4.6,
    imagen: '/images/producto_monitor.png'
  }
]

export default function ProductoPage() {
  const params = useParams()
  const router = useRouter()
  const [cantidad, setCantidad] = useState(1)
  const [imagenActiva, setImagenActiva] = useState(0)
  const [favorito, setFavorito] = useState(false)
  const [tabActiva, setTabActiva] = useState('descripcion')

  const descuento = productoEjemplo.precioOferta 
    ? Math.round((1 - productoEjemplo.precioOferta / productoEjemplo.precio) * 100)
    : 0

  const mediaValoraciones = valoracionesMock.reduce((acc, v) => acc + v.puntuacion, 0) / valoracionesMock.length

  const distribucion = [5, 4, 3, 2, 1].reduce((acc, stars) => {
    acc[stars] = valoracionesMock.filter(v => v.puntuacion === stars).length
    return acc
  }, {} as Record<number, number>)

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Breadcrumb y navegación */}
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <nav className="flex items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Inicio</Link>
            <span className="mx-2">/</span>
            <Link href="/tienda" className="hover:text-primary">Tienda</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">{productoEjemplo.nombre}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda: Imagen y Precio */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galería de Imágenes */}
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-square bg-muted">
                  <Image
                    src={productoEjemplo.imagenes[imagenActiva]}
                    alt={productoEjemplo.nombre}
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Thumbnails */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2">
                    {productoEjemplo.imagenes.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setImagenActiva(index)}
                        className={`w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
                          imagenActiva === index
                            ? 'border-primary scale-105'
                            : 'border-transparent hover:border-primary/50'
                        }`}
                      >
                        <Image
                          src={productoEjemplo.imagenes[index]}
                          alt={`Vista ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs: Descripción, Especificaciones, Valoraciones */}
            <Tabs value={tabActiva} onValueChange={setTabActiva} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="descripcion">Descripción</TabsTrigger>
                <TabsTrigger value="especificaciones">Especificaciones</TabsTrigger>
                <TabsTrigger value="valoraciones">
                  Valoraciones ({valoracionesMock.length})
                </TabsTrigger>
              </TabsList>

              {/* Tab: Descripción */}
              <TabsContent value="descripcion" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-2xl font-bold mb-4">{productoEjemplo.nombre}</h3>
                    <p className="text-lg text-muted-foreground mb-6">
                      {productoEjemplo.descripcionCorta}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {productoEjemplo.descripcion}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Especificaciones */}
              <TabsContent value="especificaciones" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(productoEjemplo.especificaciones).map(([clave, valor]) => (
                        <div key={clave} className="space-y-2">
                          <h4 className="font-semibold text-sm">{clave}</h4>
                          <p className="text-sm text-muted-foreground">{valor as string}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Valoraciones */}
              <TabsContent value="valoraciones" className="mt-6">
                <div className="space-y-4">
                  {/* Resumen de valoraciones */}
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle>Resumen de Valoraciones</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Valoración Media</span>
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 fill-primary text-primary" />
                          <span className="text-2xl font-bold">{mediaValoraciones.toFixed(1)}</span>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center gap-2">
                        <div className="flex-1 space-y-2">
                          {[5, 4, 3, 2, 1].map((stars) => (
                            <div key={stars} className="flex items-center gap-2">
                              <div className="flex items-center gap-1 w-8">
                                {Array.from({ length: stars }).map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">{stars} estrellas</span>
                              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full transition-all"
                                  style={{ width: `${(distribucion[stars] / valoracionesMock.length) * 100}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground w-16 text-right">
                          {distribucion[5]}%
                        </span>
                      </div>
                      <Separator />
                      <div className="text-sm text-muted-foreground">
                        <p className="font-semibold text-foreground mb-2">Basado en {valoracionesMock.length} valoraciones</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Lista de valoraciones */}
                  <div className="space-y-4">
                    {valoracionesMock.map((valoracion) => (
                      <Card key={valoracion.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold">{valoracion.usuario}</span>
                                {valoracion.verificada && (
                                  <Badge variant="outline" className="text-xs">
                                    Compra Verificada
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < valoracion.puntuacion
                                          ? 'fill-yellow-500 text-yellow-500'
                                          : 'text-muted-foreground'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {valoracion.fecha}
                                </span>
                              </div>
                              {valoracion.titulo && (
                                <h4 className="font-semibold mb-2 mt-3">{valoracion.titulo}</h4>
                              )}
                              <p className="text-sm text-muted-foreground">{valoracion.comentario}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Columna Derecha: Info y Compra */}
          <div className="space-y-6">
            {/* Precio y Disponibilidad */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                {/* Marca */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Marca</span>
                  <Badge variant="outline">{productoEjemplo.marca}</Badge>
                </div>
                
                {/* Precio */}
                <div className="space-y-2">
                  {productoEjemplo.precioOferta ? (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-destructive">
                          {productoEjemplo.precioOferta.toFixed(2)}€
                        </span>
                        {descuento > 0 && (
                          <Badge className="bg-destructive text-destructive-foreground">
                            -{descuento}%
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg text-muted-foreground line-through">
                          {productoEjemplo.precio.toFixed(2)}€
                        </span>
                      </div>
                    </>
                  ) : (
                    <span className="text-3xl font-bold">
                      {productoEjemplo.precio.toFixed(2)}€
                    </span>
                  )}
                </div>

                <Separator />

                {/* Stock */}
                <div className="space-y-2">
                  {productoEjemplo.stock > 0 ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="h-4 w-4" />
                      <span className="font-medium">
                        {productoEjemplo.stock} unidades disponibles
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-destructive">
                      <Minus className="h-4 w-4" />
                      <span className="font-medium">Agotado</span>
                    </div>
                  )}
                  {productoEjemplo.stock <= 10 && productoEjemplo.stock > 0 && (
                    <Badge variant="outline" className="border-destructive text-destructive">
                      ¡Últimas unidades!
                    </Badge>
                  )}
                </div>

                <Separator />

                {/* Selector de cantidad */}
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Cantidad</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      disabled={cantidad <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-semibold w-12 text-center">{cantidad}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCantidad(cantidad + 1)}
                      disabled={cantidad >= productoEjemplo.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Botones de acción */}
                <div className="space-y-2">
                  <Button size="lg" className="w-full" disabled={productoEjemplo.stock === 0}>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Añadir al Carrito
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="lg" className="flex-1">
                      <Heart className={`h-5 w-5 mr-2 ${favorito ? 'fill-red-500 text-red-500' : ''}`} />
                      {favorito ? 'Guardado' : 'Favoritos'}
                    </Button>
                    <Button variant="outline" size="lg" className="flex-1">
                      <Share2 className="h-5 w-5 mr-2" />
                      Compartir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de envío y garantía */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold mb-1">Envío Gratis</p>
                    <p className="text-sm text-muted-foreground">
                      Pedidos superiores a 99€
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold mb-1">Garantía Extendida</p>
                    <p className="text-sm text-muted-foreground">
                      {productoEjemplo.garantiaMeses} meses de garantía oficial
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <RotateCcw className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold mb-1">Devolución Gratuita</p>
                    <p className="text-sm text-muted-foreground">
                      30 días para devoluciones
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Productos Relacionados */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productosRelacionados.map((producto) => (
              <Card key={producto.id} className="group hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden">
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <Image
                    src={producto.imagen}
                    alt={producto.nombre}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {producto.precioOferta && (
                    <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
                      -{Math.round((1 - producto.precioOferta / producto.precio) * 100)}%
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <Link href={`/producto/${producto.id}`}>
                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {producto.nombre}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">{producto.valoracion}</span>
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
                  <Button variant="outline" size="sm" className="flex-1">
                    Ver Detalles
                  </Button>
                  <Button size="sm" className="flex-1">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Añadir
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
