# Micro1475 - Sistema de Gestión de Tienda y SAT

Sistema completo de gestión para tienda de informática con servicio técnico integrado (SAT). Desarrollado con Next.js 15, Prisma, SQLite y Bun.

## 📋 Características Principales

- 🛒 **Tienda Online**: Catálogo de productos con filtros avanzados, carrito de compras y gestión de pedidos
- 🔧 **Sistema SAT**: Gestión completa de tickets de soporte técnico con seguimiento en tiempo real
- 👥 **Gestión de Usuarios**: Sistema de autenticación con roles (cliente, técnico, admin, superadmin)
- 📊 **Panel de Administración**: Dashboard completo para gestión de productos, pedidos, tickets y clientes
- 📄 **Generación de PDFs**: Informes de pedidos y tickets con códigos QR para seguimiento
- 📱 **Diseño Responsive**: Interfaz moderna y adaptable a todos los dispositivos
- 🔐 **Autenticación Segura**: Sistema de login con NextAuth.js

## 🚀 Instalación

### Requisitos Previos

#### 1. Instalación de Bun (Entorno de Desarrollo)
El runtime **Bun** se utiliza para el desarrollo, gestión de dependencias y construcción del proyecto por su extrema velocidad.

**Windows:**
```powershell
# Usando PowerShell
powershell -c "irm bun.sh/install.ps1 | iex"
```

**Linux (Debian 13 / Ubuntu):**
```bash
# Usando curl
curl -fsSL https://bun.sh/install | bash
# Recargar el shell
source ~/.bashrc
```

#### 2. Instalación de Node.js (Entorno de Producción)
Para la ejecución en producción, se recomienda **Node.js (LTS)** por su estabilidad y compatibilidad oficial con el modo `standalone` de Next.js.

**Linux (Debian 13 / Ubuntu):**
```bash
# Instalación de Node.js 20 LTS vía NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Windows:**
Descarga e instala la versión **LTS** desde el sitio oficial: [nodejs.org](https://nodejs.org/)


### Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

### Instalación de Dependencias

```bash
bun install
```

### Configuración de la Base de Datos

1. **Crear el archivo de configuración:**
*Nota: No existe archivo .env.example en este repositorio. Debes crearlo manualmente.*

**Linux/macOS:**
```bash
# Crear archivo .env
cat > .env << EOF
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="tu-secreto-aleatorio-muy-seguro-$(openssl rand -hex 16)"
NEXTAUTH_URL="http://localhost:3000"
EOF
```

**Windows (Notepad):**
```cmd
notepad .env
```

2. **Contenido base para `.env`:**
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="tu-secreto-aleatorio-muy-seguro"
NEXTAUTH_URL="http://localhost:3000"
```

3. **Generar el cliente de Prisma:**
```bash
bun run db:generate
```

4. **Crear la base de datos:**
```bash
bun run db:push
```

5. **Poblar la base de datos con datos iniciales:**
```bash
bun scripts/seed-productos.ts
bun scripts/seed-tecnicos.ts
```

Esto creará:
- 12 productos de ejemplo (equipos completos, componentes y periféricos)
- Productos con ofertas y stock
- Estructura completa de la base de datos

### Ejecutar el Proyecto
 
 **Modo Desarrollo (usando Bun):**
 ```bash
 bun run dev
 ```
 
 La aplicación estará disponible en: `http://localhost:3000`
 
 **Modo Producción (usando Node.js):**
 
 Para ejecutar la aplicación en un entorno de producción (servidor estable):

```bash
# 1. Construir la aplicación
bun run build

# 2. Iniciar el servidor de producción (Script optimizado)
./scripts/start-production.sh
```

El script `start-production.sh` se encarga automáticamente de:
- Verificar que el build existe.
- Configurar la ruta correcta a la base de datos (usando la original en `prisma/dev.db`).
- Iniciar el servidor optimizado utilizando **Node.js**.

*Nota: No es necesario ejecutar `prepare-production.sh` manualmente si usas el script de inicio.*

## 📁 Estructura del Proyecto

