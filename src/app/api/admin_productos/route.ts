import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

let productosAdminMock = [
  {
    id: '1',
    sku: 'LAP-GAM-X15',
    nombre: 'Portátil Gaming Pro X15',
    descripcionCorta: 'Intel Core i7-13700H, RTX 4070, 32GB RAM DDR5',
    descripcionLarga: 'Portátil gaming de alto rendimiento con Intel Core i7 de 13ª generación, NVIDIA GeForce RTX 4070 de 8GB, 32GB de RAM DDR5 a 6000MHz, SSD NVMe de 1TB y pantalla de 15.6" QHD 240Hz. Incluye Windows 11 Home preinstalado y 2 años de garantía.',
    precio: 1499,
    precioOferta: 1299,
    stock: 12,
    stockMinimo: 5,
    categoria: 'ordenadores',
    marca: 'Asus',
    modelo: 'ROG Strix G15',
    imagen: '/images/producto_laptop_gaming.png',
    enOferta: true,
    destacado: true,
    enStock: true,
    estado: 'activo',
    fechaCreacion: '2023-12-15',
    fechaActualizacion: '2023-12-28'
  }
]

// POST /api/admin_productos - Crear producto (admin)
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { sku, nombre, descripcionCorta, descripcionLarga, precio, precioOferta, stock, stockMinimo, categoria, marca, modelo, imagen, enOferta, destacado, enStock } = body

    // Validaciones básicas
    if (!sku || sku.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'El SKU debe tener al menos 3 caracteres' },
        { status: 400 }
      )
    }

    if (!nombre || nombre.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'El nombre debe tener al menos 5 caracteres' },
        { status: 400 }
      )
    }

    if (!descripcionCorta || descripcionCorta.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'La descripción corta debe tener al menos 10 caracteres' },
        { status: 400 }
      )
    }

    if (!descripcionLarga || descripcionLarga.trim().length < 20) {
      return NextResponse.json(
        { success: false, error: 'La descripción larga debe tener al menos 20 caracteres' },
        { status: 400 }
      )
    }

    if (!precio || precio < 0) {
      return NextResponse.json(
        { success: false, error: 'El precio es requerido' },
        { status: 400 }
      )
    }

    if (!stock || stock < 0) {
      return NextResponse.json(
        { success: false, error: 'El stock es requerido' },
        { status: 400 }
      )
    }

    if (!categoria) {
      return NextResponse.json(
        { success: false, error: 'La categoría es requerida' },
        { status: 400 }
      )
    }

    if (!marca) {
      return NextResponse.json(
        { success: false, error: 'La marca es requerida' },
        { status: 400 }
      )
    }

    // Crear nuevo producto mock
    const nuevoProducto = {
      id: randomUUID(),
      sku,
      nombre,
      descripcionCorta,
      descripcionLarga,
      precio: Number(precio),
      precioOferta: precioOferta ? Number(precioOferta) : null,
      stock: Number(stock),
      stockMinimo: Number(stockMinimo) || 3,
      categoria,
      marca,
      modelo,
      imagen: imagen || '',
      enOferta: Boolean(enOferta),
      destacado: Boolean(destacado),
      enStock: Boolean(enStock),
      estado: 'activo',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    }

    productosAdminMock.push(nuevoProducto)

    return NextResponse.json({
      success: true,
      data: {
        producto: nuevoProducto,
        mensaje: 'Producto creado correctamente'
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/admin_productos:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear producto',
        datos: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}
