import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Checkbox } from './components/checkbox/checkbox';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, Checkbox],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('checklist');
}
