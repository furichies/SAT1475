# 🐛 Troubleshooting - Problemas Comunes y Soluciones

## Problemas en Producción

### ❌ Error: JWT_SESSION_ERROR - decryption operation failed

**Síntomas:**
```
[next-auth][error][JWT_SESSION_ERROR] 
https://next-auth.js.org/errors#jwt_session_error decryption operation failed
```

**Causa:**
El `NEXTAUTH_SECRET` configurado es demasiado corto. NextAuth.js requiere un secreto de **mínimo 32 caracteres** para las operaciones de cifrado/descifrado de sesiones JWT.

**Solución:**

1. **Generar un secreto seguro:**
```bash
openssl rand -base64 32
```

2. **Actualizar el archivo `.env`:**
```env
NEXTAUTH_SECRET="tu-secreto-generado-de-32-caracteres-o-mas"
```

3. **Si usas el build standalone:**
```bash
# Ejecutar el script de preparación que genera automáticamente un secreto seguro
./scripts/prepare-production.sh
```

**Prevención:**
- Nunca uses secretos cortos como "secret123" o "CaM1n0K0y0T3"
- Usa siempre el script `prepare-production.sh` que genera secretos seguros automáticamente
- Guarda el `NEXTAUTH_SECRET` en un gestor de secretos (no lo pierdas)

---

### ❌ Error: Unable to open the database file

**Síntomas:**
```
Error querying the database: Error code 14: Unable to open the database file
Invalid `prisma.producto.findMany()` invocation
```

**Causa:**
La ruta de la base de datos en `DATABASE_URL` no es correcta o el archivo no existe en la ubicación esperada.

**Solución:**

1. **Verificar que existe la base de datos:**
```bash
ls -la .next/standalone/prisma/dev.db
```

2. **Si no existe, copiarla:**
```bash
cp prisma/dev.db .next/standalone/prisma/dev.db
```

3. **Verificar permisos:**
```bash
chmod 644 .next/standalone/prisma/dev.db
```

4. **Verificar la variable de entorno:**
```bash
cat .next/standalone/.env | grep DATABASE_URL
# Debe mostrar una ruta ABSOLUTA como:
# DATABASE_URL="file:/home/usuario/proyecto/.next/standalone/prisma/dev.db"
```

5. **Usar el script de preparación (recomendado):**
```bash
./scripts/prepare-production.sh
```

**Prevención:**
- Siempre ejecuta `prepare-production.sh` después de `bun run build`
- El script genera automáticamente la ruta absoluta correcta
- **Importante:** En producción, usa SIEMPRE rutas absolutas para DATABASE_URL

---

### ❌ Error: Prisma Client not initialized

**Síntomas:**
```
PrismaClient is unable to be run in the browser
```

**Causa:**
Estás intentando usar Prisma en un componente del cliente (Client Component).

**Solución:**

1. **Mover la lógica de base de datos a Server Components o API Routes**
2. **Usar API Routes para acceder a la base de datos:**

```typescript
// ❌ MAL - En un Client Component
'use client'
import { db } from '@/lib/db'

export default function Component() {
  const data = await db.producto.findMany() // ERROR
}

// ✅ BIEN - En un Server Component
import { db } from '@/lib/db'

export default async function Component() {
  const data = await db.producto.findMany() // OK
}

// ✅ BIEN - Usando API Route
'use client'
export default function Component() {
  const [data, setData] = useState([])
  
  useEffect(() => {
    fetch('/api/productos')
      .then(res => res.json())
      .then(data => setData(data))
  }, [])
}
```

---

### ❌ Error: Module not found after build

**Síntomas:**
```
Module not found: Can't resolve '@/components/...'
```

**Causa:**
Problema con los alias de TypeScript o archivos no copiados al build.

**Solución:**

1. **Verificar `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

2. **Limpiar y reconstruir:**
```bash
rm -rf .next
bun run build
./scripts/prepare-production.sh
```

---

### ❌ Error: NEXTAUTH_URL is not defined

**Síntomas:**
```
[next-auth][error][MISSING_NEXTAUTH_URL]
```

**Solución:**

1. **Verificar el archivo `.env`:**
```env
NEXTAUTH_URL="http://localhost:3000"
```

2. **Para producción con dominio:**
```env
NEXTAUTH_URL="https://tudominio.com"
```

3. **Usar el script de preparación:**
```bash
./scripts/prepare-production.sh
```

---

## Problemas en Desarrollo

### ❌ Error: Port 3000 already in use

**Solución:**

```bash
# Encontrar el proceso
lsof -i :3000

