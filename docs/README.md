# DevMatch


**Arthur Martins Candido, arthurmartinsdev@gmail.com**

**Felipe Costa Liboa, lilfelipecosta@gmail.com**

**Gabriel de Paula Fonseca, gabrieldpfonseca@gmail.com**

**Lucas Alexandre Soares Gomes da Silva, lucasalexandre1500@gmail.com**

**Pedro Henrique Carvalho Pereira, pedrocarvalho.phm@gmail.com**

---

Professores:

**Prof. Cleia Marcia Gomes Amaral**

**Prof. Joana Gabriela Ribeiro de Souza**

---

_Curso de Engenharia de Software_

_Instituto de Informática e Ciências Exatas – Pontifícia Universidade Católica de Minas Gerais (PUC MINAS), Belo Horizonte – MG – Brasil_

---

**Resumo**. O DevMatch é uma proposta de plataforma que conecta desenvolvedores a empresas e projetos que precisam de talento em tecnologia, de forma ágil e eficiente.
A ideia central é criar um “match” entre skills técnicas dos devs e necessidades reais das empresas, semelhante ao que aplicativos de relacionamento fazem, mas voltado para o mercado de tecnologia.

	•	Para empresas: elas podem publicar demandas específicas (stack, nível de experiência, prazo, tipo de contrato). O sistema sugere candidatos que melhor se encaixam, reduzindo tempo de triagem.
	•	Para devs: além de expor suas habilidades, podem encontrar projetos ou vagas que combinem com seus objetivos (CLT, PJ, freelance, remoto, híbrido etc.).
	•	Diferencial: foco em transparência e agilidade, usando automação e inteligência para evitar longos processos seletivos e facilitar contratações rápidas.

O objetivo é simplificar e acelerar o processo de conexão entre devs e empresas, criando um ecossistema mais justo, direto e prático para ambos os lados.

---


## 1. Introdução

Este trabalho apresenta o DevMatch, uma plataforma projetada para resolver os desafios de contratação no mercado de tecnologia, conectando de forma inteligente e eficiente desenvolvedores a oportunidades de emprego e projetos.

### 1.1 Contextualização

O mercado de tecnologia brasileiro está em rápido crescimento, impulsionado pela digitalização e pela crescente demanda por soluções de software. Projeções recentes indicam que o setor continuará a enfrentar um déficit de profissionais qualificados, tornando a atração e retenção de talentos um desafio constante.

Nesse cenário, empresas de todos os portes enfrentam desafios na busca, avaliação e contratação ágil e precisa de talentos. Embora plataformas de intermediação ajudem a conectar a oferta e a demanda, muitas falham ao não considerar regimes de contratação e formatos de remuneração variados, gerando lacunas na gestão e no acompanhamento de projetos.

### 1.2 Problema

Empresas frequentemente têm dificuldades em equilibrar a velocidade de seleção, a adequação técnica e a conformidade trabalhista na contratação de desenvolvedores.
Plataformas genéricas de freelancers ou redes profissionais não oferecem controle adequado sobre diferentes tipos de vínculo (CLT, PJ, freelancer) nem flexibilidade para definir formatos de pagamento (por sprint ou por hora). Essa limitação resulta em desperdício de tempo, aumento de custos e insegurança para contratantes e profissionais

### 1.3 Objetivo geral

O objetivo geral do DevMatch é criar uma plataforma digital que conecte de forma ágil, transparente e segura desenvolvedores a empresas, simplificando o processo de contratação por meio de matching inteligente de habilidades, gestão flexível de contratos e controle de pagamentos, atendendo às necessidades reais do mercado de tecnologia no Brasil.

#### 1.3.1 Objetivos específicos

**Gestão de Perfis:** Implementar cadastro e gestão de perfis detalhados para empresas e desenvolvedores.

**Busca e Matching Inteligente:** Criar um mecanismo de busca e matching baseado em habilidades, experiência e disponibilidade.

**Gestão de Contratos Flexíveis:** Integrar funcionalidades para gestão de propostas e contratos, adaptáveis a diferentes tipos de contratação.

**Módulo de Pagamentos:** Desenvolver um módulo de pagamentos para freelancers, incluindo opções por sprint ou por hora.

