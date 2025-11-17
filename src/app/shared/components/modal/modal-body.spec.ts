import { provideZonelessChangeDetection } from '@angular/core';
import { render } from '@testing-library/angular';
import { ModalBody } from './modal-body';

const setupModalBody = async () => {
  const { fixture, component } = await render(ModalBody, {
    providers: [provideZonelessChangeDetection()],
  });

  return { fixture, component };
};

describe('ModalBody', () => {
  it('should create', async () => {
    const { component } = await setupModalBody();
    expect(component).toBeTruthy();
  });

  it('should render body with correct styles', async () => {
    const { fixture } = await setupModalBody();
    const body = fixture.nativeElement.querySelector('div');
    expect(body.className).toContain('p-4');
    expect(body.className).toContain('md:p-5');
    expect(body.className).toContain('space-y-4');
  });

  it('should project content', async () => {
    const { fixture } = await render(ModalBody, {
      providers: [provideZonelessChangeDetection()],
    });

    const testContent = 'Test body content';
    fixture.nativeElement.innerHTML = `<p>${testContent}</p>`;
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain(testContent);
  });
});
