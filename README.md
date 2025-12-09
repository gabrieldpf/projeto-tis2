# DEVMatch

O DevMatch é uma proposta de plataforma que conecta desenvolvedores a empresas e projetos que precisam de talento em tecnologia, de forma ágil e eficiente.
A ideia central é criar um “match” entre skills técnicas dos devs e necessidades reais das empresas, semelhante ao que aplicativos de relacionamento fazem, mas voltado para o mercado de tecnologia.

	•	Para empresas: elas podem publicar demandas específicas (stack, nível de experiência, prazo, tipo de contrato). O sistema sugere candidatos que melhor se encaixam, reduzindo tempo de triagem.
	•	Para devs: além de expor suas habilidades, podem encontrar projetos ou vagas que combinem com seus objetivos (CLT, PJ, freelance, remoto, híbrido etc.).
	•	Diferencial: foco em transparência e agilidade, usando automação e inteligência para evitar longos processos seletivos e facilitar contratações rápidas.

O objetivo é simplificar e acelerar o processo de conexão entre devs e empresas, criando um ecossistema mais justo, direto e prático para ambos os lados.

## Integrantes

* Gabriel de Paula Fonseca
* Lucas Alexandre Soares Gomes da Silva
* Felipe Costa Lisboa
* Arthur Martins Candido
* Pedro Henrique Carvalho Pereira

## Professores

* Professora Cleia Marcia Gomes Amaral
* Professora Joana Gabriela Ribeiro de Souza

## Instruções de Utilização

Esta seção descreve como instalar dependências, configurar o ambiente e executar o sistema DevMatch.  
O projeto é composto por duas partes:

- **Backend**: Java + Spring Boot  
- **Frontend**: React

## Requisitos

### Backend (Spring Boot)
- Java 17 ou superior  
- Maven 3.8+

### Frontend (React)
- Node.js 18+  
- npm ou yarn

---

## Passo a passo para execução

### 1. Clone o repositório
```bash
git clone https://github.com/ICEI-PUC-Minas-PPLES-TI/plf-es-2025-2-ti2-1381100-devmatch.git
```

### 2. Acesse as pastas do projeto

Abra dois terminais:

**Terminal 1 – Backend**
```bash
cd back
```

**Terminal 2 – Frontend**
```bash
cd front
```

### 3. Instale as dependências

**Backend**
```bash
mvn clean install
```

**Frontend**
```bash
npm install
```

### 4. Execute os serviços

**Iniciar o backend (Spring Boot)**
```bash
mvn spring-boot:run
```

**Iniciar o frontend (React)**
```bash
npm run dev
```

## Histórico de versões

* 0.1.1
    * CHANGE: Atualização das documentações. Código permaneceu inalterado.
* 0.1.0
    * Implementação de funcionalidades.
* 0.0.1
    * Trabalhando na modelagem do processo de negócio.

