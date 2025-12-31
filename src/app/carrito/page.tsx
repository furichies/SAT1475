'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import {
  Trash2,
  ShoppingBag,
  Truck,
  Shield,
  ArrowRight,
  Minus,
  Plus,
  CreditCard
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/use-cart-store'
import { productosMock } from '@/lib/data/productos'

const gastosEnvio = {
  standard: 0,
  express: 9.99,
  premium: 19.99
}

const impuestoIVA = 0.21

export default function CarritoPage() {
  const router = useRouter()
  // Hydration fix
  const [isMounted, setIsMounted] = useState(false)
  const cartItems = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const clearCart = useCartStore((state) => state.clearCart)

  const [metodoEnvio, setMetodoEnvio] = useState('standard')

  const [datosEnvio, setDatosEnvio] = useState({
    nombre: '',
    apellidos: '',
    direccion: '',
    codigoPostal: '',
    ciudad: '',
    provincia: '',
    telefono: ''
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Enriched items with full product details
  const enrichedItems = cartItems.map(item => {
    const productDetail = productosMock.find(p => p.id === item.id)
    return {
      ...item,
      producto: productDetail || {
        // Fallback if product not found in mock (shouldn't happen with sync data)
        id: item.id,
        nombre: item.nombre,
        descripcionCorta: '',
        precio: item.precio,
        precioOferta: null,
        stock: 99,
        marca: 'N/A',
        modelo: 'N/A',
        imagenes: [item.imagen],
        valoracion: 0,
        totalValoraciones: 0
      }
    }
  })

  const calcularTotal = () => {
    const subtotal = enrichedItems.reduce((sum, item) => {
      // Use the price from the store (which captures the effective price at add time)
      // or check fresh price from mock if desired. Let's stick to store price for consistency
      // or better, verify against mock to show current offers.
      // Re-evaluating: The store saves 'precio' which is the effective price.
      return sum + (item.precio * item.cantidad)
    }, 0)

    const iva = subtotal * impuestoIVA
    const envio = gastosEnvio[metodoEnvio as keyof typeof gastosEnvio] || 0
    const total = subtotal + iva + envio

    return { subtotal, iva, envio, total }
  }

  const total = calcularTotal()

  const handleCantidadChange = (id: string, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) return
    // Optional: Check max stock
    const product = productosMock.find(p => p.id === id)
    if (product && nuevaCantidad > product.stock) return

    updateQuantity(id, nuevaCantidad)
  }

  const handleEliminarItem = (id: string) => {
    removeItem(id)
  }

  const handleMetodoEnvioChange = (metodo: string) => {
    setMetodoEnvio(metodo)
  }

  const handleDatosEnvioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatosEnvio({
      ...datosEnvio,
      [e.target.name]: e.target.value
    })
  }

  const finalizarCompra = () => {
    console.log('Finalizando compra...', {
      items: enrichedItems,
      metodoEnvio,
      datosEnvio,
      total
    })

    // Here we would send to API
    alert('Compra finalizada con exito (Demo)')
    clearCart()
    router.push('/')
  }

  if (!isMounted) {
    return null
  }

  if (enrichedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-primary/5 to-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 h-16 w-16 bg-primary rounded-lg flex items-center justify-center">
            <ShoppingBag className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Tu Carrito Esta Vacio</h1>
          <p className="text-gray-600 mb-6">
            No tienes productos en tu carrito.
          </p>
          <Button onClick={() => router.push('/tienda')} className="w-full">
            Ir a la Tienda
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-primary/5 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Volver a la Tienda
          </Button>
          <h1 className="text-3xl font-bold">Mi Carrito</h1>
          <p className="text-gray-600">
            {enrichedItems.length} {enrichedItems.length === 1 ? 'articulo' : 'articulos'}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {enrichedItems.map((item) => {
              const subtotal = item.precio * item.cantidad
              const producto = item.producto
              // Safe image handling
              const itemImage = producto.imagenes?.[0] || item.imagen || '/placeholder.png'

              return (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="relative h-24 w-24 bg-gray-100 rounded overflow-hidden flex-shrink-0 border">
                            <Image
                              src={itemImage}
                              alt={item.nombre}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div>
                              {producto.precioOferta && (
                                <Badge className="mb-2 bg-red-100 text-red-800 hover:bg-red-100">
                                  Oferta
                                </Badge>
                              )}
                              <Link href={`/producto/${item.id}`} className="hover:underline">
                                <h3 className="font-semibold text-lg">{item.nombre}</h3>
                              </Link>
                              <p className="text-sm text-gray-600">{producto.descripcionCorta}</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div>
                                <span className="text-gray-500 mr-1">Marca:</span>
                                <span className="font-medium">{producto.marca}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 mr-1">Stock:</span>
                                <span className={`font-medium ${producto.stock < 5 ? 'text-red-600' : 'text-green-600'}`}>
                                  {producto.stock > 0 ? `${producto.stock} uds` : 'Agotado'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-4 flex-shrink-0">
                        <div className="text-right">
                          {producto.precioOferta ? (
                            <>
                              <p className="text-sm text-gray-400 line-through">
                                {producto.precio.toFixed(2)}€
                              </p>
                              <p className="text-xl font-bold text-red-600">
                                {producto.precioOferta.toFixed(2)}€
                              </p>
                            </>
                          ) : (
                            <p className="text-xl font-bold">
                              {producto.precio.toFixed(2)}€
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {item.cantidad} x {item.precio.toFixed(2)}€
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCantidadChange(item.id, item.cantidad - 1)}
                            disabled={item.cantidad <= 1}
                            className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.cantidad}</span>
                          <button
                            onClick={() => handleCantidadChange(item.id, item.cantidad + 1)}
                            disabled={item.cantidad >= producto.stock}
                            className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEliminarItem(item.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Metodo de Envio</Label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleMetodoEnvioChange('standard')}
                      className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors ${metodoEnvio === 'standard'
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium">Estandar</p>
                          <p className="text-sm text-gray-600">3-5 dias laborables</p>
                        </div>
                      </div>
                      <span className="font-semibold">
                        {gastosEnvio.standard > 0 ? gastosEnvio.standard.toFixed(2) + '€' : 'Gratis'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMetodoEnvioChange('express')}
                      className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors ${metodoEnvio === 'express'
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Express (24h)</p>
                          <p className="text-sm text-gray-600">Entrega al dia siguiente</p>
                        </div>
                      </div>
                      <span className="font-semibold">
                        {gastosEnvio.express.toFixed(2)}€
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMetodoEnvioChange('premium')}
                      className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors ${metodoEnvio === 'premium'
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Premium (12h)</p>
                          <p className="text-sm text-gray-600">Entrega prioritaria</p>
                        </div>
                      </div>
                      <span className="font-semibold">
                        {gastosEnvio.premium.toFixed(2)}€
                      </span>
                    </button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Direccion de Envio</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        placeholder="Juan"
                        value={datosEnvio.nombre}
                        onChange={handleDatosEnvioChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="apellidos">Apellidos *</Label>
                      <Input
                        id="apellidos"
                        name="apellidos"
                        placeholder="Perez"
                        value={datosEnvio.apellidos}
                        onChange={handleDatosEnvioChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="direccion">Direccion *</Label>
                      <Input
                        id="direccion"
                        name="direccion"
                        placeholder="Calle Mayor 123"
                        value={datosEnvio.direccion}
                        onChange={handleDatosEnvioChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="codigoPostal">Codigo Postal *</Label>
                        <Input
                          id="codigoPostal"
                          name="codigoPostal"
                          placeholder="28001"
                          value={datosEnvio.codigoPostal}
                          onChange={handleDatosEnvioChange}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="ciudad">Ciudad *</Label>
                        <Input
                          id="ciudad"
                          name="ciudad"
                          placeholder="Madrid"
                          value={datosEnvio.ciudad}
                          onChange={handleDatosEnvioChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="provincia">Provincia *</Label>
                        <Input
                          id="provincia"
                          name="provincia"
                          placeholder="Madrid"
                          value={datosEnvio.provincia}
                          onChange={handleDatosEnvioChange}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="telefono">Telefono *</Label>
                        <Input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          placeholder="655-123-456"
                          value={datosEnvio.telefono}
                          onChange={handleDatosEnvioChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <Shield className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Compra Segura</p>
                      <p className="text-muted-foreground">
                        Todos los pedidos cuentan con garantia oficial de 2 anos en equipos y 1 ano en componentes.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Truck className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Envio Gratis</p>
                      <p className="text-muted-foreground">
                        Pedidos superiores a 199€ tienen envio estandar gratuito.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <CreditCard className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Metodos de Pago</p>
                      <p className="text-muted-foreground">
                        Aceptamos tarjeta, PayPal, transferencia y contrareembolso.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">{total.subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IVA (21%)</span>
                    <span className="font-semibold">{total.iva.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gastos de Envio</span>
                    <span className="font-semibold">
                      {total.envio > 0 ? total.envio.toFixed(2) + '€' : 'Gratis'}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">{total.total.toFixed(2)}€</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex-col gap-3">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={finalizarCompra}
                  disabled={enrichedItems.length === 0}
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Finalizar Compra
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
