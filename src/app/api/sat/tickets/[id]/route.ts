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

        const { id } = params
        const ticket = await db.ticket.findUnique({
            where: { id },
            include: {
                usuario: { select: { nombre: true, email: true } },
                tecnico: { include: { usuario: { select: { nombre: true, email: true } } } },
                seguimientos: {
                    orderBy: { fechaCreacion: 'asc' },
                    include: { usuario: { select: { nombre: true } } }
                }
            }
        })

        if (!ticket) {
            return NextResponse.json({ success: false, error: 'Ticket no encontrado' }, { status: 404 })
        }

        const isStaff = session.user.role === 'admin' || session.user.role === 'tecnico' || session.user.role === 'superadmin'
        if (!isStaff && ticket.usuarioId !== session.user.id) {
            return NextResponse.json({ success: false, error: 'No tienes permiso para ver este ticket' }, { status: 403 })
        }

        return NextResponse.json({ success: true, ticket })
    } catch (error) {
        console.error('Error al obtener ticket:', error)
        return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 })
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: 'No autenticado' }, { status: 401 })
        }

        const isStaff = session.user.role === 'admin' || session.user.role === 'tecnico' || session.user.role === 'superadmin'
        if (!isStaff) {
            return NextResponse.json({ success: false, error: 'Privilegios insuficientes' }, { status: 403 })
        }

        const body = await req.json()
        const { estado, prioridad, tecnico, tipo, descripcion, asunto } = body
        const { id } = params

        let tecnicoId: string | null | undefined = undefined
        if (tecnico === 'Sin asignar') {
            tecnicoId = null
        } else if (tecnico) {
            const tech = await db.tecnico.findFirst({
                where: { usuario: { nombre: { contains: tecnico } } }
            })
            if (tech) tecnicoId = tech.id
        }

        const updated = await db.ticket.update({
            where: { id },
            data: {
                ...(estado && { estado }),
                ...(prioridad && { prioridad }),
                ...(tipo && { tipo }),
                ...(descripcion !== undefined && { descripcion }),
                ...(asunto && { asunto }),
                ...(tecnicoId !== undefined && { tecnicoId }),
                ...(tecnicoId ? { fechaAsignacion: new Date() } : {})
            }
        })

        return NextResponse.json({ success: true, ticket: updated })
    } catch (error) {
        console.error('Error al actualizar ticket:', error)
        return NextResponse.json({ success: false, error: 'Error al actualizar' }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: 'No autenticado' }, { status: 401 })
        }

        const isStaff = session.user.role === 'admin' || session.user.role === 'tecnico' || session.user.role === 'superadmin'
        if (!isStaff) {
            return NextResponse.json({ success: false, error: 'Privilegios insuficientes' }, { status: 403 })
        }

        const { id } = params
        await db.ticket.delete({
            where: { id }
        })

        return NextResponse.json({ success: true, message: 'Ticket eliminado correctamente' })
    } catch (error) {
        console.error('Error al eliminar ticket:', error)
        return NextResponse.json({ success: false, error: 'Error al eliminar' }, { status: 500 })
    }
}
