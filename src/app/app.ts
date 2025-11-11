import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ToastComponent} from '@loan/app/shared/components/toast/toast';
import {ToastContainerComponent} from '@loan/app/shared/components/toast/toast-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
