import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hash } from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin_tecnicos - Listar técnicos (admin)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const especialidad = searchParams.get('especialidad') || ''
    const nivel = searchParams.get('nivel') || ''
    const disponible = searchParams.get('disponible') || ''

    const tecnicos = await db.tecnico.findMany({
      include: {
        usuario: {
          select: {
            nombre: true,
            apellidos: true,
            email: true,
            telefono: true,
            ultimoAcceso: true,
            fechaRegistro: true
          }
        }
      }
    })

    // Mapear al formato esperado por el frontend
    let filteredTecnicos = tecnicos.map(t => ({
      id: t.id,
      nombre: t.usuario.nombre,
      apellidos: t.usuario.apellidos || '',
      email: t.usuario.email,
      telefono: t.usuario.telefono || '',
      especialidades: t.especialidades ? JSON.parse(t.especialidades) : [],
      nivel: t.nivel,
      disponible: t.disponible,
      ticketsAsignados: t.ticketsAsignados,
      ticketsResueltos: t.ticketsResueltos,
      valoracionMedia: t.valoracionMedia,
      ultimaConexion: t.usuario.ultimoAcceso ? new Date(t.usuario.ultimoAcceso).toLocaleString() : 'Nunca',
      fechaCreacion: new Date(t.fechaCreacion).toISOString().split('T')[0]
    }))

    // Aplicar filtros adicionales si es necesario (ya que Prisma no filtra JSON fácilmente)
    if (especialidad && especialidad !== 'todos') {
      filteredTecnicos = filteredTecnicos.filter(t => t.especialidades.includes(especialidad))
    }
    if (nivel && nivel !== 'todos') {
      filteredTecnicos = filteredTecnicos.filter(t => t.nivel === nivel)
    }
    if (disponible === 'si') {
      filteredTecnicos = filteredTecnicos.filter(t => t.disponible)
    } else if (disponible === 'no') {
      filteredTecnicos = filteredTecnicos.filter(t => !t.disponible)
    }

    return NextResponse.json({
      success: true,
      data: {
        tecnicos: filteredTecnicos,
        totalTecnicos: filteredTecnicos.length
      }
    })
  } catch (error) {
    console.error('Error en GET /api/admin_tecnicos:', error)
    return NextResponse.json({ success: false, error: 'Error al obtener técnicos' }, { status: 500 })
  }
}

// POST /api/admin_tecnicos - Crear técnico (admin)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'superadmin')) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { nombre, apellidos, email, telefono, especialidades, nivel, disponible } = body

    if (!nombre || !email) {
      return NextResponse.json({ success: false, error: 'Nombre y email son obligatorios' }, { status: 400 })
    }

    // Verificar si el usuario ya existe
    let usuario = await db.usuario.findUnique({ where: { email } })

    if (usuario) {
      // Si ya existe, nos aseguramos de que sea técnico o lo convertimos
      if (usuario.rol !== 'tecnico' && usuario.rol !== 'admin' && usuario.rol !== 'superadmin') {
        usuario = await db.usuario.update({
          where: { id: usuario.id },
          data: { rol: 'tecnico' }
        })
      }
    } else {
      // Crear nuevo usuario
      const passwordHash = await hash('MicroInfo2024!', 12) // Contraseña por defecto
      usuario = await db.usuario.create({
        data: {
          nombre,
          apellidos,
          email,
          telefono,
          passwordHash,
          rol: 'tecnico'
        }
      })
    }

    // Verificar si ya tiene registro de técnico
    const tecnicoExistente = await db.tecnico.findUnique({ where: { usuarioId: usuario.id } })

    if (tecnicoExistente) {
      return NextResponse.json({ success: false, error: 'Este usuario ya está registrado como técnico' }, { status: 400 })
    }

    // Crear el registro de técnico
    const nuevoTecnico = await db.tecnico.create({
      data: {
        usuarioId: usuario.id,
        especialidades: JSON.stringify(especialidades || []),
        nivel: nivel || 'junior',
        disponible: disponible !== undefined ? disponible : true,
      },
      include: {
        usuario: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        tecnico: {
          id: nuevoTecnico.id,
          nombre: nuevoTecnico.usuario.nombre,
          apellidos: nuevoTecnico.usuario.apellidos,
          email: nuevoTecnico.usuario.email
        },
        mensaje: 'Técnico creado correctamente'
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/admin_tecnicos:', error)
    return NextResponse.json({ success: false, error: 'Error al crear técnico' }, { status: 500 })
  }
}
