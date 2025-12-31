import { NextResponse } from 'next/server'
import { ProductoTipo } from '@prisma/client'

// Mock data para demostración (mismo que en frontend)
const productosMock = [
  {
    id: '1',
    sku: 'LAP-GAM-X15',
    nombre: 'Portátil Gaming Pro X15',
    descripcion: 'Potente portátil gaming diseñado para ofrecer el máximo rendimiento en juegos y aplicaciones exigentes. Equipado con el procesador Intel Core i7 de última generación, tarjeta gráfica NVIDIA RTX 4070 y 32GB de memoria RAM DDR5 ultrarrápida.',
    descripcionCorta: 'Intel Core i7-13700H, RTX 4070, 32GB RAM DDR5, 1TB SSD NVMe',
    precio: 1499,
    precioOferta: 1299,
    stock: 5,
    stockMinimo: 3,
    marca: 'Asus',
    modelo: 'ROG Strix G15',
    tipo: ProductoTipo.EQUIPO_COMPLETO,
    especificaciones: {
      procesador: 'Intel Core i7-13700H (14 núcleos)',
      gpu: 'NVIDIA GeForce RTX 4070 8GB GDDR6',
      ram: '32GB DDR5 4800MHz Dual Channel',
      almacenamiento: '1TB NVMe SSD, 7000MB/s lectura',
      pantalla: '15.6" QHD 240Hz, G-Sync Compatible',
      bateria: '90Wh, hasta 6 horas de uso mixto',
      so: 'Windows 11 Home OEM',
      conectividad: 'Wi-Fi 6E, Bluetooth 5.3, USB 3.2 Gen2, HDMI 2.1',
      peso: '2.8 kg'
    },
    imagenes: ['/images/producto_laptop_gaming.png'],
    peso: 2.8,
    dimensiones: '35.5 x 25.5 x 2.5 cm',
    garantiaMeses: 24,
    activo: true,
    destacado: true,
    valoracion: 4.8,
    totalValoraciones: 124,
    categoriaId: '1'
  },
  {
    id: '2',
    sku: 'LAP-ULT-Z14',
    nombre: 'Portátil Ultralight ZenBook',
    descripcion: 'Portátil ultra ligero perfect para trabajo y estudios con batería de 12 horas. Pantalla OLED de 14" con colores vivos.',
    descripcionCorta: 'Intel Core i5-1340P, 16GB RAM, 512GB SSD, 2.8kg',
    precio: 899,
    precioOferta: null,
    stock: 12,
    stockMinimo: 5,
    marca: 'Asus',
    modelo: 'ZenBook 14 OLED',
    tipo: ProductoTipo.EQUIPO_COMPLETO,
    especificaciones: {
      procesador: 'Intel Core i5-1340P',
      ram: '16GB LPDDR5',
      almacenamiento: '512GB SSD',
      pantalla: '14" OLED 2.8K',
      bateria: '75Wh',
      so: 'Windows 11 Home OEM',
      peso: '1.2 kg'
    },
    imagenes: ['/images/producto_laptop_gaming.png'],
    peso: 1.2,
    dimensiones: '31.8 x 21.8 x 1.8 cm',
    garantiaMeses: 24,
    activo: true,
    destacado: false,
    valoracion: 4.6,
    totalValoraciones: 87,
    categoriaId: '1'
  },
  {
    id: '3',
    sku: 'SSD-SAM-2TB',
    nombre: 'SSD NVMe Samsung 980 Pro 2TB',
    descripcion: 'SSD de alto rendimiento para gaming y trabajo pesado. Tecnología V-NAND 3-bit MLC con velocidad de lectura de 7.000 MB/s.',
    descripcionCorta: 'Velocidad de lectura 7.000 MB/s, escritura 5.000 MB/s',
    precio: 189.99,
    precioOferta: 159.99,
    stock: 23,
    stockMinimo: 10,
    marca: 'Samsung',
    modelo: '980 Pro',
    tipo: ProductoTipo.COMPONENTE,
    especificaciones: {
      interfaz: 'NVMe PCIe 4.0',
      velocidadLectura: '7.000 MB/s',
      velocidadEscritura: '5.000 MB/s',
      cache: '256MB',
      factorDeForma: 'M.2 2280',
      tecnologia: 'V-NAND 3-bit MLC',
      tbw: '1200 TBW',
      vidaUtil: '5 años'
    },
    imagenes: ['/images/producto_ssd.png'],
    peso: 0.078,
    dimensiones: '8 x 2.2 x 0.2 cm',
    garantiaMeses: 36,
    activo: true,
    destacado: true,
    valoracion: 4.9,
    totalValoraciones: 156,
    categoriaId: '3'
  },
  {
    id: '4',
    sku: 'RAM-COR-DD5-32',
    nombre: 'Memoria RAM DDR5 32GB Corsair',
    descripcion: 'Memoria RAM de alto rendimiento con iluminación RGB sincronizable. Frecuencia de 6000MHz con latencia CL36 para máxima velocidad en gaming.',
    descripcionCorta: '6000MHz CL36 RGB, baja latencia para gaming',
    precio: 129.99,
    precioOferta: 109.99,
    stock: 15,
    stockMinimo: 8,
    marca: 'Corsair',
    modelo: 'Vengeance DDR5',
    tipo: ProductoTipo.COMPONENTE,
    especificaciones: {
      capacidad: '32GB (2x16GB)',
      tipo: 'DDR5',
      velocidad: '6000MHz',
      latencia: 'CL36',
      voltaje: '1.25V',
      rgb: 'Sí, 16.8 millones de colores',
      disipacionTermica: 'XMP 3.0',
      xmp: 'Sí'
    },
    imagenes: ['/images/producto_ram.png'],
    peso: 0.07,
    dimensiones: '13.7 x 4.3 x 0.8 cm',
    garantiaMeses: 36,
    activo: true,
    destacado: true,
    valoracion: 4.7,
    totalValoraciones: 203,
    categoriaId: '4'
  },
  {
    id: '5',
    sku: 'MON-SAM-32-4K',
    nombre: 'Monitor Curvo 32" 4K Samsung',
    descripcion: 'Monitor gaming profesional con curvatura 1000R y colores vivos. Panel VA con HDR10+ y AMD FreeSync Premium Pro.',
    descripcionCorta: '165Hz, 1ms, HDR10+, AMD FreeSync Premium Pro',
    precio: 549.99,
    precioOferta: 479.99,
    stock: 8,
    stockMinimo: 5,
    marca: 'Samsung',
    modelo: 'Odyssey G7',
    tipo: ProductoTipo.PERIFERICO,
    especificaciones: {
      tamano: '32" curvo',
      curvatura: '1000R',
      resolucion: '3840x2160 (4K)',
      tasaRefresco: '165Hz',
      tiempoRespuesta: '1ms (GtG)',
      panel: 'VA',
      srgb: '125% sRGB',
      hdr: 'HDR10+',
      freesync: 'AMD FreeSync Premium Pro',
      brillo: '600 cd/m²',
      contraste: '3000:1',
      angulosVisuales: '178/178'
    },
    imagenes: ['/images/producto_monitor.png'],
    peso: 7.5,
    dimensiones: '73 x 55 x 25 cm',
    garantiaMeses: 24,
    activo: true,
    destacado: false,
    valoracion: 4.6,
    totalValoraciones: 92,
    categoriaId: '5'
  },
  {
    id: '6',
    sku: 'TEC-LOG-GPROX',
    nombre: 'Teclado Mecánico Logitech G Pro X',
    descripcion: 'Teclado mecánico para esports con switches táctiles y respuesta ultrarrápida. Diseño compacto TKL y conexión inalámbrica.',
    descripcionCorta: 'Switch Cherry MX Red, iluminación RGB, inalámbrico',
    precio: 149.99,
    precioOferta: 119.99,
    stock: 42,
    stockMinimo: 15,
    marca: 'Logitech',
    modelo: 'G Pro X TKL',
    tipo: ProductoTipo.PERIFERICO,
    especificaciones: {
      switches: 'Cherry MX Red (táctiles)',
      tipo: 'Mecánico',
      teclas: '87 (TKL sin teclas de función)',
      conexion: 'Bluetooth o USB-C',
      bateria: 'hasta 90 horas',
      rgb: '16.8M colores',
      keycaps: 'PBT doblado de inyección',
      peso: '79.5g (sin cable)',
      pollingRate: '1ms'
    },
    imagenes: ['/images/producto_teclado.png'],
    peso: 0.73,
    dimensiones: '31 x 13 x 4 cm',
    garantiaMeses: 24,
    activo: true,
    destacado: false,
    valoracion: 4.5,
    totalValoraciones: 312,
    categoriaId: '5'
  },
  {
    id: '7',
    sku: 'RAT-RAZ-DAV3',
    nombre: 'Ratón Gaming Razer DeathAdder V3',
    descripcion: 'Ratón gaming ergonómico con sensor óptico Focus Pro de 25.600 DPI. 8 botones programables para máxima personalización.',
    descripcionCorta: '25.600 DPI Focus Pro, sensor óptico, 8 botones programables',
    precio: 79.99,
    precioOferta: 59.99,
    stock: 67,
    stockMinimo: 20,
    marca: 'Razer',
    modelo: 'DeathAdder V3',
    tipo: ProductoTipo.PERIFERICO,
    especificaciones: {
      sensor: '25,600 DPI Focus Pro óptico',
      dpiMax: '25,600',
      dpiMin: '100',
      botones: '8 programables',
      scroll: 'Ergonómico',
      conexion: 'SpeedCable USB o HyperSpeed Wireless',
      pollingRate: '1000Hz (inalámbrico)',
      bateria: 'hasta 90 horas',
      peso: '62g (inalámbrico)'
    },
    imagenes: ['/images/producto_raton.png'],
    peso: 0.06,
    dimensiones: '12.7 x 6 x 4 cm',
    garantiaMeses: 24,
    activo: true,
    destacado: false,
    valoracion: 4.7,
    totalValoraciones: 445,
    categoriaId: '5'
  },
  {
    id: '8',
    sku: 'CPU-INT-I9',
    nombre: 'CPU Intel Core i9-13900K',
    descripcion: 'Procesador de alto rendimiento para gaming y creación de contenido. 24 núcleos (8P+16E) y 32 hilos hasta 5.8 GHz.',
    descripcionCorta: '24 núcleos (8P+16E), 32 hilos, hasta 5.8 GHz',
    precio: 599.99,
    precioOferta: null,
    stock: 9,
    stockMinimo: 5,
    marca: 'Intel',
    modelo: 'Core i9-13900K',
    tipo: ProductoTipo.COMPONENTE,
    especificaciones: {
      nucleos: '24 (8 Performance + 16 Efficient)',
      hilos: '32',
      frecuenciaBase: '3.0 GHz',
      frecuenciaTurbo: '5.8 GHz',
      cacheL3: '36MB',
      tdp: '125W',
      socket: 'LGA 1700',
      memoriaSoportada: 'DDR4-3200 y DDR5-5600',
      arquitectura: 'Raptor Lake',
      overclocking: 'Sí'
    },
    imagenes: ['/images/producto_cpu.png'],
    peso: 0.16,
    dimensiones: '4.5 x 4.5 x 0.7 cm',
    garantiaMeses: 36,
    activo: true,
    destacado: true,
    valoracion: 4.8,
    totalValoraciones: 178,
    categoriaId: '2'
  },
  {
    id: '9',
    sku: 'GPU-NVD-4080',
    nombre: 'GPU NVIDIA RTX 4080',
    descripcion: 'Tarjeta gráfica de última generación con Ray Tracing y DLSS 3.0. 16GB de memoria GDDR6X para máxima calidad visual.',
    descripcionCorta: '16GB GDDR6X, 9728 CUDA cores, DLSS 3.0',
    precio: 1199.99,
    precioOferta: 1099.99,
    stock: 4,
    stockMinimo: 3,
    marca: 'NVIDIA',
    modelo: 'RTX 4080',
    tipo: ProductoTipo.COMPONENTE,
    especificaciones: {
      memoria: '16GB GDDR6X',
      cudaCores: '9728',
      tensorCores: '304',
      rtCores: '76',
      frecuenciaBase: '2505 MHz',
      frecuenciaBoost: '2805 MHz',
      tdp: '320W',
      dlss: '3.0',
      rayTracing: '3ra Generación',
      memoriaAnchoBanda: '1008 GB/s',
      displayport: 'DisplayPort 1.4a x3, HDMI 2.1',
      arquitectura: 'Ada Lovelace'
    },
    imagenes: ['/images/producto_gpu.png'],
    peso: 1.5,
    dimensiones: '28 x 12 x 5 cm',
    garantiaMeses: 36,
    activo: true,
    destacado: true,
    valoracion: 4.9,
    totalValoraciones: 234,
    categoriaId: '2'
  },
  {
    id: '10',
    sku: 'AUR-SEN-HD600',
    nombre: 'Auriculares Sennheiser HD 600',
    descripcion: 'Auriculares de alta fidelidad para audiófilos y profesionales. Diseño open-back con respuesta en frecuencia de 12-39500 Hz.',
    descripcionCorta: 'Open-back, 150 Ohm, respuesta en frecuencia 12-39500 Hz',
    precio: 299.99,
    precioOferta: 249.99,
    stock: 18,
    stockMinimo: 10,
    marca: 'Sennheiser',
    modelo: 'HD 600',
    tipo: ProductoTipo.PERIFERICO,
    especificaciones: {
      tipo: 'Open-back',
      impedancia: '150 Ohm',
      respuestaFrecuencia: '12-39,500 Hz',
      sensibilidad: '105 dB SPL',
      cable: '3m OFC (desconectable)',
      diametroDriver: '42mm',
      peso: '250g (sin cable)',
      acoplador: '6.35mm (incluye adaptador 3.5mm)'
    },
    imagenes: ['/images/producto_auriculares.png'],
    peso: 0.25,
    dimensiones: '15 x 10 x 20 cm',
    garantiaMeses: 24,
    activo: true,
    destacado: false,
    valoracion: 4.9,
    totalValoraciones: 567,
    categoriaId: '6'
  },
  {
    id: '11',
    sku: 'HDD-SEA-8TB',
    nombre: 'Disco Duro HDD Seagate 8TB',
    descripcion: 'Disco duro de gran capacidad para almacenamiento masivo y NAS. Rotación de 5400 RPM y caché de 256MB.',
    descripcionCorta: '5400 RPM, caché 256MB, NAS optimizado',
    precio: 179.99,
    precioOferta: null,
    stock: 31,
    stockMinimo: 15,
    marca: 'Seagate',
    modelo: 'IronWolf 8TB',
    tipo: ProductoTipo.COMPONENTE,
    especificaciones: {
      capacidad: '8TB',
      rotacion: '5400 RPM',
      cache: '256MB',
      interfaz: 'SATA 6Gb/s',
      optimizadoPara: 'NAS, servidores, RAID',
      usoRecomendado: '24/7',
      tasaErrorRecuperable: '1 en 10^14',
      garantia: '2 años (1.8 millones horas MTBF)',
      tecnologia: 'CMR (Conventional Magnetic Recording)',
      platos: '3'
    },
    imagenes: ['/images/producto_hdd.png'],
    peso: 0.64,
    dimensiones: '14.7 x 10.2 x 2.7 cm',
    garantiaMeses: 36,
    activo: true,
    destacado: false,
    valoracion: 4.4,
    totalValoraciones: 89,
    categoriaId: '3'
  },
  {
    id: '12',
    sku: 'RAM-KIN-DD4-16',
    nombre: 'Memoria RAM DDR4 16GB Kingston',
    descripcion: 'Memoria RAM económica y fiable para actualizaciones básicas. Velocidad de 3200MHz con baja latencia.',
    descripcionCorta: '3200MHz CL16, baja latencia, sin RGB',
    precio: 39.99,
    precioOferta: 29.99,
    stock: 55,
    stockMinimo: 20,
    marca: 'Kingston',
    modelo: 'Fury Beast',
    tipo: ProductoTipo.COMPONENTE,
    especificaciones: {
      capacidad: '16GB (2x8GB)',
      tipo: 'DDR4',
      velocidad: '3200MHz',
      latencia: 'CL16',
      voltaje: '1.2V',
      rgb: 'No',
      disipacionTermica: 'Sí (incluye disipador)',
      xmp: 'Sí',
      tiempoLatencia: '10ns'
    },
    imagenes: ['/images/producto_ram_basic.png'],
    peso: 0.06,
    dimensiones: '13.3 x 3 x 0.8 cm',
    garantiaMeses: 36,
    activo: true,
    destacado: false,
    valoracion: 4.3,
    totalValoraciones: 321,
    categoriaId: '4'
  }
]

