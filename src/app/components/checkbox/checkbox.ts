import { Component, input, signal } from '@angular/core';
import { Check, CircleX, LucideAngularModule, Trash2, X } from 'lucide-angular';

interface CheckItem {
  id: number;
  state: number;
  storageKey: string;
}

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.css',
})
export class Checkbox {
  icons = { Trash2, Check, CircleX , X };

  storageKey = input.required<string>();
  items = signal(Array.from({ length: 7 }, (_, i) => ({ id: i, state: 0 })));

  ngOnInit() {
    const saved = localStorage.getItem(this.storageKey());
    if (saved) {
      this.items.set(JSON.parse(saved));
    }
  }

  toggle(index: number) {
    const update = this.items().map((item, i) =>
      i === index ? { ...item, state: (item.state + 1) % 3 } : item,
    );
    this.items.set(update);
    this.save();
  }

  toggleNull() {
    const reset = Array.from({ length: 7 }, (_, i) => ({ id: i, state: 0 }));
    this.items.set(reset);
    this.save();
  }

  save() {
    localStorage.setItem(this.storageKey(), JSON.stringify(this.items()));
  }
}
