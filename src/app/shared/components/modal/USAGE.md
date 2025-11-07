# Modal Component Usage

El componente Modal está construido con Angular CDK Dialog y sigue el diseño de Flowbite.

## Importación

```typescript
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalService,
} from '@loan/app/shared/components/modal';
```

## Uso Básico

### 1. Con el servicio (Recomendado)

Primero, crea un componente para el contenido del modal:

```typescript
import { Component, inject } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@loan/app/shared/components/modal';
import { Button } from '@loan/app/shared/components/button';

@Component({
  selector: 'app-terms-modal',
  standalone: true,
  imports: [Modal, ModalHeader, ModalBody, ModalFooter, Button],
  template: `
    <app-modal [size]="'2xl'" [dismissible]="true">
      <app-modal-header (closeClick)="close()">Terms of Service</app-modal-header>

      <app-modal-body>
        <p class="text-base leading-relaxed text-text-secondary">
          With less than a month to go before the European Union enacts new consumer
          privacy laws for its citizens...
        </p>
        <p class="text-base leading-relaxed text-text-secondary">
          The European Union's General Data Protection Regulation (G.D.P.R.) goes
          into effect on May 25...
        </p>
      </app-modal-body>

      <app-modal-footer>
        <app-button (buttonClick)="close()">I accept</app-button>
        <app-button [variant]="'outline'" [tone]="'neutral'" (buttonClick)="close()">
          Decline
        </app-button>
      </app-modal-footer>
    </app-modal>
  `,
})
export class TermsModalComponent {
  private readonly dialog = inject(Dialog);

  close(): void {
    this.dialog.closeAll();
  }
}
```

Luego, abre el modal desde cualquier componente:

```typescript
import { Component, inject } from '@angular/core';
import { ModalService } from '@loan/app/shared/components/modal';
import { TermsModalComponent } from './terms-modal.component';
import { Button } from '@loan/app/shared/components/button';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [Button],
  template: `
    <app-button (buttonClick)="openModal()">Open Terms</app-button>
  `,
})
export class PageComponent {
  private readonly modalService = inject(ModalService);

  openModal(): void {
    this.modalService.open(TermsModalComponent);
  }
}
```

### 2. Modal Simple (sin componente custom)

```typescript
import { Component, inject } from '@angular/core';
import { ModalService } from '@loan/app/shared/components/modal';

@Component({
  selector: 'app-page',
  template: `
    <app-button (buttonClick)="showInfo()">Show Info</app-button>
  `,
})
export class PageComponent {
  private readonly modalService = inject(ModalService);

  showInfo(): void {
    this.modalService.openSimple({
      title: 'Important Information',
      content: 'This is a simple modal with just title and content.',
      size: 'md',
      dismissible: true,
    });
  }
}
```

## Configuración

### Tamaños disponibles

```typescript
type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Ejemplo
this.modalService.open(MyModalComponent, {
  size: 'lg', // Default es '2xl'
});
```

### Dismissible (cerrar al hacer clic fuera)

```typescript
this.modalService.open(MyModalComponent, {
  dismissible: false, // Default es true
});
```

### Test IDs

Todos los componentes soportan `data-testid`:

```typescript
this.modalService.open(MyModalComponent, {
  testId: 'terms-modal',
});
```

Esto generará automáticamente:
- `terms-modal-overlay`
- `terms-modal-container`
- `terms-modal-content`
- `terms-modal-header`
- `terms-modal-close-btn`
- `terms-modal-body`
- `terms-modal-footer`

## Recibir datos en el modal

Puedes pasar datos al componente del modal:

```typescript
interface UserModalData {
  userId: string;
  userName: string;
}

// Abrir modal con datos
this.modalService.open<void, UserModalData>(UserModalComponent, {
  data: {
    userId: '123',
    userName: 'John Doe',
  },
});

// En el componente modal
import { DIALOG_DATA } from '@angular/cdk/dialog';

@Component({...})
export class UserModalComponent {
  data = inject<UserModalData>(DIALOG_DATA);

  // Usar data en el template
  template: `<p>User: {{ data.userName }}</p>`
}
```

## Cerrar modal con resultado

```typescript
import { DialogRef } from '@angular/cdk/dialog';

@Component({...})
export class ConfirmModalComponent {
  dialogRef = inject(DialogRef);

  confirm(): void {
    this.dialogRef.close({ confirmed: true });
  }

  cancel(): void {
    this.dialogRef.close({ confirmed: false });
  }
}

// Al abrir el modal
const dialogRef = this.modalService.open<{confirmed: boolean}>(ConfirmModalComponent);

dialogRef.closed.subscribe(result => {
  if (result?.confirmed) {
    console.log('User confirmed!');
  }
});
```

## Cerrar todos los modales

```typescript
this.modalService.closeAll();
```

## Estilos y Theming

El modal usa tokens de Tailwind v4 y soporta dark mode automáticamente:

- Background: `bg-white dark:bg-gray-700`
- Text: `text-gray-900 dark:text-white`
- Borders: `border-gray-200 dark:border-gray-600`

## Accesibilidad

El componente incluye:
- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby` (cuando se proporciona título)
- `aria-label` en el botón cerrar
- Screen reader text para el icono de cerrar
- Keyboard navigation support (ESC para cerrar cuando dismissible=true)

## Ejemplo Completo

Ver el archivo de stories en `src/stories/app/shared/components/modal/modal.stories.ts` para más ejemplos.
