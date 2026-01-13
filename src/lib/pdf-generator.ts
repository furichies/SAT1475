import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { DocumentoTipo, EstadoDocumento } from '@/types/enums'
import type {
    MetadatosOrdenServicio,
    MetadatosDiagnosticoPresupuesto,
    MetadatosAceptacionPresupuesto,
    MetadatosRechazoPresupuesto,
    MetadatosExtensionPresupuesto,
    MetadatosAlbaranEntrega,
    MetadatosFactura,
} from '@/types/documentos'

// Configuración de la empresa
const EMPRESA = {
    nombre: 'MicroInfo',
    direccion: 'Calle Principal, 123',
    ciudad: 'Ciudad, CP 12345',
    telefono: '+34 123 456 789',
    email: 'info@microinfo.es',
    web: 'www.microinfo.es',
}

// Colores corporativos
const COLORS = {
    primary: '#4f46e5', // Indigo
    secondary: '#64748b', // Slate
    success: '#10b981', // Green
    danger: '#ef4444', // Red
    warning: '#f59e0b', // Amber
    text: '#1f2937', // Gray-800
    textLight: '#6b7280', // Gray-500
}

/**
 * Función principal para generar PDF de un documento
 */
export async function generarPDFDocumento(documento: any): Promise<Buffer> {
    const doc = new jsPDF()

    // Parsear metadatos si existen
    let metadatos = null
    if (documento.metadatos) {
        try {
            metadatos = JSON.parse(documento.metadatos)
        } catch (e) {
            console.error('Error al parsear metadatos:', e)
        }
    }

    // Generar PDF según el tipo de documento
    switch (documento.tipo) {
        case DocumentoTipo.ORDEN_SERVICIO:
            generarOrdenServicio(doc, documento, metadatos)
            break
        case DocumentoTipo.DIAGNOSTICO_PRESUPUESTO:
            generarDiagnosticoPresupuesto(doc, documento, metadatos)
            break
        case DocumentoTipo.ACEPTACION_PRESUPUESTO:
            generarAceptacionPresupuesto(doc, documento, metadatos)
            break
        case DocumentoTipo.RECHAZO_PRESUPUESTO:
            generarRechazoPresupuesto(doc, documento, metadatos)
            break
        case DocumentoTipo.EXTENSION_PRESUPUESTO:
            generarExtensionPresupuesto(doc, documento, metadatos)
            break
        case DocumentoTipo.ALBARAN_ENTREGA:
            generarAlbaranEntrega(doc, documento, metadatos)
            break
        case DocumentoTipo.FACTURA:
            generarFactura(doc, documento, metadatos)
            break
        default:
            generarDocumentoGenerico(doc, documento)
    }

    // Convertir a buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
    return pdfBuffer
}

/**
 * Agregar encabezado de la empresa
 */
function agregarEncabezado(doc: jsPDF, titulo: string, numeroDocumento: string) {
    const pageWidth = doc.internal.pageSize.getWidth()

    // Logo/Nombre de la empresa
    doc.setFontSize(20)
    doc.setTextColor(COLORS.primary)
    doc.setFont('helvetica', 'bold')
    doc.text(EMPRESA.nombre, 20, 20)

    // Información de contacto
    doc.setFontSize(9)
    doc.setTextColor(COLORS.textLight)
    doc.setFont('helvetica', 'normal')
    doc.text(EMPRESA.direccion, 20, 27)
    doc.text(`${EMPRESA.ciudad} | Tel: ${EMPRESA.telefono}`, 20, 32)
    doc.text(`${EMPRESA.email} | ${EMPRESA.web}`, 20, 37)

    // Título del documento
    doc.setFontSize(16)
    doc.setTextColor(COLORS.text)
    doc.setFont('helvetica', 'bold')
    const tituloWidth = doc.getTextWidth(titulo)
    doc.text(titulo, pageWidth - 20 - tituloWidth, 20)

    // Número de documento
    doc.setFontSize(10)
    doc.setTextColor(COLORS.textLight)
    doc.setFont('helvetica', 'normal')
    const numeroWidth = doc.getTextWidth(numeroDocumento)
    doc.text(numeroDocumento, pageWidth - 20 - numeroWidth, 27)

    // Línea separadora
    doc.setDrawColor(COLORS.primary)
    doc.setLineWidth(0.5)
    doc.line(20, 42, pageWidth - 20, 42)

    return 50 // Posición Y después del encabezado
}

