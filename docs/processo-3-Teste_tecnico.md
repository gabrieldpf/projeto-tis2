# 3.3.3 Processo 3 – Teste técnico na plataforma

### Descrição do Processo

A empresa publica um teste técnico para validar o *fit* do(a) profissional com a vaga.  
A plataforma (serviços automatizados) gerencia convites, execução cronometrada, correção automática (casos de teste, múltipla escolha, linters/qualidade) e revisão humana opcional.  

Ao final, a empresa decide (aprovado/reprovado/novo teste) e o resultado alimenta o ranqueamento/matching do **Processo 1**.

O processo se encerra em três caminhos possíveis:

- **teste_aprovado** → candidatura sinalizada como “Aprovado no teste X (score Y)”.  
- **teste_reprovado** → candidatura encerrada, com feedback e possível retentativa segundo regras.  
- **prazo_expirado/abandono** → convite ou execução expirados conforme timers.  

---

### Oportunidades de melhoria

- **Correção híbrida:** pesos ajustáveis entre correção automática e revisão humana.  
- **Antifraude:** proctoring, detecção de plágio e verificação de identidade.  
- **SLA e lembretes:** timers para resposta/entrega, com notificações automáticas.  
- **Métricas de qualidade:** cobertura de testes, complexidade, tempo de execução.  
- **Retentativa controlada:** cooldown e novo conjunto de questões.  

---

### Modelo do Processo

- **Lanes:** empresa, desenvolvedor  
- **Eventos:** inicio, mensagem_envio_recebimento (convite, submissão, notificação), tempo_prazo (timers), decisao_gateway (nota ≥ corte), fim_aprovado, fim_reprovado, fim_expirado, fim_cancelamento

<img width="1485" height="346" alt="image" src="https://github.com/user-attachments/assets/4f5dde2b-da85-4e18-b309-a3502f63bf59" />

---

### Wireframes

<img width="1916" height="906" alt="image" src="https://github.com/user-attachments/assets/e191b7b3-7270-4a68-a5d9-0e9177ef7e3c" />
<img width="1918" height="907" alt="image" src="https://github.com/user-attachments/assets/9d288552-f44d-4d63-8bc4-8b039ca2f125" />
<img width="1917" height="911" alt="image" src="https://github.com/user-attachments/assets/7371cc17-e461-4d02-8b9b-891ff63fa07d" />

---

### Etapas do Processo

### 1. Configurar/Publicar Teste (Empresa)

| Campo                | Tipo          | Restrições                | Valor default       |
|----------------------|---------------|----------------------------|---------------------|
| id_vaga              | number        | obrigatório                | —                   |
| stack_requerida       | multi_select  | mínimo 1                   | —                   |
| nivel_experiencia     | single_select | obrigatório                | —                   |
| regime_contratacao    | single_select | obrigatório                | —                   |
| disponibilidade_dev   | datetime      | validar agenda             | —                   |
| score_compatibilidade | number        | 0–100                      | calculado sistema   |
| lista_candidatos      | table         | ordenado desc. por score   | —                   |

**Comandos:**
- `publicar_teste` → etapa “Gerar Convites”  
- `cancelar` → fim_cancelamento  

---

### 2. Gerar Convites (Empresa – *service task*)

| Campo                | Tipo        | Restrições         | Valor default |
|----------------------|-------------|--------------------|----------------|
| candidatos_convidados| table       | gerado por matching| —              |
| mensagem_convite     | text_area   | opcional           | —              |
| prazo_resposta       | datetime    | obrigatório         | +48h           |
| tentativas_permitidas| number      | ≥ 1                 | 1              |

**Comandos:**
- `enviar_convite` → etapa “Aceitar Convite”  
- `expirar_convite (tempo_prazo)` → fim_expirado  
- `voltar` → “Configurar/Publicar Teste”  

---

### 3. Aceitar Convite (Desenvolvedor)

