import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Check,
  ExternalLink,
  ListTodo,
  LucideAngularModule,
  Plus,
  RefreshCw,
} from 'lucide-angular';
import {
  microsoftRedirectUri,
  MicrosoftSessionExpired,
  MicrosoftTodoApi,
  TodoList,
  TodoTask,
} from './microsoft-todo-api';

const clientIdKey = 'checklist.microsoftTodo.clientId';
const clientIdPattern = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

@Component({
  selector: 'app-microsoft-todo',
  imports: [FormsModule, LucideAngularModule],
  providers: [MicrosoftTodoApi],
  templateUrl: './microsoft-todo.html',
})
export class MicrosoftTodo implements OnInit {
  private readonly api = inject(MicrosoftTodoApi);

  protected readonly icons = { Check, ExternalLink, ListTodo, Plus, RefreshCw };
  protected readonly redirectUri = microsoftRedirectUri;
  protected readonly configured = signal(false);
  protected readonly connected = signal(false);
  protected readonly busy = signal(false);
  protected readonly error = signal('');
  protected readonly lists = signal<TodoList[]>([]);
  protected readonly listId = signal('');
  protected readonly tasks = signal<TodoTask[]>([]);
  protected readonly completedCount = signal(0);
  protected title = '';
  protected clientId = '';

  ngOnInit() {
    void this.run(async () => {
      this.clientId = localStorage.getItem(clientIdKey) ?? '';
      if (clientIdPattern.test(this.clientId)) {
        this.connected.set(await this.api.initialize(this.clientId));
        this.configured.set(true);
        if (this.connected()) await this.loadLists();
      }
    }, 'Não foi possível carregar a conexão. Atualize a página para tentar novamente.');
  }

  protected configure() {
    const clientId = this.clientId.trim();
    if (!clientIdPattern.test(clientId)) {
      this.error.set('Informe a ID do aplicativo no formato mostrado no Microsoft Entra.');
      return;
    }

    void this.run(async () => {
      this.resetTasks();
      this.connected.set(await this.api.initialize(clientId));
      localStorage.setItem(clientIdKey, clientId);
      this.clientId = clientId;
      this.configured.set(true);
      if (this.connected()) await this.loadLists();
    }, 'Não foi possível salvar a configuração da Microsoft.');
  }

  protected connect() {
    void this.run(async () => {
      this.resetTasks();
      this.title = '';
      await this.api.connect();
      this.connected.set(true);
      await this.loadLists();
    }, 'Não foi possível conectar ou carregar as listas. Confira a configuração e tente novamente.');
  }

  protected disconnect() {
    void this.run(async () => {
      await this.api.disconnect();
      this.connected.set(false);
      this.title = '';
      this.resetTasks();
    }, 'Não foi possível desconectar a conta Microsoft.');
  }

  protected refresh() {
    void this.run(
      () => this.loadLists(),
      'Não foi possível atualizar as listas do Microsoft To Do.',
    );
  }

  protected selectList(id: string) {
    void this.run(async () => {
      this.listId.set(id);
      this.setTasks([]);
      this.setTasks(await this.api.tasks(id));
    }, 'Não foi possível carregar as tarefas. Use o botão Atualizar para tentar novamente.');
  }

  protected add() {
    const title = this.title.trim();
    const listId = this.listId();
    if (!title || !listId) return;

    void this.run(async () => {
      const task = await this.api.add(listId, title);
      this.tasks.update((tasks) => [task, ...tasks]);
      this.title = '';
    }, 'Não foi possível confirmar a adição. Atualize a lista antes de tentar de novo.');
  }

  protected complete(task: TodoTask) {
    const listId = this.listId();
    if (!listId) return;

    void this.run(async () => {
      await this.api.complete(listId, task.id);
      this.tasks.update((tasks) => tasks.filter(({ id }) => id !== task.id));
      this.completedCount.update((count) => count + 1);
      try {
        this.setTasks(await this.api.tasks(listId));
      } catch {
        this.error.set('Tarefa concluída. Use o botão Atualizar para recarregar a lista.');
      }
    }, 'Não foi possível confirmar a conclusão. Atualize a lista antes de tentar de novo.');
  }

  private async loadLists() {
    const lists = await this.api.lists();
    const selected =
      lists.find(({ id }) => id === this.listId()) ??
      lists.find(({ wellknownListName }) => wellknownListName === 'defaultList') ??
      lists[0];
    const tasks = selected ? await this.api.tasks(selected.id) : [];
    this.lists.set(lists);
    this.listId.set(selected?.id ?? '');
    this.setTasks(tasks);
  }

  private setTasks(tasks: TodoTask[]) {
    const pending = tasks.filter(({ status }) => status !== 'completed');
    this.tasks.set(pending);
    this.completedCount.set(tasks.length - pending.length);
  }

  private resetTasks() {
    this.lists.set([]);
    this.listId.set('');
    this.setTasks([]);
  }

  private async run(action: () => Promise<void>, failureMessage: string) {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');

    try {
      await action();
    } catch (error) {
      if (error instanceof MicrosoftSessionExpired) {
        this.connected.set(false);
        this.resetTasks();
        this.error.set('A sessão expirou. Conecte sua conta Microsoft novamente.');
      } else {
        this.error.set(failureMessage);
      }
    } finally {
      this.busy.set(false);
    }
  }
}
