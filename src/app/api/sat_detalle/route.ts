import { NextResponse } from 'next/server'

// Mock data para tickets
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
    descripcion: 'El portátil no enciende al presionar el botón.',
    pedidoId: null,
    productoId: '1',
    numeroSerieProducto: null,
    diagnostico: 'Se ha determinado que el problema está en la placa base.',
    solucion: null,
    tiempoEstimado: 48,
    tiempoReal: 24,
    costeReparacion: null,
    fechaCreacion: new Date('2023-12-28T10:30:00Z'),
    fechaAsignacion: new Date('2023-12-28T11:00:00Z'),
    fechaResolucion: null,
    fechaCierre: null,
    satisfaccion: null,
    numeroSeguimientos: 3
  },
  {
    id: '2',
    numeroTicket: 'SAT-2023-0002',
    usuarioId: 'demo-user-1',
    tecnicoId: 'tecnico-1',
    tipo: 'reparacion',
    prioridad: 'media',
    estado: 'asignado',
    asunto: 'Instalación de SSD NVMe',
    descripcion: 'Necesito ayuda para instalar un SSD.',
    pedidoId: '1',
    productoId: '1',
    numeroSerieProducto: 'SN123456789',
    diagnostico: null,
    solucion: null,
    tiempoEstimado: 24,
    tiempoReal: null,
    costeReparacion: null,
    fechaCreacion: new Date('2023-12-25T14:15:00Z'),
    fechaAsignacion: new Date('2023-12-25T15:00:00Z'),
    fechaResolucion: null,
    fechaCierre: null,
    satisfaccion: null,
    numeroSeguimientos: 2
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
    contenido: 'Ticket creado por el usuario. Estado: Abierto',
    esInterno: false,
    adjuntos: [],
    fechaCreacion: new Date('2023-12-28T10:30:00Z')
  },
  {
    id: '2',
    ticketId: '1',
    usuarioId: 'tecnico-1',
    tecnicoId: 'tecnico-1',
    tipo: 'asignacion',
    contenido: 'Técnico asignado al ticket. Estado: Asignado',
    esInterno: true,
    adjuntos: [],
    fechaCreacion: new Date('2023-12-28T11:00:00Z')
  },
  {
    id: '3',
    ticketId: '1',
    usuarioId: 'tecnico-1',
    tecnicoId: 'tecnico-1',
    tipo: 'comentario',
    contenido: 'Diagnóstico: Se ha determinado que el problema está en la placa base. Se requiere sustitución.',
    esInterno: true,
    adjuntos: [],
    fechaCreacion: new Date('2023-12-29T09:15:00Z')
  },
  {
    id: '4',
    ticketId: '2',
    usuarioId: 'demo-user-1',
    tecnicoId: null,
    tipo: 'cambio_estado',
    contenido: 'Ticket creado. Estado: Abierto',
    esInterno: false,
    adjuntos: [],
    fechaCreacion: new Date('2023-12-25T14:15:00Z')
  },
  {
    id: '5',
    ticketId: '2',
    usuarioId: 'tecnico-1',
    tecnicoId: 'tecnico-1',
    tipo: 'asignacion',
    contenido: 'Técnico asignado. Estado: Asignado',
    esInterno: true,
    adjuntos: [],
    fechaCreacion: new Date('2023-12-25T15:00:00Z')
  }
]

// Mock data para técnicos
const tecnicosMock = [
  {
    id: 'tecnico-1',
    usuarioId: 'user-tecnico-1',
    especialidades: ['Hardware', 'Portátiles', 'SSD', 'HDD'],
    nivel: 'experto',
    disponible: true,
    ticketsAsignados: 3,
    ticketsResueltos: 45,
    valoracionMedia: 4.8
  },
  {
    id: 'tecnico-2',
    usuarioId: 'user-tecnico-2',
    especialidades: ['Monitores', 'Periféricos', 'Audio'],
    nivel: 'senior',
    disponible: true,
    ticketsAsignados: 2,
    ticketsResueltos: 38,
    valoracionMedia: 4.9
  }
]

// GET /api/sat_detalle - Obtener detalle de ticket con seguimientos
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const ticketId = searchParams.get('ticketId') || ''

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

    // Obtener seguimientos del ticket
    const seguimientos = seguimientosMock.filter(s => s.ticketId === ticketId)

    // Obtener información del técnico
    const tecnico = tecnicosMock.find(t => t.id === ticket.tecnicoId) || null

    return NextResponse.json({
      success: true,
      data: {
        ticket: {
          ...ticket,
          tecnico,
          estadoLabel: ticket.estado === 'en_progreso' ? 'En Progreso' : 
                       ticket.estado === 'resuelto' ? 'Resuelto' :
                       ticket.estado === 'cerrado' ? 'Cerrado' :
                       ticket.estado === 'abierto' ? 'Abierto' :
                       ticket.estado === 'asignado' ? 'Asignado' :
                       ticket.estado
        },
        seguimientos: seguimientos,
        totalSeguimientos: seguimientos.length
      }
    })
  } catch (error) {
    console.error('Error en GET /api/sat_detalle:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener detalle del ticket',
        datos: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

// POST /api/sat_detalle - Añadir comentario a ticket
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { ticketId, mensaje, esInterno = false } = body

    if (!ticketId) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID de ticket es requerido'
        },
        { status: 400 }
      )
    }

    if (!mensaje || mensaje.trim().length < 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'El mensaje es requerido'
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

    // Verificar si el ticket está activo
    if (ticket.estado === 'resuelto' || ticket.estado === 'cancelado' || ticket.estado === 'cerrado') {
      return NextResponse.json(
        {
          success: false,
          error: 'No se pueden añadir comentarios a un ticket cerrado o resuelto'
        },
        { status: 400 }
      )
    }

    // Crear nuevo seguimiento
    const nuevoSeguimiento = {
      id: `seg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ticketId,
      usuarioId: 'demo-user-1', // Mock: vendría de la sesión
      tecnicoId: null, // Mock: comentarios de usuario no tienen técnico
      tipo: esInterno ? 'nota_interna' : 'comentario',
      contenido: mensaje,
      esInterno,
      adjuntos: [],
      fechaCreacion: new Date()
    }

    seguimientosMock.push(nuevoSeguimiento)
    ticket.numeroSeguimientos = seguimientosMock.filter(s => s.ticketId === ticketId).length

    return NextResponse.json({
      success: true,
      data: {
        seguimiento: nuevoSeguimiento,
        mensaje: 'Comentario añadido correctamente'
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/sat_detalle:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al añadir comentario',
        datos: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}
