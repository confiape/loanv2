# Estrategia de TestIds - Guía Definitiva

## Principios Fundamentales

### ✅ NECESITAN TestId (Para Testing)
1. **Elementos Interactivos**: Botones, inputs, checkboxes, selects
2. **Contenedores Principales**: Wrappers de componentes, modals, forms
3. **Elementos con Estado**: Labels con validación, mensajes de error
4. **Navegación**: Links, menús, tabs
5. **Elementos de Feedback**: Alerts, toasts, error messages

### ❌ NO NECESITAN TestId (Decorativos/Redundantes)
1. **Iconos**: Son parte visual del botón/elemento padre
2. **Divs de Layout**: Espaciadores, wrappers puramente visuales
3. **Textos Estáticos**: Títulos, descripciones que no cambian
4. **SVGs Decorativos**: Ilustraciones, backgrounds
5. **Elementos con aria-hidden**: No son accesibles, no se deben testear

---

## Estrategia por Componente

### 1. INPUT / SELECT / TEXTAREA Components

**✅ Necesitan TestId:**
```typescript
- wrapperTestId: Host del componente
- inputTestId: El input/select real (para interacción)
- labelTestId: Para verificar texto del label
- errorMessageTestId: Para verificar mensajes de error
- helpTextTestId: Para verificar texto de ayuda
```

**❌ NO Necesitan:**
```typescript
- Iconos de prefijo/sufijo
- Divs contenedores internos
- Spans decorativos
```

**Ejemplo simplificado:**
```html
<div [attr.data-testid]="wrapperTestId()">
  <label [attr.data-testid]="labelTestId()">{{ label() }}</label>
  <input [attr.data-testid]="inputTestId()" />
  @if (errorMessage()) {
    <p [attr.data-testid]="errorMessageTestId()">{{ errorMessage() }}</p>
  }
  <!-- Sin testId en iconos decorativos -->
  <svg aria-hidden="true">...</svg>
</div>
```

---

### 2. BUTTON Component

**✅ Necesitan TestId:**
```typescript
- wrapperTestId: Host del componente (para querySelector)
```

**❌ NO Necesitan:**
```typescript
- buttonTestId: REDUNDANTE (el wrapper ES el botón)
- Iconos internos
- Spans de texto
- Loading spinners
```

**Simplificación:**
```typescript
// ANTES (redundante)
readonly wrapperTestId = computed(() => ...);
readonly buttonTestId = computed(() => ...); // ❌ Innecesario

// DESPUÉS (simplificado)
readonly wrapperTestId = computed(() =>
  this.testId() ? `${this.testId()}-wrapper` : null
);
```

---

### 3. MODAL Component

**✅ Necesitan TestId:**
```typescript
- wrapperTestId: Host del modal
- overlayTestId: Para detectar overlay backdrop
- closeButtonTestId: Botón de cerrar (interactivo)
- headerTestId: Para verificar título
- contentTestId: Para buscar contenido dentro
```

**❌ NO Necesitan:**
```typescript
- Divs de layout internos
- Iconos del botón cerrar
- Animaciones/transiciones
```

---

### 4. ACCORDION Component

**✅ Necesitan TestId:**
```typescript
- wrapperTestId: Host
- containerTestId: Div principal con items
- Per Item:
  - triggerTestId: Botón para expandir/colapsar
  - contentTestId: Contenido del item
```

**❌ NO Necesitan:**
```typescript
- Iconos de chevron/arrow
- Divs wrapper de items individuales
```

---

### 5. DROPDOWN Component

**✅ Necesitan TestId:**
```typescript
- wrapperTestId: Host
- triggerTestId: Botón trigger
- panelTestId: Panel con opciones
- itemTestId (con índice): Cada opción individual
```

**❌ NO Necesitan:**
```typescript
- Overlay backdrop (se puede testear por clase CSS)
- Iconos de arrow/chevron
- Divs contenedores
```

---

### 6. TABLE Component

**✅ Necesitan TestId:**
```typescript
- wrapperTestId: Host
- searchTestId: Input de búsqueda (si existe)
- tableTestId: Elemento <table>
- selectAllTestId: Checkbox select all
- paginationTestId: Controles de paginación
```

**❌ NO Necesitan:**
```typescript
- <thead>, <tbody> (se acceden por estructura DOM)
- Iconos de sorting
- Headers individuales (se acceden por contenido)
```

---

### 7. AVATAR Component

