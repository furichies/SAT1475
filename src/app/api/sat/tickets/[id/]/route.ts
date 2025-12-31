import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
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

        const ticket = await db.ticket.findUnique({
            where: {
                id: params.id
            },
            include: {
                tecnico: {
                    include: {
                        usuario: {
                            select: {
                                nombre: true,
                                email: true
                            }
                        }
                    }
                },
                seguimientos: {
                    orderBy: {
                        fechaCreacion: 'asc'
                    },
                    include: {
                        usuario: {
                            select: {
                                nombre: true
                            }
                        }
                    }
                }
            }
        })

        if (!ticket) {
            return NextResponse.json(
                { success: false, error: 'Ticket no encontrado' },
                { status: 404 }
            )
        }

        // Seguridad: El cliente solo puede ver sus propios tickets
        const isStaff = session.user.role === 'admin' || session.user.role === 'tecnico' || session.user.role === 'superadmin'
        if (!isStaff && ticket.usuarioId !== session.user.id) {
            return NextResponse.json(
                { success: false, error: 'No tienes permiso para ver este ticket' },
                { status: 403 }
            )
        }

        return NextResponse.json({
            success: true,
            ticket
        })
    } catch (error) {
        console.error('Error al obtener ticket:', error)
        return NextResponse.json(
            { success: false, error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

export async function PATCH(
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

        const isStaff = session.user.role === 'admin' || session.user.role === 'tecnico' || session.user.role === 'superadmin'
        if (!isStaff) {
            return NextResponse.json(
                { success: false, error: 'No tienes permiso para actualizar tickets' },
                { status: 403 }
            )
        }

        const body = await req.json()
        const { estado, prioridad, tecnicoId, descripcion, asunto, tecnicoNombreManual } = body

        // Nota: tecnicoNombreManual es para el mock de técnicos si no queremos complicar con IDs reales ahora
        // Pero lo ideal es usar tecnicoId

        const updatedTicket = await db.ticket.update({
            where: { id: params.id },
            data: {
                ...(estado && { estado }),
                ...(prioridad && { prioridad }),
                ...(descripcion && { descripcion }),
                ...(asunto && { asunto }),
                // En un sistema real, mapearíamos el técnico por su id de la tabla Tecnico
            }
        })

        return NextResponse.json({
            success: true,
            ticket: updatedTicket
        })
    } catch (error) {
        console.error('Error al actualizar ticket:', error)
        return NextResponse.json(
            { success: false, error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