const categoriasMock = [
  {
    id: '1',
    nombre: 'Ordenadores',
    descripcion: 'Ordenadores de sobremesa y portátiles de alta gama',
    imagenUrl: '/images/categoria_ordenadores.png',
    orden: 1,
    activa: true,
    categoriaPadreId: null,
    subcategorias: [],
    productos: [],
    fechaCreacion: new Date(),
    fechaActualizacion: new Date()
  },
  {
    id: '2',
    nombre: 'Componentes',
    descripcion: 'Componentes informáticos: procesadores, tarjetas gráficas, RAM, almacenamiento',
    imagenUrl: '/images/categoria_componentes.png',
    orden: 2,
    activa: true,
    categoriaPadreId: null,
    subcategorias: [],
    productos: [],
    fechaCreacion: new Date(),
    fechaActualizacion: new Date()
  },
  {
    id: '3',
    nombre: 'Almacenamiento',
    descripcion: 'Discos duros, SSDs y unidades de almacenamiento',
    imagenUrl: '/images/categoria_almacenamiento.png',
    orden: 3,
    activa: true,
    categoriaPadreId: null,
    subcategorias: [],
    productos: [],
    fechaCreacion: new Date(),
    fechaActualizacion: new Date()
  },
  {
    id: '4',
    nombre: 'Memoria RAM',
    descripcion: 'Memoria RAM para todas las necesidades',
    imagenUrl: '/images/categoria_ram.png',
    orden: 4,
    activa: true,
    categoriaPadreId: null,
    subcategorias: [],
    productos: [],
    fechaCreacion: new Date(),
    fechaActualizacion: new Date()
  },
  {
    id: '5',
    nombre: 'Periféricos',
    descripcion: 'Teclados, ratones, monitores, auriculares y más',
    imagenUrl: '/images/categoria_perifericos.png',
    orden: 5,
    activa: true,
    categoriaPadreId: null,
    subcategorias: [],
    productos: [],
    fechaCreacion: new Date(),
    fechaActualizacion: new Date()
  },
  {
    id: '6',
    nombre: 'Audio',
    descripcion: 'Auriculares, altavoces y sistemas de audio',
    imagenUrl: '/images/categoria_audio.png',
    orden: 6,
    activa: true,
    categoriaPadreId: null,
    subcategorias: [],
    productos: [],
    fechaCreacion: new Date(),
    fechaActualizacion: new Date()
  }
]

