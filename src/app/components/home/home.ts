import { Component, OnInit, signal } from '@angular/core';
import {
  Book,
  CodeXml,
  Languages,
  LucideAngularModule,
  SquareActivity,
  University,CalendarDays, Dumbbell, Bitcoin 
} from 'lucide-angular';
import { Checkbox } from '../checkbox/checkbox';
import { MicrosoftTodo } from '../microsoft-todo/microsoft-todo';
import { DatePipe } from '@angular/common';
import { interval } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [LucideAngularModule, Checkbox, DatePipe, MicrosoftTodo],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  icons = { CodeXml, Book, SquareActivity, University, Languages, CalendarDays,Dumbbell, Bitcoin    };

  data = signal(new Date());

  ngOnInit() {
    interval(1000).subscribe(() => {
      this.data.set(new Date());
    });
  }
}
