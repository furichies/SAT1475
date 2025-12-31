import { NextResponse } from 'next/server'

// Mock data para tickets
let ticketsMock = [
  {
    id: '3',
    numeroTicket: 'SAT-2023-0003',
    usuarioId: 'demo-user-1',
    tecnicoId: 'tecnico-2',
    tipo: 'garantia',
    prioridad: 'baja',
    estado: 'resuelto',
    asunto: 'Garantía del Monitor Curvo 32"',
    descripcion: 'El monitor tiene un píxel muerto.',
    diagnostico: 'Confirmado píxel muerto.',
    solucion: 'Monitor cambiado por nueva unidad.',
    fechaCierre: new Date('2023-12-26T16:30:00Z'),
    satisfaccion: 5,
    numeroSeguimientos: 8
  }
]

// PUT /api/sat_close - Cerrar ticket (solo si está resuelto)
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { ticketId, motivo } = body

    if (!ticketId) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID de ticket es requerido'
        },
        { status: 400 }
      )
    }

    const ticket = ticketsMock.find(t => t.id === ticketId)

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ticket no encontrado'
        },
        { status: 404 }
      )
    }

    // Verificar que el ticket esté resuelto
    if (ticket.estado !== 'resuelto') {
      return NextResponse.json(
        {
          success: false,
          error: 'Solo se pueden cerrar tickets resueltos'
        },
        { status: 400 }
      )
    }

    // Verificar que no esté cerrado ya
    if (ticket.estado === 'cerrado') {
      return NextResponse.json(
        {
          success: false,
          error: 'Este ticket ya está cerrado'
        },
        { status: 400 }
      )
    }

    // Cerrar ticket
    ticket.estado = 'cerrado'
    ticket.fechaCierre = new Date()
    
    // Guardar motivo si se proporcionó
    if (motivo) {
      ticket.descripcion += `\n\nMotivo de cierre: ${motivo}`
    }

    return NextResponse.json({
      success: true,
      data: {
        ticket,
        mensaje: 'Ticket cerrado correctamente'
      }
    })
  } catch (error) {
    console.error('Error en PUT /api/sat_close:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al cerrar ticket',
        datos: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}
