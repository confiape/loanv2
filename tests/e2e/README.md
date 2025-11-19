# E2E Tests - Playwright

Arquitectura híbrida de tests E2E con Playwright para ConfiaPe Prestamos.

## ⚠️ Setup Inicial Requerido

Antes de ejecutar los tests por primera vez, sigue estos pasos:

### 1. Actualizar credenciales de prueba

Edita `fixtures/users.ts` con credenciales **reales** del ambiente de desarrollo:

```typescript
export const testUsers = {
  admin: {
    email: 'TU_EMAIL_ADMIN@confiape.org',  // ← Actualizar
    password: 'TU_PASSWORD_REAL',            // ← Actualizar
    role: 'admin' as const,
  },
  // ...
};
```

### 2. Verificar selectores data-testid en tu aplicación

Los componentes Angular deben tener atributos `data-testid`. Revisa el componente de login:

```html
<!-- Ejemplo esperado en login component -->
<input data-testid="login-email" type="email" />
<input data-testid="login-password" type="password" />
<button data-testid="login-submit">Ingresar</button>
```

Si los `data-testid` no coinciden, actualízalos en tu aplicación o edita `helpers/test-ids.ts`.

### 3. Inspeccionar la página real

Para descubrir qué selectores existen actualmente:

```bash
npm run test:e2e:dev -- inspect-login.spec.ts
```

Esto genera:
- Console log con todos los elementos encontrados
- Screenshot: `test-results/login-page-inspection.png`

Luego actualiza `helpers/test-ids.ts` según los IDs reales.

### 4. Instalar navegadores (si es necesario)

```bash
npx playwright install chromium
```

## Estructura

```
tests/e2e/
├── pages/           # Page Objects (navegación y elementos)
│   ├── base.page.ts
│   ├── login.page.ts
│   └── dashboard.page.ts
├── actions/         # Flujos reutilizables de negocio
│   └── auth.actions.ts
├── helpers/         # Utilidades y helpers
│   ├── test-ids.ts
│   └── base.helper.ts
├── fixtures/        # Datos de prueba
│   └── users.ts
└── auth/            # Tests organizados por feature
    └── login.spec.ts
```

## Comandos

### Ejecutar tests contra dev.confiape.org (por defecto)
```bash
npm run test:e2e:dev
```

### Ejecutar tests localmente
```bash
BASE_URL=http://localhost:4200 npm run test:e2e
```

### Modo UI interactivo
```bash
npm run test:e2e:ui
```

### Modo headed (ver navegador)
```bash
npm run test:e2e:headed
```

### Modo debug
```bash
npm run test:e2e:debug
```

### Ver reporte HTML
```bash
npm run test:e2e:report
```

## Configuración

### Variables de entorno

- `BASE_URL`: URL base de la aplicación (default: `https://dev.confiape.org`)

### Usuarios de prueba

Los usuarios de prueba están definidos en `fixtures/users.ts`. **IMPORTANTE**: Actualizar con credenciales reales del ambiente de desarrollo.

```typescript
import { testUsers } from './fixtures/users';

// Usar en tests
await loginAs(page, testUsers.admin);
```

## Escribir Tests

### Patrón básico

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { loginAsAdmin } from '../actions/auth.actions';

test('mi test', async ({ page }) => {
  // Arrange
  const loginPage = new LoginPage(page);

  // Act
  await loginPage.goto();
  await loginPage.login('email', 'password');

  // Assert
  await expect(page).toHaveURL(/dashboard/);
});
```

### Usar actions para flujos comunes

```typescript
// En lugar de repetir el flujo de login:
await loginAsAdmin(page);

// O con un usuario específico:
await loginAs(page, testUsers.analyst);
```

### Verificar mensajes de error en Toasts

Los mensajes de error/éxito se muestran mediante toasts. Para verificarlos:

```typescript
import { LoginPage } from '../pages/login.page';

test('should show error on invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('invalid@email.com', 'wrongpassword');

  // Verifica que aparezca un toast de error
  await loginPage.verifyErrorDisplayed();

  // O verifica que contenga un mensaje específico
  await loginPage.verifyErrorDisplayed('Email o contraseña incorrectos');
});
```

**Cómo funciona:**
- Los toasts tienen `data-testid="toast"` y `data-toast-type="error|success|warning|info"`
- `verifyErrorDisplayed()` busca toasts con `data-toast-type="error"` visibles
- Puedes verificar el contenido del mensaje pasando el texto esperado

### Selectores con data-testid

Todos los selectores están centralizados en `helpers/test-ids.ts`:

```typescript
import { TestIds } from '../helpers/test-ids';

// Usar en Page Objects
this.getByTestId(TestIds.auth.emailInput);
```

## Arquitectura

### Pages (navegación y elementos)
- Encapsulan elementos de la UI
- Proveen métodos para interactuar con la página
- Extienden de `BasePage`
- Usan selectores de `TestIds`

### Actions (flujos de negocio)
- Flujos completos de usuario
- Combinan múltiples Page Objects
- Ejemplo: `loginAsAdmin()`, `createLoan()`

### Helpers
- Utilidades comunes
- Selectores centralizados
- Funciones de espera y sincronización

### Fixtures
- Datos de prueba
- Usuarios, configuraciones, etc.

## Buenas Prácticas

1. ✅ Usar Page Objects para elementos UI
2. ✅ Usar Actions para flujos completos
3. ✅ Centralizar selectores en `TestIds`
4. ✅ Usar data-testid en lugar de selectores CSS frágiles
5. ✅ Patrón Arrange/Act/Assert en tests
6. ✅ Limpiar sesión antes de cada test
7. ✅ Verificar estados después de acciones
8. ✅ Usar fixtures para datos de prueba

## Agregar nuevos tests

### 1. Crear nueva página (si es necesaria)

```typescript
// pages/loans.page.ts
export class LoansPage extends BasePage {
  // ... locators y métodos
}
```

### 2. Agregar test IDs al helper

```typescript
// helpers/test-ids.ts
export const TestIds = {
  loans: {
    createButton: 'loan-create-btn',
    // ...
  },
};
```

### 3. Crear action si es flujo complejo

```typescript
// actions/loan.actions.ts
export async function createLoan(page: Page, data: LoanData) {
  // ...
}
```

### 4. Escribir el test

```typescript
// loans/create-loan.spec.ts
test('should create loan', async ({ page }) => {
  await createLoan(page, loanData);
});
```

## Troubleshooting

### Tests fallan por timeouts
- Verificar que dev.confiape.org esté disponible
- Aumentar timeout en `playwright.config.ts`

### Selectores no encontrados
- Verificar que los data-testid existan en la aplicación
- Usar modo debug: `npm run test:e2e:debug`

### Tests pasan localmente pero fallan en CI
- Verificar variables de entorno
- Revisar configuración de `webServer` en config

### Toasts no son detectados

**Problema:** El toast aparece en pantalla pero el test no lo encuentra

**Causa:** Los toasts tienen `pointer-events-none` en el contenedor y se agregan dinámicamente al DOM

**Solución:**
1. El método `verifyErrorDisplayed()` ya maneja esto automáticamente
2. Espera hasta 10 segundos a que el toast se adjunte al DOM
3. Verifica visibilidad real (no solo presencia en DOM)

**Debug manual:**
```typescript
import { debugToasts } from '../helpers/base.helper';

test('my test', async ({ page }) => {
  // ... after action that should show toast
  await page.waitForTimeout(2000); // Wait for toast
  await debugToasts(page); // Shows all toasts in console
});
```

El output mostrará:
- Cuántos toasts hay
- Tipo de cada toast (error, success, warning, info)
- Si están visibles
- Su contenido de texto
