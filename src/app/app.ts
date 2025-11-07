import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from './shared/components/button';
import { Alert } from './shared/components/alert';
import { ToastContainer, ToastService } from './shared/components/toast';
import { ButtonGroup, ButtonGroupButton } from './shared/components/button-group';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Button, Alert, ToastContainer, ButtonGroup, ButtonGroupButton],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  @ViewChild('toastContainer', { static: false }) toastContainer!: ToastContainer;

  private readonly toastService = inject(ToastService);

  ngAfterViewInit(): void {
    console.log('ToastContainer:', this.toastContainer);
    if (this.toastContainer) {
      this.toastService.setContainer(this.toastContainer);
      console.log('Toast container registered successfully');
    } else {
      console.error('ToastContainer not found!');
    }
  }

  // Alert example
  dismissAlert(): void {
    console.log('Alert dismissed');
  }

  // Toast examples
  showToastInfo(): void {
    console.log('Showing info toast');
    this.toastService.info('This is an informational message', 'Info');
  }

  showToastSuccess(): void {
    console.log('Showing success toast');
    this.toastService.success('Operation completed successfully!', 'Success');
  }

  showToastError(): void {
    console.log('Showing error toast');
    this.toastService.error('An error occurred', 'Error');
  }

  showToastWarning(): void {
    console.log('Showing warning toast');
    this.toastService.warning('Please be careful', 'Warning');
  }

  // Button group examples
  onButtonGroupClick(action: string): void {
    console.log('Button group action:', action);
    this.toastService.info(`You clicked: ${action}`);
  }
}
