import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Book, CodeXml, Languages, LucideAngularModule, SquareActivity, University } from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, LucideAngularModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  icons = {CodeXml, Book, SquareActivity, University, Languages}
  protected readonly title = signal('checklist');
}
