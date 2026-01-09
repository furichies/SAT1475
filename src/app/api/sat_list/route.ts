import { NextResponse } from 'next/server'

// Mock data para tickets
let ticketsMock: any[] = [
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
    numeroSerie: null,
    diagnostico: 'Problema en la placa base.',
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
    numeroSerie: 'SN123456789',
    diagnostico: null,
    solucion: null,
    tiempoEstimado: 24,
    tiempoReal: null,
    costeReparacion: 49.99,
    fechaCreacion: new Date('2023-12-25T14:15:00Z'),
    fechaAsignacion: new Date('2023-12-25T15:00:00Z'),
    fechaResolucion: null,
    fechaCierre: null,
    satisfaccion: null,
    numeroSeguimientos: 2
  },
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
    pedidoId: '1',
    productoId: '5',
    numeroSerie: 'SN987654321',
    diagnostico: 'Píxel muerto confirmado.',
    solucion: 'Monitor cambiado por una nueva unidad.',
    tiempoEstimado: 72,
    tiempoReal: 48,
    costeReparacion: 0,
    fechaCreacion: new Date('2023-12-20T09:00:00Z'),
    fechaAsignacion: new Date('2023-12-20T10:00:00Z'),
    fechaResolucion: new Date('2023-12-26T16:00:00Z'),
    fechaCierre: new Date('2023-12-26T16:30:00Z'),
    satisfaccion: 5,
    numeroSeguimientos: 8
  }
]

const tecnicosMock = [
  {
    id: 'tecnico-1',
    nombre: 'Carlos',
    especialidades: ['Hardware', 'SSD', 'HDD'],
    nivel: 'experto',
    disponible: true,
    valoracionMedia: 4.8
  },
  {
    id: 'tecnico-2',
    nombre: 'Maria',
    especialidades: ['Monitores', 'Perifericos'],
    nivel: 'senior',
    disponible: true,
    valoracionMedia: 4.9
  }
]

// GET /api/sat_list - Listar tickets del usuario
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const estado = searchParams.get('estado') || ''
    const tipo = searchParams.get('tipo') || ''
    const prioridad = searchParams.get('prioridad') || ''
    const soloPendientes = searchParams.get('solo_pendientes') === 'true'

    // Mock: Obtener userId de la sesión
    const userId = 'demo-user-1'

    let ticketsFiltrados = ticketsMock.filter(t => t.usuarioId === userId)

    // Aplicar filtros
    if (estado) ticketsFiltrados = ticketsFiltrados.filter(t => t.estado === estado)
    if (tipo) ticketsFiltrados = ticketsFiltrados.filter(t => t.tipo === tipo)
    if (prioridad) ticketsFiltrados = ticketsFiltrados.filter(t => t.prioridad === prioridad)
    if (soloPendientes) {
      ticketsFiltrados = ticketsFiltrados.filter(t =>
        t.estado !== 'resuelto' && t.estado !== 'cancelado' && t.estado !== 'cerrado'
      )
    }

    // Enrich con información del técnico
    const ticketsConInfo = ticketsFiltrados.map(ticket => {
      const tecnico = tecnicosMock.find(t => t.id === ticket.tecnicoId)
      return {
        ...ticket,
        tecnico: tecnico ? {
          nombre: tecnico.nombre,
          especialidades: tecnico.especialidades,
          nivel: tecnico.nivel,
          valoracionMedia: tecnico.valoracionMedia
        } : null
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        tickets: ticketsConInfo,
        totalTickets: ticketsConInfo.length
      }
    })
  } catch (error) {
    console.error('Error en GET /api/sat_list:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener tickets' },
      { status: 500 }
    )
  }
}

// POST /api/sat_create - Crear nuevo ticket
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { tipo, prioridad, asunto, descripcion, pedidoId, productoId, numeroSerie } = body

    // Validaciones
    if (!tipo) {
      return NextResponse.json(
        { success: false, error: 'El tipo es requerido' },
        { status: 400 }
      )
    }
    if (!asunto || asunto.length < 5) {
      return NextResponse.json(
        { success: false, error: 'El asunto debe tener al menos 5 caracteres' },
        { status: 400 }
      )
    }
    if (!descripcion || descripcion.length < 10) {
      return NextResponse.json(
        { success: false, error: 'La descripción debe tener al menos 10 caracteres' },
        { status: 400 }
      )
    }

    // Generar número de ticket
    const numeroTicket = `SAT-${new Date().getFullYear()}-${(ticketsMock.length + 1).toString().padStart(4, '0')}`

    // Crear ticket mock
    const nuevoTicket = {
      id: `ticket-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      numeroTicket,
      usuarioId: 'demo-user-1',
      tecnicoId: null,
      tipo,
      prioridad,
      estado: 'abierto',
      asunto,
      descripcion,
      pedidoId: pedidoId || null,
      productoId: productoId || null,
      numeroSerie: numeroSerie || null,
      diagnostico: null,
      solucion: null,
      tiempoEstimado: prioridad === 'urgente' ? 4 : prioridad === 'alta' ? 24 : prioridad === 'media' ? 48 : 72,
      tiempoReal: null,
      costeReparacion: null,
      fechaCreacion: new Date(),
      fechaAsignacion: null,
      fechaResolucion: null,
      fechaCierre: null,
      satisfaccion: null,
      numeroSeguimientos: 1
    }

    ticketsMock.push(nuevoTicket)

    // Asignar automáticamente si es alta prioridad
    if (prioridad === 'alta' || prioridad === 'urgente') {
      const tecnicoDisponible = tecnicosMock.find(t => t.disponible)
      if (tecnicoDisponible) {
        (nuevoTicket as any).tecnicoId = tecnicoDisponible.id;
        (nuevoTicket as any).estado = 'asignado';
        (nuevoTicket as any).fechaAsignacion = new Date();
        (nuevoTicket as any).numeroSeguimientos = 2
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ticket: nuevoTicket,
        mensaje: 'Ticket creado correctamente'
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/sat_create:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear ticket' },
      { status: 500 }
    )
  }
}
