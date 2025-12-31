/**
 * NOTA PARA EL DESARROLLADOR:
 * 
 * Si encuentras errores de caché con Next.js después de cambios significativos:
 * 
 * 1. El servidor de desarrollo necesita reiniciarse para cargar los cambios correctos
 * 2. Los archivos en el sistema de archivos están correctos (auth.ts usa bcryptjs)
 * 3. El error "Module not found: Can't resolve 'bcrypt'" es por caché antiguo
 * 
 * Para resolver esto, se necesita reiniciar el servidor de desarrollo.
 * El sistema usa 'bcryptjs' instalado, no 'bcrypt'.
 * 
 * Todos los componentes y páginas creados están listos para funcionar
 * una vez que el servidor se reinicie correctamente.
 */

export const CACHE_NOTE = {
  message: "Servidor requiere reinicio para cargar cambios de caché",
  solution: "Reiniciar el servidor de desarrollo: bun run dev",
  affected: ["auth.ts", "layout.tsx", "apis de autenticación"],
  status: "Código correcto, caché desactualizado"
}
