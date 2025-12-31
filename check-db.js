const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const productos = await prisma.producto.findMany({
        select: { id: true, nombre: true, stock: true }
    });
    console.log(JSON.stringify(productos, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
