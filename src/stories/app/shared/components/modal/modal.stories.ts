import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { Component, inject } from '@angular/core';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { Modal } from '@loan/app/shared/components/modal/modal';
import { ModalHeader } from '@loan/app/shared/components/modal/modal-header';
import { ModalBody } from '@loan/app/shared/components/modal/modal-body';
import { ModalFooter } from '@loan/app/shared/components/modal/modal-footer';
import { ModalService } from '@loan/app/shared/components/modal/modal.service';
import { Button } from '@loan/app/shared/components/button/button';
import { wrapInLightDarkComparison } from '@loan/stories/story-helpers';

/**
 * Base modal component that accepts configuration
 */
@Component({
  selector: 'app-example-modal',
  standalone: true,
  imports: [Modal, ModalHeader, ModalBody, ModalFooter, Button],
  template: `
    <app-modal [size]="modalSize" [dismissible]="modalDismissible">
      <app-modal-header (closeClick)="close()">{{ modalTitle }}</app-modal-header>
      <app-modal-body>
        <p class="text-base leading-relaxed text-text-secondary">
          With less than a month to go before the European Union enacts new consumer privacy laws
          for its citizens, companies around the world are updating their terms of service
          agreements to comply.
        </p>
        <p class="text-base leading-relaxed text-text-secondary">
          The European Union's General Data Protection Regulation (G.D.P.R.) goes into effect on May
          25 and is meant to ensure a common set of data rights in the European Union. It requires
          organizations to notify users as soon as possible of high-risk data breaches that could
          personally affect them.
        </p>
      </app-modal-body>
      <app-modal-footer>
        <app-button (buttonClick)="close()">I accept</app-button>
        <app-button [variant]="'outline'" [tone]="'neutral'" (buttonClick)="close()"
          >Decline</app-button
        >
      </app-modal-footer>
    </app-modal>
  `,
})
class ExampleModalComponent {
  modalSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl' = '2xl';
  modalDismissible = true;
  modalTitle = 'Terms of Service';

  private readonly dialog = inject(Dialog);

  close(): void {
    this.dialog.closeAll();
  }
}

/**
 * Story wrapper component that includes trigger button
 */
@Component({
  selector: 'app-modal-story-wrapper',
  standalone: true,
  imports: [Button, DialogModule],
  template: `
    <div class="flex items-center justify-center min-h-[300px]">
      <app-button (buttonClick)="openModal()">Toggle modal</app-button>
    </div>
  `,
})
class ModalStoryWrapper {
  private readonly modalService = inject(ModalService);

  openModal(): void {
    this.modalService.open(ExampleModalComponent);
  }
}

/**
 * Small modal wrapper
 */
@Component({
  selector: 'app-modal-small-wrapper',
  standalone: true,
  imports: [Button],
  template: `
    <div class="flex items-center justify-center min-h-[300px]">
      <app-button (buttonClick)="openModal()">Open Small Modal</app-button>
    </div>
  `,
})
class SmallModalWrapper {
  private readonly modalService = inject(ModalService);

  openModal(): void {
    const modalRef = this.modalService.open(ExampleModalComponent);
    // Configure the modal instance
    if (modalRef.componentInstance) {
      const instance = modalRef.componentInstance as unknown as ExampleModalComponent;
      instance.modalSize = 'sm';
      instance.modalTitle = 'Small Modal (sm)';
    }
  }
}

/**
 * Medium modal wrapper
 */
@Component({
  selector: 'app-modal-medium-wrapper',
  standalone: true,
  imports: [Button],
  template: `
    <div class="flex items-center justify-center min-h-[300px]">
      <app-button (buttonClick)="openModal()">Open Medium Modal</app-button>
    </div>
  `,
})
class MediumModalWrapper {
  private readonly modalService = inject(ModalService);

  openModal(): void {
    const modalRef = this.modalService.open(ExampleModalComponent);
    if (modalRef.componentInstance) {
      const instance = modalRef.componentInstance as unknown as ExampleModalComponent;
      instance.modalSize = 'md';
      instance.modalTitle = 'Medium Modal (md)';
    }
  }
}

/**
 * Large modal wrapper
 */
@Component({
  selector: 'app-modal-large-wrapper',
  standalone: true,
  imports: [Button],
  template: `
    <div class="flex items-center justify-center min-h-[300px]">
      <app-button (buttonClick)="openModal()">Open Large Modal</app-button>
    </div>
  `,
})
class LargeModalWrapper {
  private readonly modalService = inject(ModalService);

  openModal(): void {
    const modalRef = this.modalService.open(ExampleModalComponent);
    if (modalRef.componentInstance) {
      const instance = modalRef.componentInstance as unknown as ExampleModalComponent;
      instance.modalSize = 'lg';
      instance.modalTitle = 'Large Modal (lg)';
    }
  }
}

/**
 * Non-dismissible modal wrapper
 */
@Component({
  selector: 'app-modal-non-dismissible-wrapper',
  standalone: true,
  imports: [Button],
  template: `
    <div class="flex flex-col items-center justify-center gap-4 min-h-[300px]">
      <p class="text-sm text-text-secondary">This modal cannot be closed by clicking outside</p>
      <app-button (buttonClick)="openModal()">Open Non-Dismissible Modal</app-button>
    </div>
  `,
})
class NonDismissibleModalWrapper {
  private readonly modalService = inject(ModalService);

  openModal(): void {
    const modalRef = this.modalService.open(ExampleModalComponent, {
      dismissible: false,
    });
    if (modalRef.componentInstance) {
      const instance = modalRef.componentInstance as unknown as ExampleModalComponent;
      instance.modalDismissible = false;
      instance.modalTitle = 'Non-Dismissible Modal';
    }
  }
}

const meta: Meta = {
  title: 'UI/Modal',
  decorators: [
    moduleMetadata({
      imports: [
        ModalStoryWrapper,
        SmallModalWrapper,
        MediumModalWrapper,
        LargeModalWrapper,
        NonDismissibleModalWrapper,
        ExampleModalComponent,
        Modal,
        ModalHeader,
        ModalBody,
        ModalFooter,
        Button,
        DialogModule,
      ],
      providers: [ModalService],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <app-modal-story-wrapper />
    `),
  }),
};

export const SmallSize: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <app-modal-small-wrapper />
    `),
  }),
};

export const MediumSize: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <app-modal-medium-wrapper />
    `),
  }),
};

export const LargeSize: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <app-modal-large-wrapper />
    `),
  }),
};

export const NonDismissible: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <app-modal-non-dismissible-wrapper />
    `),
  }),
};
