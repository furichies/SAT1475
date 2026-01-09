#!/bin/bash

# Script para verificar que el build de producción está listo
# Uso: ./scripts/verify-production.sh

set -e

echo "🔍 Verificando configuración de producción..."
echo ""

ERRORS=0

# Verificar que existe el directorio standalone
if [ ! -d ".next/standalone" ]; then
  echo "❌ No se encuentra .next/standalone/"
  echo "   Ejecuta: bun run build"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ Directorio .next/standalone/ existe"
fi

# Verificar que existe el .env
if [ ! -f ".next/standalone/.env" ]; then
  echo "❌ No se encuentra .next/standalone/.env"
  echo "   Ejecuta: ./scripts/prepare-production.sh"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ Archivo .env existe"
  
  # Verificar NEXTAUTH_SECRET
  SECRET=$(grep NEXTAUTH_SECRET .next/standalone/.env | cut -d'=' -f2 | tr -d '"')
  SECRET_LENGTH=${#SECRET}
  
  if [ $SECRET_LENGTH -lt 32 ]; then
    echo "❌ NEXTAUTH_SECRET es demasiado corto ($SECRET_LENGTH caracteres)"
    echo "   Debe tener al menos 32 caracteres"
    echo "   Ejecuta: ./scripts/prepare-production.sh"
    ERRORS=$((ERRORS + 1))
  else
    echo "✅ NEXTAUTH_SECRET tiene longitud adecuada ($SECRET_LENGTH caracteres)"
  fi
  
  # Verificar DATABASE_URL
  if grep -q "DATABASE_URL" .next/standalone/.env; then
    echo "✅ DATABASE_URL está configurado"
  else
    echo "❌ DATABASE_URL no está configurado"
    ERRORS=$((ERRORS + 1))
  fi
  
  # Verificar NEXTAUTH_URL
  if grep -q "NEXTAUTH_URL" .next/standalone/.env; then
    echo "✅ NEXTAUTH_URL está configurado"
  else
    echo "❌ NEXTAUTH_URL no está configurado"
    ERRORS=$((ERRORS + 1))
  fi
fi

# Verificar que existe la base de datos
if [ ! -f ".next/standalone/prisma/dev.db" ]; then
  echo "❌ No se encuentra .next/standalone/prisma/dev.db"
  echo "   Ejecuta: ./scripts/prepare-production.sh"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ Base de datos existe"
  
  # Verificar tamaño de la base de datos
  DB_SIZE=$(stat -f%z ".next/standalone/prisma/dev.db" 2>/dev/null || stat -c%s ".next/standalone/prisma/dev.db" 2>/dev/null)
  
  if [ $DB_SIZE -lt 10000 ]; then
    echo "⚠️  Base de datos parece vacía (${DB_SIZE} bytes)"
    echo "   Considera ejecutar los seeds:"
    echo "   - bun scripts/seed-productos.ts"
    echo "   - bun scripts/seed-tecnicos.ts"
  else
    echo "✅ Base de datos tiene datos ($(numfmt --to=iec-i --suffix=B $DB_SIZE 2>/dev/null || echo ${DB_SIZE} bytes))"
  fi
  
  # Verificar permisos
  if [ -r ".next/standalone/prisma/dev.db" ] && [ -w ".next/standalone/prisma/dev.db" ]; then
    echo "✅ Permisos de base de datos correctos"
  else
    echo "❌ Permisos de base de datos incorrectos"
    echo "   Ejecuta: chmod 644 .next/standalone/prisma/dev.db"
    ERRORS=$((ERRORS + 1))
  fi
fi

# Verificar que existe schema.prisma
if [ ! -f ".next/standalone/prisma/schema.prisma" ]; then
  echo "❌ No se encuentra .next/standalone/prisma/schema.prisma"
  echo "   Ejecuta: ./scripts/prepare-production.sh"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ Schema de Prisma existe"
fi

# Verificar que existe server.js
if [ ! -f ".next/standalone/server.js" ]; then
  echo "❌ No se encuentra .next/standalone/server.js"
  echo "   Ejecuta: bun run build"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ Servidor de producción existe"
fi

# Verificar que existe node_modules
if [ ! -d ".next/standalone/node_modules" ]; then
  echo "⚠️  No se encuentra .next/standalone/node_modules"
  echo "   El build standalone debería incluirlo automáticamente"
  echo "   Si hay errores, ejecuta: cd .next/standalone && bun install"
else
  echo "✅ Dependencias instaladas"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $ERRORS -eq 0 ]; then
  echo "✨ ¡Todo listo para producción!"
  echo ""
  echo "Para iniciar el servidor:"
  echo "  ./scripts/start-production.sh"
  echo ""
  echo "O manualmente:"
  echo "  cd .next/standalone"
  echo "  NODE_ENV=production bun server.js"
  exit 0
else
  echo "❌ Se encontraron $ERRORS error(es)"
  echo ""
  echo "Ejecuta los comandos sugeridos arriba para corregirlos"
  exit 1
fi