# Matar el proceso
kill -9 <PID>

# O usar otro puerto
PORT=3001 bun run dev
```

---

### ❌ Error: bcrypt not found

**Síntomas:**
```
Cannot find module 'bcrypt'
```

**Solución:**

```bash
bun add bcrypt
bun add -d @types/bcrypt
```

---

### ❌ Error: Prisma Client out of sync

**Síntomas:**
```
Prisma schema has been changed. Please run `prisma generate`
```

**Solución:**

```bash
bun run db:generate
```

---

## Problemas de Base de Datos

### ❌ Error: Unique constraint failed

**Síntomas:**
```
Unique constraint failed on the fields: (`email`)
```

**Causa:**
Intentas crear un registro con un valor único que ya existe.

**Solución:**

1. **Verificar si el registro existe antes de crear:**
```typescript
const existing = await db.usuario.findUnique({
  where: { email: 'test@example.com' }
})

if (!existing) {
  await db.usuario.create({ ... })
}
```

2. **Usar `upsert` para crear o actualizar:**
```typescript
await db.usuario.upsert({
  where: { email: 'test@example.com' },
  update: { ... },
  create: { ... }
})
```

---

### ❌ Error: Foreign key constraint failed

**Causa:**
Intentas crear/actualizar un registro con una referencia a otro registro que no existe.

**Solución:**

1. **Verificar que el registro relacionado existe:**
```typescript
const categoria = await db.categoria.findUnique({
  where: { id: categoriaId }
})

if (categoria) {
  await db.producto.create({
    data: {
      categoriaId: categoria.id,
      ...
    }
  })
}
```

---

## Problemas de Autenticación

### ❌ Error: Invalid credentials

**Causa:**
- Email o contraseña incorrectos
- Usuario inactivo
- Hash de contraseña incorrecto

**Solución:**

1. **Verificar que el usuario existe:**
```bash
# Abrir la base de datos
sqlite3 prisma/dev.db
SELECT email, activo FROM Usuario WHERE email = 'test@example.com';
```

2. **Resetear contraseña (desarrollo):**
```typescript
import { hash } from 'bcryptjs'

const passwordHash = await hash('nuevacontraseña', 10)
await db.usuario.update({
  where: { email: 'test@example.com' },
  data: { passwordHash }
})
```

---

## Herramientas de Diagnóstico

### Verificar el estado del build

```bash
# Ver estructura del standalone
tree -L 3 .next/standalone

# Verificar variables de entorno
cat .next/standalone/.env

# Verificar base de datos
ls -lh .next/standalone/prisma/dev.db

# Probar conexión a la base de datos
sqlite3 .next/standalone/prisma/dev.db "SELECT COUNT(*) FROM Producto;"
```

### Logs de producción

```bash
# Ejecutar con logs detallados
cd .next/standalone
NODE_ENV=production DEBUG=* bun server.js 2>&1 | tee production.log
```

### Verificar integridad de la base de datos

```bash
sqlite3 prisma/dev.db "PRAGMA integrity_check;"
```

---

## 🆘 Checklist de Diagnóstico

Cuando encuentres un error, sigue este checklist:

- [ ] ¿El error ocurre en desarrollo o producción?
- [ ] ¿Has ejecutado `bun install` recientemente?
- [ ] ¿Has ejecutado `bun run db:generate` después de cambiar el schema?
- [ ] ¿Existe el archivo `.env` con todas las variables necesarias?
- [ ] ¿El `NEXTAUTH_SECRET` tiene al menos 32 caracteres?
- [ ] ¿La base de datos existe y tiene datos?
- [ ] ¿Los permisos de archivos son correctos?
- [ ] ¿Has limpiado el build? (`rm -rf .next`)
- [ ] ¿Has revisado los logs completos del error?

---

## 📞 Obtener Ayuda

Si ninguna de estas soluciones funciona:

1. **Revisa los logs completos** del error
2. **Busca el error específico** en la documentación de:
   - [Next.js](https://nextjs.org/docs)
   - [NextAuth.js](https://next-auth.js.org)
   - [Prisma](https://www.prisma.io/docs)
3. **Abre un issue** en el repositorio con:
   - Descripción del problema
   - Pasos para reproducir
   - Logs completos del error
   - Versiones de las dependencias
