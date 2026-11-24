import { Component, OnInit, signal } from '@angular/core';
import { CodeXml, Dumbbell, GraduationCap, Languages } from 'lucide-angular';
import { Checkbox, weekDays } from '../checkbox/checkbox';
import { MicrosoftTodo } from '../microsoft-todo/microsoft-todo';
import { DatePipe } from '@angular/common';
import { interval } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [Checkbox, DatePipe, MicrosoftTodo],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  protected readonly weekDays = weekDays;
  protected readonly habits = [
    { storageKey: 'University', name: 'Faculdade', icon: GraduationCap },
    { storageKey: 'SquareActivity', name: 'Musculação', icon: Dumbbell },
    {
      storageKey: 'CodeXml',
      name: 'Código',
      icon: CodeXml,
      description: 'Projetos pessoais ou estudos da faculdade',
    },
    { storageKey: 'Languages', name: 'Inglês', icon: Languages },
  ];

  data = signal(new Date());

  ngOnInit() {
    interval(1000).subscribe(() => {
      this.data.set(new Date());
    });
  }
}
