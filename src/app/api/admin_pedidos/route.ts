import { NextResponse } from 'next/server'

// Mock data para pedidos del admin
let pedidosAdminMock = [
  {
    id: '1',
    numeroPedido: 'PED-2023-0123',
    clienteId: 'cliente-1',
    clienteNombre: 'Juan Pérez',
    clienteEmail: 'juan.perez@email.com',
    estado: 'pendiente',
    fecha: '2023-12-30T10:30:00Z',
    subtotal: 1099.99,
    iva: 230.90,
    gastosEnvio: 9.99,
    total: 1340.88,
    metodoPago: 'tarjeta',
    metodoEnvio: 'estandar',
    direccion: 'Calle Mayor 123, 28001 Madrid'
  },
  {
    id: '2',
    numeroPedido: 'PED-2023-0122',
    clienteId: 'cliente-2',
    clienteNombre: 'María García',
    clienteEmail: 'maria.garcia@email.com',
    estado: 'en_proceso',
    fecha: '2023-12-30T09:15:00Z',
    subtotal: 1890,
    iva: 396.90,
    gastosEnvio: 0,
    total: 2286.90,
    metodoPago: 'paypal',
    metodoEnvio: 'premium',
    direccion: 'Avenida Libertad 45, 08010 Barcelona'
  },
  {
    id: '3',
    numeroPedido: 'PED-2023-0121',
    clienteId: 'cliente-3',
    clienteNombre: 'Carlos López',
    clienteEmail: 'carlos.lopez@email.com',
    estado: 'enviado',
    fecha: '2023-12-29T16:45:00Z',
    subtotal: 599.99,
    iva: 125.90,
    gastosEnvio: 9.99,
    total: 735.88,
    metodoPago: 'transferencia',
    metodoEnvio: 'estandar',
    direccion: 'Calle San Juan 67, 41003 Sevilla'
  },
  {
    id: '4',
    numeroPedido: 'PED-2023-0120',
    clienteId: 'cliente-4',
    clienteNombre: 'Ana Martínez',
    clienteEmail: 'ana.martinez@email.com',
    estado: 'entregado',
    fecha: '2023-12-29T14:20:00Z',
    subtotal: 1254,
    iva: 263.34,
    gastosEnvio: 0,
    total: 1517.34,
    metodoPago: 'tarjeta',
    metodoEnvio: 'express',
    direccion: 'Paseo de la Reforma 23, 50007 Zaragoza'
  },
  {
    id: '5',
    numeroPedido: 'PED-2023-0119',
    clienteId: 'cliente-5',
    clienteNombre: 'Diego Fernández',
    clienteEmail: 'diego.fernandez@email.com',
    estado: 'cancelado',
    fecha: '2023-12-28T11:30:00Z',
    subtotal: 890,
    iva: 186.90,
    gastosEnvio: 9.99,
    total: 1086.89,
    metodoPago: 'tarjeta',
    metodoEnvio: 'estandar',
    direccion: 'Calle Principal 89, 28002 Madrid',
    motivoCancelacion: 'Cancelado por cliente - pago duplicado',
    fechaCancelacion: '2023-12-28T14:45:00Z'
  }
]

// GET /api/admin_pedidos - Listar pedidos para admin
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const estado = searchParams.get('estado') || ''
    const busqueda = searchParams.get('busqueda') || ''
    const fechaInicio = searchParams.get('fecha_inicio') || ''
    const fechaFin = searchParams.get('fecha_fin') || ''

    // Filtrar pedidos
    let pedidosFiltrados = pedidosAdminMock.filter(p => {
      if (estado && p.estado !== estado) return false
      if (busqueda && !p.numeroPedido.toLowerCase().includes(busqueda.toLowerCase()) && 
          !p.clienteNombre.toLowerCase().includes(busqueda.toLowerCase()) && 
          !p.clienteEmail.toLowerCase().includes(busqueda.toLowerCase())) {
        return false
      }
      if (fechaInicio && new Date(p.fecha) < new Date(fechaInicio)) return false
      if (fechaFin && new Date(p.fecha) > new Date(fechaFin)) return false
      return true
    })

    return NextResponse.json({
      success: true,
      data: {
        pedidos: pedidosFiltrados,
        totalPedidos: pedidosFiltrados.length
      }
    })
  } catch (error) {
    console.error('Error en GET /api/admin_pedidos:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener pedidos del admin'
      },
      { status: 500 }
    )
  }
}

// PUT /api/admin_pedidos/[id] - Actualizar estado de pedido (admin)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { estado, motivo } = body

    if (!estado) {
      return NextResponse.json(
        {
          success: false,
          error: 'El estado es requerido'
        },
        { status: 400 }
      )
    }

    const pedido = pedidosAdminMock.find(p => p.id === params.id)

    if (!pedido) {
      return NextResponse.json(
        {
          success: false,
          error: 'Pedido no encontrado'
        },
        { status: 404 }
      )
    }

    // Actualizar estado del pedido
    pedido.estado = estado
    pedido.fechaActualizacion = new Date().toISOString()
    
    if (estado === 'cancelado' && motivo) {
      pedido.motivoCancelacion = motivo
      pedido.fechaCancelacion = new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: {
        pedido,
        mensaje: 'Estado del pedido actualizado correctamente'
      }
    })
  } catch (error) {
    console.error('Error en PUT /api/admin_pedidos/[id]:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al actualizar estado del pedido'
      },
      { status: 500 }
    )
  }
}