### 1.4 Justificativas

O desenvolvimento do DevMatch se justifica pela necessidade urgente de aproximar, de forma mais eficiente, empresas e desenvolvedores no cenário atual da tecnologia. O déficit de profissionais qualificados e a complexidade dos processos seletivos tradicionais tornam o mercado mais lento e caro, prejudicando tanto quem contrata quanto quem busca uma oportunidade.

Além disso, muitas plataformas existentes não oferecem a flexibilidade necessária para lidar com diferentes modelos de contratação (CLT, PJ, freelance), nem garantem um processo transparente e ágil. Essa falta de adequação gera insatisfação, insegurança e, muitas vezes, perda de boas oportunidades.

A proposta do DevMatch surge como uma solução prática, moderna e justa, que não apenas conecta pessoas, mas também simplifica toda a gestão do processo de contratação, desde a identificação de habilidades até a formalização do vínculo e pagamentos.

Como contribuição, o trabalho busca criar um ambiente que incentive relações mais diretas e confiáveis entre devs e empresas, reduzindo burocracia e tempo perdido. Isso pode impactar positivamente a forma como projetos de software são desenvolvidos, aumentando a eficiência e fortalecendo o ecossistema de tecnologia no Brasil.

## 2. Participantes do processo

### **Empresas Contratantes:** 
**Idade e perfil típico:** geralmente gestores, recrutadores ou líderes de tecnologia, entre 28 e 50 anos.

**Nível de educação:** ensino superior completo, muitas vezes com pós-graduação ou especialização em áreas de gestão, tecnologia ou negócios.

**Objetivos:** contratar rapidamente profissionais adequados às demandas do projeto; reduzir burocracias; garantir segurança nos pagamentos e no cumprimento dos contratos.

**Papel no sistema:** criam vagas e especificam requisitos (stack, experiência, regime de contratação), selecionam candidatos indicados pelo sistema e aprovam pagamentos conforme entregas.

### Desenvolvedores:

**Idade e perfil típico:** jovens e adultos de 18 a 45 anos, com forte diversidade cultural e social.

**Nível de educação:** variado, desde autodidatas e estudantes até graduados em áreas da T.I.

**Objetivos:** conseguir oportunidades de trabalho compatíveis com suas habilidades, ter liberdade para escolher o tipo de contrato (freelance, PJ, CLT) e negociar condições justas de pagamento.

**Papel no sistema:** criam perfis e portfólios, candidatam-se às vagas disponíveis, negociam condições de trabalho e executam projetos.

### Administradores da Plataforma:

**Idade e perfil típico:** profissionais entre 25 e 45 anos, com experiência em TI, gestão de sistemas e atendimento ao usuário.

**Nível de educação:** ensino superior em áreas de tecnologia ou administração; alguns podem ter especialização em governança ou compliance digital.

**Objetivos:** garantir que a plataforma funcione de forma segura, transparente e equilibrada, mediar disputas e validar transações financeiras.

**Papel no sistema:** gerenciam usuários e transações, moderam conteúdos e resolvem conflitos entre empresas e devs, validam e liberam pagamentos.

## 3. Modelagem do processo de negócio

### 3.1. Análise da situação atual

Atualmente, o processo de conexão entre desenvolvedores e empresas ocorre principalmente por meio de plataformas genéricas de recrutamento, como LinkedIn, InfoJobs e Gupy, além de redes de freelancers, como Workana, Upwork e Fiverr. Em menor escala, essa interação também acontece de forma informal, através de indicações pessoais ou grupos em redes sociais. Apesar de cumprirem a função de aproximar profissionais e organizações, esses sistemas apresentam limitações importantes. As plataformas de recrutamento, por exemplo, concentram-se em vagas formais, sobretudo no regime CLT, e seguem modelos tradicionais de seleção que tendem a ser longos, burocráticos e pouco transparentes. Outro problema é a ausência de filtros mais específicos relacionados a stacks, modalidades de contrato e formatos de pagamento, o que acaba gerando perda de tempo tanto para recrutadores quanto para candidatos. Já as plataformas de freelancers oferecem alternativas mais rápidas de contratação, mas em geral são voltadas para projetos de pequeno porte e com forte presença internacional, não atendendo de forma adequada às particularidades do mercado brasileiro, especialmente no que diz respeito a vínculos trabalhistas como PJ e CLT. 