| Campo                | Tipo          | Restrições                   | Valor default |
|----------------------|---------------|-------------------------------|----------------|
| aceite_candidato     | single_select | aceito/recusado              | —              |
| data_aceite          | datetime      | setado no aceite             | —              |
| evidencias_identidade| file          | obrigatório se antifraude=on | —              |

**Comandos:**
- `aceitar_convite` → etapa “Executar Teste / Enviar Submissão”  
- `recusar_convite` → fim_cancelamento  

---

### 4. Executar Teste / Enviar Submissão (Desenvolvedor)

| Campo                | Tipo       | Restrições                                   | Valor default |
|----------------------|------------|----------------------------------------------|----------------|
| inicio_teste         | datetime   | setado ao iniciar                            | —              |
| arquivo_submissao    | file       | obrigatório se não houver *link_repo_submissao* | —           |
| link_repo_submissao  | link       | obrigatório se *tipo_teste=projeto*          | —              |
| comentario_dev       | text_area  | opcional                                     | —              |
| evidencias_proctoring| file       | obrigatório se antifraude=on                 | —              |

**Comandos:**
- `enviar_submissao` → etapa “Correção Automática & Antifraude”  
- `prazo_excedido (tempo_prazo)` → fim_expirado  

---

### 5. Correção Automática & Antifraude (Empresa – *service task*)

| Campo                 | Tipo     | Restrições             | Valor default |
|-----------------------|----------|------------------------|----------------|
| casos_teste           | table    | obrigatório p/ código  | —              |
| score_tests           | number   | 0–100                  | calculado      |
| score_qualidade_codigo| number   | 0–100                  | calculado      |
| plagio_score          | number   | 0–100                  | —              |
| penalidade_atraso     | number   | 0–100                  | 0              |

**Comandos:**
- `calcular_score` → gateway “nota ≥ corte?”  
- `reprovar_automatica` (se score < corte) → “Reprovação Automática”  
- `encaminhar_revisao` → etapa “Revisão Humana (Opcional)”  

---

### 6. Revisão Humana (Opcional) (Empresa)

| Campo                | Tipo       | Restrições               | Valor default |
|----------------------|------------|--------------------------|----------------|
| nota_revisao_humana  | number     | 0–100                    | —              |
| comentarios_revisor  | text_area  | min. 20 chars se reprovado| —             |
| anexos_revisor       | file       | opcional                 | —              |

**Comandos:**
- `aprovar_revisao` → etapa “Decisão Final”  
- `reprovar_revisao` → etapa “Decisão Final”  
- `solicitar_ajustes` → retorna para “Executar Teste / Enviar Submissão”  

---

### 7. Decisão Final (Empresa)

| Campo                 | Tipo          | Restrições                | Valor default |
|-----------------------|---------------|---------------------------|----------------|
| status_teste          | single_select | aprovado/reprovado/novo_teste | —          |
| nota_final            | number        | 0–100 (fórmula)           | calculado     |
| justificativa_decisao | text_area     | min. 20 chars se reprovado| —             |
| relatorio_resultado   | file          | opcional (PDF/ZIP)        | —             |

**Comandos:**
- `aprovar_candidato` → etapa “Divulgar Análise (Relatório)”  
- `reprovar_candidato` → “Reprovação Automática”  
- `solicitar_novo_teste` → retorna para “Configurar/Publicar Teste”  

---

### 8. Divulgar Análise (Relatório) (Empresa – *service task*)

| Campo        | Tipo       | Restrições     | Valor default       |
|--------------|-------------|----------------|---------------------|
| notificacao  | text_area   | leitura apenas | gerado pelo sistema |

**Comandos:**
- `notificar_dev_empresa` → fim_aprovado  
---

### Encerramento do Processo

- **fim_1:** teste_aprovado  
- **fim_2:** teste_reprovado  
- **fim_3:** prazo_expirado / abandono  
- **fim_4:** processo_cancelado  
