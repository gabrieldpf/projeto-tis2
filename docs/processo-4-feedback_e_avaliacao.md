# 3.3.2 Processo 4 – FEEDBACK E AVALIAÇÃO PÓS-PROJETO

## Descrição do Processo
Após o término de um projeto ou contrato, a plataforma permite que empresas e desenvolvedores avaliem mutuamente a experiência, fornecendo feedback estruturado sobre desempenho técnico, pontualidade, comunicação e colaboração. Esses dados são usados para construir um sistema de reputação que influencia futuros matches.
Como funciona: Ao concluir o projeto, ambos recebem uma notificação para preencher um formulário de avaliação na plataforma. O formulário inclui perguntas quantitativas (ex.: notas de 1 a 5 para qualidade do código ou cumprimento de prazos) e qualitativas (ex.: comentários como "ótima comunicação, mas atraso em 2 entregas"). As respostas são anônimas para o outro lado, mas agregadas em um perfil público de reputação (ex.: "4.8/5 baseado em 10 avaliações"). O sistema usa esses dados para ajustar o algoritmo de matching, priorizando profissionais ou empresas com alta pontuação, e gera relatórios analíticos (ex.: médias de feedback por skill) para os usuários. Um mecanismo de mediação está disponível se houver disputas, permitindo submissão de evidências (como capturas de tela de entregas).
Por que é essencial: O feedback cria um ecossistema justo e confiável, incentivando a excelência profissional e penalizando comportamentos inconsistentes. Isso melhora a qualidade dos matches futuros, aumenta a confiança entre as partes e reduz riscos em contratações subsequentes, fortalecendo a credibilidade da plataforma a longo prazo.

## Oportunidades de melhoria

- Permitir que empresa e dev definam pesos diferentes para critérios (ex.: comunicação pode valer mais para um projeto ágil).  
- Não apenas no fim do contrato, mas em milestones (entregas parciais), para capturar a evolução do desempenho.  
- Permitir que comentários sejam públicos, privados (só para o avaliado) ou apenas internos para a plataforma.


## Modelo do Processo
**Lanes**: Empresa, desenvolvedor, plataforma DevMatch (sistema)  
**Eventos**: inicio, Mensagem (notificação de avaliação), mensagem_envio_recebimento,Decisão de disputa (gateway), Fim mediação concluída


<img width="1565" height="609" alt="image" src="https://github.com/user-attachments/assets/07d44e68-35d2-4487-bd05-fac7fa829d3a" />



## Etapas do Processo

### 1. Notificação de Avaliação (Plataforma)

| **Campo**            | **Tipo**       | **Restrições**            | **Valor default** |
|-----------------------|----------------|---------------------------|-------------------|
| id_projeto            | number         | obrigatório               | —                 |
| data_avaliacao        | datetime       | automatico                | —                 |

**Comandos**
- notificar_empresa → envia solicitação de feedback
- notificar_dev → envia solicitação de feedback

---

### 2. Preencher Avaliação (Empresa/Desenvolvedor)

| **Campo**              | **Tipo**       | **Restrições**            | **Valor default** |
|-------------------------|----------------|---------------------------|-------------------|
| qualidade_tecnica       | number         | 1-5                       | —                           |
| cumprimento_prazos      | number         | 1-5                       | —                           |
| comunicacao             | number         | 1-5                       | —                           |
| colaboracao             | number         | 1-5                       | —                           |
| comentario              | text_area      | opcional                  | min. 20 chars se preenchido |
| evidencias              | file           | opcional                  | -                           |
<img width="1890" height="911" alt="image" src="https://github.com/user-attachments/assets/c7b672b7-828d-4c04-a72d-05b353703eea" />



---

### 3. Consolidação de Avaliações (Plataforma)

| **Campo**            | **Tipo**       | **Restrições**            | **Valor default** |
|-----------------------|----------------|---------------------------|-------------------|
| score_medio           | number         | 0–5                       | calculado         |
| historico_avaliacoes  | table          | agregado                  | —                 |

**Comandos**
- registrar_feedback → calcula reputação
- atualizar_perfil → exibe score público

<img width="1899" height="911" alt="image" src="https://github.com/user-attachments/assets/d55075eb-a99d-46dd-81fa-313add52bb28" />




---

### 4. Mediação (Opcional)

| **Campo**            | **Tipo**       | **Restrições**            | **Valor default** |
|-----------------------|----------------|---------------------------|-------------------|
| justificativa_disputa | text_area      | obrigatório se aberto     | -                |
| evidencias            | table          | obrigatório se aberto     | -                |
| decisao_mediacao      | single_select: mantida/ajustada   | file          | -    |

**Comandos**
- abrir_disputa → inicia análise
- enviar_evidencias → registra anexos
- registrar_decisao → finaliza mediação

<img width="1914" height="908" alt="image" src="https://github.com/user-attachments/assets/e663ad42-2fd1-4a39-90fc-930bdf9d71e8" />

---

### 5. Relatórios Analíticos (Plataforma)

| **Campo**             | **Tipo**       | **Restrições**            | **Valor default** |
|-----------------------|----------------|---------------------------|-------------------|
| relatorio_feedback    | table          | consolidado               | -                 |
| evolucao_reputacao    | number + datetime  | histórico             | —                 |

**Comandos**
- gerar_relatorio → disponibiliza para usuários
- exportar_pdf → download de histórico

<img width="1898" height="912" alt="image" src="https://github.com/user-attachments/assets/c0517b59-39e1-4a24-8104-608bc88b81e5" />




---