Nessas plataformas, a negociação de prazos e pagamentos também nem sempre é clara, o que gera insegurança para ambas as partes envolvidas. Além disso, muitas empresas ainda recorrem a processos manuais de contratação, como indicações pessoais, grupos de WhatsApp, Telegram ou fóruns online. Embora essa prática possa gerar oportunidades rápidas, ela carece de formalização, de acompanhamento dos contratos e de garantias de pagamento, o que torna o processo arriscado.

Diante desse cenário, percebe-se que as alternativas atuais não oferecem uma solução integrada que contemple aspectos como flexibilidade nos tipos de vínculo, agilidade no matching de habilidades, transparência nos contratos e gestão eficiente dos pagamentos atrelados à entrega de projetos. O DevMatch surge, portanto, como uma resposta a essa lacuna, propondo um sistema que reúne agilidade, automação e segurança. A ideia é disponibilizar em uma única plataforma um ambiente adaptado à realidade brasileira, capaz de oferecer suporte a múltiplos formatos de contratação e de garantir pagamentos monitorados, criando assim uma experiência mais prática, confiável e eficiente para empresas e desenvolvedores.

### 3.2. Descrição geral da proposta de solução

O DevMatch é uma plataforma digital concebida para simplificar e acelerar a conexão entre desenvolvedores e empresas, atuando como um ambiente integrado de busca, negociação e gestão de contratos. A proposta tem como objetivo principal reduzir os gargalos encontrados nos processos atuais de recrutamento, que muitas vezes são burocráticos, lentos e pouco transparentes. Diferente das soluções já existentes, o DevMatch procura unir em um único espaço a possibilidade de cadastro detalhado de perfis, o uso de mecanismos inteligentes de matching e a formalização de vínculos variados, como CLT, PJ ou freelance, além de oferecer um sistema de pagamentos seguro vinculado ao progresso dos projetos.

Apesar de seu potencial, a solução apresenta alguns limites, como a necessidade de que usuários mantenham seus perfis constantemente atualizados para que as recomendações sejam eficazes, também não substitui completamente os processos de recrutamento tradicionais, como entrevistas presenciais ou avaliações técnicas específicas que algumas empresas exigem. Ainda assim, o DevMatch se conecta diretamente às estratégias de negócios tanto das empresas, que passam a economizar tempo e recursos na contratação, quanto dos desenvolvedores, que ganham maior visibilidade e acesso a oportunidades mais alinhadas às suas habilidades e expectativas profissionais.

O sistema abre espaço para melhorias importantes, como a implementação de mecanismos de avaliação e feedback para aumentar a confiabilidade das interações, a aplicação de inteligência artificial para tornar as recomendações cada vez mais precisas, a diversificação de meios de pagamento para acompanhar a evolução do mercado financeiro digital e até mesmo a expansão para o cenário internacional, adaptando-se às legislações trabalhistas de outros países. Nesse sentido, o DevMatch não apenas se coloca como uma solução para os problemas imediatos de contratação na área de tecnologia, mas também como uma iniciativa capaz de estimular um ecossistema mais justo, ágil e inovador no futuro do trabalho.

### 3.3. Modelagem dos processos

[PROCESSO 1 - Vagas](processo-1-Vagas.md "Detalhamento do Processo 1 - Criação de vagas.")

[PROCESSO 2 - Matching](processo-2-Matching.md "Detalhamento do Processo 2 - Matching.")

[PROCESSO 3 - Teste técnico na plataforma](processo-3-Teste_tecnico.md "Detalhamento do Processo 3.")

[PROCESSO 4 - FeedBack e Avaliação do Processo Seletivo](processo-4-feedback_e_avaliacao.md "Detalhamento do Processo 4.")

[PROCESSO 5 - Execução e Acompanhamento](processo-5-execucao_e_acompanhamento.md "Detalhamento do Processo 5.")

## 4. Projeto da solução

