import { TestBed } from '@angular/core/testing';
import { MicrosoftTodo } from './microsoft-todo';
import { MicrosoftTodoApi, TodoTask } from './microsoft-todo-api';

describe('MicrosoftTodo', () => {
  it('orders by the displayed due day and keeps undated tasks last in both directions', async () => {
    const configKey = 'checklist.microsoftTodo.clientId';
    const tasks: TodoTask[] = [
      { id: 'undated', title: 'Sem prazo', status: 'notStarted' },
      {
        id: 'later',
        title: 'Prazo distante',
        status: 'notStarted',
        dueDateTime: { dateTime: '2026-12-01T00:00:00', timeZone: 'America/Sao_Paulo' },
      },
      {
        id: 'earlier',
        title: 'Prazo próximo',
        status: 'notStarted',
        dueDateTime: { dateTime: '2026-11-30T03:00:00', timeZone: 'UTC' },
      },
    ];
    const api = {
      initialize: vi.fn(async () => true),
      lists: vi.fn(async () => [
        { id: 'default', displayName: 'Tarefas', wellknownListName: 'defaultList' },
      ]),
      tasks: vi.fn(async () => tasks),
    };

    localStorage.setItem(configKey, '01234567-89ab-cdef-0123-456789abcdef');
    try {
      TestBed.configureTestingModule({ imports: [MicrosoftTodo] }).overrideComponent(
        MicrosoftTodo,
        {
          set: { providers: [{ provide: MicrosoftTodoApi, useValue: api }] },
        },
      );
      const fixture = TestBed.createComponent(MicrosoftTodo);
      const panel = fixture.nativeElement as HTMLElement;
      await fixture.whenStable();

      await vi.waitFor(() => expect(panel.textContent).toContain('Ordenar por'));
      const picker = panel.querySelectorAll('select')[1];
      const taskLabels = () =>
        [...panel.querySelectorAll('li button')].map((button) => button.getAttribute('aria-label'));
      expect(picker.value).toBe('list');
      expect(taskLabels()).toEqual([
        'Concluir: Sem prazo',
        'Concluir: Prazo distante',
        'Concluir: Prazo próximo',
      ]);

      picker.value = 'nearest';
      picker.dispatchEvent(new Event('change'));
      await fixture.whenStable();
      expect(taskLabels()).toEqual([
        'Concluir: Prazo próximo',
        'Concluir: Prazo distante',
        'Concluir: Sem prazo',
      ]);

      picker.value = 'farthest';
      picker.dispatchEvent(new Event('change'));
      await fixture.whenStable();
      expect(taskLabels()).toEqual([
        'Concluir: Prazo distante',
        'Concluir: Prazo próximo',
        'Concluir: Sem prazo',
      ]);
      expect(api.tasks).toHaveBeenCalledOnce();
    } finally {
      localStorage.removeItem(configKey);
    }
  });

  it.each(['2026-11-28', ''])('adds and completes a task with due date "%s"', async (dueDate) => {
    const configKey = 'checklist.microsoftTodo.clientId';
    const lists = [
      { id: 'studies', displayName: 'Estudos', wellknownListName: 'none' },
      { id: 'default', displayName: 'Tarefas', wellknownListName: 'defaultList' },
    ];
    const tasks: TodoTask[] = [];
    const api = {
      initialize: vi.fn(async () => false),
      connect: vi.fn(async () => {}),
      lists: vi.fn(async () => lists),
      tasks: vi.fn(async () => tasks.map((task) => ({ ...task }))),
      add: vi.fn(async (_listId: string, title: string, date?: string) => {
        const task: TodoTask = { id: 'review', title, status: 'notStarted' };
        if (date) {
          task.dueDateTime = {
            dateTime: new Date(`${date}T00:00:00`).toISOString().slice(0, -1),
            timeZone: 'UTC',
          };
        }
        tasks.push(task);
        return { ...task };
      }),
      complete: vi.fn(async () => {
        tasks[0].status = 'completed';
      }),
    };

    localStorage.setItem(configKey, '01234567-89ab-cdef-0123-456789abcdef');
    try {
      TestBed.configureTestingModule({ imports: [MicrosoftTodo] }).overrideComponent(
        MicrosoftTodo,
        {
          set: { providers: [{ provide: MicrosoftTodoApi, useValue: api }] },
        },
      );
      const fixture = TestBed.createComponent(MicrosoftTodo);
      const panel = fixture.nativeElement as HTMLElement;
      await fixture.whenStable();

      panel.querySelector('button')!.click();
      await fixture.whenStable();
      expect(api.connect).toHaveBeenCalledOnce();

      const picker = panel.querySelector('select')!;
      expect(picker.value).toBe('default');
      picker.value = 'studies';
      picker.dispatchEvent(new Event('change'));
      await fixture.whenStable();

      const input = panel.querySelector<HTMLInputElement>('input[name="title"]')!;
      input.value = '  Revisar para N3  ';
      input.dispatchEvent(new Event('input'));
      const dateInput = panel.querySelector<HTMLInputElement>('input[name="dueDate"]')!;
      dateInput.value = dueDate;
      dateInput.dispatchEvent(new Event('input'));
      await fixture.whenStable();
      panel.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
      await fixture.whenStable();
      expect(api.add).toHaveBeenCalledWith('studies', 'Revisar para N3', dueDate || undefined);
      expect(dateInput.value).toBe('');
      const displayedDate = panel.querySelector('li time');
      if (dueDate) {
        expect(displayedDate?.getAttribute('datetime')).toBe(dueDate);
        expect(displayedDate?.textContent?.trim()).toBe('Até 28/11/2026');
      } else {
        expect(displayedDate).toBeNull();
      }

      panel.querySelector<HTMLButtonElement>('[aria-label="Concluir: Revisar para N3"]')!.click();
      await fixture.whenStable();
      expect(api.complete).toHaveBeenCalledWith('studies', 'review');
      expect(panel.querySelector('li')).toBeNull();
      expect(panel.textContent).toContain('Concluídas nesta lista: 1');
    } finally {
      localStorage.removeItem(configKey);
    }
  });
});
