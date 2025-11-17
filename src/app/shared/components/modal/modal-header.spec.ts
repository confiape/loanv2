import { provideZonelessChangeDetection } from '@angular/core';
import { render } from '@testing-library/angular';
import { ModalHeader } from './modal-header';

const setupModalHeader = async () => {
  const { fixture, component } = await render(ModalHeader, {
    providers: [provideZonelessChangeDetection()],
  });

  return { fixture, component };
};

describe('ModalHeader', () => {
  it('should create', async () => {
    const { component } = await setupModalHeader();
    expect(component).toBeTruthy();
  });

  it('should render header with correct styles', async () => {
    const { fixture } = await setupModalHeader();
    const header = fixture.nativeElement.querySelector('div');
    expect(header.className).toContain('flex');
    expect(header.className).toContain('items-center');
    expect(header.className).toContain('justify-between');
    expect(header.className).toContain('border-b');
  });

  it('should render close button', async () => {
    const { fixture } = await setupModalHeader();
    const closeButton = fixture.nativeElement.querySelector('button');
    expect(closeButton).toBeTruthy();
    expect(closeButton.getAttribute('type')).toBe('button');
  });

  it('should emit closeClick when close button is clicked', async () => {
    const { fixture, component } = await setupModalHeader();
    let emitted = false;
    component.closeClick.subscribe(() => {
      emitted = true;
    });

    const closeButton = fixture.nativeElement.querySelector('button');
    closeButton.click();

    expect(emitted).toBeTruthy();
  });

  it('should have accessible label for close button', async () => {
    const { fixture } = await setupModalHeader();
    const closeButton = fixture.nativeElement.querySelector('button');
    expect(closeButton.getAttribute('aria-label')).toBe('Close modal');
  });

  it('should render svg icon in close button', async () => {
    const { fixture } = await setupModalHeader();
    const svg = fixture.nativeElement.querySelector('button svg');
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('aria-hidden')).toBe('true');
  });

  it('should render screen reader text', async () => {
    const { fixture } = await setupModalHeader();
    const srOnly = fixture.nativeElement.querySelector('.sr-only');
    expect(srOnly).toBeTruthy();
    expect(srOnly.textContent).toBe('Close modal');
  });
});
