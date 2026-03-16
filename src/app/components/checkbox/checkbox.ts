import { Component, Input, signal } from '@angular/core';
import { LucideAngularModule, CodeXml, Book, SquareActivity, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.css',
})
export class Checkbox {
  icons = { CodeXml, Book, SquareActivity, Trash2 };

  @Input() storageKey: string = 'default';

  code = signal(Array.from({ length: 7 }, (_, i) => ({ id: i, state: false })));
  book = signal(Array.from({ length: 7 }, (_, i) => ({ id: i, state: false })));
  exercise = signal(Array.from({ length: 7 }, (_, i) => ({ id: i, state: false })));

  ngOnInit() {
    this.load('code', this.code);
    this.load('book', this.book);
    this.load('exercise', this.exercise);
  }

  toggle(index: number) {
    const updated = [...this.array()];
    updated[index].state = !updated[index].state;
    this.array.set(updated);
    this.save();
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.array()));
  }
}
