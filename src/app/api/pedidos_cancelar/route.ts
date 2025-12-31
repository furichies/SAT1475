import { NextResponse } from 'next/server'

// Mock data para pedidos
const pedidosMock = [
  {
    id: '1',
    numeroPedido: 'PED-2023-0001',
    estado: 'entregado',
    usuarioId: 'demo-user-1'
  },
  {
    id: '2',
    numeroPedido: 'PED-2023-0002',
    estado: 'pendiente',
    usuarioId: 'demo-user-1'
  }
]

// PUT /api/pedidos_cancelar/[id] - Cancelar pedido
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = await params
    const body = await req.json()
    const { motivo } = body

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID de pedido requerido'
        },
        { status: 400 }
      )
    }

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

    // Solo se pueden cancelar pedidos en estado pendiente o confirmado
    if (pedido.estado === 'enviado' || pedido.estado === 'entregado') {
      return NextResponse.json(
        {
          success: false,
          error: 'Solo se pueden cancelar pedidos pendientes o confirmados'
        },
        { status: 400 }
      )
    }

    // Mock: Cancelar pedido
    pedido.estado = 'cancelado'

    return NextResponse.json({
      success: true,
      data: {
        pedido,
        mensaje: 'Pedido cancelado correctamente'
      }
    })
  } catch (error) {
    console.error('Error en PUT /api/pedidos_cancelar/[id]:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al cancelar pedido',
        datos: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}
