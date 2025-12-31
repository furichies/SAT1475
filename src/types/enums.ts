// Enums del sistema - exportados desde Prisma

export enum UserRole {
  CLIENTE = 'cliente',
  TECNICO = 'tecnico',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin'
}

export enum ProductoTipo {
  EQUIPO_COMPLETO = 'equipo_completo',
  COMPONENTE = 'componente',
  PERIFERICO = 'periferico',
  ACCESORIO = 'accesorio',
  SOFTWARE = 'software'
}

export enum PedidoEstado {
  PENDIENTE = 'pendiente',
  CONFIRMADO = 'confirmado',
  PROCESANDO = 'procesando',
  ENVIADO = 'enviado',
  ENTREGADO = 'entregado',
  CANCELADO = 'cancelado',
  DEVUELTO = 'devuelto'
}

export enum MetodoPago {
  TARJETA = 'tarjeta',
  PAYPAL = 'paypal',
  TRANSFERENCIA = 'transferencia',
  CONTRAREEMBOLSO = 'contrareembolso'
}

export enum TecnicoNivel {
  JUNIOR = 'junior',
  SENIOR = 'senior',
  EXPERTO = 'experto'
}

export enum TicketTipo {
  INCIDENCIA = 'incidencia',
  CONSULTA = 'consulta',
  REPARACION = 'reparacion',
  GARANTIA = 'garantia',
  DEVOLUCION = 'devolucion',
  OTRO = 'otro'
}

export enum TicketPrioridad {
  BAJA = 'baja',
  MEDIA = 'media',
  ALTA = 'alta',
  URGENTE = 'urgente'
}

export enum TicketEstado {
  ABIERTO = 'abierto',
  ASIGNADO = 'asignado',
  EN_PROGRESO = 'en_progreso',
  PENDIENTE_CLIENTE = 'pendiente_cliente',
  PENDIENTE_PIEZA = 'pendiente_pieza',
  RESUELTO = 'resuelto',
  CERRADO = 'cerrado',
  CANCELADO = 'cancelado'
}

export enum SeguimientoTipo {
  COMENTARIO = 'comentario',
  CAMBIO_ESTADO = 'cambio_estado',
  ASIGNACION = 'asignacion',
  NOTA_INTERNA = 'nota_interna',
  ADJUNTO = 'adjunto'
}

export enum ConocimientoTipo {
  SOLUCION = 'solucion',
  PROCEDIMIENTO = 'procedimiento',
  FAQ = 'faq',
  MANUAL = 'manual',
  TUTORIAL = 'tutorial'
}

export enum DocumentoTipo {
  FACTURA = 'factura',
  ALBARAN = 'albaran',
  PRESUPUESTO = 'presupuesto',
  INFORME_REPARACION = 'informe_reparacion',
  GARANTIA = 'garantia',
  MANUAL = 'manual'
}

export enum DocumentoEntidadTipo {
  PEDIDO = 'pedido',
  TICKET = 'ticket',
  PRODUCTO = 'producto'
}