/**
 * Agregar pie de página
 */
function agregarPiePagina(doc: jsPDF, numeroPagina: number = 1) {
    const pageHeight = doc.internal.pageSize.getHeight()
    const pageWidth = doc.internal.pageSize.getWidth()

    doc.setFontSize(8)
    doc.setTextColor(COLORS.textLight)
    doc.setFont('helvetica', 'italic')

    const texto = `Página ${numeroPagina} | Documento generado el ${new Date().toLocaleDateString('es-ES')}`
    const textoWidth = doc.getTextWidth(texto)
    doc.text(texto, (pageWidth - textoWidth) / 2, pageHeight - 10)
}

/**
 * Generar Orden de Servicio (FASE 1)
 */
function generarOrdenServicio(doc: jsPDF, documento: any, metadatos: MetadatosOrdenServicio | null) {
    let yPos = agregarEncabezado(doc, 'ORDEN DE SERVICIO', documento.numeroDocumento)

    // Fecha de recepción
    yPos += 5
    doc.setFontSize(10)
    doc.setTextColor(COLORS.text)
    doc.text(`Fecha de Recepción: ${new Date(documento.fechaGeneracion).toLocaleDateString('es-ES')}`, 20, yPos)

    if (!metadatos) {
        doc.text('No hay metadatos disponibles', 20, yPos + 10)
        agregarPiePagina(doc)
        return
    }

    // DATOS DEL CLIENTE
    yPos += 10
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(COLORS.primary)
    doc.text('DATOS DEL CLIENTE', 20, yPos)

    yPos += 7
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(COLORS.text)

    const datosCliente = [
        ['Nombre Completo:', metadatos.cliente.nombreCompleto],
        ['Identificación:', metadatos.cliente.identificacion],
        ['Teléfono:', metadatos.cliente.telefono],
        ['Email:', metadatos.cliente.correoElectronico],
        ['Dirección:', metadatos.cliente.direccion],
    ]

    datosCliente.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold')
        doc.text(label, 20, yPos)
        doc.setFont('helvetica', 'normal')
        doc.text(value, 70, yPos)
        yPos += 6
    })

    // DATOS DEL EQUIPO
    yPos += 5
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(COLORS.primary)
    doc.text('DATOS DEL EQUIPO', 20, yPos)

    yPos += 7
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(COLORS.text)

    const datosEquipo = [
        ['Tipo de Equipo:', metadatos.equipo.tipoEquipo],
        ['Marca:', metadatos.equipo.marca],
        ['Modelo:', metadatos.equipo.modelo],
        ['Número de Serie:', metadatos.equipo.numeroSerie || 'N/A'],
        ['IMEI:', metadatos.equipo.imei || 'N/A'],
        ['Color:', metadatos.equipo.color || 'N/A'],
    ]

    datosEquipo.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold')
        doc.text(label, 20, yPos)
        doc.setFont('helvetica', 'normal')
        doc.text(value, 70, yPos)
        yPos += 6
    })

    // Accesorios entregados
    if (metadatos.equipo.accesoriosEntregados && metadatos.equipo.accesoriosEntregados.length > 0) {
        yPos += 2
        doc.setFont('helvetica', 'bold')
        doc.text('Accesorios Entregados:', 20, yPos)
        yPos += 6
        doc.setFont('helvetica', 'normal')
        metadatos.equipo.accesoriosEntregados.forEach(accesorio => {
            doc.text(`• ${accesorio}`, 25, yPos)
            yPos += 5
        })
    }

    // DESCRIPCIÓN DEL PROBLEMA
    yPos += 5
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(COLORS.primary)
    doc.text('DESCRIPCIÓN DEL PROBLEMA', 20, yPos)

    yPos += 7
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(COLORS.text)

    doc.text('Síntomas Reportados:', 20, yPos)
    yPos += 6
    const sintomasLines = doc.splitTextToSize(metadatos.problema.sintomasReportados, 170)
    doc.text(sintomasLines, 20, yPos)
    yPos += sintomasLines.length * 5

    if (metadatos.problema.frecuenciaFallo) {
        yPos += 3
        doc.text(`Frecuencia del Fallo: ${metadatos.problema.frecuenciaFallo}`, 20, yPos)
        yPos += 6
    }

    // ESTADO FÍSICO
    yPos += 5
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(COLORS.primary)
    doc.text('ESTADO FÍSICO AL INGRESO', 20, yPos)

    yPos += 7
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(COLORS.text)

    const estadoFisico = [
        ['Golpes:', metadatos.estadoFisico.golpes ? 'Sí' : 'No'],
        ['Rayones:', metadatos.estadoFisico.rayones ? 'Sí' : 'No'],
        ['Estado de Pantalla:', metadatos.estadoFisico.estadoPantalla || 'Normal'],
        ['Funcionalidad de Botones:', metadatos.estadoFisico.funcionalidadBotones || 'Normal'],
    ]

    estadoFisico.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold')
        doc.text(label, 20, yPos)
        doc.setFont('helvetica', 'normal')
        doc.text(value, 70, yPos)
        yPos += 6
    })

    if (metadatos.estadoFisico.danosVisibles) {
        yPos += 2
        doc.setFont('helvetica', 'bold')
        doc.text('Daños Visibles:', 20, yPos)
        yPos += 6
        doc.setFont('helvetica', 'normal')
        const danosLines = doc.splitTextToSize(metadatos.estadoFisico.danosVisibles, 170)
        doc.text(danosLines, 20, yPos)
        yPos += danosLines.length * 5
    }

    // OBSERVACIONES
    if (metadatos.observacionesTecnico) {
        yPos += 5
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(COLORS.primary)
        doc.text('OBSERVACIONES DEL TÉCNICO', 20, yPos)

        yPos += 7
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(COLORS.text)
        const obsLines = doc.splitTextToSize(metadatos.observacionesTecnico, 170)
        doc.text(obsLines, 20, yPos)
        yPos += obsLines.length * 5
    }

    // TÉRMINOS Y CONDICIONES
    yPos += 10
    doc.setFontSize(9)
    doc.setTextColor(COLORS.textLight)
    doc.setFont('helvetica', 'italic')
    const terminos = 'El cliente acepta los términos y condiciones del servicio de reparación. El equipo será diagnosticado y se enviará un presupuesto en un plazo máximo de 48-72 horas.'
    const terminosLines = doc.splitTextToSize(terminos, 170)
    doc.text(terminosLines, 20, yPos)

    // Fecha estimada de diagnóstico
    if (metadatos.fechaEstimadaDiagnostico) {
        yPos += terminosLines.length * 5 + 5
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(COLORS.text)
        doc.text(`Fecha Estimada de Diagnóstico: ${new Date(metadatos.fechaEstimadaDiagnostico).toLocaleDateString('es-ES')}`, 20, yPos)
    }

    agregarPiePagina(doc)
}

