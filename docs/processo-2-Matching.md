# 3.3.2 Processo 2 – MATCHING

## Descrição do Processo

A plataforma utiliza um algoritmo de inteligência artificial avançado para conectar desenvolvedores a empresas, alinhando de forma precisa as habilidades técnicas dos profissionais (como domínio de linguagens específicas, frameworks, nível de experiência sênior ou júnior, e preferências de trabalho como remoto, híbrido ou presencial) com as demandas específicas das empresas (tecnologias exigidas, prazos de entrega, nível de senioridade, tipo de contrato — CLT, PJ ou freelance).

O sistema prioriza a compatibilidade holística, considerando não apenas skills técnicas, mas também soft skills, disponibilidade e, em versões mais avançadas, o histórico de feedbacks e desempenho (conforme Processo 4).

**Como funciona:**
Após os perfis serem preenchidos com dados detalhados (ex.: um desenvolvedor insere que domina Python e Django, com 3 anos de experiência, preferindo trabalho remoto), o algoritmo realiza uma análise multicritério. Ele compara essas informações com as vagas publicadas (ex.: uma empresa busca um dev Python/Django com experiência intermediária para um projeto remoto de 2 meses) e gera uma pontuação de compatibilidade.

Os *matches* mais altos são sugeridos em tempo real, com uma interface que destaca o percentual de compatibilidade e permite filtrar por critérios como localização, modelo contratual ou orçamento. O sistema também aprende com interações anteriores, ajustando sugestões com base em aceitações, rejeições e ajustes realizados pelas empresas ao longo do tempo.

**Por que é essencial:**
Este processo é o núcleo operacional do DevMatch, reduzindo drasticamente o tempo de triagem manual — que pode levar semanas em processos tradicionais — para horas ou minutos.
A automação assegura conexões mais relevantes, aumenta a taxa de sucesso nas contratações e permite que empresas e desenvolvedores foquem em negociações e execução do projeto, em vez de buscas preliminares.

O processo se encerra em dois caminhos possíveis:

* **Contrato formalizado** (candidato contratado);
* **Candidatura rejeitada** (candidato não contratado).

---

## Oportunidades de melhoria

* Reduzir tempo de triagem manual por meio de matching automático baseado em stack, senioridade e disponibilidade.
* Aumentar a assertividade das indicações com pontuação (*score*) e ranqueamento dinâmico.
* Garantir transparência com notificações de status para devs e registro formal de decisão para empresas.
* Centralizar formalização contratual (CLT/PJ/freelancer) com dados e documentos versionados.
* Estabelecer prazos de decisão (*evento_tempo*) para evitar gargalos.

---

## Modelo do Processo

**Lanes:** empresa_contratante, plataforma_dev_match (sistema), desenvolvedor  
**Eventos:** inicio, mensagem_envio_recebimento, tempo_prazo, fim_contrato_formalizado, fim_candidatura_rejeitada

![Modelo BPMN do Processo 2 – Matching](images/diagram%20(11).svg)

---

## Detalhamento das Atividades

### 1. Cadastrar Vaga/Projeto (Empresa)

| **Campo**          | **Tipo**      | **Restrições**            | **Valor default** |
| ------------------ | ------------- | ------------------------- | ----------------- |
| titulo_vaga        | text_box      | obrigatório               | —                 |
| stack_tecnologica  | multi_select  | mínimo 1                  | —                 |
| nivel_experiencia  | single_select | junior/pleno/senior       | pleno             |
| regime_contratacao | single_select | clt/pj/freelancer         | —                 |
| modelo_remuneracao | single_select | hora/sprint/mensal        | —                 |
| valor_referencia   | number        | > 0                       | —                 |
| prazo_estimado     | date          | obrigatório               | —                 |
| descricao          | text_area     | 10–2000 chars             | —                 |
| local_modalidade   | single_select | remoto/hibrido/presencial | remoto            |
| anexo_escopo       | file          | —                         | —                 |

**Comandos**

* publicar_vaga → registra requisitos (sistema)
* entrar → fim do processo 1
* cadastrar → início do processo de cadastro

---

### 2. Matching Automático (Plataforma DevMatch)

| **Campo**             | **Tipo**      | **Restrições**           | **Valor default** |
| --------------------- | ------------- | ------------------------ | ----------------- |
| id_vaga               | number        | obrigatório              | —                 |
| stack_requerida       | multi_select  | mínimo 1                 | —                 |
| nivel_experiencia     | single_select | obrigatório              | —                 |
| regime_contratacao    | single_select | obrigatório              | —                 |
| disponibilidade_dev   | datetime      | validar agenda           | —                 |
| score_compatibilidade | number        | 0–100                    | calculado sistema |
| lista_candidatos      | table         | ordenado desc. por score | —                 |

**Comandos**

* notificar_devs → envia mensagem automática aos candidatos
* notificar_empresa → informa empresa sobre candidatos sugeridos
* registrar_decisao → encaminha para etapa **"Avaliar candidatos recomendados"**

---

### 3. Avaliar Candidatos Recomendados (Empresa)

| **Campo**             | **Tipo**      | **Restrições**                         | **Valor default** |
| --------------------- | ------------- | -------------------------------------- | ----------------- |
| lista_candidatos      | table         | gerada pelo sistema                    | —                 |
| justificativa_decisao | text_area     | opcional (mín. 20 chars se preenchido) | —                 |
| status_candidatura    | single_select | aprovado/reprovado                     | —                 |
| prazo_decisao         | datetime      | evento de tempo configurado            | —                 |

**Comandos**

* aprovar_candidato → envia para **Formalização Contratual**
* reprovar_candidato → notifica dev e registra histórico
* solicitar_ajustes → retorna para ajuste no matching

---

### 4. Formalização Contratual (Empresa + Plataforma + Dev)

| **Campo**           | **Tipo**      | **Restrições**                   | **Valor default** |
| ------------------- | ------------- | -------------------------------- | ----------------- |
| tipo_contrato       | single_select | clt/pj/freelancer                | —                 |
| dados_cadastrais    | table         | obrigatório (empresa e dev)      | —                 |
| documentos_pessoais | file          | obrigatório (upload)             | —                 |
| versao_contrato     | number        | incremental                      | 1                 |
| data_assinatura     | date          | obrigatório                      | —                 |
| link_assinatura     | link          | obrigatório (assinatura digital) | —                 |

**Comandos**

* assinar_contrato → finaliza processo com sucesso
* rejeitar_contrato → fim candidatura rejeitada
* solicitar_revisao → retorna para ajustes

---

## Encerramento do Processo

* **fim_1:** contrato_formalizado
* **fim_2:** candidatura_rejeitada
