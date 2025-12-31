import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

// Mock data para técnicos del admin
let tecnicosAdminMock = [
  {
    id: 'tecnico-1',
    nombre: 'Carlos',
    apellidos: 'García Fernández',
    email: 'carlos.garcia@microinfo.es',
    telefono: '655-123-456',
    especialidades: ['Hardware', 'Portátiles', 'SSD', 'HDD'],
    nivel: 'experto',
    nivelExperiencia: 10,
    disponible: true,
    ticketsAsignados: 3,
    ticketsResueltos: 45,
    valoracionMedia: 4.8,
    valoraciones: 23,
    ultimaConexion: '2023-12-30 09:00',
    fechaCreacion: '2020-01-15'
  },
  {
    id: 'tecnico-2',
    nombre: 'María',
    apellidos: 'Martínez Sánchez',
    email: 'maria.martinez@microinfo.es',
    telefono: '655-234-567',
    especialidades: ['Monitores', 'Periféricos', 'Audio'],
    nivel: 'senior',
    nivelExperiencia: 7,
    disponible: true,
    ticketsAsignados: 2,
    ticketsResueltos: 38,
    valoracionMedia: 4.9,
    valoraciones: 20,
    ultimaConexion: '2023-12-30 08:30',
    fechaCreacion: '2021-06-20'
  },
  {
    id: 'tecnico-3',
    nombre: 'Diego',
    apellidos: 'Fernández López',
    email: 'diego.fernandez@microinfo.es',
    telefono: '655-345-678',
    especialidades: ['CPU', 'GPU', 'RAM'],
    nivel: 'senior',
    nivelExperiencia: 5,
    disponible: false,
    ticketsAsignados: 5,
    ticketsResueltos: 52,
    valoracionMedia: 4.7,
    valoraciones: 18,
    ultimaConexion: '2023-12-29 16:45',
    fechaCreacion: '2022-03-10'
  },
  {
    id: 'tecnico-4',
    nombre: 'Ana',
    apellidos: 'Rodríguez González',
    email: 'ana.rodriguez@microinfo.es',
    telefono: '655-456-789',
    especialidades: ['Almacenamiento', 'RAM'],
    nivel: 'junior',
    nivelExperiencia: 2,
    disponible: true,
    ticketsAsignados: 1,
    ticketsResueltos: 12,
    valoracionMedia: 4.5,
    valoraciones: 10,
    ultimaConexion: '2023-12-30 10:00',
    fechaCreacion: '2023-09-01'
  }
]

// GET /api/admin_tecnicos - Listar técnicos (admin)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const especialidad = searchParams.get('especialidad') || ''
    const nivel = searchParams.get('nivel') || ''
    const disponible = searchParams.get('disponible') || ''

    let tecnicosFiltrados = tecnicosAdminMock.filter(t => {
      if (especialidad && !t.especialidades.includes(especialidad)) return false
      if (nivel && t.nivel !== nivel) return false
      if (disponible === 'si' && !t.disponible) return false
      if (disponible === 'no' && t.disponible) return false
      return true
    })

    return NextResponse.json({
      success: true,
      data: {
        tecnicos: tecnicosFiltrados,
        totalTecnicos: tecnicosFiltrados.length
      }
    })
  } catch (error) {
    console.error('Error en GET /api/admin_tecnicos:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener técnicos del admin'
      },
      { status: 500 }
    )
  }
}

// POST /api/admin_tecnicos - Crear técnico (admin)
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, apellidos, email, telefono, especialidades, nivel, nivelExperiencia, disponible, recibirNotificaciones } = body

    // Validaciones básicas
    if (!nombre || nombre.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: 'El nombre debe tener al menos 2 caracteres'
        },
        { status: 400 }
      )
    }

    if (!apellidos || apellidos.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: 'Los apellidos deben tener al menos 2 caracteres'
        },
        { status: 400 }
      )
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        {
          success: false,
          error: 'El email es inválido'
        },
        { status: 400 }
      )
    }

    if (!telefono || telefono.length < 9) {
      return NextResponse.json(
        {
          success: false,
          error: 'El teléfono debe tener al menos 9 caracteres'
        },
        { status: 400 }
      )
    }

    if (!especialidades || especialidades.length < 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Al menos una especialidad es requerida'
        },
        { status: 400 }
      )
    }

    if (!nivel || !['junior', 'senior', 'experto'].includes(nivel)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nivel inválido'
        },
        { status: 400 }
      )
    }

    if (!nivelExperiencia || nivelExperiencia < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Los años de experiencia deben ser un número positivo'
        },
        { status: 400 }
      )
    }

    // Crear nuevo técnico mock
    const nuevoTecnico = {
      id: 'tecnico-' + randomUUID(),
      nombre,
      apellidos,
      email,
      telefono,
      especialidades: especialidades || [],
      nivel,
      nivelExperiencia: Number(nivelExperiencia),
      disponible: Boolean(disponible),
      recibirNotificaciones: Boolean(recibirNotificaciones),
      ticketsAsignados: 0,
      ticketsResueltos: 0,
      valoracionMedia: 0,
      valoraciones: 0,
      ultimaConexion: new Date().toISOString(),
      fechaCreacion: new Date().toISOString()
    }

    tecnicosAdminMock.push(nuevoTecnico)

    return NextResponse.json({
      success: true,
      data: {
        tecnico: nuevoTecnico,
        mensaje: 'Técnico creado correctamente'
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/admin_tecnicos:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear técnico'
      },
      { status: 500 }
    )
  }
}
