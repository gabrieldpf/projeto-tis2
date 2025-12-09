# 🎯 DevMatch - Plataforma Inteligente de Conexão entre Desenvolvedores e Empresas

---

## 📌 O que é o DevMatch?

O **DevMatch** é uma plataforma web que conecta **desenvolvedores** com **empresas de tecnologia** através de um **algoritmo inteligente de compatibilidade**.

Diferente de plataformas tradicionais de emprego, o DevMatch analisa automaticamente o perfil de cada desenvolvedor e calcula um **percentual de compatibilidade** com cada vaga disponível, mostrando apenas as oportunidades que realmente fazem sentido.

---

## 🎯 Problema que Resolvemos

### Para Desenvolvedores:
- ❌ **Antes**: Perder tempo candidatando-se a vagas incompatíveis
- ❌ **Antes**: Não saber se o perfil atende aos requisitos
- ❌ **Antes**: Receber muitas rejeições por falta de fit

- ✅ **Agora**: Ver apenas vagas compatíveis com suas habilidades
- ✅ **Agora**: Saber o percentual exato de match antes de se candidatar
- ✅ **Agora**: Focar nas oportunidades certas

### Para Empresas:
- ❌ **Antes**: Receber centenas de candidaturas desqualificadas
- ❌ **Antes**: Perder tempo triando perfis incompatíveis
- ❌ **Antes**: Dificuldade em encontrar o candidato ideal

- ✅ **Agora**: Receber apenas candidaturas de perfis compatíveis
- ✅ **Agora**: Ver automaticamente o percentual de fit de cada candidato
- ✅ **Agora**: Agilizar o processo de seleção

---

## 🔄 Como Funciona o Sistema?

### 1️⃣ **Cadastro e Perfil**

#### **Desenvolvedor:**
- Cria conta informando nome, email e senha
- Completa seu perfil profissional com:
  - **Título profissional** (ex: "Desenvolvedor Full Stack Sênior")
  - **Habilidades técnicas** (React, Node.js, Python, etc.)
  - **Preferências de trabalho** (remoto, híbrido, presencial)
  - **Expectativa salarial**
  - **Localização**

#### **Empresa:**
- Cria conta corporativa
- Completa perfil da empresa
- Publica vagas detalhando:
  - **Título da vaga**
  - **Descrição das atividades**
  - **Habilidades requeridas**
  - **Nível de experiência** (Júnior, Pleno, Sênior)
  - **Valor oferecido**
  - **Modalidade de trabalho**
  - **Localização**

---

### 2️⃣ **Algoritmo de Matching (A Mágica!)**

Quando um desenvolvedor acessa o sistema, o **algoritmo inteligente** analisa:

#### **Fatores Analisados:**

| Fator | Peso | O que analisa |
|-------|------|---------------|
| 🎯 **Habilidades Técnicas** | 25% | Quantas das skills requeridas o dev possui? |
| 💰 **Faixa Salarial** | 25% | A expectativa do dev está alinhada com a oferta? |
| 📍 **Localização/Modalidade** | 20% | Local e modalidade são compatíveis? |
| 📋 **Tipo de Contrato** | 15% | CLT, PJ, etc - está alinhado? |
| ⭐ **Preferências** | 15% | A vaga está nas preferências do dev? |

#### **Cálculo da Compatibilidade:**

```
Compatibilidade = (Pontuação Total / Peso Total) × 100
```

**Exemplo Real:**
- Dev tem 4 de 4 skills → +25 pontos
- Salário alinhado → +20 pontos
- Modalidade híbrida (compatível) → +14 pontos
- Tipo de contrato alinhado → +12 pontos
- Vaga nas preferências → +10 pontos

**Total: 81 pontos de 100 = 81% de compatibilidade! 🎉**

---

### 3️⃣ **Exibição de Vagas Compatíveis**

O desenvolvedor vê em seu dashboard:

