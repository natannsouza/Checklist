import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Checkbox } from './components/checkbox/checkbox';
import { Book, CodeXml, Languages, LucideAngularModule, School, SquareActivity, University } from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, Checkbox, LucideAngularModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  icons = {CodeXml, Book, SquareActivity, University, Languages}
  protected readonly title = signal('checklist');
}
