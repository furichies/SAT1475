import { NextResponse } from 'next/server'
import { PedidoEstado, MetodoPago } from '@prisma/client'

// Mock data en memoria para pedidos (se usará en producción cuando se conecte a DB)
const pedidosMock = [
  {
    id: '1',
    numeroPedido: 'PED-2023-0001',
    usuarioId: 'demo-user-1',
    estado: PedidoEstado.ENTREGADO,
    subtotal: 2778.96,
    iva: 583.58,
    gastosEnvio: 0,
    total: 3362.54,
    direccionEnvio: JSON.stringify({
      nombre: 'Juan Pérez',
      apellidos: 'García López',
      direccion: 'Calle Mayor, 123',
      codigoPostal: '28001',
      ciudad: 'Madrid',
      provincia: 'Madrid',
      telefono: '+34 600 123 456'
    }),
    metodoPago: MetodoPago.TARJETA,
    referenciaPago: 'TXN-20231230-001',
    notas: 'Dejar en portería',
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
        subtotal: 1299,
        producto: {
          id: '1',
          sku: 'LAP-GAM-X15',
          nombre: 'Portátil Gaming Pro X15',
          descripcionCorta: 'Intel Core i7-13700H, RTX 4070, 32GB RAM DDR5',
          precio: 1499,
          precioOferta: 1299,
          imagen: '/images/producto_laptop_gaming.png',
          marca: 'Asus',
          modelo: 'ROG Strix G15'
        }
      },
      {
        id: '2',
        productoId: '3',
        cantidad: 2,
        precioUnitario: 109.99,
        descuento: 20,
        subtotal: 219.98,
        producto: {
          id: '3',
          sku: 'RAM-COR-DD5-32',
          nombre: 'Memoria RAM DDR5 32GB Corsair',
          descripcionCorta: '6000MHz CL36 RGB',
          precio: 129.99,
          precioOferta: 109.99,
          imagen: '/images/producto_ram.png',
          marca: 'Corsair',
          modelo: 'Vengeance DDR5'
        }
      },
      {
        id: '3',
        productoId: '5',
        cantidad: 1,
        precioUnitario: 479.99,
        descuento: 70,
        subtotal: 479.99,
        producto: {
          id: '5',
          sku: 'MON-SAM-32-4K',
          nombre: 'Monitor Curvo 32" 4K Samsung',
          descripcionCorta: '165Hz, 1ms, HDR10+',
          precio: 549.99,
          precioOferta: 479.99,
          imagen: '/images/producto_monitor.png',
          marca: 'Samsung',
          modelo: 'Odyssey G7'
        }
      }
    ]
  }
]

// ============================================
// PEDIDOS - LISTAR Y DETALLE
// ============================================

// GET /api/pedidos - Listar pedidos del usuario
export async function GET(req: Request) {
  try {
    // En producción, se obtendría el userId de la sesión
    const userId = 'demo-user-1' // Mock

    const pedidos = pedidosMock.filter(p => p.usuarioId === userId)

    return NextResponse.json({
      success: true,
      data: {
        pedidos,
        totalPedidos: pedidos.length
      }
    })
  } catch (error) {
    console.error('Error en GET /api/pedidos:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener pedidos',
        datos: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

// POST /api/pedidos - Crear nuevo pedido
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, direccionEnvio, metodoPago, notas } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'El carrito está vacío'
        },
        { status: 400 }
      )
    }

    if (!direccionEnvio) {
      return NextResponse.json(
        {
          success: false,
          error: 'La dirección de envío es requerida'
        },
        { status: 400 }
      )
    }

    if (!metodoPago) {
      return NextResponse.json(
        {
          success: false,
          error: 'El método de pago es requerido'
        },
        { status: 400 }
      )
    }

    // Calcular totales
    const subtotal = items.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0)
    const descuentoTotal = items.reduce((acc, item) => acc + (item.descuento * item.cantidad), 0)
    const iva = subtotal * 0.21 // 21% IVA
    const gastosEnvio = subtotal >= 199 ? 0 : 9.99 // Envío gratis para pedidos > 199€
    const total = subtotal + iva + gastosEnvio

    // Generar número de pedido
    const numeroPedido = `PED-${new Date().getFullYear()}-${(pedidosMock.length + 1).toString().padStart(4, '0')}`

    // Crear pedido mock
    const nuevoPedido = {
      id: `pedido-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      numeroPedido,
      usuarioId: 'demo-user-1', // Mock: vendría de la sesión
      estado: PedidoEstado.PENDIENTE,
      subtotal,
      iva,
      gastosEnvio,
      total,
      direccionEnvio: JSON.stringify(direccionEnvio),
      metodoPago,
      referenciaPago: null,
      notas: notas || '',
      fechaPedido: new Date(),
      fechaEnvio: null,
      fechaEntrega: null,
      items
    }

    pedidosMock.push(nuevoPedido)

    return NextResponse.json({
      success: true,
      data: {
        pedido: nuevoPedido,
        mensaje: 'Pedido creado correctamente'
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/pedidos:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear pedido',
        datos: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}
