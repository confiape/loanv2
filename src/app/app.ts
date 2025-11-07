import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import {
  Accordion,
  AccordionItemComponent,
  AccordionItemHeaderComponent,
  AccordionItemContentComponent,
} from './shared/components/accordion';
import { Button } from './shared/components/button';
import {
  ModalService,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from './shared/components/modal';

/**
 * Example modal component for terms of service
 */
@Component({
  selector: 'app-terms-modal',
  standalone: true,
  imports: [Modal, ModalHeader, ModalBody, ModalFooter, Button],
  template: `
    <app-modal [size]="'2xl'" [dismissible]="true">
      <app-modal-header (closeClick)="close()">Terms of Service</app-modal-header>

      <app-modal-body>
        <p class="text-base leading-relaxed text-text-secondary mb-4">
          With less than a month to go before the European Union enacts new consumer privacy laws
          for its citizens, companies around the world are updating their terms of service
          agreements to comply.
        </p>
        <p class="text-base leading-relaxed text-text-secondary">
          The European Union's General Data Protection Regulation (G.D.P.R.) goes into effect on
          May 25 and is meant to ensure a common set of data rights in the European Union. It
          requires organizations to notify users as soon as possible of high-risk data breaches
          that could personally affect them.
        </p>
      </app-modal-body>

      <app-modal-footer>
        <app-button (buttonClick)="accept()">I accept</app-button>
        <app-button [variant]="'outline'" [tone]="'neutral'" (buttonClick)="decline()">
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

  accept(): void {
    console.log('User accepted terms');
    this.close();
  }

  decline(): void {
    console.log('User declined terms');
    this.close();
  }
}

/**
 * Confirmation modal component
 */
@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [Modal, ModalHeader, ModalBody, ModalFooter, Button],
  template: `
    <app-modal [size]="'md'" [dismissible]="false">
      <app-modal-header (closeClick)="cancel()">Confirm Action</app-modal-header>

      <app-modal-body>
        <p class="text-base text-text-primary mb-2">Are you sure you want to delete this item?</p>
        <p class="text-sm text-text-secondary">This action cannot be undone.</p>
      </app-modal-body>

      <app-modal-footer>
        <app-button [tone]="'danger'" (buttonClick)="confirm()">Delete</app-button>
        <app-button [variant]="'outline'" [tone]="'neutral'" (buttonClick)="cancel()">
          Cancel
        </app-button>
      </app-modal-footer>
    </app-modal>
  `,
})
export class ConfirmModalComponent {
  private readonly dialog = inject(Dialog);

  confirm(): void {
    console.log('User confirmed deletion');
    this.close();
  }

  cancel(): void {
    console.log('User cancelled');
    this.close();
  }

  close(): void {
    this.dialog.closeAll();
  }
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Accordion,
    AccordionItemComponent,
    AccordionItemHeaderComponent,
    AccordionItemContentComponent,
    Button,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly modalService = inject(ModalService);

  openTermsModal(): void {
    this.modalService.open(TermsModalComponent);
  }

  openConfirmModal(): void {
    this.modalService.open(ConfirmModalComponent);
  }

  openSmallModal(): void {
    const modalRef = this.modalService.open(TermsModalComponent);
    if (modalRef.componentInstance) {
      const instance = modalRef.componentInstance as unknown as TermsModalComponent;
      // Aquí podrías configurar el modal si fuera necesario
    }
  }
}