/**
 * Generar Diagnóstico y Presupuesto (FASE 2)
 */
function generarDiagnosticoPresupuesto(doc: jsPDF, documento: any, metadatos: MetadatosDiagnosticoPresupuesto | null) {
    let yPos = agregarEncabezado(doc, 'DIAGNÓSTICO Y PRESUPUESTO', documento.numeroDocumento)

    // Fecha
    yPos += 5
    doc.setFontSize(10)
    doc.setTextColor(COLORS.text)
    doc.text(`Fecha: ${new Date(documento.fechaGeneracion).toLocaleDateString('es-ES')}`, 20, yPos)

    if (!metadatos) {
        doc.text('No hay metadatos disponibles', 20, yPos + 10)
        agregarPiePagina(doc)
        return
    }

    // Técnico asignado
    yPos += 6
    doc.setFont('helvetica', 'bold')
    doc.text('Técnico Asignado:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(metadatos.tecnicoAsignado.nombre, 70, yPos)

    // DIAGNÓSTICO DETALLADO
    yPos += 10
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(COLORS.primary)
    doc.text('DIAGNÓSTICO DETALLADO', 20, yPos)

    yPos += 7
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(COLORS.text)

    // Pruebas realizadas
    doc.setFont('helvetica', 'bold')
    doc.text('Pruebas Realizadas:', 20, yPos)
    yPos += 6
    doc.setFont('helvetica', 'normal')
    metadatos.diagnostico.pruebasRealizadas.forEach(prueba => {
        doc.text(`• ${prueba}`, 25, yPos)
        yPos += 5
    })

    // Resultados
    yPos += 3
    doc.setFont('helvetica', 'bold')
    doc.text('Resultados:', 20, yPos)
    yPos += 6
    doc.setFont('helvetica', 'normal')
    const resultadosLines = doc.splitTextToSize(metadatos.diagnostico.resultadosObtenidos, 170)
    doc.text(resultadosLines, 20, yPos)
    yPos += resultadosLines.length * 5

    // Componentes defectuosos
    yPos += 3
    doc.setFont('helvetica', 'bold')
    doc.text('Componentes Defectuosos:', 20, yPos)
    yPos += 6
    doc.setFont('helvetica', 'normal')
    metadatos.diagnostico.componentesDefectuosos.forEach(componente => {
        doc.text(`• ${componente}`, 25, yPos)
        yPos += 5
    })

    // Causa raíz
    yPos += 3
    doc.setFont('helvetica', 'bold')
    doc.text('Causa Raíz:', 20, yPos)
    yPos += 6
    doc.setFont('helvetica', 'normal')
    const causaLines = doc.splitTextToSize(metadatos.diagnostico.causaRaiz, 170)
    doc.text(causaLines, 20, yPos)
    yPos += causaLines.length * 5

    // REPARACIÓN PROPUESTA
    yPos += 10
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(COLORS.primary)
    doc.text('REPARACIÓN PROPUESTA', 20, yPos)

    yPos += 7
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(COLORS.text)
    const trabajosLines = doc.splitTextToSize(metadatos.reparacionPropuesta.descripcionTrabajos, 170)
    doc.text(trabajosLines, 20, yPos)
    yPos += trabajosLines.length * 5 + 5

    // Tabla de repuestos
    if (metadatos.reparacionPropuesta.repuestosNecesarios.length > 0) {
        const repuestosData = metadatos.reparacionPropuesta.repuestosNecesarios.map(r => [
            r.codigo,
            r.descripcion,
            r.cantidad.toString(),
            `${r.precioUnitario.toFixed(2)}€`,
            `${r.subtotal.toFixed(2)}€`,
        ])

        autoTable(doc, {
            startY: yPos,
            head: [['Código', 'Descripción', 'Cant.', 'P. Unit.', 'Subtotal']],
            body: repuestosData,
            theme: 'striped',
            headStyles: { fillColor: COLORS.primary },
            margin: { left: 20, right: 20 },
        })

        yPos = (doc as any).lastAutoTable.finalY + 10
    }

    // Tabla de mano de obra
    if (metadatos.reparacionPropuesta.manoObra.length > 0) {
        const manoObraData = metadatos.reparacionPropuesta.manoObra.map(m => [
            m.descripcion,
            `${m.horasEstimadas}h`,
            `${m.precioHora.toFixed(2)}€/h`,
            `${m.subtotal.toFixed(2)}€`,
        ])

        autoTable(doc, {
            startY: yPos,
            head: [['Descripción', 'Horas', 'Precio/Hora', 'Subtotal']],
            body: manoObraData,
            theme: 'striped',
            headStyles: { fillColor: COLORS.secondary },
            margin: { left: 20, right: 20 },
        })

        yPos = (doc as any).lastAutoTable.finalY + 10
    }

    // COSTOS TOTALES
    const pageWidth = doc.internal.pageSize.getWidth()
    yPos += 5

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('RESUMEN DE COSTOS', 20, yPos)
    yPos += 7

    const costos = [
        ['Repuestos:', `${metadatos.costos.costoRepuestos.toFixed(2)}€`],
        ['Mano de Obra:', `${metadatos.costos.costoManoObra.toFixed(2)}€`],
    ]

    if (metadatos.costos.costosAdicionales && metadatos.costos.costosAdicionales.length > 0) {
        metadatos.costos.costosAdicionales.forEach(ca => {
            costos.push([ca.descripcion, `${ca.monto.toFixed(2)}€`])
        })
    }

    costos.push(['Subtotal:', `${metadatos.costos.subtotal.toFixed(2)}€`])
    costos.push(['IVA (21%):', `${metadatos.costos.iva.toFixed(2)}€`])

    doc.setFontSize(10)
    costos.forEach(([label, value]) => {
        doc.setFont('helvetica', 'normal')
        doc.text(label, pageWidth - 80, yPos)
        doc.text(value, pageWidth - 40, yPos, { align: 'right' })
        yPos += 6
    })

    // Total
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(COLORS.primary)
    doc.text('TOTAL:', pageWidth - 80, yPos)
    doc.text(`${metadatos.costos.total.toFixed(2)}€`, pageWidth - 40, yPos, { align: 'right' })

    // Información adicional
    yPos += 10
    doc.setFontSize(10)
    doc.setTextColor(COLORS.text)
    doc.setFont('helvetica', 'normal')
    doc.text(`Tiempo Estimado de Reparación: ${metadatos.tiempoEstimadoReparacion} horas`, 20, yPos)
    yPos += 6
    doc.text(`Garantía: ${metadatos.garantiaOfrecida.repuestos} meses (repuestos) | ${metadatos.garantiaOfrecida.manoObra} meses (mano de obra)`, 20, yPos)
    yPos += 6
    doc.text(`Validez del Presupuesto: ${metadatos.validezPresupuesto} días`, 20, yPos)

    agregarPiePagina(doc)
}

/**
 * Generar documento genérico para tipos no implementados
 */
function generarDocumentoGenerico(doc: jsPDF, documento: any) {
    let yPos = agregarEncabezado(doc, 'DOCUMENTO', documento.numeroDocumento)

    yPos += 10
    doc.setFontSize(10)
    doc.setTextColor(COLORS.text)
    doc.text(`Tipo: ${documento.tipo}`, 20, yPos)
    yPos += 6
    doc.text(`Estado: ${documento.estadoDocumento}`, 20, yPos)
    yPos += 6
    doc.text(`Fecha: ${new Date(documento.fechaGeneracion).toLocaleDateString('es-ES')}`, 20, yPos)

    if (documento.contenido) {
        yPos += 10
        const contenidoLines = doc.splitTextToSize(documento.contenido, 170)
        doc.text(contenidoLines, 20, yPos)
    }

    agregarPiePagina(doc)
}

/**
 * Generar Aceptación de Presupuesto (FASE 3)
 */
function generarAceptacionPresupuesto(doc: jsPDF, documento: any, metadatos: MetadatosAceptacionPresupuesto | null) {
    let yPos = agregarEncabezado(doc, 'ACEPTACIÓN DE PRESUPUESTO', documento.numeroDocumento)

    if (!metadatos) {
        doc.text('No hay metadatos disponibles', 20, yPos + 10)
        agregarPiePagina(doc)
        return
    }

    yPos += 10
    doc.setFontSize(10)
    doc.setTextColor(COLORS.text)
    doc.text(`Presupuesto: ${metadatos.numeroPresupuesto}`, 20, yPos)
    yPos += 6
    doc.text(`Fecha de Aceptación: ${new Date(metadatos.fechaAceptacion).toLocaleDateString('es-ES')}`, 20, yPos)
    yPos += 6
    doc.text(`Forma de Aprobación: ${metadatos.formaAprobacion}`, 20, yPos)
    yPos += 6
    doc.text(`Método de Pago: ${metadatos.metodoPagoAcordado}`, 20, yPos)

    yPos += 15
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(COLORS.success)
    doc.text('✓ PRESUPUESTO ACEPTADO', 20, yPos)

    agregarPiePagina(doc)
}

/**
 * Generar Rechazo de Presupuesto (FASE 3)
 */
function generarRechazoPresupuesto(doc: jsPDF, documento: any, metadatos: MetadatosRechazoPresupuesto | null) {
    let yPos = agregarEncabezado(doc, 'RECHAZO DE PRESUPUESTO', documento.numeroDocumento)

    if (!metadatos) {
        doc.text('No hay metadatos disponibles', 20, yPos + 10)
        agregarPiePagina(doc)
        return
    }

    yPos += 10
    doc.setFontSize(10)
    doc.setTextColor(COLORS.text)
    doc.text(`Presupuesto: ${metadatos.numeroPresupuesto}`, 20, yPos)
    yPos += 6
    doc.text(`Fecha de Rechazo: ${new Date(metadatos.fechaRechazo).toLocaleDateString('es-ES')}`, 20, yPos)
    yPos += 6
    doc.text(`Motivo: ${metadatos.motivoRechazo}`, 20, yPos)

    if (metadatos.motivoDetalle) {
        yPos += 6
        const detalleLines = doc.splitTextToSize(metadatos.motivoDetalle, 170)
        doc.text(detalleLines, 20, yPos)
        yPos += detalleLines.length * 5
    }

    yPos += 15
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(COLORS.danger)
    doc.text('✗ PRESUPUESTO RECHAZADO', 20, yPos)

    agregarPiePagina(doc)
}

/**
 * Generar Extensión de Presupuesto (FASE 4)
 */
function generarExtensionPresupuesto(doc: jsPDF, documento: any, metadatos: MetadatosExtensionPresupuesto | null) {
    let yPos = agregarEncabezado(doc, 'EXTENSIÓN DE PRESUPUESTO', documento.numeroDocumento)

    if (!metadatos) {
        doc.text('No hay metadatos disponibles', 20, yPos + 10)
        agregarPiePagina(doc)
        return
    }

    yPos += 10
    doc.setFontSize(10)
    doc.setTextColor(COLORS.text)
    doc.text(`Presupuesto Original: ${metadatos.numeroPresupuestoOriginal}`, 20, yPos)
    yPos += 6
    doc.text(`Fecha de Descubrimiento: ${new Date(metadatos.fechaDescubrimiento).toLocaleDateString('es-ES')}`, 20, yPos)
    yPos += 6
    doc.text(`Motivo: ${metadatos.motivoExtension}`, 20, yPos)

    yPos += 10
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(COLORS.primary)
    doc.text('DIAGNÓSTICO AMPLIADO', 20, yPos)

    yPos += 7
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(COLORS.text)
    const diagnosticoLines = doc.splitTextToSize(metadatos.diagnosticoAmpliado.descripcion, 170)
    doc.text(diagnosticoLines, 20, yPos)
    yPos += diagnosticoLines.length * 5 + 10

    // Costo adicional
    const pageWidth = doc.internal.pageSize.getWidth()
    doc.setFont('helvetica', 'bold')
    doc.text('COSTO ADICIONAL', 20, yPos)
    yPos += 7

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Repuestos:', pageWidth - 80, yPos)
    doc.text(`${metadatos.costoAdicional.repuestos.toFixed(2)}€`, pageWidth - 40, yPos, { align: 'right' })
    yPos += 6
    doc.text('Mano de Obra:', pageWidth - 80, yPos)
    doc.text(`${metadatos.costoAdicional.manoObra.toFixed(2)}€`, pageWidth - 40, yPos, { align: 'right' })
    yPos += 6

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(COLORS.primary)
    doc.text('TOTAL ADICIONAL:', pageWidth - 80, yPos)
    doc.text(`${metadatos.costoAdicional.total.toFixed(2)}€`, pageWidth - 40, yPos, { align: 'right' })

    agregarPiePagina(doc)
}

/**
 * Generar Albarán de Entrega (FASE FINAL)
 */
function generarAlbaranEntrega(doc: jsPDF, documento: any, metadatos: MetadatosAlbaranEntrega | null) {
    let yPos = agregarEncabezado(doc, 'ALBARÁN DE ENTREGA', documento.numeroDocumento)

    if (!metadatos) {
        doc.text('No hay metadatos disponibles', 20, yPos + 10)
        agregarPiePagina(doc)
        return
    }

    yPos += 10
    doc.setFontSize(10)
    doc.setTextColor(COLORS.text)
    doc.text(`Ticket: ${metadatos.numeroTicket}`, 20, yPos)
    yPos += 6
    doc.text(`Fecha de Entrega: ${new Date(metadatos.fechaEntrega).toLocaleDateString('es-ES')}`, 20, yPos)

    // Equipo entregado
    yPos += 10
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(COLORS.primary)
    doc.text('EQUIPO ENTREGADO', 20, yPos)

    yPos += 7
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(COLORS.text)
    doc.text(`${metadatos.equipoEntregado.marca} ${metadatos.equipoEntregado.modelo}`, 20, yPos)
    yPos += 6
    doc.text(`Tipo: ${metadatos.equipoEntregado.tipo}`, 20, yPos)

    // Reparaciones realizadas
    yPos += 10
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(COLORS.primary)
    doc.text('REPARACIONES REALIZADAS', 20, yPos)

    yPos += 7
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(COLORS.text)
    metadatos.reparacionesRealizadas.forEach(reparacion => {
        doc.text(`• ${reparacion}`, 25, yPos)
        yPos += 5
    })

    // Garantía
    yPos += 10
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(COLORS.success)
    doc.text('GARANTÍA', 20, yPos)

    yPos += 7
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(COLORS.text)
    doc.text(`Repuestos: ${metadatos.garantiaProporcionada.repuestos} meses`, 20, yPos)
    yPos += 6
    doc.text(`Mano de Obra: ${metadatos.garantiaProporcionada.manoObra} meses`, 20, yPos)

    agregarPiePagina(doc)
}

/**
 * Generar Factura (FINAL/PAGO)
 */
function generarFactura(doc: jsPDF, documento: any, metadatos: MetadatosFactura | null) {
    let yPos = agregarEncabezado(doc, 'FACTURA', documento.numeroDocumento)

    if (!metadatos) {
        doc.text('No hay metadatos disponibles', 20, yPos + 10)
        agregarPiePagina(doc)
        return
    }

    // Información de emisión
    yPos += 5
    doc.setFontSize(10)
    doc.setTextColor(COLORS.text)
    doc.text(`Fecha de Emisión: ${new Date(metadatos.fechaEmision || documento.fechaGeneracion).toLocaleDateString('es-ES')}`, 20, yPos)

    if (metadatos.numeroTicket) {
        doc.text(`Ticket Ref: ${metadatos.numeroTicket}`, 120, yPos)
    }

    // DATOS DEL CLIENTE
    yPos += 10
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(COLORS.primary)
    doc.text('DATOS DE FACTURACIÓN', 20, yPos)

    yPos += 7
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(COLORS.text)

    doc.text(metadatos.cliente.nombre, 20, yPos)
    yPos += 5
    doc.text(`NIF/DNI: ${metadatos.cliente.identificacion}`, 20, yPos)
    yPos += 5
    if (metadatos.cliente.direccion) {
        doc.text(metadatos.cliente.direccion, 20, yPos)
        yPos += 5
    }
    if (metadatos.cliente.email || metadatos.cliente.telefono) {
        const contact = [metadatos.cliente.email, metadatos.cliente.telefono].filter(Boolean).join(' | ')
        doc.text(contact, 20, yPos)
        yPos += 5
    }

    // EQUIPO RELACIONADO
    if (metadatos.equipo) {
        yPos += 5
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(COLORS.primary)
        doc.text('EQUIPO / SERVICIO', 20, yPos)
        yPos += 7
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(COLORS.text)
        doc.text(`${metadatos.equipo.tipo} ${metadatos.equipo.marca} ${metadatos.equipo.modelo}`, 20, yPos)
        if (metadatos.equipo.numeroSerie) {
            yPos += 5
            doc.text(`N/S: ${metadatos.equipo.numeroSerie}`, 20, yPos)
        }
        yPos += 5
    }

    // TABLA DE ITEMS
    yPos += 5
    const itemsData = metadatos.items.map(item => [
        item.descripcion,
        item.cantidad.toString(),
        `${item.precioUnitario.toFixed(2)}€`,
        `${item.subtotal.toFixed(2)}€`
    ])

    autoTable(doc, {
        startY: yPos,
        head: [['Concepto / Descripción', 'Cant.', 'Precio', 'Subtotal']],
        body: itemsData,
        theme: 'striped',
        headStyles: { fillColor: COLORS.primary },
        styles: { fontSize: 9 },
        columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 25, halign: 'right' },
            3: { cellWidth: 25, halign: 'right' }
        },
        margin: { left: 20, right: 20 }
    })

    yPos = (doc as any).lastAutoTable.finalY + 10
    const pageWidth = doc.internal.pageSize.getWidth()

    // TOTALES
    const totals = [
        ['Base Imponible:', `${metadatos.totales.subtotal.toFixed(2)}€`],
        ['I.V.A. (21%):', `${metadatos.totales.iva.toFixed(2)}€`],
    ]

    totals.forEach(([label, value]) => {
        doc.setFont('helvetica', 'normal')
        doc.text(label, pageWidth - 80, yPos)
        doc.text(value, pageWidth - 20, yPos, { align: 'right' })
        yPos += 6
    })

    // GRAN TOTAL
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(COLORS.primary)
    doc.text('TOTAL FACTURA:', pageWidth - 80, yPos)
    doc.text(`${metadatos.totales.total.toFixed(2)}€`, pageWidth - 20, yPos, { align: 'right' })

    // PAGO
    yPos += 15
    doc.setFontSize(10)
    doc.setTextColor(COLORS.text)
    doc.setFont('helvetica', 'bold')
    doc.text('ESTADO DE PAGO:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(`PAGADO mediante ${metadatos.pago.metodo}`, 60, yPos)

    if (metadatos.pago.referencia) {
        yPos += 6
        doc.text(`Referencia: ${metadatos.pago.referencia}`, 60, yPos)
    }

    agregarPiePagina(doc)
}


export default generarPDFDocumento
