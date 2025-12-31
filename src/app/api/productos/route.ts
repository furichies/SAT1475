import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/productos - Listar productos desde la base de datos real
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const busqueda = searchParams.get('busqueda') || ''
    const categoriaId = searchParams.get('categoria') || ''
    const pagina = parseInt(searchParams.get('pagina') || '1')
    const porPagina = parseInt(searchParams.get('porPagina') || '12')

    const where: any = {
      activo: true
    }

    if (busqueda) {
      where.OR = [
        { nombre: { contains: busqueda } },
        { descripcion: { contains: busqueda } },
        { marca: { contains: busqueda } }
      ]
    }

    if (categoriaId) {
      where.categoriaId = categoriaId
    }

    const [productos, totalItems] = await Promise.all([
      db.producto.findMany({
        where,
        skip: (pagina - 1) * porPagina,
        take: porPagina,
        orderBy: { fechaCreacion: 'desc' }
      }),
      db.producto.count({ where })
    ])

    const totalPages = Math.ceil(totalItems / porPagina)

    return NextResponse.json({
      success: true,
      data: {
        productos: productos.map(p => ({
          ...p,
          imagenes: p.imagenes ? JSON.parse(p.imagenes) : []
        })),
        paginacion: {
          pagina,
          porPagina,
          totalItems,
          totalPages,
          tieneSiguiente: pagina < totalPages,
          tieneAnterior: pagina > 1
        }
      }
    })
  } catch (error) {
    console.error('Error en GET /api/productos:', error)
    return NextResponse.json({ success: false, error: 'Error al obtener productos' }, { status: 500 })
  }
}

// Para obtener el detalle de un producto
export async function GETProductoDetail(id: string) {
  try {
    const producto = await db.producto.findUnique({
      where: { id },
      include: { categoria: true }
    })

    if (!producto) return null

    return {
      ...producto,
      imagenes: producto.imagenes ? JSON.parse(producto.imagenes) : []
    }
  } catch (error) {
    return null
  }
}
