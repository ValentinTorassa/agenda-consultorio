# Auralis Mobile

Aplicación nativa Expo/React Native de Auralis. Usa el mismo backend Convex,
usuarios y datos que la web en `turnos.valentorassa.com`.

## Funciones incluidas

- Login con token guardado en `expo-secure-store`
- Resumen de hoy y próximo turno
- Turnos diarios en tiempo real
- Tareas para cualquier fecha
- Búsqueda de pacientes y acceso a WhatsApp
- Próximos turnos del psiquiatra
- Ajustes y cierre de sesión

## Configuración

```bash
cd mobile
npm install
cp .env.example .env.local
```

Definí en `.env.local` la URL del deployment Convex:

```env
EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

## Ejecutar

Desde la raíz del repo:

```bash
npm run mobile
```

Después:

- Escaneá el QR con Expo Go
- Presioná `a` para Android
- Presioná `i` para iOS en macOS

También podés ejecutar directamente:

```bash
npm run mobile:android
npm run mobile:ios
```

## Validación

```bash
npm run lint
npm run mobile:typecheck
cd mobile && npx expo export --platform android
```

## Arquitectura compartida

`convex/` se publica dentro del repo como el paquete privado
`@auralis/backend`. Esto permite que web y mobile usen las mismas referencias
tipadas a queries y mutations sin duplicar el backend.

## Pendiente para distribución

- Proyecto EAS y credenciales de firma
- Íconos y splash finales de Auralis
- Push notifications APNs/FCM
- Bloqueo biométrico opcional
- Builds internos para TestFlight y Google Play