**✅ Necesitan TestId:**
```typescript
- wrapperTestId: Host
- imageTestId: Tag <img> (para verificar src)
- initialsTestId: Span con iniciales (para verificar texto)
```

**❌ NO Necesitan:**
```typescript
- placeholderTestId: ❌ ELIMINAR (es SVG decorativo)
- indicatorTestId: ❌ ELIMINAR (se puede verificar por clase CSS)
- containerTestId: REDUNDANTE
```

---

### 8. ALERT / TOAST Component

**✅ Necesitan TestId:**
```typescript
- wrapperTestId: Host
- closeButtonTestId: Botón cerrar (si existe)
```

**❌ NO Necesitan:**
```typescript
- Iconos de tipo (success/error/warning)
- Títulos/mensajes (se verifican por textContent del wrapper)
```

---

### 9. CHECKBOX / RADIO Component

**✅ Necesitan TestId:**
```typescript
- wrapperTestId: Host
- inputTestId: Input checkbox/radio real
- labelTestId: Label (para verificar texto)
```

**❌ NO Necesitan:**
```typescript
- Checkmark SVG
- Divs wrapper internos
```

---

### 10. GENERIC-CRUD Components

**✅ Necesitan TestId (con testIdPrefix):**
```typescript
Form:
- {prefix}-input-{fieldKey}-wrapper
- {prefix}-btn-submit-wrapper
- {prefix}-btn-cancel-wrapper
- {prefix}-form-error (div de error)

List:
- {prefix}-btn-new-wrapper
- {prefix}-search-input
- {prefix}-table-wrapper
- {prefix}-modal-wrapper
- {prefix}-delete-modal-wrapper
- {prefix}-btn-{action}-wrapper
```

**❌ NO Necesitan:**
```typescript
- Iconos en botones
- Divs de layout
- Loading spinners (se verifica loading state del botón)
```

---

## Simplificación: Patrón Único

### Recomendación: Un Solo TestId Por Componente

**Para componentes simples (Button, Avatar, Badge):**
```typescript
// Solo el wrapper
readonly wrapperTestId = computed(() =>
  this.testId() ? `${this.testId()}-wrapper` : null
);
```

**Para componentes con inputs (Input, Select, Checkbox):**
```typescript
readonly wrapperTestId = computed(() =>
  this.testId() ? `${this.testId()}-wrapper` : null
);

// Solo elementos interactivos o con contenido dinámico
readonly inputTestId = computed(() => this.testId() || null);
readonly labelTestId = computed(() =>
  this.testId() ? `${this.testId()}-label` : null
);
readonly errorMessageTestId = computed(() =>
  this.testId() ? `${this.testId()}-error` : null
);
```

---

## Reglas de Oro

1. **Un componente = Un wrapper testId** (siempre)
2. **TestIds solo para elementos que se INTERACTÚAN o VERIFICAN**
3. **No testIds en elementos decorativos**
4. **Usar estructura DOM para elementos sin testId**
5. **Preferir aria-labels para accesibilidad, testIds para testing**

---

## Ejemplos de Testing

### ✅ CORRECTO - Usar TestId
```typescript
// Buscar input para escribir
const input = screen.getByTestId('email-input-wrapper');
input.querySelector('input').value = 'test@test.com';

// Verificar error
const error = screen.getByTestId('email-error');
expect(error).toHaveTextContent('Invalid email');
```

### ✅ CORRECTO - Usar Estructura DOM
```typescript
// Buscar icono dentro del botón (sin testId)
const button = screen.getByTestId('submit-btn-wrapper');
const icon = button.querySelector('svg');
expect(icon).toBeInTheDocument();
```

### ❌ INCORRECTO - TestId en Todo
```typescript
// ❌ No necesario
const icon = screen.getByTestId('submit-btn-icon');
const wrapper = screen.getByTestId('submit-btn-wrapper-div');
const span = screen.getByTestId('submit-btn-text-span');
```

---

## Implementación Sugerida

### Fase 1: ELIMINAR TestIds Innecesarios
- Avatar: placeholderTestId, indicatorTestId
- Button: buttonTestId (usar solo wrapperTestId)
- Alert/Toast: iconTestId
- Todos los iconos decorativos

### Fase 2: CONSOLIDAR Patrones
- Standardizar nomenclatura: {base}-wrapper, {base}-input, {base}-label, {base}-error
- Eliminar testIds intermedios redundantes

### Fase 3: DOCUMENTAR
- Agregar comentarios en código
- Actualizar tests para usar estructura DOM cuando sea posible

