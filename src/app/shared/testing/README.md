# Test Builders - Angular 20 Testing Utilities

Utilities para reducir código duplicado en tests manteniendo independencia entre tests.

## 🎯 Problema que Resuelve

**Antes (Código Repetitivo):**

```typescript
describe('Alert', () => {
  it('should display info message', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Alert, {
      bindings: [
        inputBinding('message', () => 'Info message'),
        inputBinding('variant', () => 'info'),
        inputBinding('dismissible', () => true),
      ],
    });
    TestBed.tick();
    // ... test code
  });

  it('should display success message', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Alert, {
      bindings: [
        inputBinding('message', () => 'Success message'),
        inputBinding('variant', () => 'success'),
        inputBinding('dismissible', () => true),
      ],
    });
    TestBed.tick();
    // ... test code
  });
});
```

**Después (Con Builder):**

```typescript
describe('Alert', () => {
  let builder: AlertTestBuilder;

  beforeEach(() => {
    builder = new AlertTestBuilder().withMessage('Default message').asDismissible();
  });

  it('should display info message', () => {
    const fixture = builder.withInfoVariant().build();
    // ... test code
  });

  it('should display success message', () => {
    const fixture = builder.withSuccessVariant().build();
    // ... test code
  });
});
```

## ✨ Características Principales

### 1. Auto-Clonado en `build()`

**El método `build()` automáticamente clona el estado interno antes de crear el componente.**

Esto significa:

- ✅ Puedes usar `beforeEach` para configurar defaults
- ✅ NO necesitas llamar `.clone()` manualmente
- ✅ Los tests son independientes automáticamente
- ✅ Código más limpio y fácil de leer

```typescript
beforeEach(() => {
  builder = new ComponentTestBuilder(Alert).withInput('message', 'Default');
});

it('test 1', () => {
  const fixture = builder.build(); // Auto-clona internamente
  // El builder en beforeEach NO se modifica
});

it('test 2', () => {
  const fixture = builder.withInput('message', 'Override').build(); // Auto-clona el estado modificado
  // El builder en beforeEach sigue intacto
});
```

### 2. API Fluida Type-Safe

```typescript
const fixture = builder
  .withInput('variant', 'info')
  .withInput('dismissible', true)
  .withOutput('dismissed', () => console.log('dismissed'))
  .build();
```

### 3. TestBed.tick() Automático

El builder llama `TestBed.tick()` automáticamente después de crear el componente.

## 📦 Componentes Disponibles

### ComponentTestBuilder (Genérico)

Builder genérico para cualquier componente.

```typescript
import { ComponentTestBuilder } from '@loan/shared/testing/component-builder';

describe('MyComponent', () => {
  let builder: ComponentTestBuilder<MyComponent>;

  beforeEach(() => {
    builder = new ComponentTestBuilder(MyComponent)
      .withInput('title', 'Default Title')
      .withInput('count', 0);
  });

  it('should display title', () => {
    const fixture = builder.build();
    expect(fixture.componentInstance.title()).toBe('Default Title');
  });
});
```

**Métodos disponibles:**

- `withInput<K>(property: K, value: T[K]): this`
- `withOutput<K>(property: K, handler: (value: any) => void): this`
- `withProviders(providers: Provider[]): this`
- `build(): ComponentFixture<T>` - **Auto-clona internamente**
- `clone(): ComponentTestBuilder<T>` - Clone manual (rara vez necesario)

### AlertTestBuilder (Especializado)

Builder especializado para Alert con métodos convenientes.

```typescript
import { AlertTestBuilder } from '@loan/shared/testing/alert-test-builder';

describe('Alert', () => {
  let builder: AlertTestBuilder;

  beforeEach(() => {
    builder = new AlertTestBuilder()
      .withInfoVariant()
      .withMessage('Default message')
      .asDismissible();
  });

  it('should display info alert', () => {
    const fixture = builder.build();
    expect(fixture.componentInstance.variant()).toBe('info');
  });

  it('should display error alert', () => {
    const fixture = builder.withErrorVariant().withMessage('Error occurred').build();
    expect(fixture.componentInstance.variant()).toBe('error');
  });
});
```

