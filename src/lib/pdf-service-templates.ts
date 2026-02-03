
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Configuración de la empresa
const EMPRESA = {
    nombre: 'MicroInfo',
    direccion: 'Calle Principal, 123',
    ciudad: 'Ciudad, CP 12345',
    telefono: '+34 123 456 789',
    email: 'info@microinfo.es',
    web: 'www.microinfo.es',
};

export type TemplateType = 'intervencion' | 'reparacion_equipo' | 'reparacion_impresora';

export type TemplateData = {
    fecha?: string;
    horaInicio?: string;
    horaFin?: string;
    tecnico?: string;
    cliente?: string;
    telefono?: string;
    direccion?: string;
    email?: string;
    fechaEntrada?: string;
    fechaSalida?: string;
    numeroOrden?: string;
    empresa?: string;
    tipoEquipo?: string;
    marca?: string;
    modelo?: string;
    numeroSerie?: string;
    observaciones?: string;
    // Specific fields will be handled dynamically
    [key: string]: any;
};

export const generateTemplatePDF = (type: TemplateType, data: TemplateData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // Helper to draw a box with title
    const drawBox = (x: number, y: number, w: number, h: number, title?: string) => {
        doc.rect(x, y, w, h);
        if (title) {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(title, x + 2, y + 5);
            doc.setFont('helvetica', 'normal');
        }
    };

    // Helper to draw the header
    const drawHeader = (title: string) => {
        // Logo/Nombre de la empresa
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(EMPRESA.nombre, margin, margin);

        // Información de contacto
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(EMPRESA.direccion, margin, margin + 5);
        doc.text(`${EMPRESA.ciudad} | Tel: ${EMPRESA.telefono}`, margin, margin + 9);
        doc.text(`${EMPRESA.email} | ${EMPRESA.web}`, margin, margin + 13);

        // Title Box
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(margin, margin + 18, pageWidth - (margin * 2), 10);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(title, pageWidth / 2, margin + 25, { align: 'center' });

        return margin + 35; // New Y position
    };

    let y = margin;

    if (type === 'intervencion') {
        y = drawHeader('HOJA DE INTERVENCIÓN GENÉRICA');

        // Row 1: Fecha, Hora Inicio, Hora Fin, Tecnico
        doc.rect(margin, y, pageWidth - (margin * 2), 12);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        // Calculate column widths roughly
        const boxWidth = pageWidth - (margin * 2);
        const col1 = boxWidth * 0.25;
        const col2 = boxWidth * 0.25;
        const col3 = boxWidth * 0.50;

        // Coordinates adjustment
        doc.text(`Fecha: [ ${data.fecha || '____/____/____'} ]`, margin + 2, y + 8);
        doc.text(`Hora Inicio: [ ${data.horaInicio || '__:__'} ]`, margin + col1, y + 8);
        doc.text(`Hora Fin: [ ${data.horaFin || '__:__'} ]`, margin + col1 + col2, y + 8); // Moved right
        doc.text(`Técnico: [ ${data.tecnico || '__________________'} ]`, margin + col1 + col2 + col2, y + 8); // Adjusted to fit

        y += 12;

        // Row 2: Cliente info
        doc.rect(margin, y, pageWidth - (margin * 2), 25);

        doc.text(`Cliente: [ ${data.cliente || '____________________'} ]`, margin + 2, y + 8);
        doc.text(`Teléfono: [ ${data.telefono || '________'} ]`, margin + (boxWidth * 0.6), y + 8); // Adjusted X

        doc.text(`Dirección: [ ${data.direccion || '________________________________________'} ]`, margin + 2, y + 16);
        doc.text(`Email: [ ${data.email || '______________'} ]`, margin + 2, y + 24);

        y += 30;

        // Description / Intervention details
        doc.setFont('helvetica', 'bold');
        doc.text('Detalle de la Intervención:', margin, y);
        y += 2;
        doc.rect(margin, y, pageWidth - (margin * 2), 80);

        if (data.observaciones) {
            doc.setFont('helvetica', 'normal');
            const splitText = doc.splitTextToSize(data.observaciones, boxWidth - 4);
            doc.text(splitText, margin + 2, y + 6);
        }

        y += 85;

        // Tasks / Tareas
        if (data.tareas && data.tareas.length > 0) {
            doc.setFont('helvetica', 'bold');
            doc.text('Tareas Realizadas:', margin, y);
            y += 5;

            let xTask = margin;
            data.tareas.forEach((task: string) => {
                // Checkbox filled
                doc.setFillColor(0, 0, 0);
                doc.rect(xTask, y, 4, 4, 'FD'); // Filled rect
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(8);
                doc.text('X', xTask + 1, y + 3);

                doc.setTextColor(0, 0, 0);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(task, xTask + 6, y + 3);
                xTask += 35; // Spacing
            });
            y += 10;
        }


        // Signatures
        doc.rect(margin, y, (boxWidth / 2) - 5, 25);
        doc.text('Firma del Técnico:', margin + 2, y + 5);

        doc.rect(margin + (boxWidth / 2) + 5, y, (boxWidth / 2) - 5, 25);
        doc.text('Firma del Cliente:', margin + (boxWidth / 2) + 7, y + 5);

    } else if (type === 'reparacion_equipo' || type === 'reparacion_impresora') {
        const title = type === 'reparacion_equipo' ? 'HOJA DE REPARACIÓN DE EQUIPO' : 'HOJA DE REPARACIÓN DE IMPRESORA';
        y = drawHeader(title);

        const boxWidth = pageWidth - (margin * 2);

        // Row 1: Fechas y Orden
        doc.rect(margin, y, boxWidth, 12);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        // Calculate available space
        const third = boxWidth / 3;

        doc.text(`Fecha Entrada: [ ${data.fechaEntrada || '____/____/____'} ]`, margin + 2, y + 8);
        doc.text(`Fecha Salida: [ ${data.fechaSalida || '____/____/____'} ]`, margin + third, y + 8);
        doc.text(`Nº de Orden: [ ${data.numeroOrden || '__________'} ]`, margin + (third * 2), y + 8); // Better spacing

        y += 12;

        // Row 2: Datos Cliente
        doc.rect(margin, y, boxWidth, 20);
        doc.text('Datos del Cliente:', margin + 2, y + 5);
        doc.text(`Nombre: [ ${data.cliente || '____________________'} ]`, margin + 10, y + 12);
        doc.text(`Empresa: [ ${data.empresa || '_________'} ]`, margin + (boxWidth * 0.6), y + 12); // Moved right
        doc.text(`Teléfono: [ ${data.telefono || '__________'} ]`, margin + 10, y + 18);

        y += 25;

        // Row 3: Datos Equipo / Impresora
        doc.rect(margin, y, boxWidth, type === 'reparacion_equipo' ? 30 : 35);
        doc.text('Datos del Equipo:', margin + 2, y + 5);

        if (type === 'reparacion_equipo') {
            doc.text(`Tipo: [ ${data.tipoEquipo || '_______'} ]`, margin + 10, y + 12);
            doc.text(`Memoria: [ ${data.tipoMemoria || '__'} ${data.capacidadMemoria || '__'} ]`, margin + 10, y + 18);
            doc.text(`Almacenamiento: [ ${data.tipoAlmacenamiento || '__'} ${data.capacidadAlmacenamiento || '__'} ]`, margin + 10, y + 24);
        } else {
            doc.text(`Tipo Impresora: [ ${data.tipoImpresora || '_______'} ]`, margin + 10, y + 12);
            doc.text(`Marca: [ ${data.marcaImpresora || '_______'} ]`, margin + (boxWidth / 2), y + 12);
            doc.text(`Modelo: [ ${data.modelo || '_______'} ]`, margin + 10, y + 18);
            doc.text(`Nº Serie: [ ${data.numeroSerie || '_______'} ]`, margin + (boxWidth / 2), y + 18);
        }

        y += type === 'reparacion_equipo' ? 35 : 40;

        // Diagnostico / Reparacion box
        doc.setFont('helvetica', 'bold');
        doc.text('Diagnóstico / Reparación:', margin, y);
        y += 2;
        doc.rect(margin, y, pageWidth - (margin * 2), 80);

        if (data.observaciones) {
            doc.setFont('helvetica', 'normal');
            const splitText = doc.splitTextToSize(data.observaciones, boxWidth - 4);
            doc.text(splitText, margin + 2, y + 6);
        }

        y += 85;

        // Checkbox areas for tasks
        doc.setFont('helvetica', 'bold');
        doc.text('Tareas Realizadas:', margin, y);
        y += 5;

        const allTasks = ['Limpieza', 'Formateo', 'Instalación SW', 'Cambio Pieza', 'Backup', 'Otros'];
        // Selected tasks from form
        const selectedTasks = data.tareas || [];

        let xTask = margin;
        allTasks.forEach(task => {
            const isSelected = selectedTasks.includes(task);

            if (isSelected) {
                doc.setFillColor(0, 0, 0);
                doc.rect(xTask, y, 4, 4, 'FD'); // Black box
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(8);
                doc.text('X', xTask + 1, y + 3);
            } else {
                doc.setFillColor(255, 255, 255); // White fill
                doc.rect(xTask, y, 4, 4, 'S'); // Stoke only
            }

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(task, xTask + 6, y + 3);
            xTask += 30; // Spacing
        });

        y += 15;

        // Signatures
        doc.rect(margin, y, (boxWidth / 2) - 5, 25);
        doc.text('Firma del Técnico:', margin + 2, y + 5);

        doc.rect(margin + (boxWidth / 2) + 5, y, (boxWidth / 2) - 5, 25);
        doc.text('Firma del Cliente:', margin + (boxWidth / 2) + 7, y + 5);
    }

    // doc.save(`plantilla_${type}_${new Date().getTime()}.pdf`);
    return doc;
};
