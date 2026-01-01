import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const db = new PrismaClient()

async function main() {
    console.log('🚀 Iniciando seed de técnicos...')

    // Contraseña estándar para técnicos de prueba
    const passwordHash = await bcrypt.hash('tecnico123', 10)

    const technicians = [
        {
            nombre: 'Carlos García',
            email: 'tecnico@microinfo.es',
            apellidos: 'Especialista Hardware',
            nivel: 'experto' as const,
            especialidades: ['Portátiles', 'Servidores']
        },
        {
            nombre: 'María Martínez',
            email: 'maria@microinfo.es',
            apellidos: 'Soporte Software',
            nivel: 'senior' as const,
            especialidades: ['Windows', 'Recuperación de Datos']
        },
        {
            nombre: 'Diego Fernández',
            email: 'diego@microinfo.es',
            apellidos: 'Redes y Seguridad',
            nivel: 'senior' as const,
            especialidades: ['Redes', 'Seguridad WiFi']
        }
    ]

    for (const tech of technicians) {
        // 1. Buscar o crear el Usuario
        let user = await db.usuario.findUnique({ where: { email: tech.email } })

        if (!user) {
            user = await db.usuario.create({
                data: {
                    email: tech.email,
                    nombre: tech.nombre,
                    apellidos: tech.apellidos,
                    passwordHash: passwordHash,
                    rol: 'tecnico'
                }
            })
            console.log(`✅ Usuario creado: ${tech.email}`)
        } else {
            // Asegurar que tenga el rol correcto si ya existe
            user = await db.usuario.update({
                where: { id: user.id },
                data: { rol: 'tecnico', apellidos: tech.apellidos }
            })
        }

        // 2. Buscar o crear el Perfil de Técnico
        const tecnicoProfile = await db.tecnico.findUnique({ where: { usuarioId: user.id } })

        if (!tecnicoProfile) {
            await db.tecnico.create({
                data: {
                    usuarioId: user.id,
                    nivel: tech.nivel,
                    especialidades: JSON.stringify(tech.especialidades),
                    disponible: true
                }
            })
            console.log(`⭐ Perfil de técnico vinculado a: ${tech.nombre}`)
        } else {
            console.log(`ℹ️ El técnico ${tech.nombre} ya tenía perfil vinculado.`)
        }
    }

    console.log('✨ Seed de técnicos finalizado con éxito.')
}

main()
    .catch(e => {
        console.error('❌ Error en el seed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })
