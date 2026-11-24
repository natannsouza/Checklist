import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BookOpen,
  CalendarDays,
  Dumbbell,
  GraduationCap,
  Languages,
  LucideAngularModule,
  Moon,
} from 'lucide-angular';
import { Checkbox, weekDays } from '../checkbox/checkbox';
import { MicrosoftTodo } from '../microsoft-todo/microsoft-todo';
import { DatePipe } from '@angular/common';
import { interval } from 'rxjs';

const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });
const themeKey = 'checklist.theme';

@Component({
  selector: 'app-home',
  imports: [Checkbox, DatePipe, LucideAngularModule, MicrosoftTodo],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  protected readonly calendarIcon = CalendarDays;
  protected readonly themeIcon = Moon;
  protected readonly darkMode = signal(false);
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
  protected readonly week = computed(() => {
    const today = this.data();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = today.getDate() - today.getDay();

    return {
      start: new Date(year, month, firstDay),
      end: new Date(year, month, firstDay + 6),
    };
  });

  ngOnInit() {
    try {
      this.darkMode.set(localStorage.getItem(themeKey) === 'dark');
    } catch {
      // The default theme works when browser storage is unavailable.
    }

    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.data.set(new Date());
      });
  }

  protected toggleTheme() {
    this.darkMode.update((dark) => !dark);
    try {
      localStorage.setItem(themeKey, this.darkMode() ? 'dark' : 'light');
    } catch {
      // The theme still applies to the current page.
    }
  }
}