```
┌─────────────────────────────────────────────┐
│  Desenvolvedor Full Stack Sênior            │
│  TechCorp Inovação                          │
│                                             │
│  🎯 Compatibilidade: 87%                    │
│  💰 R$ 12.000,00                            │
│  📍 Híbrido - São Paulo, SP                 │
│                                             │
│  ✅ Você tem 4 de 4 habilidades requeridas  │
│  ✅ Modalidade híbrida oferece flexibilidade│
│                                             │
│  Skills: React, Node.js, TypeScript, SQL    │
│                                             │
│  [Candidatar-se] [Ver Detalhes]            │
└─────────────────────────────────────────────┘
```

**Regra do Sistema:** Apenas vagas com **60% ou mais** de compatibilidade aparecem!

---

### 4️⃣ **Candidatura**

1. Desenvolvedor clica em **"Candidatar-se"**
2. Sistema envia candidatura automaticamente para a empresa
3. Empresa vê a candidatura com o **percentual de compatibilidade**
4. Status da candidatura é rastreado:
   - 🟡 **Pendente**: Aguardando análise
   - 🔵 **Em análise**: Empresa está avaliando
   - 🟢 **Aceito**: Match confirmado!
   - 🔴 **Rejeitado**: Não houve fit desta vez

---

## 📊 Demonstração Prática

### **Cenário: Vaga "Desenvolvedor Full Stack Sênior"**

**Requisitos da vaga:**
- React
- Node.js
- TypeScript
- PostgreSQL

---

### **Exemplos de Matching:**

#### ✅ **Maria Silva - 87% de Compatibilidade (ALTA)**

**Perfil:**
- Tem TODAS as 4 skills requeridas
- 7 anos de experiência
- Localização: São Paulo, SP (mesma da vaga)
- Modalidade: Híbrido ✓
- Expectativa salarial: R$ 10-14k (alinhada!)

**Resultado:** Aparece como **primeira opção** no dashboard!

---

#### ⚠️ **Pedro Costa - 68% de Compatibilidade (MÉDIA)**

**Perfil:**
- Tem 3 de 4 skills (falta Node.js)
- 4 anos de experiência
- Localização: São Paulo, SP
- Modalidade: Híbrido ✓
- Expectativa salarial: R$ 9-12k

**Resultado:** Aparece na lista, mas com compatibilidade menor.

---

#### ❌ **Julia Mendes - 42% de Compatibilidade (BAIXA)**

**Perfil:**
- Especialista em Python/Django (stack diferente!)
- Tem 0 de 4 skills requeridas
- Experiência em backend apenas
- Localização: Belo Horizonte, MG

**Resultado:** **NÃO APARECE** na lista (abaixo de 60%).

---

## 🎨 Interface do Sistema

### **Dashboard do Desenvolvedor**

```
╔════════════════════════════════════════════════╗
║  Painel do Desenvolvedor                       ║
╠════════════════════════════════════════════════╣
║                                                ║
║  📊 Estatísticas                               ║
║  ├─ Candidaturas Ativas: 3                    ║
║  ├─ Matches Aprovados: 1                      ║
║  ├─ Vagas Compatíveis: 5                      ║
║  └─ Em Análise: 2                             ║
║                                                ║
║  ──────────────────────────────────────────── ║
║                                                ║
║  📋 Abas:                                      ║
║  [Meus Matches] [Vagas Compatíveis] [Minhas   ║
║                                    Candidaturas]║
║                                                ║
║  🎯 Vagas Compatíveis                          ║
║  ┌──────────────────────────────────────────┐ ║
║  │ Desenvolvedor Full Stack - 87%           │ ║
║  │ TechCorp • R$ 12k • Híbrido - SP         │ ║
║  └──────────────────────────────────────────┘ ║
║                                                ║
║  ┌──────────────────────────────────────────┐ ║
║  │ Frontend React - 78%                     │ ║
║  │ StartupXYZ • R$ 8k • Remoto              │ ║
║  └──────────────────────────────────────────┘ ║
║                                                ║
╚════════════════════════════════════════════════╝
```

### **Dashboard da Empresa**

