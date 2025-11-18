# Ejemplo Práctico: Refactorizar Tests con AlertTestBuilder

Este ejemplo muestra cómo refactorizar tests existentes para usar `AlertTestBuilder` y reducir código duplicado.

## 📊 Comparación: Antes vs Después

### ❌ ANTES: Código Repetitivo (Sin Builder)

```typescript
// alert.spec.ts - ANTES
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, inputBinding, outputBinding, signal } from '@angular/core';
import { within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Alert } from './alert';

describe('Alert', () => {
  it('should render with default info variant', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Alert, {
      bindings: [],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const alertEl = queries.getByRole('alert');
    expect(alertEl.className).toContain('bg-accent/10');
  });

  it('should render success variant', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Alert, {
      bindings: [inputBinding('variant', () => 'success')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const alertEl = queries.getByRole('alert');
    expect(alertEl.className).toContain('bg-success/10');
  });

  it('should render error variant', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Alert, {
      bindings: [inputBinding('variant', () => 'error')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const alertEl = queries.getByRole('alert');
    expect(alertEl.className).toContain('bg-error/10');
  });

  it('should display title', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Alert, {
      bindings: [inputBinding('title', () => 'Test Title')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const title = queries.getByText('Test Title');
    expect(title).toBeTruthy();
  });

  it('should emit dismissed when close button clicked', async () => {
    // Arrange
    const dismissedSignal = signal<void | null>(null);
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Alert, {
      bindings: [
        inputBinding('dismissible', () => true),
        outputBinding('dismissed', () => dismissedSignal.set(undefined)),
      ],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);
    const user = userEvent.setup();

    // Act
    const closeButton = queries.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    TestBed.tick();

    // Assert
    expect(dismissedSignal()).toBeUndefined();
  });
});
```

**Problemas:**

- 🔴 Mucho código repetitivo (TestBed.configureTestingModule, provideZonelessChangeDetection, etc.)
- 🔴 Difícil de leer y mantener
- 🔴 Cada test tiene 5-10 líneas de setup
- 🔴 Signal setup repetido para outputs

**Líneas de código:** ~90 líneas para 5 tests

---

### ✅ DESPUÉS: Con AlertTestBuilder

```typescript
// alert.spec.ts - DESPUÉS
import { TestBed } from '@angular/core/testing';
import { within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { Alert } from './alert';
import { AlertTestBuilder } from '@loan/shared/testing';

describe('Alert', () => {
  let builder: AlertTestBuilder;

  beforeEach(() => {
    builder = new AlertTestBuilder();
  });

  it('should render with default info variant', () => {
    // Arrange
    const fixture = builder.withInfoVariant().build();
    const queries = within(fixture.nativeElement);

    // Assert
    const alertEl = queries.getByRole('alert');
    expect(alertEl.className).toContain('bg-accent/10');
  });

  it('should render success variant', () => {
    // Arrange
    const fixture = builder.withSuccessVariant().build();
    const queries = within(fixture.nativeElement);

    // Assert
    const alertEl = queries.getByRole('alert');
    expect(alertEl.className).toContain('bg-success/10');
  });

  it('should render error variant', () => {
    // Arrange
    const fixture = builder.withErrorVariant().build();
    const queries = within(fixture.nativeElement);

    // Assert
    const alertEl = queries.getByRole('alert');
    expect(alertEl.className).toContain('bg-error/10');
  });

  it('should display title', () => {
    // Arrange
    const fixture = builder.withMessage('Test Title').build();
    const queries = within(fixture.nativeElement);

    // Assert
    const title = queries.getByText('Test Title');
    expect(title).toBeTruthy();
  });

  it('should emit dismissed when close button clicked', async () => {
    // Arrange
    const fixture = builder.asDismissible().build();
    const dismissedSignal = builder.getDismissedSignal();
    const queries = within(fixture.nativeElement);
    const user = userEvent.setup();

    // Act
    const closeButton = queries.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    TestBed.tick();

    // Assert
    expect(dismissedSignal()).toBeUndefined();
  });
});
```

**Mejoras:**

- ✅ Código mucho más limpio y legible
- ✅ Setup en 1 línea: `builder.withSuccessVariant().build()`
- ✅ Métodos descriptivos y type-safe
- ✅ Signal management incluido en builder
- ✅ Independencia de tests garantizada (auto-clone)

**Líneas de código:** ~50 líneas para 5 tests (**44% menos código**)

---

## 🎯 Ejemplo Avanzado: Defaults + Overrides

### Con Defaults Compartidos

