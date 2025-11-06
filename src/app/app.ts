import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  Accordion,
  AccordionItemComponent,
  AccordionItemHeaderComponent,
  AccordionItemContentComponent
} from './shared/components/accordion';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Accordion,
    AccordionItemComponent,
    AccordionItemHeaderComponent,
    AccordionItemContentComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('loan');

  onItemSelected(itemId: string): void {
    console.log('Item selected:', itemId);
  }
}
