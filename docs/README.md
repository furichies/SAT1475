# 📚 Índice de Documentación

Bienvenido a la documentación del proyecto SAT1475. Aquí encontrarás guías detalladas para diferentes aspectos del sistema.

## 📖 Documentos Disponibles

### 🚀 Deployment y Producción

- **[Guía de Producción](PRODUCTION.md)** - Guía completa para deployment
  - Proceso de build
  - Configuración de variables de entorno
  - Deployment en servidor
  - Opciones de gestión de procesos (PM2, systemd)
  - Mejores prácticas de seguridad

### 🐛 Solución de Problemas

- **[Troubleshooting](TROUBLESHOOTING.md)** - Problemas comunes y soluciones
  - Errores de JWT y autenticación
  - Problemas de base de datos
  - Errores de Prisma
  - Problemas de build
  - Herramientas de diagnóstico

### 📝 Historial de Cambios

- **[Correcciones 2026-01-06](FIXES-2026-01-06.md)** - Resumen de correcciones
  - Problemas identificados en producción
  - Soluciones implementadas
  - Nuevos scripts creados
  - Workflow de producción actualizado

## 🛠️ Scripts Disponibles

### Scripts de Producción

| Script | Descripción | Uso |
|--------|-------------|-----|
| `prepare-production.sh` | Prepara el build para producción | `./scripts/prepare-production.sh` |
| `start-production.sh` | Inicia el servidor de producción | `./scripts/start-production.sh` |
| `verify-production.sh` | Verifica la configuración de producción | `./scripts/verify-production.sh` |

### Scripts de Base de Datos

| Script | Descripción | Uso |
|--------|-------------|-----|
| `seed-productos.ts` | Pobla el catálogo de productos | `bun scripts/seed-productos.ts` |
| `seed-tecnicos.ts` | Crea usuarios técnicos y admin | `bun scripts/seed-tecnicos.ts` |

## 🔗 Enlaces Rápidos

### Documentación Externa

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Bun Documentation](https://bun.sh/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Recursos del Proyecto

- [README Principal](../README.md) - Información general del proyecto
- [Licencia GPL-3.0](../LICENSE) - Términos de licencia

## 🎯 Guías Rápidas

### Primera Instalación

1. Sigue las instrucciones en [README.md](../README.md)
2. Ejecuta los seeds de base de datos
3. Inicia el servidor de desarrollo

### Deployment en Producción

1. Lee la [Guía de Producción](PRODUCTION.md)
2. Ejecuta `bun run build`
3. Ejecuta `./scripts/prepare-production.sh`
4. Ejecuta `./scripts/start-production.sh`

### Solución de Problemas

1. Consulta [Troubleshooting](TROUBLESHOOTING.md)
2. Ejecuta `./scripts/verify-production.sh`
3. Revisa los logs del servidor

## 📞 Soporte

Si no encuentras la respuesta a tu pregunta en la documentación:

1. Revisa el [Troubleshooting](TROUBLESHOOTING.md)
2. Busca en los issues del repositorio
3. Abre un nuevo issue con:
   - Descripción detallada del problema
   - Pasos para reproducir
   - Logs completos del error
   - Información del entorno (OS, versiones, etc.)

## 🔄 Actualizaciones

Esta documentación se actualiza regularmente. Última actualización: **2026-01-06**

---

**Nota:** Todos los documentos están en formato Markdown y pueden visualizarse directamente en GitHub o en cualquier editor de Markdown.
