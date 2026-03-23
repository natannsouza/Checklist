import { Component, input, signal } from '@angular/core';
import { LucideAngularModule, Trash2 } from 'lucide-angular';

interface CheckItem{
  id: number,
  state: boolean;
  storageKey: string;
}

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports:[LucideAngularModule],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.css',
})


export class Checkbox {
  icons = { Trash2 };

  storageKey = input.required<string>();
  items = signal(Array.from({ length: 7 }, (_, i) => ({ id: i, state: false })));

  ngOnInit(){
    const saved = localStorage.getItem(this.storageKey());
    if(saved){
      this.items.set(JSON.parse(saved));
    }
  }

  toggle(index: number) {
    const updated = this.items().map((item, i)=> i=== index? {...item, state: !item.state}: item);
    this.items.set(updated);
    this.save();
  }

  save() {
    localStorage.setItem(this.storageKey() , JSON.stringify(this.items()));
  }
}