```
├── prisma/
│   ├── schema.prisma          # Esquema de la base de datos
│   ├── dev.db                 # Base de datos SQLite
│   └── seed-productos.ts      # Script de seed (TypeScript)
│
├── public/
│   ├── favicon.ico            # Icono de la aplicación
│   └── images/                # Imágenes de productos y recursos
│
├── src/
│   ├── app/                   # Rutas y páginas de Next.js
│   │   ├── admin/             # Panel de administración
│   │   │   ├── clientes/      # Gestión de clientes
│   │   │   ├── dashboard/     # Dashboard principal
│   │   │   └── productos/     # Gestión de productos
│   │   ├── admin_conocimiento/ # Base de conocimiento
│   │   ├── admin_pedidos/     # Gestión de pedidos
│   │   ├── admin_tecnicos/    # Gestión de técnicos
│   │   ├── admin_tickets/     # Gestión de tickets SAT
│   │   ├── api/               # API Routes de Next.js
│   │   │   ├── auth/          # Autenticación
│   │   │   ├── productos/     # CRUD de productos
│   │   │   ├── pedidos/       # Gestión de pedidos
│   │   │   ├── sat/           # Sistema de tickets
│   │   │   └── carrito/       # Carrito de compras
│   │   ├── auth/              # Páginas de autenticación
│   │   │   ├── login/         # Inicio de sesión
│   │   │   └── register/      # Registro de usuarios
│   │   ├── carrito/           # Página del carrito
│   │   ├── legal/             # Páginas legales
│   │   ├── mi-cuenta/         # Perfil de usuario
│   │   ├── mis-pedidos/       # Pedidos del usuario
│   │   ├── producto/          # Detalle de producto
│   │   ├── sat/               # Sistema de tickets (cliente)
│   │   │   ├── [id]/          # Detalle de ticket
│   │   │   └── nuevo/         # Crear ticket
│   │   ├── tienda/            # Catálogo de productos
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Página de inicio
│   │
│   ├── components/            # Componentes reutilizables
│   │   ├── admin/             # Componentes de administración
│   │   ├── layout/            # Header, Footer, etc.
│   │   └── ui/                # Componentes UI (shadcn/ui)
│   │
│   ├── lib/                   # Utilidades y configuraciones
│   │   ├── auth.ts            # Configuración de NextAuth
│   │   ├── db.ts              # Cliente de Prisma
│   │   └── utils.ts           # Funciones auxiliares
│   │
│   └── store/                 # Estado global (Zustand)
│       └── use-cart-store.ts  # Store del carrito
│
├── .env                       # Variables de entorno (no incluido en git)
├── scripts/                   # Scripts de utilidad y seeding
│   ├── seed-productos.ts      # Seed de catálogo y categorías
│   └── seed-tecnicos.ts       # Seed de personal técnico/admin
├── package.json               # Dependencias del proyecto
├── tsconfig.json              # Configuración de TypeScript
├── next.config.js             # Configuración de Next.js
├── tailwind.config.ts         # Configuración de Tailwind CSS
└── README.md                  # Este archivo
```

## 🗄️ Base de Datos

El proyecto utiliza **SQLite** con **Prisma ORM**. El esquema incluye:

- **Usuario**: Clientes, técnicos y administradores
- **Producto**: Catálogo de productos con categorías
- **Pedido**: Gestión de pedidos y detalles
- **Ticket**: Sistema de soporte técnico (SAT)
- **Carrito**: Carrito de compras temporal
- **Valoracion**: Reseñas de productos
- **BaseConocimiento**: Artículos de ayuda
- **Documento**: Facturas, albaranes, informes

### Comandos Útiles de Base de Datos

```bash
# Generar cliente de Prisma
bun run db:generate

# Aplicar cambios al esquema
bun run db:push

# Crear una migración
bun run db:migrate

# Resetear la base de datos
bun run db:reset
```

## 👤 Usuarios de Prueba

Después de ejecutar el seed, puedes usar:

**Cliente:**
- Email: `cliente@microinfo.es`
- Contraseña: `cliente123`

**Administrador:**
- Crear desde: `/create-admin`

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 15 (App Router)
- **Runtime**: Bun
- **Base de Datos**: SQLite + Prisma ORM
- **Autenticación**: NextAuth.js
- **UI**: React 19, Tailwind CSS, shadcn/ui
- **Estado**: Zustand
- **Generación PDF**: jsPDF + jspdf-autotable
- **Códigos QR**: qrcode
- **Validación**: Zod
- **Iconos**: Lucide React

## 📝 Scripts Disponibles

```bash
# Desarrollo
bun run dev                      # Inicia el servidor de desarrollo

# Producción
bun run build                    # Construye la aplicación
./scripts/start-production.sh    # Inicia el servidor de producción (Recomendado)

# Base de Datos
bun run db:generate              # Genera el cliente de Prisma
bun run db:push                  # Aplica cambios al esquema
bun run db:migrate               # Crea una migración
bun run db:reset                 # Resetea la base de datos

# Seeding
bun scripts/seed-productos.ts    # Puebla el catálogo de productos
bun scripts/seed-tecnicos.ts     # Crea usuarios técnicos y admin

# Calidad de Código
bun run lint                     # Ejecuta ESLint
```

## 🔒 Seguridad

- Contraseñas hasheadas de forma segura
- Sesiones seguras con NextAuth.js
- Protección CSRF
- Validación de datos con Zod
- Sanitización de inputs
- Roles y permisos por usuario

## 📄 Licencia

Este proyecto está licenciado bajo la **GNU General Public License v3.0 (GPLv3)**.

Esto significa que:
- ✅ Puedes usar, modificar y distribuir este software libremente
- ✅ Debes mantener la misma licencia GPLv3 en trabajos derivados
- ✅ Debes proporcionar el código fuente si distribuyes el software
- ✅ Debes documentar los cambios realizados

Para más información, consulta el archivo [LICENSE](LICENSE) o visita: https://www.gnu.org/licenses/gpl-3.0.html

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Soporte

Para reportar bugs o solicitar nuevas características, por favor abre un issue en el repositorio.

## 🎯 Roadmap

- [ ] Integración con pasarelas de pago
- [ ] Sistema de notificaciones por email
- [ ] Chat en tiempo real para soporte
- [ ] App móvil con React Native
- [ ] Integración con sistemas de envío
- [ ] Analytics y reportes avanzados

---

**Desarrollado con ❤️ usando Next.js y Bun**
