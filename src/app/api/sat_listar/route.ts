import { NextResponse } from 'next/server'
import { TicketTipo, TicketPrioridad, TicketEstado } from '@prisma/client'

// Mock data en memoria para tickets
let ticketsMock: any[] = [
  {
    id: '1',
    numeroTicket: 'SAT-2023-0001',
    usuarioId: 'demo-user-1',
    tecnicoId: 'tecnico-1',
    tipo: 'incidencia' as TicketTipo,
    prioridad: 'alta' as TicketPrioridad,
    estado: 'en_progreso' as TicketEstado,
    asunto: 'Portátil Gaming Pro X15 no enciende',
    descripcion: 'El portátil no enciende al presionar el botón. He probado diferentes cables.',
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
    tipo: 'reparacion' as TicketTipo,
    prioridad: 'media' as TicketPrioridad,
    estado: 'asignado' as TicketEstado,
    asunto: 'Instalación de SSD NVMe',
    descripcion: 'Necesito ayuda para instalar un SSD NVMe Samsung 980 Pro.',
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
  },
  {
    id: '3',
    numeroTicket: 'SAT-2023-0003',
    usuarioId: 'demo-user-1',
    tecnicoId: 'tecnico-2',
    tipo: 'garantia' as TicketTipo,
    prioridad: 'baja' as TicketPrioridad,
    estado: 'resuelto' as TicketEstado,
    asunto: 'Garantía del Monitor Curvo 32"',
    descripcion: 'El monitor tiene un píxel muerto en la esquina.',
    pedidoId: '1',
    productoId: '5',
    numeroSerieProducto: 'SN987654321',
    diagnostico: 'Confirmado píxel muerto. Garantía cubre el cambio.',
    solucion: 'Se ha procedido a cambiar el monitor por una nueva unidad.',
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

// GET /api/sat_listar - Listar tickets
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const estado = searchParams.get('estado') || ''
    const tipo = searchParams.get('tipo') || ''
    const prioridad = searchParams.get('prioridad') || ''
    const soloPendientes = searchParams.get('soloPendientes') === 'true'

    // En producción, se obtendría el userId de la sesión
    const userId = 'demo-user-1' // Mock

    let ticketsFiltrados = ticketsMock.filter(t => t.usuarioId === userId)

    // Aplicar filtros
    if (estado) {
      ticketsFiltrados = ticketsFiltrados.filter(t => t.estado === estado)
    }
    if (tipo) {
      ticketsFiltrados = ticketsFiltrados.filter(t => t.tipo === tipo)
    }
    if (prioridad) {
      ticketsFiltrados = ticketsFiltrados.filter(t => t.prioridad === prioridad)
    }
    if (soloPendientes) {
      ticketsFiltrados = ticketsFiltrados.filter(t =>
        t.estado !== 'resuelto' && t.estado !== 'cancelado'
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        tickets: ticketsFiltrados,
        totalTickets: ticketsFiltrados.length
      }
    })
  } catch (error) {
    console.error('Error en GET /api/sat_listar:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener tickets',
        datos: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

// POST /api/sat_crear - Crear ticket
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { tipo, prioridad, asunto, descripcion, pedidoId, productoId, numeroSerie } = body

    // Validaciones básicas
    if (!tipo) {
      return NextResponse.json(
        { success: false, error: 'El tipo es requerido' },
        { status: 400 }
      )
    }

    if (!prioridad) {
      return NextResponse.json(
        { success: false, error: 'La prioridad es requerida' },
        { status: 400 }
      )
    }

    if (!asunto || asunto.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'El asunto debe tener al menos 5 caracteres' },
        { status: 400 }
      )
    }

    if (!descripcion || descripcion.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'La descripción debe tener al menos 10 caracteres' },
        { status: 400 }
      )
    }

    // Validación condicional: número de serie
    if (['reparacion', 'garantia', 'devolucion'].includes(tipo) && !numeroSerie) {
      return NextResponse.json(
        { success: false, error: 'El número de serie es obligatorio para este tipo' },
        { status: 400 }
      )
    }

    // Generar número de ticket
    const contador = ticketsMock.length + 1
    const numeroTicket = `SAT-${new Date().getFullYear()}-${contador.toString().padStart(4, '0')}`

    // Crear ticket mock
    const nuevoTicket = {
      id: `ticket-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      numeroTicket,
      usuarioId: 'demo-user-1', // Mock: vendría de la sesión
      tecnicoId: null,
      tipo: tipo as TicketTipo,
      prioridad: prioridad as TicketPrioridad,
      estado: 'abierto' as TicketEstado,
      asunto,
      descripcion,
      pedidoId: pedidoId || null,
      productoId: productoId || null,
      numeroSerieProducto: numeroSerie || null,
      diagnostico: null,
      solucion: null,
      tiempoEstimado: null,
      tiempoReal: null,
      costeReparacion: null,
      fechaCreacion: new Date(),
      fechaAsignacion: null,
      fechaResolucion: null,
      fechaCierre: null,
      satisfaccion: null,
      numeroSeguimientos: 1
    }

    // Simular asignación automática para prioridad alta/urgente
    if (prioridad === 'alta' || prioridad === 'urgente') {
      (nuevoTicket as any).tecnicoId = 'tecnico-1'; // Mock: técnico disponible
      (nuevoTicket as any).estado = 'asignado' as TicketEstado;
      (nuevoTicket as any).fechaAsignacion = new Date();
      (nuevoTicket as any).numeroSeguimientos = 2
    }

    ticketsMock.push(nuevoTicket)

    return NextResponse.json({
      success: true,
      data: {
        ticket: nuevoTicket,
        mensaje: 'Ticket creado correctamente'
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/sat_crear:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear ticket',
        datos: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}
