# HTTP Notification Interceptor

## Descripción

Interceptor HTTP que automáticamente muestra notificaciones toast para:

- ❌ **Errores HTTP**: Cualquier respuesta de error (4xx, 5xx)
- ✅ **Operaciones exitosas**: Operaciones de escritura (POST, PUT, PATCH, DELETE)

## Características

### Manejo de Errores

- Captura todos los errores HTTP automáticamente
- Extrae el mensaje del campo `message` en la respuesta del error
- Muestra mensaje genérico si no hay campo `message`
- Duración: 3 segundos
- Incluye el código de estado HTTP en el título

### Mensajes de Éxito

- Detecta operaciones de escritura: POST, PUT, PATCH, DELETE
- Muestra mensaje de éxito automático
- Duración: 2 segundos

## Configuración

El interceptor ya está configurado en `src/app/app.config.ts`:

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpNotificationInterceptor } from './interceptors/http-notification.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers
    provideHttpClient(withInterceptors([httpNotificationInterceptor])),
  ],
};
```

## Formato de Respuesta del Servidor

### Errores

El servidor debe devolver errores en este formato:

```json
{
  "message": "El usuario no fue encontrado",
  "statusCode": 404,
  "error": "Not Found"
}
```

Si no existe el campo `message`, se mostrará: "Ha ocurrido un error inesperado"

### Éxitos

Las respuestas exitosas de operaciones de escritura (POST, PUT, PATCH, DELETE) mostrarán automáticamente:
"Operación realizada con éxito"

## Uso Manual del ToastService

Si necesitas mostrar toasts manualmente en tu código:

```typescript
import { inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

export class MyComponent {
  private toastService = inject(ToastService);

  someMethod() {
    // Éxito
    this.toastService.success('Usuario creado correctamente');

    // Error
    this.toastService.error('No se pudo guardar el registro');

    // Advertencia
    this.toastService.warning('Esta acción no se puede deshacer');

    // Información
    this.toastService.info('Hay 3 nuevas notificaciones');

    // Con título y duración personalizada
    this.toastService.success(
      'Operación completada',
      'Éxito',
      5000, // 5 segundos
    );
  }
}
```

## Deshabilitar Notificaciones para Endpoints Específicos

Si necesitas deshabilitar las notificaciones automáticas para ciertos endpoints, puedes usar contextos HTTP:

```typescript
import { HttpContext, HttpContextToken } from '@angular/common/http';

// Crear token de contexto
export const SKIP_NOTIFICATION = new HttpContextToken<boolean>(() => false);

// Usar en la solicitud
this.http.post('/api/endpoint', data, {
  context: new HttpContext().set(SKIP_NOTIFICATION, true),
});
```

Luego modificar el interceptor para verificar este contexto.

## Componente de Testing

Se incluye un componente de prueba en `src/app/features/dashboard/test-http.component.ts` que demuestra:

- POST exitoso (muestra toast de éxito)
- Error 404 (muestra toast de error)
- Error 500 (muestra toast de error)
- Toasts manuales

## Archivos Relacionados

- **Interceptor**: `src/app/interceptors/http-notification.interceptor.ts`
- **Servicio Toast**: `src/app/services/toast.service.ts`
- **Componente Toast**: `src/app/components/ui/toast/`
- **Tests**: `src/app/services/toast.service.spec.ts`
- **Componente de Prueba**: `src/app/features/dashboard/test-http.component.ts`

## Tests

Ejecutar tests del servicio:

```bash
npx vitest run src/app/services/toast.service.spec.ts
```

## Personalización

### Cambiar Duraciones

Editar `src/app/services/toast.service.ts`:

```typescript
show(type: ToastType, message: string, title?: string, duration?: number) {
  const defaultDuration = type === 'error' ? 5000 : 3000; // Cambiar aquí
  // ...
}
```

### Cambiar Métodos HTTP para Notificaciones de Éxito

Editar `src/app/interceptors/http-notification.interceptor.ts`:

```typescript
const writeMethods = ['POST', 'PUT', 'PATCH', 'DELETE']; // Modificar lista
```

### Cambiar Posición de los Toasts

Editar `src/app/layout/main-layout/main-layout.html`:

```html
<app-toast-container position="top-right" />
<!-- Cambiar posición -->
```

Posiciones disponibles:

- `top-right` (por defecto)
- `top-left`
- `top-center`
- `bottom-right`
- `bottom-left`
- `bottom-center`
