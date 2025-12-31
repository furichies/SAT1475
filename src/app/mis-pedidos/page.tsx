'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Truck, Package, Clock, ChevronRight, Eye } from 'lucide-react'
import Link from 'next/link'

// Mock data para pedidos
const pedidosMock = [
  {
    id: '1',
    numeroPedido: 'PED-2023-0001',
    estado: 'entregado',
    estadoLabel: 'Entregado',
    estadoColor: 'bg-green-100 text-green-800 border-green-200',
    subtotal: 2778.96,
    iva: 583.58,
    gastosEnvio: 0,
    total: 3362.54,
    fechaPedido: '2023-12-15',
    fechaEntrega: '2023-12-16',
    items: 3
  },
  {
    id: '2',
    numeroPedido: 'PED-2023-0002',
    estado: 'enviado',
    estadoLabel: 'Enviado',
    estadoColor: 'bg-blue-100 text-blue-800 border-blue-200',
    subtotal: 1099.99,
    iva: 230.90,
    gastosEnvio: 9.99,
    total: 1240.88,
    fechaPedido: '2023-12-20',
    fechaEnvio: '2023-12-21',
    items: 2
  },
  {
    id: '3',
    numeroPedido: 'PED-2023-0003',
    estado: 'pendiente',
    estadoLabel: 'Pendiente',
    estadoColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    subtotal: 599.99,
    iva: 125.90,
    gastosEnvio: 9.99,
    total: 735.88,
    fechaPedido: '2023-12-28',
    items: 1
  }
]

export default function MisPedidosPage() {
  return (
    <div className="min-h-screen py-8 bg-muted/30">
      <div className="container max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mis Pedidos</h1>
            <p className="text-muted-foreground">
              Gestiona el historial de tus compras
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/tienda">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Nueva Compra
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {pedidosMock.map((pedido) => (
            <Card key={pedido.id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">
                        {pedido.numeroPedido}
                      </CardTitle>
                      <Badge className={pedido.estadoColor}>
                        {pedido.estadoLabel}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Fecha: {pedido.fechaPedido}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>{pedido.items} productos</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/mis-pedidos/${pedido.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalle
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Información de envío */}
                <div className="flex items-center justify-between py-3 border-t">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <div className="text-sm">
                      {pedido.fechaEnvio ? (
                        <div>
                          <p className="font-medium">Enviado: {pedido.fechaEnvio}</p>
                          <p className="text-muted-foreground">Entregado: {pedido.fechaEntrega}</p>
                        </div>
                      ) : (
                        <p className="font-medium">
                          Pendiente de envío
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Subtotal</p>
                    <p className="text-lg font-bold">{pedido.subtotal.toFixed(2)}€</p>
                  </div>
                </div>

                {/* Totales */}
                <div className="flex items-center justify-between py-3 border-t bg-muted/30 rounded-lg px-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">IVA (21%)</span>
                      <span>{pedido.iva.toFixed(2)}€</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Gastos de Envío</span>
                      <span>{pedido.gastosEnvio > 0 ? pedido.gastosEnvio.toFixed(2) + '€' : 'Gratis'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Total</p>
                    <p className="text-2xl font-bold text-primary">
                      {pedido.total.toFixed(2)}€
                    </p>
                  </div>
                </div>

                {/* Acciones rápidas */}
                <div className="flex items-center justify-between py-3 border-t">
                  <div className="space-x-2">
                    {pedido.estado === 'entregado' && (
                      <Button variant="outline" size="sm">
                        Comprar de Nuevo
                      </Button>
                    )}
                    {(pedido.estado === 'pendiente' || pedido.estado === 'enviado') && (
                      <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                        Cancelar Pedido
                      </Button>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/mis-pedidos/${pedido.id}`}>
                      Ver Todos los Detalles
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Estado vacío */}
        {pedidosMock.length === 0 && (
          <Card className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Aún no tienes pedidos</h2>
            <p className="text-muted-foreground mb-6">
              Empieza a comprar para ver tus pedidos aquí
            </p>
            <Button size="lg" asChild>
              <Link href="/tienda">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Ir a la Tienda
              </Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
