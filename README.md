# Meu Dia - To Do

Acompanhe seus hábitos da semana e use suas listas do Microsoft To Do na mesma tela.

[**Abrir o app**](https://checklist-new.vercel.app/)

## Como usar

- **Checks da semana** — clique na caixa do dia para alternar entre vazio, ✓ e ✕. A lixeira limpa as marcações daquele hábito. Os checks ficam salvos no navegador e funcionam sem conta Microsoft.
- **Tarefas** — selecione uma lista, escreva o título e clique em **Adicionar**. A **Data de conclusão** é opcional. Para concluir uma tarefa, clique no círculo ao lado do título. Use **Atualizar** para ver mudanças feitas no Microsoft To Do.
- **Tema** — use **Modo escuro** no topo para alternar entre claro e escuro.

## Como conectar o Microsoft To Do

Se já tiver a **ID do aplicativo (cliente)** com a URL de redirecionamento deste app cadastrada, vá direto ao passo 4.

1. No app, abra **Configurar conexão** e copie a URL de redirecionamento exibida.
2. No [Microsoft Entra](https://entra.microsoft.com/), vá a **Registros de aplicativo → Novo registro**. Dê um nome ao registro, escolha a opção que inclui **contas de qualquer diretório e contas pessoais Microsoft** e cole a URL na plataforma **Aplicativo de página única (SPA)**. [Guia de registro da Microsoft](https://learn.microsoft.com/pt-br/graph/auth-register-app-v2)
3. Em **Permissões de API → Microsoft Graph → Permissões delegadas**, adicione `Tasks.ReadWrite`. Em **Visão geral**, copie a **ID do aplicativo (cliente)**.
4. No app, cole a ID em **Configurar conexão** e clique em **Salvar configuração**. Depois clique em **Conectar conta Microsoft**, entre com a conta que usa no To Do e aceite a permissão.
