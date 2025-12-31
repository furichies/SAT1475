import { NextResponse } from 'next/server'

// Mock data para pedidos
const pedidosMock = [
  {
    id: '1',
    numeroPedido: 'PED-2023-0001',
    usuarioId: 'demo-user-1',
    estado: 'entregado',
    subtotal: 2778.96,
    iva: 583.58,
    gastosEnvio: 0,
    total: 3362.54,
    direccionEnvio: JSON.stringify({
      nombre: 'Juan Perez',
      apellidos: 'Garcia',
      direccion: 'Calle Mayor 123',
      codigoPostal: '28001',
      ciudad: 'Madrid',
      provincia: 'Madrid',
      telefono: '+34 600 123 456'
    }),
    metodoPago: 'tarjeta',
    referenciaPago: 'TXN-20231230-001',
    notas: '',
    fechaPedido: new Date('2023-12-15T10:30:00Z'),
    fechaEnvio: new Date('2023-12-15T16:00:00Z'),
    fechaEntrega: new Date('2023-12-16T14:00:00Z'),
    items: [
      {
        id: '1',
        productoId: '1',
        cantidad: 1,
        precioUnitario: 1299,
        descuento: 200,
        subtotal: 1299
      },
      {
        id: '2',
        productoId: '3',
        cantidad: 2,
        precioUnitario: 109.99,
        descuento: 20,
        subtotal: 219.98
      },
      {
        id: '3',
        productoId: '5',
        cantidad: 1,
        precioUnitario: 479.99,
        descuento: 70,
        subtotal: 479.99
      }
    ]
  }
]

// GET /api/pedidos_detalle/[id] - Obtener detalle de pedido
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = await params
    
    const pedido = pedidosMock.find(p => p.id === id)

    if (!pedido) {
      return NextResponse.json(
        {
          success: false,
          error: 'Pedido no encontrado'
        },
        { status: 404 }
      )
    }

    // Obtener productos completos
    const productosRes = await fetch('http://localhost:3000/api/productos')
    const productosData = await productosRes.json()
    const productos = productosData.data?.productos || []

    // Enrich items con datos de productos
    const itemsEnriched = pedido.items.map(item => {
      const producto = productos.find(p => p.id === item.productoId)
      return {
        ...item,
        producto
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        pedido: {
          ...pedido,
          items: itemsEnriched
        },
        historial: [
          {
            estado: 'pendiente',
            fecha: pedido.fechaPedido,
            notas: 'Pedido creado'
          },
          {
            estado: 'confirmado',
            fecha: new Date(pedido.fechaPedido.getTime() + 3600000),
            notas: 'Pago confirmado'
          },
          {
            estado: 'procesando',
            fecha: new Date(pedido.fechaPedido.getTime() + 7200000),
            notas: 'Pedido en preparación'
          },
          {
            estado: 'enviado',
            fecha: pedido.fechaEnvio,
            notas: 'Pedido enviado'
          },
          {
            estado: 'entregado',
            fecha: pedido.fechaEntrega,
            notas: 'Entregado al cliente'
          }
        ]
      }
    })
  } catch (error) {
    console.error('Error en GET /api/pedidos_detalle/[id]:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener detalle del pedido',
        datos: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}
