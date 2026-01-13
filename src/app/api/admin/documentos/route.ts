import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DocumentoTipo, EstadoDocumento, DocumentoEntidadTipo } from '@/types/enums'
import { writeFile } from 'fs/promises'
import path from 'path'

// GET /api/admin/documentos - Listar documentos con filtros
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || (session.user.role !== 'admin' && session.user.role !== 'tecnico' && session.user.role !== 'superadmin')) {
            return NextResponse.json(
                { success: false, error: 'No autorizado' },
                { status: 401 }
            )
        }

        const searchParams = request.nextUrl.searchParams
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const tipo = searchParams.get('tipo')
        const estado = searchParams.get('estado')
        const busqueda = searchParams.get('busqueda')
        const ticketId = searchParams.get('ticketId')
        const pedidoId = searchParams.get('pedidoId')

        console.log('[API] GET /admin/documentos params:', { page, limit, tipo, estado, ticketId, pedidoId });

        const skip = (page - 1) * limit

        // Construir filtros
        const where: any = {}

        if (tipo && tipo !== 'todos') {
            where.tipo = tipo as DocumentoTipo
        }

        if (estado && estado !== 'todos') {
            where.estadoDocumento = estado as EstadoDocumento
        }

        if (ticketId) {
            where.ticketId = ticketId
        }

        if (pedidoId) {
            where.pedidoId = pedidoId
        }

        if (busqueda) {
            where.OR = [
                { numeroDocumento: { contains: busqueda } },
                { contenido: { contains: busqueda } },
                { metadatos: { contains: busqueda } },
                {
                    ticket: {
                        numeroTicket: { contains: busqueda }
                    }
                },
                {
                    pedido: {
                        numeroPedido: { contains: busqueda }
                    }
                },
                {
                    usuarioGenerador: {
                        nombre: { contains: busqueda }
                    }
                }
            ]
        }

        console.log('[API] GET /admin/documentos where:', JSON.stringify(where));

        // Obtener documentos
        const [documentos, total] = await Promise.all([
            prisma.documento.findMany({
                where,
                skip,
                take: limit,
                orderBy: { fechaGeneracion: 'desc' },
                include: {
                    usuarioGenerador: {
                        select: {
                            id: true,
                            nombre: true,
                            email: true,
                        },
                    },
                    ticket: {
                        select: {
                            id: true,
                            numeroTicket: true,
                            asunto: true,
                        },
                    },
                    pedido: {
                        select: {
                            id: true,
                            numeroPedido: true,
                        },
                    },
                    producto: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                    documentoRelacionado: true,
                    documentosHijos: true,
                },
            }),
            prisma.documento.count({ where }),
        ])

        console.log(`[API] Found ${documentos.length} documents (Total: ${total})`);

        return NextResponse.json({
            success: true,
            data: {
                documentos,
                total,
                pagina: page,
                porPagina: limit,
            },
        })
    } catch (error) {
        console.error('Error al obtener documentos:', error)
        return NextResponse.json(
            { success: false, error: 'Error al obtener documentos' },
            { status: 500 }
        )
    }
}

