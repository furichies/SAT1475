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
    tiempoEstimado: 72,
    tiempoReal: 48,
    costeReparacion: 0,
    fechaCierre: new Date('2023-12-26T16:30:00Z'),
    satisfaccion: null,
    fechaCreacion: new Date('2023-12-24T10:00:00Z')
  }
]

// PUT /api/sat_rating - Valorar ticket
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { ticketId, puntuacion } = body

    if (!ticketId) {
      return NextResponse.json(
        { success: false, error: 'ID de ticket requerido' },
        { status: 400 }
      )
    }

    if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
      return NextResponse.json(
        { success: false, error: 'La puntuación debe estar entre 1 y 5' },
        { status: 400 }
      )
    }

    const ticket = ticketsMock.find(t => t.id === ticketId)

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que el ticket esté resuelto o cerrado
    if (ticket.estado !== 'resuelto' && ticket.estado !== 'cerrado') {
      return NextResponse.json(
        { success: false, error: 'Solo se pueden valorar tickets resueltos o cerrados' },
        { status: 400 }
      )
    }

    // Verificar que no haya sido valorado ya
    if (ticket.satisfaccion) {
      return NextResponse.json(
        { success: false, error: 'Este ticket ya ha sido valorado' },
        { status: 400 }
      )
    }

    // Actualizar ticket
    ticket.satisfaccion = puntuacion
    ticket.estado = 'cerrado'

    // Calcular tiempo real si no estaba establecido
    if (!ticket.tiempoReal) {
      const tiempoReal = Math.round((Date.now() - new Date(ticket.fechaCreacion).getTime()) / (1000 * 60 * 60 * 24))
      ticket.tiempoReal = tiempoReal
    }

    return NextResponse.json({
      success: true,
      data: {
        ticket,
        mensaje: 'Valoración registrada correctamente'
      }
    })
  } catch (error) {
    console.error('Error en PUT /api/sat_rating:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al valorar ticket',
        datos: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}


