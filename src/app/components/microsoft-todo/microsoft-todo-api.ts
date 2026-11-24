import { Injectable } from '@angular/core';
import type { PublicClientApplication } from '@azure/msal-browser';

const graph = 'https://graph.microsoft.com';
const scopes = ['https://graph.microsoft.com/Tasks.ReadWrite'];

export const microsoftRedirectUri = new URL('microsoft-auth', document.baseURI).href;

export interface TodoList {
  id: string;
  displayName: string;
  wellknownListName: string;
}

export interface TodoTask {
  id: string;
  title: string;
  status: string;
}

export class MicrosoftSessionExpired extends Error {}

@Injectable()
export class MicrosoftTodoApi {
  private client?: PublicClientApplication;
  private authError?: (typeof import('@azure/msal-browser'))['InteractionRequiredAuthError'];

  async initialize(clientId: string) {
    const { InteractionRequiredAuthError, PublicClientApplication } =
      await import('@azure/msal-browser');
    const client = new PublicClientApplication({
      auth: {
        clientId,
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: microsoftRedirectUri,
      },
      cache: { cacheLocation: 'sessionStorage' },
    });
    await client.initialize();
    this.client = client;
    this.authError = InteractionRequiredAuthError;
    return client.getActiveAccount() !== null;
  }

  async connect() {
    const client = this.client;
    if (!client) throw new Error('Configure a conexão Microsoft primeiro');
    const result = await client.loginPopup({ scopes, prompt: 'select_account' });
    client.setActiveAccount(result.account);
  }

  async disconnect() {
    await this.client?.clearCache();
    this.client?.setActiveAccount(null);
  }

  async lists() {
    const lists = await this.collection<TodoList>('/v1.0/me/todo/lists');
    return lists.filter((list) => list.wellknownListName !== 'flaggedEmails');
  }

  tasks(listId: string) {
    return this.collection<TodoTask>(this.taskPath(listId));
  }

  add(listId: string, title: string) {
    return this.request<TodoTask>(this.taskPath(listId), 'POST', { title });
  }

  complete(listId: string, taskId: string) {
    return this.request<TodoTask>(
      `${this.taskPath(listId)}/${encodeURIComponent(taskId)}`,
      'PATCH',
      {
        status: 'completed',
      },
    );
  }

  private taskPath(listId: string) {
    return `/v1.0/me/todo/lists/${encodeURIComponent(listId)}/tasks`;
  }

  private async collection<T>(path: string) {
    const items: T[] = [];
    let next: string | undefined = path;
    while (next) {
      const page: { value: T[]; '@odata.nextLink'?: string } = await this.request(next);
      items.push(...page.value);
      next = page['@odata.nextLink'];
    }
    return items;
  }

  private async request<T>(path: string, method = 'GET', body?: object): Promise<T> {
    const url = new URL(path, graph);
    if (url.origin !== graph) throw new Error('URL inesperada do Microsoft Graph');

    const client = this.client;
    const account = client?.getActiveAccount();
    if (!client || !account) throw new MicrosoftSessionExpired();

    const { accessToken } = await client.acquireTokenSilent({ account, scopes }).catch((error) => {
      if (this.authError && error instanceof this.authError) throw new MicrosoftSessionExpired();
      throw error;
    });
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(body && { 'Content-Type': 'application/json' }),
      },
      body: body && JSON.stringify(body),
    });
    if (response.status === 401) throw new MicrosoftSessionExpired();
    if (!response.ok) throw new Error(`Microsoft Graph retornou ${response.status}`);
    return response.json();
  }
}
