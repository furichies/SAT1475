import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function main() {
    const technicians = [
        { nombre: 'Carlos García', email: 'carlos@microinfo.es' },
        { nombre: 'María Martínez', email: 'maria@microinfo.es' },
        { nombre: 'Diego Fernández', email: 'diego@microinfo.es' }
    ]

    for (const tech of technicians) {
        let user = await db.usuario.findUnique({ where: { email: tech.email } })
        if (!user) {
            user = await db.usuario.create({
                data: {
                    email: tech.email,
                    nombre: tech.nombre,
                    passwordHash: 'dummy',
                    rol: 'tecnico'
                }
            })
        }

        const tecnico = await db.tecnico.findUnique({ where: { usuarioId: user.id } })
        if (!tecnico) {
            await db.tecnico.create({
                data: {
                    usuarioId: user.id,
                    nivel: 'senior'
                }
            })
            console.log(`Creado técnico: ${tech.nombre}`)
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await db.$disconnect())
