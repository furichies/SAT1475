import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

// Mock data para artículos de la base de conocimiento del admin
let articulosAdminMock = [
  {
    id: '1',
    titulo: 'Cómo instalar un SSD NVMe en portátil',
    contenido: 'Guía paso a paso para instalar un SSD NVMe en tu portátil. Aprende los requisitos previos, herramientas necesarias y procedimiento completo de instalación. Esta guía es适用于 tanto Windows como Linux.',
    categoria: 'Almacenamiento',
    tags: ['SSD', 'NVMe', 'Instalación', 'Hardware', 'Portátil', 'Windows', 'Linux'],
    autor: 'Carlos García',
    autorId: 'tecnico-1',
    autorRol: 'tecnico',
    estado: 'publicado',
    vistas: 1234,
    likes: 87,
    comentarios: 15,
    fechaCreacion: '2023-12-20',
    fechaActualizacion: '2023-12-28'
  },
  {
    id: '2',
    titulo: 'Solución a problemas de conexión WiFi',
    contenido: 'Guía completa para solucionar problemas de conexión WiFi en ordenadores portátiles y de escritorio. Incluye diagnósticos, soluciones comunes y herramientas de diagnóstico. Aborda problemas con Windows, macOS y Linux.',
    categoria: 'Redes',
    tags: ['WiFi', 'Conexión', 'Redes', 'Troubleshooting', 'Diagnóstico', 'Configuración'],
    autor: 'María Martínez',
    autorId: 'tecnico-2',
    autorRol: 'tecnico',
    estado: 'publicado',
    vistas: 890,
    likes: 65,
    comentarios: 23,
    fechaCreacion: '2023-12-18',
    fechaActualizacion: '2023-12-25'
  },
  {
    id: '3',
    titulo: 'Guía de reparación de portátiles - Diagnóstico inicial',
    contenido: 'Aprende cómo realizar un diagnóstico inicial de tu portátil antes de llevarlo al técnico. Identifica problemas comunes de hardware y software, comprueba componentes básicos, y determina si es reparable o requiere servicio técnico.',
    categoria: 'Reparación',
    tags: ['Portátiles', 'Diagnóstico', 'Hardware', 'Software', 'Reparación'],
    autor: 'Admin Principal',
    autorId: 'admin-1',
    autorRol: 'admin',
    estado: 'publicado',
    vistas: 2345,
    likes: 156,
    comentarios: 34,
    fechaCreacion: '2023-12-15',
    fechaActualizacion: '2023-12-30'
  },
  {
    id: '4',
    titulo: 'Actualización de BIOS y UEFI - Guía completa',
    contenido: 'Guía completa sobre cómo actualizar la BIOS o UEFI de tu ordenador. Incluye pasos de seguridad, métodos de actualización, riesgos, y recomendaciones de seguridad. Adecuada para usuarios intermedios y avanzados.',
    categoria: 'Sistema',
    tags: ['BIOS', 'UEFI', 'Actualización', 'Sistema', 'Seguridad'],
    autor: 'Diego Fernández',
    autorId: 'tecnico-3',
    autorRol: 'tecnico',
    estado: 'publicado',
    vistas: 1567,
    likes: 92,
    comentarios: 18,
    fechaCreacion: '2023-12-12',
    fechaActualizacion: '2023-12-22'
  },
  {
    id: '5',
    titulo: 'Borrador: Instalación de GPU NVIDIA RTX 4090',
    contenido: 'Guía paso a paso para instalar una RTX 4090 en tu ordenador. Incluye requisitos de sistema (fuente de alimentación, tamaño de carcasa), fuentes de los drivers, procedimiento de instalación, y post-instalación.',
    categoria: 'Hardware',
    tags: ['GPU', 'NVIDIA', 'RTX', 'Instalación', 'Hardware'],
    autor: 'Ana Rodríguez',
    autorId: 'admin-2',
    autorRol: 'admin',
    estado: 'borrador',
    vistas: 0,
    likes: 0,
    comentarios: 0,
    fechaCreacion: '2023-12-28',
    fechaActualizacion: '2023-12-28'
  },
  {
    id: '6',
    titulo: 'Guía de limpieza y mantenimiento de monitores',
    contenido: 'Aprende cómo limpiar y mantener tu monitor para prolongar su vida útil. Incluye productos recomendados (paños, soluciones de limpieza), frecuencia de limpieza, zonas delicadas a evitar, y mantenimiento preventivo.',
    categoria: 'Periféricos',
    tags: ['Monitor', 'Limpieza', 'Mantenimiento', 'Cuidado', 'Periféricos'],
    autor: 'Admin Principal',
    autorId: 'admin-1',
    autorRol: 'admin',
    estado: 'archivado',
    vistas: 678,
    likes: 45,
    comentarios: 8,
    fechaCreacion: '2023-11-20',
    fechaActualizacion: '2023-12-01'
  }
]

