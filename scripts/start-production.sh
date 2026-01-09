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

# Verificar que existe la base de datos original
if [ ! -f "../../prisma/dev.db" ] && [ ! -f "prisma/dev.db" ]; then
  echo "❌ Error: No se encuentra la base de datos en prisma/dev.db"
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

# Usar ruta absoluta para la base de datos para evitar problemas con standalone
DB_PATH="$(pwd)/../../prisma/dev.db"
if [ ! -f "$DB_PATH" ]; then
    # Fallback si estamos ejecutando desde root
    DB_PATH="$(pwd)/prisma/dev.db"
fi

# Cambiar al directorio standalone e iniciar
cd .next/standalone
DATABASE_URL="file:${DB_PATH}" NODE_ENV=production bun server.js