```
╔════════════════════════════════════════════════╗
║  Painel da Empresa                             ║
╠════════════════════════════════════════════════╣
║                                                ║
║  📊 Métricas                                   ║
║  ├─ Vagas Ativas: 3                           ║
║  ├─ Candidaturas Recebidas: 12                ║
║  ├─ Matches Confirmados: 2                    ║
║  └─ Taxa de Compatibilidade Média: 73%        ║
║                                                ║
║  ──────────────────────────────────────────── ║
║                                                ║
║  📋 Candidaturas para "Full Stack Sênior"     ║
║                                                ║
║  ┌──────────────────────────────────────────┐ ║
║  │ 🎯 Maria Silva - 87% de match            │ ║
║  │ Full Stack Sênior • 7 anos exp           │ ║
║  │ ✅ 4/4 habilidades                        │ ║
║  │ [Ver Perfil] [Aceitar] [Rejeitar]        │ ║
║  └──────────────────────────────────────────┘ ║
║                                                ║
║  ┌──────────────────────────────────────────┐ ║
║  │ 🎯 João Santos - 82% de match            │ ║
║  │ Full Stack • 5 anos exp                  │ ║
║  │ ✅ 4/4 habilidades                        │ ║
║  │ [Ver Perfil] [Aceitar] [Rejeitar]        │ ║
║  └──────────────────────────────────────────┘ ║
║                                                ║
╚════════════════════════════════════════════════╝
```

---

## 🔍 Detalhes do Matching

### **Por que não mostrar TODAS as vagas?**

Imagine receber 100 vagas por dia, mas apenas 5 fazem sentido para você. 

**DevMatch filtra automaticamente**, mostrando só o que importa!

### **Como o sistema decide quem vê o quê?**

```
              VAGA PUBLICADA
                    ↓
         ┌──────────────────────┐
         │ Algoritmo de Matching │
         └──────────────────────┘
                    ↓
    ┌───────────────┴───────────────┐
    │ Analisa TODOS os devs         │
    │ cadastrados no sistema        │
    └───────────────┬───────────────┘
                    ↓
    ┌───────────────┴───────────────┐
    │ Calcula compatibilidade       │
    │ de cada um                    │
    └───────────────┬───────────────┘
                    ↓
    ┌───────────────┴───────────────┐
    │ Filtra: >= 60% de match       │
    └───────────────┬───────────────┘
                    ↓
    ┌───────────────┴───────────────┐
    │ Mostra no dashboard do dev    │
    │ ordenado por compatibilidade  │
    └───────────────────────────────┘
```

---

## 🎬 Fluxo Completo (Passo a Passo)

### **Do ponto de vista do Desenvolvedor:**

1. **Cadastro**
   - Acessa DevMatch
   - Cria conta (email + senha)
   - Completa perfil com habilidades

2. **Descoberta**
   - Faz login
   - Vê dashboard com vagas compatíveis
   - Cada vaga mostra % de match

3. **Candidatura**
   - Escolhe vaga interessante
   - Clica em "Candidatar-se"
   - Aguarda resposta da empresa

4. **Acompanhamento**
   - Acompanha status em "Minhas Candidaturas"
   - Recebe notificação se aceito/rejeitado
   - Match confirmado → Próximo passo!

---

### **Do ponto de vista da Empresa:**

1. **Cadastro**
   - Cria conta corporativa
   - Completa perfil da empresa

2. **Publicação de Vaga**
   - Clica em "Nova Vaga"
   - Preenche detalhes
   - Define habilidades requeridas
   - Publica!

3. **Recebimento de Candidaturas**
   - Recebe apenas candidatos compatíveis (60%+)
   - Vê % de match de cada um
   - Vê detalhes: quais skills tem/falta

4. **Seleção**
   - Analisa candidatos ordenados por match
   - Aceita os mais compatíveis
   - Sistema notifica desenvolvedor

---

## 💡 Diferenciais do DevMatch