// GET /api/admin_conocimiento - Listar artículos (admin)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const busqueda = searchParams.get('busqueda') || ''
    const categoria = searchParams.get('categoria') || ''
    const estado = searchParams.get('estado') || ''
    const autor = searchParams.get('autor') || ''

    // Filtrar artículos
    let articulosFiltrados = articulosAdminMock.filter(a => {
      if (busqueda && !a.titulo.toLowerCase().includes(busqueda.toLowerCase()) && 
          !a.contenido.toLowerCase().includes(busqueda.toLowerCase()) &&
          !a.tags.some(t => t.toLowerCase().includes(busqueda.toLowerCase()))) return false
      if (categoria && a.categoria !== categoria) return false
      if (estado && a.estado !== estado) return false
      if (autor && a.autor.toLowerCase() !== autor.toLowerCase()) return false
      return true
    })

    // Ordenar por fecha de actualización (más reciente primero)
    articulosFiltrados.sort((a, b) => new Date(b.fechaActualizacion).getTime() - new Date(a.fechaActualizacion).getTime())

    return NextResponse.json({
      success: true,
      data: {
        articulos: articulosFiltrados,
        totalArticulos: articulosFiltrados.length
      }
    })
  } catch (error) {
    console.error('Error en GET /api/admin_conocimiento:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener artículos de la base de conocimiento'
      },
      { status: 500 }
    )
  }
}

// POST /api/admin_conocimiento - Crear artículo (admin)
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { titulo, contenido, categoria, tags, imagen, estado, programarFecha, fechaProgramada } = body

    // Validaciones básicas
    if (!titulo || titulo.trim().length < 5) {
      return NextResponse.json(
        {
          success: false,
          error: 'El título debe tener al menos 5 caracteres'
        },
        { status: 400 }
      )
    }

    if (!contenido || contenido.trim().length < 20) {
      return NextResponse.json(
        {
          success: false,
          error: 'El contenido debe tener al menos 20 caracteres'
        },
        { status: 400 }
      )
    }

    if (!categoria) {
      return NextResponse.json(
        {
          success: false,
          error: 'La categoría es requerida'
        },
        { status: 400 }
      )
    }

    if (!tags || tags.length < 1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Al menos un tag es requerido'
        },
        { status: 400 }
      )
    }

    if (!estado || !['borrador', 'publicado'].includes(estado)) {
      return NextResponse.json(
        {
          success: false,
          error: 'El estado debe ser borrador o publicado'
        },
        { status: 400 }
      )
    }

    if (programarFecha && !fechaProgramada) {
      return NextResponse.json(
        {
          success: false,
          error: 'La fecha de publicación programada es requerida'
        },
        { status: 400 }
      )
    }

    // Mock: Obtener autor de la sesión
    const autor = {
      id: 'admin-1',
      nombre: 'Admin Principal',
      rol: 'admin'
    }

    // Crear nuevo artículo mock
    const nuevoArticulo = {
      id: randomUUID(),
      titulo,
      contenido,
      categoria,
      tags: Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()),
      imagen: imagen || '',
      autor: autor.nombre,
      autorId: autor.id,
      autorRol: autor.rol,
      estado: estado || 'borrador',
      vistas: 0,
      likes: 0,
      comentarios: 0,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      fechaProgramacion: programarFecha ? fechaProgramada : null
    }

    articulosAdminMock.push(nuevoArticulo)

    return NextResponse.json({
      success: true,
      data: {
        articulo: nuevoArticulo,
        mensaje: 'Artículo creado correctamente'
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/admin_conocimiento:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear artículo',
        datos: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

// PUT /api/admin_conocimiento/[id] - Actualizar artículo (admin)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { titulo, contenido, categoria, tags, imagen, estado, programarFecha, fechaProgramada, archivar } = body

    const articulo = articulosAdminMock.find(a => a.id === params.id)

    if (!articulo) {
      return NextResponse.json(
        {
          success: false,
          error: 'Artículo no encontrado'
        },
        { status: 404 }
      )
    }

    // Validaciones básicas
    if (titulo && titulo.length < 5) {
      return NextResponse.json(
        {
          success: false,
          error: 'El título debe tener al menos 5 caracteres'
        },
        { status: 400 }
      )
    }

    if (contenido && contenido.length < 20) {
      return NextResponse.json(
        {
          success: false,
          error: 'El contenido debe tener al menos 20 caracteres'
        },
        { status: 400 }
      )
    }

    // Actualizar artículo
    if (titulo) articulo.titulo = titulo
    if (contenido) articulo.contenido = contenido
    if (categoria) articulo.categoria = categoria
    if (tags) articulo.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())
    if (imagen) articulo.imagen = imagen
    if (estado) articulo.estado = estado

    if (programarFecha && fechaProgramada) {
      articulo.fechaProgramacion = fechaProgramada
      articulo.estado = 'programado'
    }

    if (archivar) {
      articulo.estado = 'archivado'
    }

    articulo.fechaActualizacion = new Date().toISOString()

    return NextResponse.json({
      success: true,
      data: {
        articulo,
        mensaje: 'Artículo actualizado correctamente'
      }
    })
  } catch (error) {
    console.error('Error en PUT /api/admin_conocimiento/[id]:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al actualizar artículo',
        datos: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

// DELETE /api/admin_conocimiento/[id] - Eliminar artículo (admin)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const articulo = articulosAdminMock.find(a => a.id === params.id)

    if (!articulo) {
      return NextResponse.json(
        {
          success: false,
          error: 'Artículo no encontrado'
        },
        { status: 404 }
      )
    }

    // Eliminar artículo (soft delete: estado = eliminado)
    articulo.estado = 'eliminado'

    return NextResponse.json({
      success: true,
      data: {
        mensaje: 'Artículo eliminado correctamente'
      }
    })
  } catch (error) {
    console.error('Error en DELETE /api/admin_conocimiento/[id]:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar artículo',
        datos: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}