// GET /api/productos - Listar todos los productos
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const busqueda = searchParams.get('busqueda') || ''
    const tipo = searchParams.get('tipo') || ''
    const categoria = searchParams.get('categoria') || ''
    const marca = searchParams.get('marca') || ''
    const precioMax = searchParams.get('precioMax') ? parseFloat(searchParams.get('precioMax')!) : null
    const enOferta = searchParams.get('enOferta') === 'true'
    const destacado = searchParams.get('destacado') === 'true'
    const enStock = searchParams.get('enStock') === 'true'
    const ordenar = searchParams.get('ordenar') || 'novedad'
    const pagina = parseInt(searchParams.get('pagina') || '1')
    const porPagina = parseInt(searchParams.get('porPagina') || '12')

    // Filtrar productos
    let productosFiltrados = productosMock.filter((producto) => {
      const matchBusqueda = !busqueda || 
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        producto.descripcionCorta.toLowerCase().includes(busqueda.toLowerCase()) ||
        producto.marca.toLowerCase().includes(busqueda.toLowerCase())
      
      const matchTipo = !tipo || producto.tipo === tipo
      const matchCategoria = !categoria || producto.categoriaId === categoria
      const matchMarca = !marca || producto.marca === marca
      const matchPrecio = !precioMax || producto.precio <= precioMax
      const matchOferta = !enOferta || !!producto.precioOferta
      const matchDestacado = !destacado || producto.destacado
      const matchStock = !enStock || producto.stock > 0

      return matchBusqueda && matchTipo && matchCategoria && matchMarca && matchPrecio && matchOferta && matchDestacado && matchStock
    })

    // Ordenar productos
    productosFiltrados.sort((a, b) => {
      switch (ordenar) {
        case 'precio_asc':
          return (a.precioOferta || a.precio) - (b.precioOferta || b.precio)
        case 'precio_desc':
          return (b.precioOferta || b.precio) - (a.precioOferta || a.precio)
        case 'valoracion':
          return b.valoracion - a.valoracion
        case 'nombre':
          return a.nombre.localeCompare(b.nombre)
        case 'novedad':
        default:
          return 0
      }
    })

    // Paginar
    const totalItems = productosFiltrados.length
    const totalPages = Math.ceil(totalItems / porPagina)
    const startIndex = (pagina - 1) * porPagina
    const productosPaginados = productosFiltrados.slice(startIndex, startIndex + porPagina)

    return NextResponse.json({
      success: true,
      data: {
        productos: productosPaginados,
        paginacion: {
          pagina,
          porPagina,
          totalItems,
          totalPages,
          tieneSiguiente: pagina < totalPages,
          tieneAnterior: pagina > 1
        }
      },
      filtrosAplicados: {
        busqueda,
        tipo,
        categoria,
        marca,
        precioMax,
        enOferta,
        destacado,
        enStock
      }
    })
  } catch (error) {
    console.error('Error en GET /api/productos:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener productos',
        datos: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

// GET /api/productos/[id] - Obtener detalle de un producto
export async function GETProductoDetail(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await params

    const producto = productosMock.find((p) => p.id === id)

    if (!producto) {
      return NextResponse.json(
        {
          success: false,
          error: 'Producto no encontrado'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        producto,
        productosRelacionados: productosMock
          .filter((p) => p.id !== id && p.categoriaId === producto.categoriaId)
          .slice(0, 4)
      }
    })
  } catch (error) {
    console.error('Error en GET /api/productos/[id]:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener detalle del producto',
        datos: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

// GET /api/productos/categorias - Listar todas las categorías
export async function GETCategorias(req: Request) {
  try {
    return NextResponse.json({
      success: true,
      data: {
        categorias: categoriasMock.filter((c) => c.activa)
      }
    })
  } catch (error) {
    console.error('Error en GET /api/productos/categorias:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener categorías',
        datos: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

// GET /api/productos/marcas - Listar todas las marcas
export async function GETMarcas(req: Request) {
  try {
    const marcas = Array.from(new Set(productosMock.map((p) => p.marca))).sort()

    return NextResponse.json({
      success: true,
      data: {
        marcas
      }
    })
  } catch (error) {
    console.error('Error en GET /api/productos/marcas:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener marcas',
        datos: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

// GET /api/productos/destacados - Obtener productos destacados
export async function GETDestacados(req: Request) {
  try {
    const limit = parseInt(req.headers.get('limit') || '4')
    
    const productosDestacados = productosMock
      .filter((p) => p.destacado && p.activo)
      .slice(0, limit)

    return NextResponse.json({
      success: true,
      data: {
        productos: productosDestacados
      }
    })
  } catch (error) {
    console.error('Error en GET /api/productos/destacados:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener productos destacados',
        datos: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

// GET /api/productos/ofertas - Obtener productos en oferta
export async function GETOfertas(req: Request) {
  try {
    const limit = parseInt(req.headers.get('limit') || '6')
    
    const productosEnOferta = productosMock
      .filter((p) => p.precioOferta && p.precioOferta < p.precio && p.activo)
      .slice(0, limit)

    return NextResponse.json({
      success: true,
      data: {
        productos: productosEnOferta
      }
    })
  } catch (error) {
    console.error('Error en GET /api/productos/ofertas:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener productos en oferta',
        datos: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}
