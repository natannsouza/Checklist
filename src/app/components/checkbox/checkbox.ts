import { Component, input, signal } from '@angular/core';
import { Check, LucideAngularModule, Trash2, X } from 'lucide-angular';
import type { LucideIconData } from 'lucide-angular';

export const weekDays = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
] as const;

@Component({
  selector: 'tr[app-checkbox]',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.css',
})
export class Checkbox {
  protected readonly icons = { Trash2, Check, X };
  protected readonly weekDays = weekDays;
  protected readonly states = ['Sem marcação', 'Concluído', 'Não concluído'];

  readonly storageKey = input.required<string>();
  readonly habitName = input.required<string>();
  readonly habitIcon = input.required<LucideIconData>();
  readonly description = input<string>();
  protected readonly items = signal(weekDays.map((_, id) => ({ id, state: 0 })));

  ngOnInit() {
    const saved = localStorage.getItem(this.storageKey());
    if (saved) {
      this.items.set(JSON.parse(saved));
    }
  }

  protected toggle(index: number) {
    const update = this.items().map((item, i) =>
      i === index ? { ...item, state: (item.state + 1) % 3 } : item,
    );
    this.items.set(update);
    this.save();
  }

  protected reset() {
    this.items.set(weekDays.map((_, id) => ({ id, state: 0 })));
    this.save();
  }

  private save() {
    localStorage.setItem(this.storageKey(), JSON.stringify(this.items()));
  }
}
