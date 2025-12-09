
# 3.3.5 Processo 5 – Execução e Acompanhamento do Projeto

## Descrição do Processo

Após o contrato ser formalizado no **Processo 2**, o projeto entra em fase de **execução operacional**.  
Nesse momento, a plataforma **DevMatch** gerencia a entrega das atividades, prazos e pagamentos parciais (por hora, sprint ou marco de entrega).  
O sistema atua como **mediador automatizado**, garantindo rastreabilidade de entregas e controle de pagamentos.

**Como funciona:**  
- A empresa define **etapas (milestones)** com prazos, valores e critérios de aceitação.  
- O desenvolvedor envia **entregas** (com anexos, links e registros de tempo).  
- A plataforma gera alertas automáticos de **prazo, aprovação ou pendências**.  
- Após a validação da entrega pela empresa, o **pagamento é liberado** de forma automatizada (via integração com o módulo financeiro).  
- O sistema coleta dados de desempenho para o **Processo 4 (Feedback e Avaliação)**.

---

<img width="1330" height="415" alt="image" src="https://github.com/user-attachments/assets/fcb32ab4-3222-47fa-89e9-d0061d99cb92" />


---

## Detalhamento das Atividades

### 1. Planejar Entregas e Prazos (Empresa)

| **Campo**            | **Tipo**       | **Restrições**          | **Valor default** |
|-----------------------|----------------|--------------------------|-------------------|
| id_projeto            | number         | obrigatório              | —                 |
| milestones            | table          | mínimo 1 entrega         | —                 |
| prazo_entrega         | datetime       | obrigatório              | —                 |
| valor_milestone       | number         | > 0                      | —                 |

**Comandos**  
- criar_marcos → salva no sistema  
- notificar_dev → inicia execução  

---

### 2. Submeter Entrega (Desenvolvedor)

| **Campo**              | **Tipo**       | **Restrições**                | **Valor default** |
|-------------------------|----------------|--------------------------------|-------------------|
| descricao_entrega       | text_area      | obrigatório (mín. 50 chars)    | —                 |
| arquivos_entrega        | file/link      | obrigatório                    | —                 |
| data_envio              | datetime       | automático                     | —                 |
| horas_trabalhadas       | number         | opcional                       | —                 |

**Comandos**  
- enviar_entrega → etapa “Revisar Entrega”  
- cancelar → retorna para edição  

---

### 3. Revisar Entrega (Empresa)

| **Campo**           | **Tipo**        | **Restrições**           | **Valor default** |
|----------------------|-----------------|--------------------------|-------------------|
| status_entrega       | single_select   | aprovada/rejeitada       | —                 |
| comentario_revisao   | text_area       | min. 20 chars se rejeitada| —                 |
| data_revisao         | datetime        | automático               | —                 |

**Comandos**  
- aprovar_entrega → etapa “Liberar Pagamento”  
- rejeitar_entrega → retorna para “Submeter Entrega”  

---

## Encerramento do Processo

- **fim_1:** projeto_concluido_com_sucesso  
- **fim_2:** entrega_rejeitada_sem_reenvio  
- **fim_3:** pagamento_pendente (processo suspenso)

<img width="1920" height="1080" alt="BUTTON" src="https://github.com/user-attachments/assets/3f9a8daa-bb6e-4da8-a478-8f403a766836" />

  
