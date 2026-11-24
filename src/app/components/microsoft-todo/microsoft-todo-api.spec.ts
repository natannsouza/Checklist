import { MicrosoftTodoApi } from './microsoft-todo-api';

const configuredCaches = vi.hoisted(() => vi.fn());

vi.mock('@azure/msal-browser', () => ({
  InteractionRequiredAuthError: Error,
  PublicClientApplication: class {
    constructor(config: { cache: { cacheLocation: string } }) {
      configuredCaches(config.cache.cacheLocation);
    }

    async initialize() {}

    getActiveAccount() {
      return { homeAccountId: 'test-account' };
    }

    async acquireTokenSilent() {
      return { accessToken: 'test-token' };
    }
  },
}));

describe('MicrosoftTodoApi.initialize', () => {
  it('uses persistent MSAL storage only when requested', async () => {
    const api = new MicrosoftTodoApi();
    await api.initialize('test-client');
    expect(configuredCaches).toHaveBeenLastCalledWith('sessionStorage');

    await api.initialize('test-client', true);
    expect(configuredCaches).toHaveBeenLastCalledWith('localStorage');
  });
});

describe('MicrosoftTodoApi.add', () => {
  it('sends a local calendar date to Microsoft Graph only when one is selected', async () => {
    const fetchMock = vi.fn(async (_url: URL, _options: RequestInit) => ({
      ok: true,
      json: async () => ({ id: 'task', title: 'Revisar', status: 'notStarted' }),
    }));
    vi.stubGlobal('fetch', fetchMock);
    try {
      const api = new MicrosoftTodoApi();
      await api.initialize('test-client');
      await api.add('studies', 'Revisar', '2026-11-28');
      await api.add('studies', 'Revisar');

      const [[url, scheduled], [, unscheduled]] = fetchMock.mock.calls;
      expect(url.pathname).toBe('/v1.0/me/todo/lists/studies/tasks');
      expect(scheduled.method).toBe('POST');
      expect(JSON.parse(scheduled.body as string)).toEqual({
        title: 'Revisar',
        dueDateTime: {
          dateTime: '2026-11-28T00:00:00',
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });
      expect(JSON.parse(unscheduled.body as string)).toEqual({ title: 'Revisar' });
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