**Métodos de Variante:**

- `withInfoVariant()` - Info variant
- `withSuccessVariant()` - Success variant
- `withWarningVariant()` - Warning variant
- `withErrorVariant()` - Error variant
- `withVariant(variant: AlertVariant)` - Custom variant

**Métodos de Contenido:**

- `withMessage(title: string)` - Set title/message
- `withoutMessage()` - Clear message

**Métodos de Features:**

- `asDismissible()` / `asNotDismissible()`
- `withIcon()` / `withoutIcon()`
- `withBorder()` / `withoutBorder()`
- `withActions()` / `withoutActions()`

**Métodos de TestId:**

- `withTestId(testId: string)`
- `withoutTestId()`

**Métodos de Outputs:**

- `onDismissed(handler: () => void)` - Custom handler
- `getDismissedSignal()` - Get signal for assertions
- `resetDismissed()` - Reset signal between actions

## 📚 Patrones de Uso

### Patrón 1: Configuración Simple

```typescript
describe('Alert', () => {
  it('should render info alert', () => {
    const fixture = new AlertTestBuilder().withInfoVariant().withMessage('Information').build();

    const queries = within(fixture.nativeElement);
    expect(queries.getByText('Information')).toBeInTheDocument();
  });
});
```

### Patrón 2: Defaults en beforeEach

```typescript
describe('Alert', () => {
  let builder: AlertTestBuilder;

  beforeEach(() => {
    // Configura defaults, NO crea componente
    builder = new AlertTestBuilder().withMessage('Default message').withIcon();
  });

  it('should use defaults', () => {
    const fixture = builder.build();
    expect(fixture.componentInstance.message()).toBe('Default message');
  });

  it('should override defaults', () => {
    const fixture = builder.withMessage('Custom message').build();
    expect(fixture.componentInstance.message()).toBe('Custom message');
  });
});
```

### Patrón 3: Múltiples Variantes

```typescript
describe('Alert Variants', () => {
  let builder: AlertTestBuilder;

  beforeEach(() => {
    builder = new AlertTestBuilder().withMessage('Test message').withIcon();
  });

  it('should render info variant', () => {
    const fixture = builder.withInfoVariant().build();
    expect(fixture.componentInstance.variant()).toBe('info');
  });

  it('should render success variant', () => {
    const fixture = builder.withSuccessVariant().build();
    expect(fixture.componentInstance.variant()).toBe('success');
  });

  it('should render warning variant', () => {
    const fixture = builder.withWarningVariant().build();
    expect(fixture.componentInstance.variant()).toBe('warning');
  });
});
```

### Patrón 4: Testing Outputs

```typescript
describe('Alert Dismissible', () => {
  it('should emit dismissed event', async () => {
    const builder = new AlertTestBuilder().asDismissible().withMessage('Dismissible alert');

    const fixture = builder.build();
    const dismissedSignal = builder.getDismissedSignal();
    const queries = within(fixture.nativeElement);
    const user = userEvent.setup();

    // Act
    const closeButton = queries.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    TestBed.tick();

    // Assert
    expect(dismissedSignal()).toBeUndefined(); // Signal was set
  });
});
```

### Patrón 5: Custom Output Handler

```typescript
describe('Alert Custom Handler', () => {
  it('should call custom handler on dismiss', async () => {
    const dismissHandler = vi.fn();
    const fixture = new AlertTestBuilder().asDismissible().onDismissed(dismissHandler).build();

    const queries = within(fixture.nativeElement);
    const user = userEvent.setup();

    const closeButton = queries.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    TestBed.tick();

    expect(dismissHandler).toHaveBeenCalledTimes(1);
  });
});
```

## 🛠 Crear Tu Propio Builder

Para crear un builder especializado para otro componente:

