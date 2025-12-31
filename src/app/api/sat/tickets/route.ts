import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Función para generar número de ticket único
function generarNumeroTicket(): string {
    const fecha = new Date()
    const año = fecha.getFullYear()
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const dia = String(fecha.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `TKT-${año}${mes}${dia}-${random}`
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, error: 'No autenticado' },
                { status: 401 }
            )
        }

        const body = await req.json()
        const {
            tipo,
            prioridad,
            asunto,
            descripcion,
            pedidoId,
            productoId,
            numeroSerie,
            adjuntos
        } = body

        // Validaciones básicas
        if (!tipo || !prioridad || !asunto || !descripcion) {
            return NextResponse.json(
                { success: false, error: 'Faltan campos obligatorios' },
                { status: 400 }
            )
        }

        // Generar número de ticket único
        let numeroTicket = generarNumeroTicket()

        // Verificar que sea único (aunque es muy improbable que se repita)
        let existente = await prisma.ticket.findUnique({
            where: { numeroTicket }
        })

        while (existente) {
            numeroTicket = generarNumeroTicket()
            existente = await prisma.ticket.findUnique({
                where: { numeroTicket }
            })
        }

        // Crear el ticket en la base de datos
        const ticket = await prisma.ticket.create({
            data: {
                numeroTicket,
                tipo,
                prioridad,
                asunto,
                descripcion,
                estado: 'abierto',
                usuarioId: session.user.id,
                pedidoId: pedidoId || null,
                productoId: productoId || null,
                numeroSerieProducto: numeroSerie || null,
                // Los adjuntos se manejarían con un sistema de archivos separado
                // Por ahora solo guardamos los nombres como referencia
            }
        })

        return NextResponse.json({
            success: true,
            ticket: {
                id: ticket.id,
                numeroTicket: ticket.numeroTicket,
                tipo: ticket.tipo,
                prioridad: ticket.prioridad,
                estado: ticket.estado,
                asunto: ticket.asunto
            }
        })
    } catch (error) {
        console.error('Error al crear ticket:', error)
        return NextResponse.json(
            { success: false, error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, error: 'No autenticado' },
                { status: 401 }
            )
        }

        // Obtener todos los tickets del usuario
        const tickets = await prisma.ticket.findMany({
            where: {
                usuarioId: session.user.id
            },
            orderBy: {
                fechaCreacion: 'desc'
            },
            include: {
                usuario: {
                    select: {
                        nombre: true,
                        email: true
                    }
                }
            }
        })

        return NextResponse.json({
            success: true,
            tickets
        })
    } catch (error) {
        console.error('Error al obtener tickets:', error)
        return NextResponse.json(
            { success: false, error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