### **1. Matching Inteligente**
Não é só "tem a skill ou não tem". O algoritmo analisa múltiplos fatores (salário, localização, modalidade, etc.) para um match mais preciso.

### **2. Transparência Total**
O desenvolvedor vê EXATAMENTE por que tem aquele % de compatibilidade:
- ✅ "Você possui 4 de 4 habilidades requeridas"
- ⚠️ "Verifique se a faixa salarial atende suas expectativas"

### **3. Economia de Tempo**
- **Desenvolvedor**: Não perde tempo com vagas incompatíveis
- **Empresa**: Não analisa centenas de perfis desqualificados

### **4. Agilidade no Processo**
Candidatura em 1 clique, rastreamento em tempo real, sem burocracias.

---

## 📈 Resultados Esperados

### **Para Desenvolvedores:**
- ⏱️ **90% menos tempo** procurando vagas
- 📈 **3x mais respostas** positivas
- 🎯 **Foco nas oportunidades certas**

### **Para Empresas:**
- ⏱️ **80% menos tempo** triando candidatos
- 📈 **Candidatos 2x mais qualificados**
- 🎯 **Contratações mais assertivas**

---

## 🛠️ Tecnologias Utilizadas

**Frontend:**
- React + TypeScript
- Material-UI (design moderno)

**Backend:**
- Java + Spring Boot
- PostgreSQL (banco de dados)

**Infraestrutura:**
- Supabase (banco em nuvem)
- Hospedagem web

---

## 🎯 Demonstração ao Vivo

### **Como testar:**

1. **Execute o script de dados:**
```bash
psql -U usuario -d banco -f test-matching-demo.sql
```

2. **Inicie o sistema:**
```bash
# Backend
cd src/back && mvn spring-boot:run

# Frontend
cd src/front && npm run dev
```

3. **Acesse:** `http://localhost:5173`

4. **Teste com diferentes perfis:**

| Perfil | Email | Senha | Match Esperado |
|--------|-------|-------|----------------|
| Maria Silva | maria.silva@demo.com | senha123 | 87% ⭐⭐⭐ |
| Pedro Costa | pedro.costa@demo.com | senha123 | 68% ⭐⭐ |
| Julia Mendes | julia.mendes@demo.com | senha123 | 42% (não aparece) |

---

## 🚀 Próximos Passos

### **Melhorias Futuras:**

1. **Notificações em tempo real**
   - Email quando empresa aceitar candidatura
   - Push notification para novas vagas compatíveis

2. **Machine Learning**
   - Algoritmo aprende com histórico de contratações
   - Melhora predições de match ao longo do tempo

3. **Chat integrado**
   - Empresa e desenvolvedor conversam direto na plataforma
   - Agendamento de entrevistas

4. **Análise de mercado**
   - Estatísticas salariais por stack
   - Habilidades mais demandadas
   - Tendências do mercado

---

## 📞 Conclusão

O **DevMatch** revoluciona o processo de recrutamento tech, conectando **pessoas certas com oportunidades certas** através de tecnologia e dados.

**Menos candidaturas. Mais qualidade. Match perfeito!** 🎯

---

## 🎬 Roteiro para Apresentação

### **Estrutura sugerida (10-15 minutos):**

1. **Introdução (2 min)**
   - Problema atual do mercado
   - Apresentar a solução: DevMatch

2. **Como Funciona (3 min)**
   - Explicar algoritmo de matching (visual!)
   - Mostrar os 5 fatores analisados

3. **Demo ao Vivo (5 min)**
   - Login como Maria Silva (87% match)
   - Mostrar vaga compatível
   - Candidatar-se
   - Login como empresa
   - Ver candidatura com % de match

4. **Comparação (2 min)**
   - Login como Julia Mendes (0 matches - stack diferente)
   - Mostrar que vaga NÃO aparece para ela
   - Explicar filtro de 60%

5. **Conclusão (2 min)**
   - Benefícios
   - Impacto esperado
   - Próximos passos

---

**DevMatch - Connecting the Right Talent with the Right Opportunity** 🚀