[Projeto da solução](solution-design.md "Detalhamento do projeto da solução: modelo relacional e tecnologias.")

## 5. Indicadores de desempenho

[Indicadores de desempenho dos processos](performance-indicators.md)

## 6. Interface do sistema

[Documentação da interface do sistema](interface.md)

## 7. Conclusão

O desenvolvimento do DevMatch permitiu identificar, de maneira clara, como o processo de conexão entre empresas e desenvolvedores ainda apresenta diversas barreiras que dificultam contratações ágeis, transparentes e alinhadas às necessidades reais do mercado de tecnologia. A partir da modelagem dos processos, da definição dos participantes e do projeto da solução, foi possível construir uma plataforma que integra, em um único ambiente, recursos de criação de vagas, matching inteligente, feedback estruturado, testes técnicos e gestão de contratos.

Os resultados obtidos ao longo do trabalho demonstraram que a proposta é viável e atende diretamente às lacunas identificadas no cenário atual: falta de personalização, limitações nos tipos de vínculo e etapas de seleção fragmentadas. Ao projetar um sistema que considera esses elementos, foi possível oferecer uma solução mais completa e adaptada ao contexto brasileiro, aproximando a experiência do usuário das necessidades práticas de recrutadores e profissionais de TI.

Do ponto de vista pessoal, o desenvolvimento do DevMatch proporcionou uma compreensão mais ampla sobre análise de processos, modelagem de negócios e integração de tecnologias em um produto de software real. Foi possível perceber, na prática, a importância de organizar fluxos, padronizar ações, definir indicadores de desempenho e estruturar um ecossistema capaz de sustentar, de forma equilibrada, as interações entre diferentes perfis de usuários. Além disso, trabalhar em equipe reforçou a relevância da comunicação, da divisão de responsabilidades e do uso de metodologias como Scrum para garantir ritmo e consistência no projeto.

Conclui-se que o DevMatch cumpriu os objetivos propostos, oferecendo uma solução inovadora, prática e alinhada às demandas contemporâneas do mercado de tecnologia. O trabalho representa não apenas um projeto acadêmico estruturado, mas também uma base sólida para evoluções futuras que podem contribuir significativamente para tornar o processo de contratação mais eficiente, justo e inteligente no contexto da engenharia de software.

# REFERÊNCIAS

_Como um projeto de software não requer revisão bibliográfica, a inclusão das referências não é obrigatória. No entanto, caso você deseje incluir referências relacionadas às tecnologias, padrões, ou metodologias que serão usadas no seu trabalho, relacione-as de acordo com a ABNT._

_Verifique no link abaixo como devem ser as referências no padrão ABNT:_

http://portal.pucminas.br/imagedb/documento/DOC_DSC_NOME_ARQUI20160217102425.pdf

**[1.1]** - _ELMASRI, Ramez; NAVATHE, Sham. **Sistemas de banco de dados**. 7. ed. São Paulo: Pearson, c2019. E-book. ISBN 9788543025001._

**[1.2]** - _COPPIN, Ben. **Inteligência artificial**. Rio de Janeiro, RJ: LTC, c2010. E-book. ISBN 978-85-216-2936-8._

**[1.3]** - _CORMEN, Thomas H. et al. **Algoritmos: teoria e prática**. Rio de Janeiro, RJ: Elsevier, Campus, c2012. xvi, 926 p. ISBN 9788535236996._

**[1.4]** - _SUTHERLAND, Jeffrey Victor. **Scrum: a arte de fazer o dobro do trabalho na metade do tempo**. 2. ed. rev. São Paulo, SP: Leya, 2016. 236, [4] p. ISBN 9788544104514._

**[1.5]** - _RUSSELL, Stuart J.; NORVIG, Peter. **Inteligência artificial**. Rio de Janeiro: Elsevier, c2013. xxi, 988 p. ISBN 9788535237016._



# APÊNDICES

## Apêndice A - Código fonte

[Código do front-end](../src/front) -- repositório do código do front-end

[Código do back-end](../src/back)  -- repositório do código do back-end


## Apêndice B - Apresentação final


[Slides da apresentação final](presentations/)


[Vídeo da apresentação final](video/)






