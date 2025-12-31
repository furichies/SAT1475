import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        const id = params.id

        if (!session || !session.user) {
            return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
        }

        const pedido = await db.pedido.findUnique({
            where: { id },
            include: {
                detalles: {
                    include: {
                        producto: true
                    }
                }
            }
        })

        if (!pedido) {
            return NextResponse.json({ success: false, error: 'Pedido no encontrado' }, { status: 404 })
        }

        // Seguridad: solo el dueño o un admin pueden verlo
        if (pedido.usuarioId !== session.user.id && session.user.role !== 'admin' && session.user.role !== 'superadmin') {
            return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 })
        }

        return NextResponse.json({
            success: true,
            data: {
                pedido
            }
        })
    } catch (error) {
        console.error('Error en GET /api/pedidos/[id]:', error)
        return NextResponse.json({ success: false, error: 'Error al obtener el detalle del pedido' }, { status: 500 })
    }
}
