#!/bin/bash

# Script para iniciar el servidor de producción
# Uso: ./scripts/start-production.sh

set -e

echo "🚀 Iniciando servidor de producción SAT1475..."

# Verificar que existe el build
if [ ! -d ".next/standalone" ]; then
  echo "❌ Error: No se encuentra el build de producción"
  echo ""
  echo "Ejecuta primero:"
  echo "  1. bun run build"
  echo "  2. ./scripts/prepare-production.sh"
  exit 1
fi

# Verificar que existe el .env
if [ ! -f ".next/standalone/.env" ]; then
  echo "❌ Error: No se encuentra .env en .next/standalone/"
  echo ""
  echo "Ejecuta primero:"
  echo "  ./scripts/prepare-production.sh"
  exit 1
fi



echo "✅ Verificaciones completadas"
echo ""
echo "📍 Directorio: .next/standalone"
echo "🌐 URL: http://localhost:3000"
echo ""
echo "Para detener el servidor: Ctrl+C"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Usar ruta absoluta para la base de datos
# Prioridad 1: Base de datos en raíz del proyecto (Persistente)
DB_PATH="$(pwd)/../../prisma/dev.db"

# Prioridad 2: Fallback si ejecutamos desde root
if [ ! -f "$DB_PATH" ]; then
    DB_PATH="$(pwd)/prisma/dev.db"
fi

# Prioridad 3: Verificar ruta anómala por error de configuración (prisma/prisma/dev.db)
if [ ! -f "$DB_PATH" ]; then
    if [ -f "$(pwd)/prisma/prisma/dev.db" ]; then
        echo "⚠️  ADVERTENCIA: Se detectó la base de datos anidada en 'prisma/prisma/dev.db'."
        echo "   Esto ocurre por una configuración incorrecta en .env (file:./prisma/dev.db)."
        echo "   Intentando usar esta base de datos..."
        DB_PATH="$(pwd)/prisma/prisma/dev.db"
    elif [ -f "$(pwd)/../../prisma/prisma/dev.db" ]; then
        DB_PATH="$(pwd)/../../prisma/prisma/dev.db"
    fi
fi

# Prioridad 4: Base de datos empaquetada en standalone (No persistente entre builds)
if [ ! -f "$DB_PATH" ]; then
    echo "⚠️  No se encontró base de datos persistente en la raíz."
    echo "   Buscando en desplegable standalone..."
    
    # Check relative to standalone dir
    if [ -f "prisma/dev.db" ]; then
       # We are in .next/standalone/ so this is local
       # But we need absolute path logic if we are passing it via env
       # Usually start script cd's later.
       # Let's assume we are at root for now based on previous checks.
       DB_PATH="$(pwd)/.next/standalone/prisma/dev.db"
    fi
fi

if [ ! -f "$DB_PATH" ]; then
     echo "❌ Error CRÍTICO: No se puede encontrar el archivo de base de datos 'dev.db' en ninguna ubicación estándar."
     echo "   Ubicaciones verificadas:"
     echo "   - ../../prisma/dev.db (Raíz)"
     echo "   - prisma/dev.db (Raíz local)"
     echo "   - prisma/prisma/dev.db (Error común)"
     exit 1
fi


# Cambiar al directorio standalone e iniciar
cd .next/standalone
DATABASE_URL="file:${DB_PATH}" NODE_ENV=production node server.js
