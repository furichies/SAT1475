import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { DocumentoTipo, DocumentoEntidadTipo } from '@prisma/client'

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

        const formData = await req.formData()
        const tipo: any = formData.get('tipo')
        const prioridad: any = formData.get('prioridad')
        const asunto: any = formData.get('asunto')
        const descripcion: any = formData.get('descripcion')
        const pedidoId: any = formData.get('pedidoId')
        const productoId: any = formData.get('productoId')
        const numeroSerie: any = formData.get('numeroSerie')
        const files = formData.getAll('adjuntos') as File[]

        // Validaciones básicas
        if (!tipo || !prioridad || !asunto || !descripcion) {
            return NextResponse.json(
                { success: false, error: 'Faltan campos obligatorios' },
                { status: 400 }
            )
        }

        // Generar número de ticket único
        let numeroTicket = generarNumeroTicket()
        let existente = await db.ticket.findUnique({
            where: { numeroTicket }
        })

        while (existente) {
            numeroTicket = generarNumeroTicket()
            existente = await db.ticket.findUnique({
                where: { numeroTicket }
            })
        }

        // Resolver pedidoId (ID o NumeroPedido)
        let resolvedPedidoId: string | null = null
        if (pedidoId) {
            const pedido = await db.pedido.findFirst({
                where: {
                    OR: [
                        { id: pedidoId },
                        { numeroPedido: pedidoId }
                    ]
                }
            })

            if (!pedido) {
                return NextResponse.json(
                    { success: false, error: 'El número de pedido indicado no existe' },
                    { status: 400 }
                )
            }
            resolvedPedidoId = pedido.id
        }

        // Crear el ticket en la base de datos
        const ticket = await db.ticket.create({
            data: {
                numeroTicket,
                tipo,
                prioridad,
                asunto,
                descripcion,
                estado: 'abierto',
                usuarioId: session.user.id,
                pedidoId: resolvedPedidoId,
                productoId: productoId || null,
                numeroSerieProducto: numeroSerie || null,
            }
        })

        // Procesar Archivos
        if (files && files.length > 0) {
            // Save to root 'uploads' folder for persistence and API serving
            const uploadDir = path.join(process.cwd(), 'uploads', 'tickets')
            await mkdir(uploadDir, { recursive: true })

            for (const file of files) {
                if (file.size > 0 && file.name !== 'undefined') {
                    const bytes = await file.arrayBuffer()
                    const buffer = Buffer.from(bytes)
                    const fileName = `${ticket.numeroTicket}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
                    const filePath = path.join(uploadDir, fileName)

                    await writeFile(filePath, buffer)

                    // Crear registro Documento
                    await db.documento.create({
                        data: {
                            tipo: DocumentoTipo.informe_reparacion, // General type used for ticket docs
                            numeroDocumento: fileName,
                            entidadTipo: DocumentoEntidadTipo.ticket,
                            ticketId: ticket.id,
                            usuarioGeneradorId: session.user.id,
                            contenido: `Adjunto: ${file.name}`,
                            rutaArchivo: `/api/uploads/tickets/${fileName}` // Serve via API
                        }
                    })
                }
            }
        }

        return NextResponse.json({
            success: true,
            ticket: {
                id: ticket.id,
                numeroTicket: ticket.numeroTicket
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

        const isStaff = session.user.role === 'admin' || session.user.role === 'tecnico' || session.user.role === 'superadmin'

        // Obtener todos los tickets (o solo los del usuario si no es staff)
        const tickets = await db.ticket.findMany({
            where: isStaff ? {} : {
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
                },
                tecnico: {
                    include: {
                        usuario: {
                            select: {
                                nombre: true
                            }
                        }
                    }
                },
                documentos: true, // Incluir documentos adjuntos
                _count: {
                    select: {
                        seguimientos: true
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
