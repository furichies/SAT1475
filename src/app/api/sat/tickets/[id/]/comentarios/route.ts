import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, error: 'No autenticado' },
                { status: 401 }
            )
        }

        const body = await req.json()
        const { contenido } = body

        if (!contenido || !contenido.trim()) {
            return NextResponse.json(
                { success: false, error: 'El contenido es obligatorio' },
                { status: 400 }
            )
        }

        // Verificar acceso al ticket
        const ticket = await db.ticket.findUnique({
            where: { id: params.id }
        })

        if (!ticket) {
            return NextResponse.json(
                { success: false, error: 'Ticket no encontrado' },
                { status: 404 }
            )
        }

        const isStaff = session.user.role === 'admin' || session.user.role === 'tecnico' || session.user.role === 'superadmin'
        if (!isStaff && ticket.usuarioId !== session.user.id) {
            return NextResponse.json(
                { success: false, error: 'No tienes permiso para comentar en este ticket' },
                { status: 403 }
            )
        }

        // Crear el seguimiento
        const seguimiento = await db.seguimientoTicket.create({
            data: {
                ticketId: params.id,
                usuarioId: session.user.id,
                contenido,
                tipo: 'comentario'
            }
        })

        return NextResponse.json({
            success: true,
            seguimiento
        })
    } catch (error) {
        console.error('Error al crear comentario:', error)
        return NextResponse.json(
            { success: false, error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
