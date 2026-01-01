const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Sembrando datos de compatibilidad extendida...');

    // Limpiar
    await prisma.detallePedido.deleteMany({});
    await prisma.pedido.deleteMany({});
    await prisma.carrito.deleteMany({});
    await prisma.valoracion.deleteMany({});
    await prisma.ticket.deleteMany({});
    await prisma.tecnico.deleteMany({});
    await prisma.usuario.deleteMany({});
    await prisma.producto.deleteMany({});
    await prisma.categoria.deleteMany({});

    console.log('✅ Base de datos limpia');

    // Categorías
    await prisma.categoria.create({ data: { id: 'ordenadores', nombre: 'Ordenadores' } });
    await prisma.categoria.create({ data: { id: 'componentes', nombre: 'Componentes' } });
    await prisma.categoria.create({ data: { id: 'almacenamiento', nombre: 'Almacenamiento' } });
    await prisma.categoria.create({ data: { id: 'ram', nombre: 'Memoria RAM' } });
    await prisma.categoria.create({ data: { id: 'perifericos', nombre: 'Periféricos' } });

    // Usuarios estándar (Contraseña: admin123 para el nuevo admin)
    const usuarios = [
        { id: 'cliente-1', email: 'juan.perez@email.com', nombre: 'Juan', passwordHash: 'hashed', rol: 'cliente' },
        { id: 'cliente-demo', email: 'cliente@test.com', nombre: 'Cliente Demo', passwordHash: 'demo123', rol: 'cliente' },
        { id: 'admin-1', email: 'admin@microinfo.es', nombre: 'Admin', passwordHash: 'hashed', rol: 'admin' },
        { id: 'admin-res', email: 'admin@res.es', nombre: 'Admin Res', passwordHash: '$2b$10$pNfCAhTwG81BxAJZ9INdZuAoxYvyOtw9Kzl9/d8CFA5NrZwPJpMna', rol: 'admin' }, // Password: admin123
    ];
    for (const u of usuarios) await prisma.usuario.create({ data: u });

    // Productos con ambos sets de IDs (para evitar errores de carrito antiguo)
    const productos = [
        {
            id: '1',
            sku: 'LAP-GAM-X15',
            nombre: 'Portátil Gaming Pro X15',
            precio: 1499,
            stock: 50,
            categoriaId: 'ordenadores',
            tipo: 'equipo_completo',
            imagenes: JSON.stringify(['/images/producto_laptop_gaming.png']),
            especificaciones: JSON.stringify({ "GPU": "RTX 4070" }),
            destacado: true
        },
        {
            id: 'prod-1',
            sku: 'LAP-GAM-X15-ALT',
            nombre: 'Portátil Gaming Pro X15 (Legacy)',
            precio: 1499.99,
            stock: 50,
            categoriaId: 'ordenadores',
            tipo: 'equipo_completo',
            imagenes: JSON.stringify(['/images/producto_laptop_gaming.png']),
            especificaciones: JSON.stringify({ "GPU": "RTX 4070" }),
        },
        {
            id: '2',
            sku: 'LAP-ULT-ZEN',
            nombre: 'Portátil Ultralight ZenBook',
            precio: 1199,
            stock: 12,
            categoriaId: 'ordenadores',
            tipo: 'equipo_completo',
            imagenes: JSON.stringify(['/images/producto_laptop_gaming.png']),
        },
        {
            id: '3',
            sku: 'SSD-SAM-2TB',
            nombre: 'SSD NVMe Samsung 980 Pro 2TB',
            precio: 250,
            stock: 100,
            categoriaId: 'almacenamiento',
            tipo: 'componente',
            imagenes: JSON.stringify(['/images/producto_ssd.png']),
        },
        {
            id: 'prod-2',
            sku: 'SSD-SAM-2TB-ALT',
            nombre: 'SSD NVMe Samsung 2TB (Legacy)',
            precio: 329.99,
            stock: 100,
            categoriaId: 'almacenamiento',
            tipo: 'componente',
            imagenes: JSON.stringify(['/images/producto_ssd.png']),
        }
    ];

    for (const p of productos) await prisma.producto.create({ data: p });

    console.log('🚀 Seed de compatibilidad completado');
}

main().catch(console.error).finally(() => prisma.$disconnect());
