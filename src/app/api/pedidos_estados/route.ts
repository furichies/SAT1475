import { NextResponse } from 'next/server'

// Estados de pedido
const estados = [
  {
    value: 'pendiente',
    label: 'Pendiente',
    descripcion: 'Pedido creado y esperando pago',
    color: 'yellow'
  },
  {
    value: 'confirmado',
    label: 'Confirmado',
    descripcion: 'Pago confirmado, pendiente de preparación',
    color: 'blue'
  },
  {
    value: 'procesando',
    label: 'En Proceso',
    descripcion: 'Pedido en preparación',
    color: 'purple'
  },
  {
    value: 'enviado',
    label: 'Enviado',
    descripcion: 'Pedido enviado al transportista',
    color: 'green'
  },
  {
    value: 'entregado',
    label: 'Entregado',
    descripcion: 'Entregado al cliente',
    color: 'success'
  },
  {
    value: 'cancelado',
    label: 'Cancelado',
    descripcion: 'Pedido cancelado por el cliente',
    color: 'destructive'
  },
  {
    value: 'devuelto',
    label: 'Devuelto',
    descripcion: 'Producto devuelto por el cliente',
    color: 'orange'
  }
]

// GET /api/pedidos_estados - Listar estados
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        estados
      }
    })
  } catch (error) {
    console.error('Error en GET /api/pedidos_estados:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estados de pedido',
        datos: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}
