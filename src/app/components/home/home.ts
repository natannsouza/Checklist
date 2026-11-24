import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BookOpen,
  CalendarDays,
  Dumbbell,
  GraduationCap,
  Languages,
  LucideAngularModule,
} from 'lucide-angular';
import { Checkbox, weekDays } from '../checkbox/checkbox';
import { MicrosoftTodo } from '../microsoft-todo/microsoft-todo';
import { DatePipe } from '@angular/common';
import { interval } from 'rxjs';

const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });

@Component({
  selector: 'app-home',
  imports: [Checkbox, DatePipe, LucideAngularModule, MicrosoftTodo],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  protected readonly calendarIcon = CalendarDays;
  protected readonly weekDays = weekDays;
  protected readonly habits = [
    { storageKey: 'University', name: 'Faculdade', icon: GraduationCap },
    { storageKey: 'SquareActivity', name: 'Musculação', icon: Dumbbell },
    {
      storageKey: 'CodeXml',
      name: 'Estudos',
      icon: BookOpen,
      description: 'Projetos pessoais ou estudos da faculdade',
    },
    { storageKey: 'Languages', name: 'Inglês', icon: Languages },
  ];

  readonly data = signal(new Date());
  protected readonly month = computed(() => monthFormatter.format(this.data()));
  protected readonly weekOfMonth = computed(() => {
    const today = this.data();
    const first = new Date(today.getFullYear(), today.getMonth(), 1);
    const precedingDays = (first.getDay() + 6) % 7;
    return Math.ceil((today.getDate() + precedingDays) / 7);
  });

  ngOnInit() {
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.data.set(new Date());
      });
  }
}
