import { provideZonelessChangeDetection } from '@angular/core';
import { render } from '@testing-library/angular';
import { ModalFooter } from './modal-footer';

const setupModalFooter = async () => {
  const { fixture, component } = await render(ModalFooter, {
    providers: [provideZonelessChangeDetection()],
  });

  return { fixture, component };
};

describe('ModalFooter', () => {
  it('should create', async () => {
    const { component } = await setupModalFooter();
    expect(component).toBeTruthy();
  });

  it('should render footer with correct styles', async () => {
    const { fixture } = await setupModalFooter();
    const footer = fixture.nativeElement.querySelector('div');
    expect(footer.className).toContain('flex');
    expect(footer.className).toContain('items-center');
    expect(footer.className).toContain('border-t');
    expect(footer.className).toContain('rounded-b');
  });

  it('should have border and padding classes', async () => {
    const { fixture } = await setupModalFooter();
    const footer = fixture.nativeElement.querySelector('div');
    expect(footer.className).toContain('p-4');
    expect(footer.className).toContain('md:p-5');
    expect(footer.className).toContain('border-border');
  });
});
