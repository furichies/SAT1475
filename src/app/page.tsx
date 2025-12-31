'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Monitor,
  Cpu,
  HardDrive,
  MemoryStick,
  Keyboard,
  Mouse,
  Headphones,
  ArrowRight,
  ShoppingCart,
  Star
} from 'lucide-react'
import Image from 'next/image'

// Categorías con imágenes reales
const categories = [
  {
    id: '1',
    nombre: 'Ordenadores',
    icon: Monitor,
    imagen: '/images/categoria_ordenadores.png',
    productos: 45
  },
  {
    id: '2',
    nombre: 'Componentes',
    icon: Cpu,
    imagen: '/images/categoria_componentes.png',
    productos: 128
  },
  {
    id: '3',
    nombre: 'Almacenamiento',
    icon: HardDrive,
    imagen: '/images/categoria_almacenamiento.png',
    productos: 56
  },
  {
    id: '4',
    nombre: 'Memoria RAM',
    icon: MemoryStick,
    imagen: '/images/categoria_ram.png',
    productos: 34
  },
  {
    id: '5',
    nombre: 'Periféricos',
    icon: Keyboard,
    imagen: '/images/categoria_perifericos.png',
    productos: 89
  },
  {
    id: '6',
    nombre: 'Audio',
    icon: Headphones,
    imagen: '/images/categoria_audio.png',
    productos: 42
  },
]

const featuredProducts = [
  {
    id: '1',
    nombre: 'Portátil Gaming Pro X15',
    descripcionCorta: 'Intel Core i7, RTX 4070, 32GB RAM',
    precio: 1499,
    precioOferta: 1299,
    stock: 5,
    marca: 'Asus',
    valoracion: 4.8,
    totalValoraciones: 124,
    tipo: 'equipo_completo',
    destacado: true,
    imagenes: ['/images/producto_laptop_gaming.png']
  },
  {
    id: '2',
    nombre: 'SSD NVMe 2TB Samsung',
    descripcionCorta: 'Velocidad de lectura 7.000 MB/s',
    precio: 189.99,
    precioOferta: null,
    stock: 23,
    marca: 'Samsung',
    valoracion: 4.9,
    totalValoraciones: 87,
    tipo: 'componente',
    destacado: true,
    imagenes: ['/images/producto_ssd.png']
  },
  {
    id: '3',
    nombre: 'Memoria RAM 32GB DDR5',
    descripcionCorta: '6000MHz CL36 RGB',
    precio: 129.99,
    precioOferta: 109.99,
    stock: 15,
    marca: 'Corsair',
    valoracion: 4.7,
    totalValoraciones: 156,
    tipo: 'componente',
    destacado: true,
    imagenes: ['/images/producto_ram.png']
  },
  {
    id: '4',
    nombre: 'Monitor Curvo 32" 4K',
    descripcionCorta: '165Hz, 1ms, HDR',
    precio: 549.99,
    precioOferta: 479.99,
    stock: 8,
    marca: 'LG',
    valoracion: 4.6,
    totalValoraciones: 92,
    tipo: 'periferico',
    destacado: true,
    imagenes: ['/images/producto_monitor.png']
  },
]

const offersProducts = [
  {
    id: '5',
    nombre: 'Teclado Mecánico RGB',
    descripcionCorta: 'Switch Cherry MX Red',
    precio: 149.99,
    precioOferta: 99.99,
    stock: 42,
    marca: 'Logitech',
    valoracion: 4.5,
    totalValoraciones: 203,
    tipo: 'periferico',
    destacado: false,
    imagenes: ['/images/producto_teclado.png']
  },
  {
    id: '6',
    nombre: 'Ratón Gaming Inalámbrico',
    descripcionCorta: '25.600 DPI, batería 90h',
    precio: 79.99,
    precioOferta: 59.99,
    stock: 67,
    marca: 'Razer',
    valoracion: 4.7,
    totalValoraciones: 312,
    tipo: 'periferico',
    destacado: false,
    imagenes: ['/images/producto_raton.png']
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Banner Principal con imagen real */}
      <section className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero_banner.png"
            alt="Technology Store"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="container relative z-10 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tu Tienda de Informática de Confianza
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-8">
              Descubre los mejores equipos, componentes y accesorios con el mejor servicio técnico especializado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Ver Tienda
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Servicio Técnico
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Destacadas con imágenes reales */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Categorías</h2>
              <p className="text-muted-foreground mt-2">Explora nuestra amplia gama de productos</p>
            </div>
            <Button variant="outline" className="hidden md:flex">
              Ver todas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((categoria) => {
              const Icon = categoria.icon
              return (
                <Link key={categoria.id} href="/tienda">
                  <Card className="group hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer overflow-hidden">
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={categoria.imagen}
                        alt={categoria.nombre}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 bg-primary/90 backdrop-blur-sm rounded-lg px-3 py-1">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold mb-1">{categoria.nombre}</h3>
                      <p className="text-sm text-muted-foreground">{categoria.productos} productos</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Productos Destacados con imágenes reales */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Productos Destacados</h2>
              <p className="text-muted-foreground mt-2">Los productos más populares de nuestra tienda</p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link href="/tienda?destacado=true">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        </div>
      </section>

      {/* Ofertas Especiales con imágenes reales */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Ofertas Especiales</h2>
              <p className="text-muted-foreground mt-2">Aprovecha nuestras mejores ofertas</p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link href="/tienda?enOferta=true">
                Ver todas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offersProducts.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Servicio Técnico */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Necesitas Servicio Técnico?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Nuestro equipo de técnicos expertos está listo para ayudarte con cualquier problema en tu equipo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-foreground" asChild>
              <Link href="/sat">
                Crear Ticket SAT
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link href="/admin_conocimiento">
                Ver Base de Conocimiento
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

// Componente de tarjeta de producto con imágenes reales
function ProductCard({ producto }: { producto: typeof featuredProducts[0] }) {
  const descuento = producto.precioOferta
    ? Math.round((1 - producto.precioOferta / producto.precio) * 100)
    : 0

  return (
    <Card className="group hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden">
      <div className="relative aspect-square bg-muted overflow-hidden">
        {producto.imagenes[0] && (
          <Image
            src={producto.imagenes[0]}
            alt={producto.nombre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        {descuento > 0 && (
          <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground z-10">
            -{descuento}%
          </Badge>
        )}
        {producto.stock < 10 && (
          <Badge variant="outline" className="absolute top-3 right-3 border-destructive text-destructive z-10">
            ¡Últimas unidades!
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
        <Button variant="outline" size="sm" className="flex-1">
          Ver Detalles
        </Button>
        <Button size="sm" className="flex-1">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Añadir
        </Button>
      </CardFooter>
    </Card>
  )
}
