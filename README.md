# Meu Dia - To Do

O **Meu Dia - To Do** é um painel pessoal para acompanhar hábitos e tarefas em uma só tela. O projeto nasceu para complementar o Microsoft To Do com um checklist semanal de faculdade, musculação, estudos e inglês.

[**Abrir o app**](https://checklist-new.vercel.app/)

## O que dá para fazer

- **Acompanhar hábitos** de domingo a sábado. Cada clique alterna a caixa entre vazio, ✓ e ✕. Use a lixeira para limpar a semana daquele hábito.
- **Gerenciar tarefas** nas suas listas do Microsoft To Do. Você pode listar, adicionar e concluir tarefas, definir um prazo ao criar e ordenar pelos prazos mais próximos ou mais distantes.
- **Consultar a data e o intervalo da semana** no topo e alternar entre os temas claro e escuro.

## Onde os dados ficam

Os checks, o tema e o ID público do aplicativo Microsoft ficam no `localStorage`, o armazenamento do site dentro do navegador. Eles continuam ali ao recarregar a página, ficam separados por navegador e perfil e podem ser apagados ao limpar os dados do site. Os checks funcionam sem conta Microsoft.

O projeto funciona no navegador, sem servidor de aplicação ou banco próprio. As tarefas ficam na sua conta Microsoft. Ao conectar, você faz login na janela da Microsoft e autoriza o acesso às tarefas pelo Microsoft Graph. O site usa o token emitido pela Microsoft, que a biblioteca MSAL mantém no `sessionStorage` da aba. [Como a MSAL armazena a sessão](https://learn.microsoft.com/en-us/entra/msal/javascript/browser/caching)

## Como conectar o Microsoft To Do

1. Abra **Configurar conexão** no app e copie a URL de redirecionamento exibida.
2. No **Microsoft Entra**, abra **Registros de aplicativo → Novo registro**. Escolha a opção que inclui contas pessoais Microsoft e cole a URL na plataforma **Aplicativo de página única (SPA)**. Se já tiver um registro, cadastre essa URL em **Autenticação**. [Abrir o Microsoft Entra](https://entra.microsoft.com/) · [Guia de registro da Microsoft](https://learn.microsoft.com/pt-br/graph/auth-register-app-v2)
3. Em **Permissões de API → Microsoft Graph → Permissões delegadas**, adicione `Tasks.ReadWrite`. Em **Visão geral**, copie a **ID do aplicativo (cliente)**.
4. No app, cole essa ID em **Configurar conexão** e clique em **Salvar configuração**. Depois clique em **Conectar conta Microsoft** e entre com a conta que você usa no To Do.
