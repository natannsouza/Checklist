# Checklist

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.2.

## Conectar o Microsoft To Do

O painel abre com os checks semanais disponíveis. Para adicionar e concluir tarefas nas suas listas do Microsoft To Do, configure a conexão uma vez neste navegador.

1. Abra o Checklist e copie o URI mostrado em **Configurar conexão**. Com `npm start`, o padrão é `http://localhost:4200/microsoft-auth`.
2. Em **Registros de aplicativo** no Microsoft Entra, registre o Checklist. Para usar uma conta pessoal, escolha um tipo de conta que inclua contas pessoais Microsoft. Em **Autenticação**, adicione o URI copiado à plataforma **Aplicativo de página única (SPA)**. [Registro de SPA no Microsoft Entra](https://learn.microsoft.com/entra/identity-platform/scenario-spa-app-registration)
3. Em **Permissões de API**, adicione a permissão **delegada** `Tasks.ReadWrite` do Microsoft Graph. A configuração no Checklist usa apenas o ID público do aplicativo. [Permissão para criar tarefas](https://learn.microsoft.com/graph/api/todotasklist-post-tasks)
4. Cole a **ID do aplicativo (cliente)** no painel e escolha **Salvar configuração**. Depois, clique em **Conectar conta Microsoft**, selecione a conta usada no To Do e conceda acesso na janela da Microsoft.

Escolha uma lista existente no seletor. Use **Adicionar** para criar uma tarefa e o círculo ao lado do título para concluí-la. **Atualizar** carrega as alterações feitas no Microsoft To Do. As tarefas ficam na Microsoft e os checks ficam no `localStorage` do navegador.

Se hospedar o app, configure o host para servir a página Angular em `/microsoft-auth` e registre o URI HTTPS correspondente no Microsoft Entra. A rota de retorno precisa funcionar sem o cabeçalho `Cross-Origin-Opener-Policy`. [Rota de retorno do MSAL Browser](https://learn.microsoft.com/entra/msal/javascript/browser/redirect-bridge)

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