```typescript
describe('Alert Dismissible Variants', () => {
  let builder: AlertTestBuilder;

  beforeEach(() => {
    // Configurar defaults comunes
    builder = new AlertTestBuilder()
      .withMessage('Important notification')
      .asDismissible()
      .withIcon();
  });

  it('should render dismissible info alert', () => {
    const fixture = builder.withInfoVariant().build();
    const queries = within(fixture.nativeElement);

    expect(queries.getByRole('button', { name: /close/i })).toBeTruthy();
    expect(queries.getByText('Important notification')).toBeTruthy();
  });

  it('should render dismissible success alert', () => {
    const fixture = builder.withSuccessVariant().build();
    const queries = within(fixture.nativeElement);

    const alertEl = queries.getByRole('alert');
    expect(alertEl.className).toContain('bg-success/10');
    expect(queries.getByRole('button', { name: /close/i })).toBeTruthy();
  });

  it('should override message for specific test', () => {
    const fixture = builder.withErrorVariant().withMessage('Custom error message').build();
    const queries = within(fixture.nativeElement);

    expect(queries.getByText('Custom error message')).toBeTruthy();
    // Los otros defaults (dismissible, withIcon) se mantienen
    expect(queries.getByRole('button', { name: /close/i })).toBeTruthy();
  });
});
```

---

## 📈 Métricas de Mejora

| Métrica                 | Antes  | Después    | Mejora             |
| ----------------------- | ------ | ---------- | ------------------ |
| **Líneas por test**     | ~15-20 | ~5-8       | **60% menos**      |
| **Setup duplicado**     | 100%   | 0%         | **100% eliminado** |
| **Legibilidad**         | Baja   | Alta       | **⬆️ Mucho mejor** |
| **Mantenibilidad**      | Baja   | Alta       | **⬆️ Mucho mejor** |
| **Type Safety**         | Sí     | Sí         | **✅ Mantenido**   |
| **Independencia tests** | Manual | Automática | **✅ Garantizada** |

---

## 🚀 Migración Paso a Paso

### Paso 1: Identificar componente con tests repetitivos

Busca componentes donde múltiples tests tienen setup similar.

### Paso 2: Crear o usar builder

Si es Alert, usa `AlertTestBuilder`. Si es otro componente, crea tu builder:

```typescript
import { ComponentTestBuilder } from '@loan/shared/testing';
import { MyComponent } from './my-component';

export class MyComponentTestBuilder extends ComponentTestBuilder<MyComponent> {
  constructor() {
    super(MyComponent);
  }

  withCustomProp(value: string): this {
    return this.withInput('customProp', value);
  }
}
```

### Paso 3: Actualizar imports

```typescript
import { AlertTestBuilder } from '@loan/shared/testing';
```

### Paso 4: Agregar beforeEach

```typescript
let builder: AlertTestBuilder;

beforeEach(() => {
  builder = new AlertTestBuilder();
  // Opcionalmente, configurar defaults comunes
});
```

### Paso 5: Refactorizar tests uno por uno

**Antes:**

```typescript
const fixture = TestBed.configureTestingModule({
  providers: [provideZonelessChangeDetection()],
}).createComponent(Alert, {
  bindings: [inputBinding('variant', () => 'success'), inputBinding('title', () => 'Success!')],
});
TestBed.tick();
```

**Después:**

```typescript
const fixture = builder.withSuccessVariant().withMessage('Success!').build();
```

### Paso 6: Ejecutar tests

```bash
npm test -- alert.spec.ts
```

✅ Todos los tests deben pasar sin cambios en comportamiento.

---

## 💡 Tips

1. **Empieza con componentes pequeños** - Alert, Badge, Button son buenos candidatos
2. **Crea builders cuando veas 3+ tests similares** - Si hay mucha repetición, vale la pena
3. **No sobre-optimices** - Para tests únicos, el builder puede ser overkill
4. **Documenta métodos custom** - Facilita el uso para el equipo
5. **Mantén AAA pattern** - El builder solo mejora "Arrange", no cambies Act/Assert

---

## ❓ FAQ

### ¿Cuándo NO usar builder?

- Tests únicos sin repetición
- Componentes usados solo en 1-2 tests
- Cuando el setup es trivial (0-1 inputs)

### ¿Puedo mezclar builder con TestBed directo?

Sí, no hay problema:

```typescript
it('complex test', () => {
  // Usa builder para setup básico
  const fixture = builder.withInfoVariant().build();

  // Luego usa TestBed directo si necesitas algo específico
  fixture.componentRef.setInput('extraProp', customValue);
  TestBed.tick();
});
```

### ¿El auto-clone es thread-safe?

No aplica - Vitest corre tests **en secuencia** por archivo. No hay paralelismo dentro del mismo `describe()`.

### ¿Puedo usar builder en tests de integración?

Sí, funciona igual. El builder solo simplifica la creación de componentes.

---

## 🎓 Conclusión

El `AlertTestBuilder` y `ComponentTestBuilder` reducen drásticamente el código duplicado manteniendo:

✅ Independencia de tests (auto-clone)
✅ Type safety
✅ Legibilidad
✅ AAA pattern
✅ Facilidad de mantenimiento

**Resultado:** Tests más limpios, más rápidos de escribir, y más fáciles de mantener.
