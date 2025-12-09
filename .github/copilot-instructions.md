# Instruções rápidas para agentes de IA — DevMatch

Objetivo curto
- Guiar a criação e manutenção de telas e integrações de Feedback (frontend React + MUI) compatíveis com o backend Spring Boot adicionado.

Visão geral da arquitetura (o "big picture")
- Frontend: React + TypeScript + Vite. Material UI (MUI) para componentes visuais. Estrutura de pastas principal: `src/front/src/components` (componentes), `src/front/src/service` (chamada a APIs), `src/front/src/types` (tipos TS).
- Backend: Spring Boot (Maven) em `src/back` expõe endpoints em `/api`. O frontend usa `http://localhost:8080/api` por convenção em `service/*`.

Padrões importantes do frontend (siga estes)
- Lazy-load de componentes grandes: use `const X = React.lazy(() => import('./components/...'))` e renderize dentro de `<Suspense>` (ver `CompanyDashboard.tsx`).
- Tabs + painéis: use o componente `TabPanel` em `components/dashboards/components/TabPanel.tsx` (padrão para controle de visibilidade por índice).
- Services: crie um arquivo em `src/front/src/service` para encapsular chamadas axios. Importe e use nas telas. Ex.: `jobService.ts` e novo `feedbackService.ts`.
- Tipos: defina shapes em `src/front/src/types/*.ts`. Para feedback criamos `types/feedback.ts` com `FeedbackSummary` e `Disputa`.
- Estilo/UI: seguir MUI e o `theme` existente (`src/front/src/theme/theme.ts`). Evite estilos inline extensos — use `sx` para pequenas regras.

Onde adicionar novas telas de Feedback
- Local sugerido: `src/front/src/components/dashboards/components/`.
- Naming: `ProjectsFinalizadosPanel.tsx`, `FeedbacksReceivedPanel.tsx`, `AvaliacaoPanel.tsx`, `ContestacoesPanel.tsx` (já adicionados como placeholders).
- Integração na dashboard: registre via `React.lazy()` no `CompanyDashboard.tsx` e exponha as abas em um `Card` com `Tabs` — panéis controlados por `TabPanel`.

Contratos / Endpoints esperados (exemplos já preparados)
- Notificações: POST /api/feedback/notificar/empresa  { idProjeto }
- Registrar feedback: POST /api/feedback  { qualidade_tecnica, cumprimento_prazos, comunicacao, colaboracao, comentario?, evidencias? }
- Disputa: POST /api/feedback/disputa  { idFeedback, justificativa_disputa }
- Enviar evidências: POST /api/feedback/disputa/{disputaId}/evidencias (multipart/form-data)
- Buscar feedbacks do usuário: GET /api/feedback/usuario/{usuarioId}

Exemplo prático (front):
- Crie `feedbackService.ts` (já adicionado) com funções: `notificarEmpresa`, `notificarDev`, `registrarFeedback`, `abrirDisputa`, `enviarEvidencias`, `getFeedbacksByUsuario`.
- Dentro da UI, chame `getFeedbacksByUsuario(user.id)` no `useEffect` para popular listas.

Conveniências e convenções do repositório
- Padrão de imports relativos: `../../service/xxx` a partir de `components`.
- Componentes maiores são lazy-loaded e colocados em `components/.../components`.
- Use `TabPanel` para conteúdo de abas; evite toggles condicionais fora desse padrão.

Comandos úteis (Windows PowerShell)
- Frontend (dev):
```powershell
cd src/front; npm install; npm run dev
```
- Frontend (build):
```powershell
cd src/front; npm run build
```
- Backend (dev, Windows):
```powershell
cd src/back; .\mvnw.cmd spring-boot:run
```
ou (Unix): `./mvnw spring-boot:run`

Notas sobre testes/lint
- Projeto tem `npm run lint` (frontend) — use para checar estilo. Não há suíte de testes automatizados adicionada (criar testes é bem-vindo).

Pontos de atenção para agentes
- Não modifique o `theme` global sem revisar `src/front/src/theme/theme.ts`.
- Mantenha os componentes de diálogo como lazy imports (padrão já existente para `JobFormDialog` e `JobEditDialog`).
- Ao adicionar novos endpoints, atualize `feedbackService.ts` e `src/front/src/types/feedback.ts` com as propriedades reais retornadas pelo backend.

Arquivos relevantes (referências rápidas)
- `src/front/src/components/dashboards/CompanyDashboard.tsx` — ponto de entrada das abas da empresa.
- `src/front/src/components/dashboards/components/TabPanel.tsx` — utilitário de abas.
- `src/front/src/service/feedbackService.ts` — serviço de exemplo para integrar o backend.
- `src/front/src/types/feedback.ts` — tipos TS de feedback.
- `src/back` — backend Spring Boot (Maven, `pom.xml`).

Solicitação ao desenvolvedor humano
- Revise os placeholders em `components/dashboards/components/*Panel.tsx` e substitua por chamadas reais ao `feedbackService` quando os endpoints estiverem prontos.

Se precisar de ajustes (rotas, campos ou exemplos), peça para eu atualizar as instruções ou criar uma tela funcional completa com formulários e uploads.
