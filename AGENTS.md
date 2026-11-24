# Checklist

## Como trabalhar neste projeto

1. **Entender o pedido.** Inspecione o projeto e os dados que a mudança pode afetar. Pedidos de auditoria, ideias ou comparação de alternativas autorizam análise e documentação solicitada.
2. **Definir a arquitetura e o comportamento.** Discuta com o usuário o fluxo, os dados, as telas e o escopo da entrega, na medida em que forem relevantes. Diferencie decisões confirmadas de propostas e resolva as dúvidas que mudam o funcionamento do app.
3. **Pedir autorização explícita para implementar.** Apresente o escopo acordado e aguarde o usuário autorizar a etapa de código. Antes dessa autorização, faça apenas leitura, análise e edição de documentação expressamente pedida. Alterar código, templates, estilos, testes, configurações ou dependências, rodar instalações e gerar protótipos no projeto fazem parte da implementação.
4. **Implementar e verificar o escopo autorizado.** Se aparecer uma decisão que muda a arquitetura ou amplia o escopo, volte à discussão antes de implementar essa parte. Verifique os fluxos afetados e preserve os dados existentes.

## Decisões confirmadas

- O app é local por escolha. Os checks ficam em `localStorage`, na origem e no perfil do navegador usados para abrir o app.
- O Checklist abre sem login próprio, banco de dados ou backend. O painel de tarefas usa uma conexão opcional com a conta Microsoft para exibir, adicionar e concluir tarefas nas listas existentes do Microsoft To Do. A Microsoft armazena essas tarefas. Os checks funcionam independentemente da conexão.
- Tarefas e checks semanais devem conviver no mesmo app. Preserve as marcações existentes e a interação dos checks. Se o formato salvo precisar mudar, mantenha a leitura dos dados anteriores ou combine uma migração antes de implementar.

## Auditoria estática de 24/11/2026

| Área | Estado encontrado |
| --- | --- |
| Stack | SPA Angular 21.2 com TypeScript, signals, RxJS, Tailwind 4 via PostCSS e ícones Lucide. O `package.json` declara npm 11.6.2 e scripts para servir, compilar e testar com Vitest. |
| Navegação | `/` abre `Home`, com relógio, agenda e checks. `/profile` é uma rota provisória com texto gerado pelo Angular. |
| Agenda e tarefas | `src/app/components/home/home.html` mostra `Estudos` e `Faculdade` como linhas fixas, com aparência clicável e sem ação associada. Ainda não há criação, edição ou persistência de tarefas. |
| Checks semanais | `src/app/components/checkbox/checkbox.ts` mantém sete posições por hábito. Cada clique alterna entre vazio (`0`), marcado (`1`) e X (`2`). A lixeira limpa as sete posições da linha. O código atual não associa datas às posições nem faz virada automática da semana. |
| Contrato dos dados | Cada linha guarda um array JSON de objetos `{ id, state }` diretamente no `localStorage`. As chaves existentes são `CodeXml`, `Bitcoin`, `University`, `SquareActivity`, `Languages` e `Book`. A linha com ícone de halter usa `SquareActivity`. |
| Robustez da persistência | O componente chama `JSON.parse` e usa o resultado sem validar o formato. Também não trata falhas de leitura ou gravação. Dados inválidos ou armazenamento indisponível podem interromper o fluxo. |
| Acessibilidade | As células são `span` com evento de clique e sem acesso por teclado. O botão de limpar a linha tem apenas um ícone, sem nome acessível. A página raiz declara `lang="en"` apesar do conteúdo em português. |
| Template e ciclo de vida | `home.html` inclui uma estrutura de documento HTML e uma referência ao Tailwind por CDN, embora o Tailwind já faça parte do build. `Home` inicia uma assinatura de `interval` para o relógio sem cancelá-la ao sair da rota. |
| Testes | Os testes existentes são principalmente de criação de componentes. `app.spec.ts` ainda espera o título `Hello, checklist`, ausente no template atual, e não há cobertura específica do ciclo de estados ou da persistência dos checks. Build e testes não foram executados nesta auditoria estática. |

Os achados da auditoria servem para decidir o escopo com o usuário. Não autorizam correções por conta própria.

## Primeira versão da integração

- O painel ocupa o espaço da agenda na página inicial. O usuário escolhe uma lista existente para ver, adicionar ou concluir tarefas. A comunicação com o Microsoft Graph ocorre no navegador, com permissão delegada `Tasks.ReadWrite`.