```typescript
import { signal } from '@angular/core';
import { ComponentTestBuilder } from './component-builder';
import { MyComponent } from '@loan/components/my-component';

export class MyComponentTestBuilder extends ComponentTestBuilder<MyComponent> {
  private outputSignal = signal<string | null>(null);

  constructor() {
    super(MyComponent);
    // Set defaults
    this.withInput('title', 'Default Title');
    this.withOutput('changed', (value: string) => this.outputSignal.set(value));
  }

  // Convenience methods
  withCustomTitle(title: string): this {
    return this.withInput('title', title);
  }

  asEnabled(): this {
    return this.withInput('enabled', true);
  }

  asDisabled(): this {
    return this.withInput('enabled', false);
  }

  // Output helpers
  getOutputSignal() {
    return this.outputSignal;
  }
}
```

## ⚡ Rendimiento

### ¿El auto-clonado afecta el rendimiento?

**NO.** El clonado es shallow (copia de referencias), extremadamente rápido:

```typescript
// Lo que hace internamente build()
const clonedBindings = [...this.bindings]; // Shallow copy - O(n) where n = # inputs
const clonedProviders = [...this.providers]; // Shallow copy - O(m) where m = # providers
```

Para componentes típicos:

- ~5-10 inputs = ~5-10 referencias copiadas
- ~1-3 providers = ~1-3 referencias copiadas
- **Tiempo total: < 1ms**

El tiempo de crear el componente con TestBed es **órdenes de magnitud mayor** que el clonado.

## ✅ Ventajas vs Otras Opciones

| Aspecto                 | beforeEach + Component | beforeEach + Builder | Factory Functions |
| ----------------------- | ---------------------- | -------------------- | ----------------- |
| **Código duplicado**    | ❌ Mucho               | ✅ Mínimo            | ✅ Mínimo         |
| **Independencia tests** | ❌ Puede fallar        | ✅ Garantizada       | ✅ Garantizada    |
| **Type safety**         | ✅ Sí                  | ✅ Sí                | ⚠️ Depende        |
| **Overrides**           | ❌ Difícil             | ✅ Fácil             | ⚠️ Parámetros     |
| **Descubribilidad**     | ⚠️ Regular             | ✅ Excelente         | ⚠️ Regular        |
| **Reusabilidad**        | ❌ Baja                | ✅ Alta              | ✅ Alta           |

## 🚫 Anti-Patrones

### ❌ NO: Crear componente en beforeEach

```typescript
// MAL - Rompe independencia de tests
let fixture: ComponentFixture<Alert>;

beforeEach(() => {
  fixture = TestBed.createComponent(Alert); // ❌
});
```

### ❌ NO: Modificar builder sin build()

```typescript
// MAL - No crea el componente
beforeEach(() => {
  builder = new AlertTestBuilder().withMessage('Test');
});

it('test', () => {
  builder.withInfoVariant(); // ❌ Modifica pero no construye
  // Falta: const fixture = builder.build();
});
```

### ✅ SÍ: Configurar en beforeEach, construir en test

```typescript
// BIEN
beforeEach(() => {
  builder = new AlertTestBuilder().withMessage('Default');
});

it('test', () => {
  const fixture = builder.withInfoVariant().build(); // ✅ Construye con auto-clone
});
```

## 📖 Resumen

1. **Usa `ComponentTestBuilder`** para componentes genéricos
2. **Crea builders especializados** para componentes reutilizados frecuentemente
3. **Configura defaults en `beforeEach`**, pero NO crees el componente
4. **Llama `build()`** en cada test - automáticamente clona y crea el componente
5. **NO necesitas `.clone()`** - `build()` lo hace internamente
6. **Aprovecha los métodos convenientes** de builders especializados
7. **Tests independientes garantizados** sin esfuerzo extra

## 🔗 Referencias

- [CLAUDE.md](../../CLAUDE.md) - Guía completa de Angular 20
- [Test Conversion Summary](../../../docs/TEST-CONVERSION-SUMMARY.md) - Progreso de conversión de tests
