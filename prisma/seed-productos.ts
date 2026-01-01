import { PrismaClient } from '@prisma/client'
import { ProductoTipo } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Sembrando datos de productos y categorías...')

  // Crear categorías
  const categorias = [
    {
      nombre: 'Ordenadores',
      descripcion: 'Ordenadores de sobremesa y portátiles de alta gama',
      imagenUrl: '/images/categoria_ordenadores.png',
      orden: 1,
      activa: true
    },
    {
      nombre: 'Componentes',
      descripcion: 'Componentes informáticos: procesadores, tarjetas gráficas, RAM, almacenamiento',
      imagenUrl: '/images/categoria_componentes.png',
      orden: 2,
      activa: true
    },
    {
      nombre: 'Almacenamiento',
      descripcion: 'Discos duros, SSDs y unidades de almacenamiento',
      imagenUrl: '/images/categoria_almacenamiento.png',
      orden: 3,
      activa: true
    },
    {
      nombre: 'Memoria RAM',
      descripcion: 'Memoria RAM para todas las necesidades',
      imagenUrl: '/images/categoria_ram.png',
      orden: 4,
      activa: true
    },
    {
      nombre: 'Periféricos',
      descripcion: 'Teclados, ratones, monitores, auriculares y más',
      imagenUrl: '/images/categoria_perifericos.png',
      orden: 5,
      activa: true
    },
    {
      nombre: 'Audio',
      descripcion: 'Auriculares, altavoces y sistemas de audio',
      imagenUrl: '/images/categoria_audio.png',
      orden: 6,
      activa: true
    }
  ]

  console.log('📁 Creando categorías...')
  for (const categoria of categorias) {
    await prisma.categoria.create({
      data: categoria
    })
  }
  console.log(`✅ ${categorias.length} categorías creadas`)

  // Crear productos
  const productos = [
    {
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
      tipo: ProductoTipo.equipo_completo,
      especificaciones: JSON.stringify({
        procesador: 'Intel Core i7-13700H (14 núcleos)',
        gpu: 'NVIDIA GeForce RTX 4070 8GB GDDR6',
        ram: '32GB DDR5 4800MHz Dual Channel',
        almacenamiento: '1TB NVMe SSD, 7000MB/s lectura',
        pantalla: '15.6" QHD 240Hz, G-Sync Compatible',
        bateria: '90Wh, hasta 6 horas de uso mixto',
        so: 'Windows 11 Home OEM',
        conectividad: 'Wi-Fi 6E, Bluetooth 5.3, USB 3.2 Gen2, HDMI 2.1',
        peso: '2.8 kg'
      }),
      imagenes: JSON.stringify(['/images/producto_laptop_gaming.png']),
      peso: 2.8,
      dimensiones: '35.5 x 25.5 x 2.5 cm',
      garantiaMeses: 24,
      activo: true,
      destacado: true
    },
    {
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
      tipo: ProductoTipo.equipo_completo,
      especificaciones: JSON.stringify({
        procesador: 'Intel Core i5-1340P',
        ram: '16GB LPDDR5',
        almacenamiento: '512GB SSD',
        pantalla: '14" OLED 2.8K',
        bateria: '75Wh',
        so: 'Windows 11 Home OEM',
        peso: '1.2 kg'
      }),
      imagenes: JSON.stringify(['/images/producto_laptop_gaming.png']),
      peso: 1.2,
      dimensiones: '31.8 x 21.8 x 1.8 cm',
      garantiaMeses: 24,
      activo: true,
      destacado: false
    },
    {
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
      tipo: ProductoTipo.componente,
      especificaciones: JSON.stringify({
        interfaz: 'NVMe PCIe 4.0',
        velocidadLectura: '7.000 MB/s',
        velocidadEscritura: '5.000 MB/s',
        cache: '256MB',
        factorDeForma: 'M.2 2280',
        tecnologia: 'V-NAND 3-bit MLC',
        tbw: '1200 TBW',
        vidaUtil: '5 años'
      }),
      imagenes: JSON.stringify(['/images/producto_ssd.png']),
      peso: 0.078,
      dimensiones: '8 x 2.2 x 0.2 cm',
      garantiaMeses: 36,
      activo: true,
      destacado: true
    },
    {
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
      tipo: ProductoTipo.componente,
      especificaciones: JSON.stringify({
        capacidad: '32GB (2x16GB)',
        tipo: 'DDR5',
        velocidad: '6000MHz',
        latencia: 'CL36',
        voltaje: '1.25V',
        rgb: 'Sí, 16.8 millones de colores',
        disipacionTermica: 'XMP 3.0',
        xmp: 'Sí'
      }),
      imagenes: JSON.stringify(['/images/producto_ram.png']),
      peso: 0.07,
      dimensiones: '13.7 x 4.3 x 0.8 cm',
      garantiaMeses: 36,
      activo: true,
      destacado: true
    },
    {
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
      tipo: ProductoTipo.periferico,
      especificaciones: JSON.stringify({
        tamano: '32" curvo',
        curvatura: '1000R',
        resolucion: '3840 x 2160 (4K)',
        tasaRefresco: '165Hz',
        tiempoRespuesta: '1ms (GtG)',
        panel: 'VA',
        srgb: '125% sRGB',
        hdr: 'HDR10+',
        freesync: 'AMD FreeSync Premium Pro',
        brillo: '600 cd/m2',
        contraste: '3000:1',
        angulosVisuales: '178/178'
      }),
      imagenes: JSON.stringify(['/images/producto_monitor.png']),
      peso: 7.5,
      dimensiones: '73 x 55 x 25 cm',
      garantiaMeses: 24,
      activo: true,
      destacado: false
    },
    {
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
      tipo: ProductoTipo.periferico,
      especificaciones: JSON.stringify({
        switches: 'Cherry MX Red (táctiles)',
        tipo: 'Mecánico',
        teclas: '87 (TKL sin teclas de función)',
        conexion: 'Bluetooth o USB-C',
        bateria: 'hasta 90 horas',
        rgb: '16.8M colores',
        keycaps: 'PBT doblado de inyección',
        peso: '79.5g (sin cable)',
        pollingRate: '1ms'
      }),
      imagenes: JSON.stringify(['/images/producto_teclado.png']),
      peso: 0.73,
      dimensiones: '31 x 13 x 4 cm',
      garantiaMeses: 24,
      activo: true,
      destacado: false
    },
    {
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
      tipo: ProductoTipo.periferico,
      especificaciones: JSON.stringify({
        sensor: '25,600 DPI Focus Pro óptico',
        dpiMax: '25,600',
        dpiMin: '100',
        botones: '8 programables',
        scroll: 'Ergonomico',
        conexion: 'SpeedCable USB o HyperSpeed Wireless',
        pollingRate: '1000Hz (inalámbrico)',
        bateria: 'hasta 90 horas',
        peso: '62g (inalámbrico)'
      }),
      imagenes: JSON.stringify(['/images/producto_raton.png']),
      peso: 0.06,
      dimensiones: '12.7 x 6 x 4 cm',
      garantiaMeses: 24,
      activo: true,
      destacado: false
    },
    {
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
      tipo: ProductoTipo.componente,
      especificaciones: JSON.stringify({
        nucleos: '24 (8 Performance + 16 Efficient)',
        hilos: '32',
        frecuenciaBase: '3.0 GHz',
        frecuenciaTurbo: '5.8 GHz',
        cacheL3: '36MB',
        tdp: '125W',
        socket: 'LGA 1700',
        memoriaSoportada: 'DDR4-3200 y DDR5-5600',
        arquitectura: 'Raptor Lake',
        overclocking: 'Si'
      }),
      imagenes: JSON.stringify(['/images/producto_cpu.png']),
      peso: 0.16,
      dimensiones: '4.5 x 4.5 x 0.7 cm',
      garantiaMeses: 36,
      activo: true,
      destacado: true
    },
    {
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
      tipo: ProductoTipo.componente,
      especificaciones: JSON.stringify({
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
      }),
      imagenes: JSON.stringify(['/images/producto_gpu.png']),
      peso: 1.5,
      dimensiones: '28 x 12 x 5 cm',
      garantiaMeses: 36,
      activo: true,
      destacado: true
    },
    {
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
      tipo: ProductoTipo.periferico,
      especificaciones: JSON.stringify({
        tipo: 'Open-back',
        impedancia: '150 Ohm',
        respuestaFrecuencia: '12-39,500 Hz',
        sensibilidad: '105 dB SPL',
        diametroDriver: '42mm',
        cable: '3m OFC (desconectable)',
        peso: '250g (sin cable)',
        acoplador: '6.35mm (incluye adaptador 3.5mm)'
      }),
      imagenes: JSON.stringify(['/images/producto_auriculares.png']),
      peso: 0.25,
      dimensiones: '15 x 10 x 20 cm',
      garantiaMeses: 24,
      activo: true,
      destacado: false
    },
    {
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
      tipo: ProductoTipo.componente,
      especificaciones: JSON.stringify({
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
      }),
      imagenes: JSON.stringify(['/images/producto_hdd.png']),
      peso: 0.64,
      dimensiones: '14.7 x 10.2 x 2.7 cm',
      garantiaMeses: 36,
      activo: true,
      destacado: false
    },
    {
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
      tipo: ProductoTipo.componente,
      especificaciones: JSON.stringify({
        capacidad: '16GB (2x8GB)',
        tipo: 'DDR4',
        velocidad: '3200MHz',
        latencia: 'CL16',
        voltaje: '1.2V',
        rgb: 'No',
        disipacionTermica: 'Sí (incluye disipador)',
        xmp: 'Sí',
        tiempoLatencia: '10ns'
      }),
      imagenes: JSON.stringify(['/images/producto_ram_basic.png']),
      peso: 0.06,
      dimensiones: '13.3 x 3 x 0.8 cm',
      garantiaMeses: 36,
      activo: true,
      destacado: false
    }
  ]

  console.log('📦 Creando productos...')

  // Asociar productos con categorías
  const categoriaOrdenadores = await prisma.categoria.findFirst({
    where: { nombre: 'Ordenadores' }
  })
  const categoriaComponentes = await prisma.categoria.findFirst({
    where: { nombre: 'Componentes' }
  })
  const categoriaAlmacenamiento = await prisma.categoria.findFirst({
    where: { nombre: 'Almacenamiento' }
  })
  const categoriaRam = await prisma.categoria.findFirst({
    where: { nombre: 'Memoria RAM' }
  })
  const categoriaPerifericos = await prisma.categoria.findFirst({
    where: { nombre: 'Periféricos' }
  })
  const categoriaAudio = await prisma.categoria.findFirst({
    where: { nombre: 'Audio' }
  })

  for (const producto of productos) {
    let categoriaId: string | null = null

    // Asignar categoría según el tipo
    if (producto.tipo === ProductoTipo.equipo_completo) {
      categoriaId = categoriaOrdenadores?.id || null
    } else if (producto.tipo === ProductoTipo.componente) {
      if (producto.modelo.includes('SSD') || producto.modelo.includes('HDD')) {
        categoriaId = categoriaAlmacenamiento?.id || null
      } else if (producto.modelo.includes('RAM') || producto.modelo.includes('CPU') || producto.modelo.includes('GPU')) {
        categoriaId = categoriaComponentes?.id || null
      } else {
        categoriaId = categoriaComponentes?.id || null
      }
    } else if (producto.tipo === ProductoTipo.periferico) {
      if (producto.modelo.includes('Sennheiser')) {
        categoriaId = categoriaAudio?.id || null
      } else {
        categoriaId = categoriaPerifericos?.id || null
      }
    }

    await prisma.producto.create({
      data: {
        ...producto,
        categoriaId
      }
    })
  }

  console.log(`✅ ${productos.length} productos creados`)

  // Obtener productos creados para valoraciones
  const productosCreados = await prisma.producto.findMany({
    where: { sku: { in: productos.slice(0, 3).map(p => p.sku) } }
  })

  // Crear algunas valoraciones de ejemplo
  console.log('⭐ Creando valoraciones de ejemplo...')

  for (const producto of productosCreados) {
    {
      id: 'demo-user-1',
        email: 'demo1@microinfo.es',
          passwordHash: '$2b$12$LQv3c1yqBHqZK6zW3YJ7w5jOz0QIwYj4z7M0w1xY', // demo123
            nombre: 'Juan Pérez',
              apellidos: 'García López',
                telefono: '+34 600 123 456',
                  direccion: 'Calle Mayor, 123',
                    codigoPostal: '28001',
                      ciudad: 'Madrid',
                        provincia: 'Madrid',
                          rol: 'cliente'
    },
    {
      id: 'demo-user-2',
        email: 'demo2@microinfo.es',
          passwordHash: '$2b$12$LQv3c1yqBHqZK6zW3YJ7w5jOz0QIwYj4z7M0w1xY', // demo123
            nombre: 'María García',
              apellidos: 'Martínez Sánchez',
                telefono: '+34 600 789 012',
                  direccion: 'Avenida de la Castellana, 45',
                    codigoPostal: '28002',
                      ciudad: 'Madrid',
                        provincia: 'Madrid',
                          rol: 'cliente' as any
    }
  ]

    // Crear usuarios de demo
    for (const usuario of usuariosDemo) {
      await prisma.usuario.create({
        data: usuario
      })
    }
    console.log(`✅ ${usuariosDemo.length} usuarios de demo creados`)

    for (const producto of productosConValoraciones) {
      const valoraciones = [
        {
          usuarioId: usuariosDemo[0].id,
          puntuacion: 5,
          titulo: '¡Excelente producto!',
          comentario: 'He estado usando este producto durante 3 meses y el rendimiento es increíble. Los juegos corren fluidos en Ultra settings y la pantalla QHD es espectacular.',
          verificada: true
        },
        {
          usuarioId: usuariosDemo[1].id,
          puntuacion: 5,
          titulo: 'Mejor compra del año',
          comentario: 'Increíble relación calidad-precio. El RGB de la tecla y el sistema de refrigeración funcionan perfectamente. Totalmente recomendado.',
          verificada: true
        }
      ]

      for (const valoracion of valoraciones) {
        await prisma.valoracion.create({
          data: {
            ...valoracion,
            productoId: producto.id
          }
        })
      }
    }

    console.log(`✅ ${productosConValoraciones.length * 2} valoraciones creadas`)

    console.log('✅ Seed de productos completado!')
  }

  main()
    .catch((e) => {
      console.error('❌ Error durante el seed:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
