import { NextResponse } from 'next/server'

// Mock data para tickets y seguimientos
let ticketsMock = [
  {
    id: '1',
    numeroTicket: 'SAT-2023-0001',
    usuarioId: 'demo-user-1',
    tecnicoId: 'tecnico-1',
    tipo: 'incidencia',
    prioridad: 'alta',
    estado: 'en_progreso',
    asunto: 'Portátil Gaming Pro X15 no enciende',
    descripcion: 'El portátil no enciende.',
    diagnostico: 'Problema en la placa base.',
    solucion: null,
    fechaCierre: null,
    satisfaccion: null
  }
]

// Mock data para seguimientos
let seguimientosMock = [
  {
    id: '1',
    ticketId: '1',
    usuarioId: 'demo-user-1',
    tecnicoId: null,
    tipo: 'cambio_estado',
    contenido: 'Ticket creado. Estado: Abierto',
    esInterno: false,
    fechaCreacion: new Date('2023-12-28T10:30:00Z')
  },
  {
    id: '2',
    ticketId: '1',
    usuarioId: 'tecnico-1',
    tecnicoId: 'tecnico-1',
    tipo: 'asignacion',
    contenido: 'Tecnico asignado. Estado: Asignado',
    esInterno: true,
    fechaCreacion: new Date('2023-12-28T11:00:00Z')
  },
  {
    id: '3',
    ticketId: '1',
    usuarioId: 'tecnico-1',
    tecnicoId: 'tecnico-1',
    tipo: 'comentario',
    contenido: 'Diagnóstico: Problema en la placa base.',
    esInterno: true,
    fechaCreacion: new Date('2023-12-29T09:15:00Z')
  }
]

// GET /api/sat_detail - Obtener detalle de ticket
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const ticketId = searchParams.get('ticketId') || ''

    if (!ticketId) {
      return NextResponse.json(
        { success: false, error: 'ID de ticket requerido' },
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

    // Obtener seguimientos del ticket
    const seguimientos = seguimientosMock.filter(s => s.ticketId === ticketId)

    // Enrich con información del técnico
    const tecnicosMock = [
      { id: 'tecnico-1', nombre: 'Carlos', nivel: 'experto' }
    ]
    const tecnico = tecnicosMock.find(t => t.id === ticket.tecnicoId)

    return NextResponse.json({
      success: true,
      data: {
        ticket: {
          ...ticket,
          tecnico,
          estadoLabel: ticket.estado === 'en_progreso' ? 'En Progreso' :
            ticket.estado === 'resuelto' ? 'Resuelto' :
              ticket.estado
        },
        seguimientos,
        totalSeguimientos: seguimientos.length
      }
    })
  } catch (error) {
    console.error('Error en GET /api/sat_detail:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener detalle' },
      { status: 500 }
    )
  }
}

// POST /api/sat_detail - Añadir comentario
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { ticketId, mensaje } = body

    if (!ticketId) {
      return NextResponse.json(
        { success: false, error: 'ID de ticket requerido' },
        { status: 400 }
      )
    }

    if (!mensaje || mensaje.trim().length < 1) {
      return NextResponse.json(
        { success: false, error: 'El mensaje es requerido' },
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

    // Verificar que el ticket esté activo
    if (ticket.estado === 'resuelto' || ticket.estado === 'cerrado') {
      return NextResponse.json(
        { success: false, error: 'No se pueden añadir comentarios a tickets cerrados' },
        { status: 400 }
      )
    }

    // Crear nuevo seguimiento
    const nuevoSeguimiento = {
      id: `seg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ticketId,
      usuarioId: 'demo-user-1', // Mock: vendría de la sesión
      tecnicoId: null,
      tipo: 'comentario',
      contenido: mensaje,
      esInterno: false,
      fechaCreacion: new Date()
    }

    seguimientosMock.push(nuevoSeguimiento)

    return NextResponse.json({
      success: true,
      data: {
        seguimiento: nuevoSeguimiento,
        mensaje: 'Comentario añadido correctamente'
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/sat_detail:', error)
    return NextResponse.json(
      { success: false, error: 'Error al añadir comentario' },
      { status: 500 }
    )
  }
}
