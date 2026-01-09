# Solución a los Errores de Producción

## Problemas Identificados

### 1. JWT_SESSION_ERROR (decryption operation failed)
**Causa**: Las cookies de sesión existentes fueron creadas con un `NEXTAUTH_SECRET` diferente al que se está usando actualmente.

**Solución Aplicada**:
- Modificado `scripts/prepare-production.sh` para reutilizar el `NEXTAUTH_SECRET` del archivo `.env` raíz
- Esto asegura consistencia entre desarrollo y producción
- Evita que las sesiones se invaliden al cambiar entre entornos

### 2. PrismaClientInitializationError (Unable to open the database file)
**Causa**: La aplicación no podía encontrar la base de datos porque:
- El archivo `.env` no existía en `.next/standalone/`
- La base de datos no estaba copiada en `.next/standalone/prisma/`
- El servidor se ejecutaba desde el directorio raíz en lugar del directorio standalone

**Solución Aplicada**:
- El script `prepare-production.sh` ahora copia correctamente la base de datos
- Crea el archivo `.env` en `.next/standalone/` con rutas absolutas
- Modificado el script `start` en `package.json` para ejecutarse desde el directorio standalone

## Pasos para Ejecutar en Producción

### 1. Compilar la aplicación
```bash
bun run build
```

### 2. Preparar el entorno de producción
```bash
./scripts/prepare-production.sh
```

Este script:
- ✅ Usa el `NEXTAUTH_SECRET` del `.env` raíz (mantiene consistencia)
- ✅ Crea el archivo `.env` en `.next/standalone/` con rutas absolutas
- ✅ Copia la base de datos a `.next/standalone/prisma/`
- ✅ Copia el `schema.prisma`
- ✅ Establece los permisos correctos

### 3. Iniciar el servidor
```bash
bun run start
```

O alternativamente:
```bash
./scripts/start-production.sh
```

## Solución al Error de Descifrado JWT

Si aún ves el error `JWT_SESSION_ERROR`, necesitas **limpiar las cookies del navegador**:

### Opción 1: Limpiar cookies manualmente
1. Abre las DevTools del navegador (F12)
2. Ve a la pestaña "Application" o "Almacenamiento"
3. En "Cookies", selecciona `http://172.16.1.4:3000` o `http://localhost:3000`
4. Elimina todas las cookies, especialmente `next-auth.session-token-sat1475`
5. Recarga la página

### Opción 2: Usar modo incógnito
Abre la aplicación en una ventana de incógnito para empezar con cookies limpias.

### Opción 3: Limpiar cookies desde el navegador
- **Chrome/Edge**: Configuración → Privacidad → Borrar datos de navegación → Cookies
- **Firefox**: Configuración → Privacidad → Borrar datos → Cookies

## Verificación

Después de seguir estos pasos, verifica que:

1. **Base de datos accesible**:
```bash
ls -lh .next/standalone/prisma/dev.db
```

2. **Archivo .env correcto**:
```bash
cat .next/standalone/.env
```

Debe mostrar:
```
DATABASE_URL="file:/ruta/absoluta/.next/standalone/prisma/dev.db"
NEXTAUTH_SECRET="CaM1n0K0y0T3"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="production"
```

3. **Servidor funcionando**:
- Accede a `http://172.16.1.4:3000` o `http://localhost:3000`
- Los "equipos destacados" deberían cargarse correctamente
- La página `/create-admin` debería funcionar sin errores

## Notas Importantes

⚠️ **NEXTAUTH_SECRET**: El valor `CaM1n0K0y0T3` se mantiene consistente entre desarrollo y producción. Si cambias este valor, todas las sesiones activas se invalidarán.

⚠️ **Cookies**: Si cambias el `NEXTAUTH_SECRET`, debes limpiar las cookies del navegador para evitar errores de descifrado.

⚠️ **Base de datos**: La base de datos se copia durante el build. Si haces cambios en la base de datos de desarrollo, necesitas ejecutar `bun run build` y `./scripts/prepare-production.sh` nuevamente.
