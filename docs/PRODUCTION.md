# 🚀 Guía de Deployment en Producción

## 📋 Requisitos Previos

- Bun instalado
- Base de datos SQLite con datos (ejecutar seeds si es necesario)
- Código fuente actualizado

## 🔨 Proceso de Build

### 1. Construir la aplicación

```bash
bun run build
```

Este comando:
- Compila el código TypeScript
- Optimiza los assets
- Genera el directorio `.next/standalone` con todo lo necesario

### 2. Preparar para producción

```bash
./scripts/prepare-production.sh
```

Este script:
- ✅ Genera un `NEXTAUTH_SECRET` seguro (32+ caracteres)
- ✅ Crea el archivo `.env` correcto en `.next/standalone/`
- ✅ Copia la base de datos SQLite
- ✅ Copia el schema de Prisma
- ✅ Configura permisos correctos

**⚠️ IMPORTANTE**: Guarda el `NEXTAUTH_SECRET` que se muestra. Lo necesitarás si reconstruyes la aplicación.

### 3. Ejecutar en producción

```bash
cd .next/standalone
NODE_ENV=production bun server.js
```

La aplicación estará disponible en:
- Local: http://localhost:3000
- Network: http://0.0.0.0:3000

## 🔧 Configuración Manual (Alternativa)

Si prefieres configurar manualmente:

### Crear `.next/standalone/.env`

```env
# Database (usa ruta absoluta en producción)
DATABASE_URL="file:/ruta/absoluta/al/proyecto/.next/standalone/prisma/dev.db"

# NextAuth (DEBE tener mínimo 32 caracteres)
NEXTAUTH_SECRET="tu-secreto-muy-largo-y-seguro-de-minimo-32-caracteres"
NEXTAUTH_URL="http://localhost:3000"

# Node Environment
NODE_ENV="production"
```

**Nota:** El script `prepare-production.sh` genera automáticamente la ruta absoluta correcta.

### Generar NEXTAUTH_SECRET seguro

```bash
openssl rand -base64 32
```

### Copiar archivos necesarios

```bash
# Base de datos
cp prisma/dev.db .next/standalone/prisma/dev.db

# Schema
cp prisma/schema.prisma .next/standalone/prisma/schema.prisma
```

## 🐛 Solución de Problemas

### Error: "JWT_SESSION_ERROR - decryption operation failed"

**Causa**: `NEXTAUTH_SECRET` es demasiado corto o no está configurado.

**Solución**:
```bash
# Generar nuevo secreto
openssl rand -base64 32

# Actualizar .next/standalone/.env con el nuevo valor
```

### Error: "Unable to open the database file"

**Causa**: La ruta de la base de datos no es correcta o no tiene permisos.

**Solución**:
```bash
# Verificar que existe
ls -la .next/standalone/prisma/dev.db

# Verificar permisos
chmod 644 .next/standalone/prisma/dev.db

# Verificar que DATABASE_URL apunta a la ruta correcta
cat .next/standalone/.env | grep DATABASE_URL
# Debe ser: DATABASE_URL="file:./prisma/dev.db"
```

### Error: "Prisma Client not found"

**Solución**:
```bash
cd .next/standalone
bun install
```

## 📦 Estructura del Standalone

```
.next/standalone/
├── .env                    # Variables de entorno de producción
├── server.js              # Servidor de producción
├── package.json           # Dependencias
├── node_modules/          # Módulos de Node
├── .next/                 # Build de Next.js
│   └── server/
│       └── chunks/
├── prisma/                # Base de datos y schema
│   ├── dev.db            # SQLite database
│   └── schema.prisma     # Schema de Prisma
└── public/               # Assets estáticos
    └── images/
```

## 🔄 Actualizar la Aplicación

Cuando hagas cambios en el código:

```bash
# 1. Rebuild
bun run build

# 2. Preparar producción (regenera .env y copia archivos)
./scripts/prepare-production.sh

# 3. Ejecutar
cd .next/standalone
NODE_ENV=production bun server.js
```

## 🌐 Deploy en Servidor

### Usando PM2 (Recomendado)

```bash
# Instalar PM2
bun add -g pm2

# Iniciar aplicación
cd .next/standalone
pm2 start server.js --name "sat1475" --interpreter bun

# Ver logs
pm2 logs sat1475

# Reiniciar
pm2 restart sat1475

# Detener
pm2 stop sat1475
```

### Usando systemd

Crear `/etc/systemd/system/sat1475.service`:

```ini
[Unit]
Description=SAT1475 Application
After=network.target

[Service]
Type=simple
User=richi
WorkingDirectory=/home/richi/Documentos/SAT1475/.next/standalone
Environment="NODE_ENV=production"
ExecStart=/usr/bin/bun server.js
Restart=always

[Install]
WantedBy=multi-user.target
```

Activar:
```bash
sudo systemctl enable sat1475
sudo systemctl start sat1475
sudo systemctl status sat1475
```

## 🔐 Seguridad en Producción

1. **NEXTAUTH_SECRET**: Nunca compartas este valor. Guárdalo en un gestor de secretos.

2. **Base de datos**: 
   - Haz backups regulares de `prisma/dev.db`
   - Considera migrar a PostgreSQL para producción real

3. **HTTPS**: 
   - Usa un reverse proxy (nginx/caddy) con SSL
   - Actualiza `NEXTAUTH_URL` a tu dominio HTTPS

4. **Variables de entorno**:
   - No commitees el `.env` al repositorio
   - Usa variables de entorno del sistema en producción

## 📊 Monitoreo

```bash
# Ver logs en tiempo real
cd .next/standalone
NODE_ENV=production bun server.js 2>&1 | tee production.log

# Verificar uso de recursos
top -p $(pgrep -f "bun server.js")
```

## 🆘 Soporte

Si encuentras problemas:
1. Verifica los logs de la aplicación
2. Revisa que todos los archivos estén en su lugar
3. Confirma que las variables de entorno sean correctas
4. Asegúrate de que la base de datos tenga datos (ejecuta seeds si es necesario)
