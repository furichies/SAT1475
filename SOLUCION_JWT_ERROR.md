# Solución al Error JWT_SESSION_ERROR

## 🔍 Problema
El error `JWT_SESSION_ERROR: decryption operation failed` ocurre porque las **cookies de sesión en tu navegador** fueron creadas con un `NEXTAUTH_SECRET` diferente al que está usando el servidor actualmente.

## ✅ Solución Implementada

He creado una solución automática que limpia las cookies corruptas. Sigue estos pasos:

### Opción 1: Limpieza Automática (Recomendado)

1. **Accede a la página de limpieza de cookies:**
   ```
   http://172.16.1.4:3000/auth/clear-session
   ```
   O si usas localhost:
   ```
   http://localhost:3000/auth/clear-session
   ```

2. La página automáticamente:
   - ✅ Eliminará todas las cookies de sesión corruptas
   - ✅ Te redirigirá al login en 3 segundos
   - ✅ Podrás iniciar sesión normalmente

### Opción 2: Limpieza Manual del Navegador

Si prefieres limpiar las cookies manualmente:

#### Chrome/Edge/Brave:
1. Presiona `F12` para abrir DevTools
2. Ve a la pestaña **Application** (Aplicación)
3. En el menú lateral, expande **Cookies**
4. Selecciona `http://172.16.1.4:3000` o `http://localhost:3000`
5. Busca y elimina la cookie: `next-auth.session-token-sat1475`
6. Recarga la página (`F5`)

#### Firefox:
1. Presiona `F12` para abrir DevTools
2. Ve a la pestaña **Storage** (Almacenamiento)
3. Expande **Cookies**
4. Selecciona `http://172.16.1.4:3000` o `http://localhost:3000`
5. Busca y elimina la cookie: `next-auth.session-token-sat1475`
6. Recarga la página (`F5`)

### Opción 3: Modo Incógnito

La forma más rápida de probar:
1. Abre una ventana de incógnito/privada
2. Accede a `http://172.16.1.4:3000`
3. Inicia sesión normalmente

## 🚀 Después de Limpiar las Cookies

Una vez que hayas limpiado las cookies (con cualquiera de las opciones anteriores):

1. **Registrarse**: Funciona correctamente ✅
2. **Iniciar sesión**: Ahora funcionará sin errores ✅
3. **Crear Super Admin**: Funcionará correctamente ✅

## 📝 Notas Importantes

- ⚠️ **No necesitas reiniciar el servidor** - El problema está solo en las cookies del navegador
- ⚠️ **Todos los usuarios afectados** deben limpiar sus cookies o usar la página `/auth/clear-session`
- ⚠️ **El registro funciona** porque crea una sesión nueva, pero el login falla porque intenta descifrar cookies antiguas

## 🔧 Cambios Realizados en el Código

Para evitar este problema en el futuro, he implementado:

1. **`/api/auth/clear-cookies`**: Endpoint que elimina todas las cookies de sesión
2. **`/auth/clear-session`**: Página que llama al endpoint y redirige al login
3. **`/auth/error`**: Página de error que detecta automáticamente errores JWT y redirige a limpiar cookies
4. **`scripts/prepare-production.sh`**: Modificado para reutilizar el mismo `NEXTAUTH_SECRET` entre desarrollo y producción

## 🎯 Verificación

Para verificar que todo funciona:

1. Accede a: `http://172.16.1.4:3000/auth/clear-session`
2. Espera a que se limpien las cookies
3. Inicia sesión con tus credenciales
4. ✅ Deberías poder acceder sin problemas

## 💡 ¿Por Qué Pasó Esto?

El error ocurrió porque:
1. En algún momento anterior, el servidor se ejecutó con un `NEXTAUTH_SECRET` diferente
2. Ese servidor creó cookies de sesión cifradas con ese secret
3. Cuando cambiaste al nuevo `NEXTAUTH_SECRET` (`CaM1n0K0y0T3`), el servidor no pudo descifrar las cookies antiguas
4. NextAuth lanza el error `JWT_SESSION_ERROR: decryption operation failed`

Ahora, con el script `prepare-production.sh` modificado, siempre se usará el mismo `NEXTAUTH_SECRET` del archivo `.env` raíz, evitando este problema en el futuro.
