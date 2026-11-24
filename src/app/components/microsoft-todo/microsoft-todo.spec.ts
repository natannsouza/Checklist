import { TestBed } from '@angular/core/testing';
import { MicrosoftTodo } from './microsoft-todo';
import { MicrosoftTodoApi, TodoTask } from './microsoft-todo-api';

describe('MicrosoftTodo', () => {
  it('adds and completes a task in the chosen Microsoft To Do list', async () => {
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
      add: vi.fn(async (_listId: string, title: string) => {
        const task = { id: 'review', title, status: 'notStarted' };
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
      await fixture.whenStable();
      panel.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
      await fixture.whenStable();
      expect(api.add).toHaveBeenCalledWith('studies', 'Revisar para N3');

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