// POST /api/admin/documentos - Crear nuevo documento
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            tipo,
            entidadTipo,
            ticketId,
            pedidoId,
            productoId,
            metadatos,
            evidenciasFotos,
            estadoDocumento,
            documentoRelacionadoId,
        } = body

        // LOGGING DEPURACION A ARCHIVO
        try {
            const logData = `[${new Date().toISOString()}] POST /api/admin/documentos
Tipo: ${tipo}
TicketId Recibido: ${ticketId}
EntidadTipo: ${entidadTipo}
Metadatos: ${JSON.stringify(metadatos || {}).substring(0, 200)}...
--------------------------------------------------\n`
            await writeFile(path.join(process.cwd(), 'documentos-debug.log'), logData, { flag: 'a' })
        } catch (logErr) {
            console.error('Error escribiendo log:', logErr)
        }

        const session = await getServerSession(authOptions)

        if (!session || (session.user.role !== 'admin' && session.user.role !== 'tecnico' && session.user.role !== 'superadmin')) {
            return NextResponse.json(
                { success: false, error: 'No autorizado' },
                { status: 401 }
            )
        }

        // Validar que el usuario generador existe en la BD (Evitar error de FK si se reinició la BD)
        const usuarioGenerador = await prisma.usuario.findUnique({
            where: { id: session.user.id }
        })

        if (!usuarioGenerador) {
            return NextResponse.json(
                { success: false, error: 'Sesión inválida: El usuario no existe en la base de datos. Por favor cierre sesión e ingrese nuevamente.' },
                { status: 401 }
            )
        }

        // Generar número de documento único
        const prefijo = tipo.toUpperCase().substring(0, 3)
        const timestamp = Date.now()
        const numeroDocumento = `${prefijo}-${timestamp}`

        // Sanitizar IDs (convertir string vacío a null)
        let cleanTicketId = ticketId && ticketId.trim() !== '' ? ticketId.trim() : null
        const cleanPedidoId = pedidoId && pedidoId.trim() !== '' ? pedidoId.trim() : null
        const cleanProductoId = productoId && productoId.trim() !== '' ? productoId.trim() : null
        const cleanDocumentoRelacionadoId = documentoRelacionadoId && documentoRelacionadoId.trim() !== '' ? documentoRelacionadoId.trim() : null

        // LOGICA DE NEGOCIO: Si es ORDÉN DE SERVICIO y no hay Ticket, se crea TODO (Cliente, Producto, Ticket)
        // Usamos 'orden_servicio' en minúsculas porque así está definido en el Enum/Prisma
        if ((tipo === 'orden_servicio' || tipo === 'ORDEN_SERVICIO') && !cleanTicketId && metadatos) {
            try {
                console.log('--- AUTO-GENERANDO TICKET PARA ORDEN DE SERVICIO ---')
                const meta = metadatos as any // MetadatosOrdenServicio

                // 1. Buscar o Crear Usuario (Cliente)
                let cliente = await prisma.usuario.findFirst({
                    where: {
                        email: meta.cliente.correoElectronico
                    }
                })

                if (!cliente) {
                    // Crear usuario rápido
                    cliente = await prisma.usuario.create({
                        data: {
                            email: meta.cliente.correoElectronico,
                            nombre: meta.cliente.nombreCompleto.split(' ')[0],
                            apellidos: meta.cliente.nombreCompleto.split(' ').slice(1).join(' ') || '.',
                            rol: 'cliente',
                            passwordHash: '$2b$10$tempPasswordHashForAutoCreatedUser', // Password temporal
                            telefono: meta.cliente.telefono,
                            direccion: meta.cliente.direccion,
                            activo: true
                        }
                    })
                }

                // 2. Crear Producto (Equipo del cliente)
                // Generar SKU único temporal
                const sku = `REP-${Date.now().toString().slice(-6)}`

                const producto = await prisma.producto.create({
                    data: {
                        sku,
                        tipo: 'equipo_completo',
                        nombre: `${meta.equipo.tipoEquipo} ${meta.equipo.marca} ${meta.equipo.modelo}`,
                        descripcion: `IMEI/Serie: ${meta.equipo.imei || meta.equipo.numeroSerie || 'N/A'}. ${meta.equipo.caracteristicasFisicas || ''}`,
                        precio: 0,
                        stock: 0,
                        marca: meta.equipo.marca,
                        modelo: meta.equipo.modelo
                    }
                })

                // 3. Crear Ticket
                const numeroTicket = `TIC-${Date.now().toString().slice(-6)}`
                const ticket = await prisma.ticket.create({
                    data: {
                        numeroTicket,
                        usuarioId: cliente.id,
                        productoId: producto.id,
                        tipo: 'reparacion',
                        prioridad: 'media',
                        estado: 'abierto',
                        asunto: `Reparación: ${meta.equipo.tipoEquipo} ${meta.equipo.marca}`,
                        descripcion: `Problema reportado: ${meta.equipo.descripcionFalla || 'Sin descripción'}. \nAccesorios: ${meta.accesoriosIncluidos?.map((a: any) => a.descripcion).join(', ') || 'Ninguno'}`
                    }
                })

                // Asignar el ID del nuevo ticket
                cleanTicketId = ticket.id
            } catch (autoGenError) {
                console.error('Error autogenerando ticket:', autoGenError)
                // No detenemos el proceso, pero el documento quedará suelto
            }
        }

        const documento = await prisma.documento.create({
            data: {
                tipo,
                numeroDocumento,
                entidadTipo,
                ticketId: cleanTicketId,
                pedidoId: cleanPedidoId,
                productoId: cleanProductoId,
                usuarioGeneradorId: session.user.id,
                metadatos: metadatos ? JSON.stringify(metadatos) : null,
                evidenciasFotos: evidenciasFotos ? JSON.stringify(evidenciasFotos) : null,
                estadoDocumento: estadoDocumento || EstadoDocumento.BORRADOR,
                documentoRelacionadoId: cleanDocumentoRelacionadoId,
            },
            include: {
                usuarioGenerador: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                    },
                },
                ticket: {
                    select: {
                        id: true,
                        numeroTicket: true,
                        asunto: true,
                        usuario: {
                            select: {
                                id: true,
                                nombre: true,
                                email: true,
                                direccion: true,
                                telefono: true,
                                apellidos: true
                            }
                        }
                    },
                },
                pedido: {
                    select: {
                        id: true,
                        numeroPedido: true,
                    },
                },
                producto: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
            },
        })

        // LOGICA DE NEGOCIO ADICIONAL: Auto-generar FACTURA si es ALBARÁN DE ENTREGA
        if ((tipo === 'albaran_entrega' || tipo === DocumentoTipo.ALBARAN_ENTREGA) && metadatos) {
            try {
                console.log('--- AUTO-GENERANDO FACTURA DESDE ALBARAN ---')
                const metaAlbaran = metadatos as any // MetadatosAlbaranEntrega

                // Generar número de factura
                const numFactura = `FAC-${Date.now().toString().slice(-8)}`

                const total = metaAlbaran.pagoRecibido?.monto || 0
                const subtotal = total / 1.21
                const iva = total - subtotal

                const metadatosFactura = {
                    ticketId: cleanTicketId,
                    numeroTicket: metaAlbaran.numeroTicket,
                    cliente: {
                        nombre: metaAlbaran.clienteRecibe?.nombre ||
                            `${documento.ticket?.usuario?.nombre || 'Cliente'} ${documento.ticket?.usuario?.apellidos || ''}`.trim(),
                        identificacion: metaAlbaran.clienteRecibe?.identificacion || '',
                        email: documento.ticket?.usuario?.email || '',
                        direccion: documento.ticket?.usuario?.direccion || '',
                        telefono: documento.ticket?.usuario?.telefono || ''
                    },
                    equipo: {
                        tipo: metaAlbaran.equipoEntregado?.tipo || '',
                        marca: metaAlbaran.equipoEntregado?.marca || '',
                        modelo: metaAlbaran.equipoEntregado?.modelo || '',
                        numeroSerie: metaAlbaran.equipoEntregado?.numeroSerie || ''
                    },
                    items: [
                        {
                            descripcion: `Servicio Técnico Reparación: ${metaAlbaran.equipoEntregado?.tipo || 'Equipo'} ${metaAlbaran.equipoEntregado?.marca || ''} ${metaAlbaran.equipoEntregado?.modelo || ''} (Ticket: ${metaAlbaran.numeroTicket || 'N/A'}) - Según Albarán ${numeroDocumento}`,
                            cantidad: 1,
                            precioUnitario: subtotal,
                            subtotal: subtotal
                        }
                    ],
                    totales: {
                        subtotal: subtotal,
                        iva: iva,
                        total: total
                    },
                    pago: {
                        metodo: metaAlbaran.pagoRecibido?.metodo || 'tarjeta',
                        monto: total,
                        referencia: metaAlbaran.pagoRecibido?.referencia
                    },
                    fechaEmision: new Date()
                }

                await prisma.documento.create({
                    data: {
                        tipo: 'factura' as any, // DocumentoTipo.FACTURA
                        numeroDocumento: numFactura,
                        entidadTipo: entidadTipo || DocumentoEntidadTipo.TICKET,
                        ticketId: cleanTicketId,
                        pedidoId: cleanPedidoId,
                        usuarioGeneradorId: session.user.id,
                        metadatos: JSON.stringify(metadatosFactura),
                        estadoDocumento: EstadoDocumento.FIRMADO, // Las facturas suelen nacer firmadas/cerradas
                        documentoRelacionadoId: documento.id // Relacionamos la factura con el albarán
                    }
                })
                console.log('--- FACTURA GENERADA EXITOSAMENTE ---')
            } catch (facturaError) {
                console.error('Error auto-generando factura:', facturaError)
            }
        }

        return NextResponse.json({
            success: true,
            data: documento,
        })
    } catch (error) {
        console.error('Error al crear documento:', error)
        // Log error a archivo también
        try {
            await writeFile(path.join(process.cwd(), 'documentos-error.log'), `Error: ${error}\n`, { flag: 'a' })
        } catch { }

        return NextResponse.json(
            { success: false, error: 'Error al crear documento: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        )
    }
}
